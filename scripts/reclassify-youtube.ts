import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

import {
  classifyVideo,
  defaultTags,
  logClassificationCounts,
  readManualOverrides,
  shouldHideVideo,
  type ImportedVideo
} from './import-youtube.ts';

const OUTPUT_PATH = path.join(process.cwd(), 'data', 'youtube-videos.json');

async function main() {
  const raw = await readFile(OUTPUT_PATH, 'utf8');
  const videos = JSON.parse(raw) as ImportedVideo[];
  const overrides = await readManualOverrides();
  const reclassified = dedupeVideos(videos).map((video) => {
    const automatic = classifyVideo(video.title.source, video.description);
    const override = overrides.videos?.[video.videoId];
    const category = override?.category ?? automatic.category;
    const parashaSlug =
      override && 'parashaSlug' in override
        ? (override.parashaSlug ?? null)
        : automatic.parashaSlug;

    return {
      ...video,
      category,
      parashaSlug,
      tags: override?.tags ?? defaultTags(category, parashaSlug),
      hidden:
        override?.hidden === true ||
        shouldHideVideo(video.title.source, video.description, category),
      classification: {
        automaticCategory: automatic.category,
        matchedKeywords: automatic.matchedKeywords,
        manualOverrideApplied: Boolean(override)
      }
    };
  });

  await writeFile(OUTPUT_PATH, `${JSON.stringify(reclassified, null, 2)}\n`);

  console.log(`Reclassified videos: ${reclassified.length}`);
  logClassificationCounts(reclassified);
}

function dedupeVideos(videos: ImportedVideo[]): ImportedVideo[] {
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();
  const unique: ImportedVideo[] = [];

  for (const video of videos) {
    const contentKey = normalizeText(`${video.title.source}\n${video.description}`);

    if (seenIds.has(video.videoId) || seenContent.has(contentKey)) {
      continue;
    }

    seenIds.add(video.videoId);
    seenContent.add(contentKey);
    unique.push(video);
  }

  return unique;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
