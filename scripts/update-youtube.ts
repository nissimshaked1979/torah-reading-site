import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

import {
  fetchAllPlaylistVideoIds,
  fetchVideoDetails,
  logClassificationCounts,
  readManualOverrides,
  resolveUploadsPlaylistId,
  toImportedVideo,
  type ImportedVideo
} from './import-youtube.ts';
import {loadLocalEnv} from './load-local-env.ts';

const OUTPUT_PATH = path.join(process.cwd(), 'data', 'youtube-videos.json');
const CURATION_FIELDS = [
  'category',
  'subcategory',
  'slug',
  'parashaSlug',
  'tags',
  'nusach',
  'displayOrder',
  'featured',
  'hidden'
] as const;

async function readExistingVideos(): Promise<ImportedVideo[]> {
  try {
    const raw = await readFile(OUTPUT_PATH, 'utf8');
    return JSON.parse(raw) as ImportedVideo[];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function mergeVideo(
  existing: ImportedVideo | undefined,
  fresh: ImportedVideo
): ImportedVideo {
  if (!existing) {
    return fresh;
  }

  const merged: ImportedVideo = {
    ...existing,
    ...fresh,
    title: {
      ...fresh.title,
      he: existing.classification.manualOverrideApplied
        ? existing.title.he
        : fresh.title.he,
      en: existing.classification.manualOverrideApplied
        ? existing.title.en
        : fresh.title.en
    },
    classification: {
      ...fresh.classification,
      manualOverrideApplied:
        existing.classification.manualOverrideApplied ||
        fresh.classification.manualOverrideApplied
    }
  };

  for (const field of CURATION_FIELDS) {
    if (existing[field] !== undefined && existing[field] !== null) {
      Object.assign(merged, {[field]: existing[field]});
    }
  }

  return merged;
}

function sortVideos(videos: ImportedVideo[]): ImportedVideo[] {
  return [...videos].sort((a, b) => {
    if (a.displayOrder !== null || b.displayOrder !== null) {
      return (
        (a.displayOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
      );
    }

    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

async function updateYouTubeVideos() {
  loadLocalEnv();

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing YOUTUBE_API_KEY. Add it to your environment and rerun npm run update:youtube.'
    );
  }

  const existingVideos = await readExistingVideos();
  const existingById = new Map(
    existingVideos.map((video) => [video.videoId, video] as const)
  );
  const manualOverrides = await readManualOverrides();

  console.log(`Existing videos: ${existingVideos.length}`);
  console.log('Fetching latest YouTube metadata.');

  const uploadsPlaylistId = await resolveUploadsPlaylistId(apiKey);
  const videoIds = await fetchAllPlaylistVideoIds(apiKey, uploadsPlaylistId);
  const videoDetails = await fetchVideoDetails(apiKey, videoIds);
  const freshVideos = videoDetails.map((video) =>
    toImportedVideo(video, manualOverrides.videos ?? {})
  );
  const freshIds = new Set(freshVideos.map((video) => video.videoId));
  const mergedById = new Map<string, ImportedVideo>();

  for (const fresh of freshVideos) {
    mergedById.set(fresh.videoId, mergeVideo(existingById.get(fresh.videoId), fresh));
  }

  for (const existing of existingVideos) {
    if (!freshIds.has(existing.videoId)) {
      mergedById.set(existing.videoId, existing);
    }
  }

  const mergedVideos = sortVideos([...mergedById.values()]);
  const newCount = freshVideos.filter((video) => !existingById.has(video.videoId)).length;
  const updatedCount = freshVideos.length - newCount;

  await writeFile(OUTPUT_PATH, `${JSON.stringify(mergedVideos, null, 2)}\n`);

  console.log(`Fetched videos: ${freshVideos.length}`);
  console.log(`New videos appended: ${newCount}`);
  console.log(`Existing videos updated: ${updatedCount}`);
  console.log(`Total videos saved: ${mergedVideos.length}`);
  logClassificationCounts(mergedVideos);
}

updateYouTubeVideos().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
