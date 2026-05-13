import {readFile} from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VALID_CATEGORIES = new Set([
  'parashat-hashavua',
  'tehillim',
  'shir-hashirim',
  'tefilot',
  'holidays',
  'other'
]);

type Video = {
  videoId?: string;
  category?: string;
  parashaSlug?: string | null;
  slug?: {
    he?: string;
    en?: string;
  };
};

type ManualOverride = {
  category?: string;
  parashaSlug?: string | null;
  slug?: {
    he?: string;
    en?: string;
  };
};

type ManualOverridesFile = {
  videos?: Record<string, ManualOverride>;
};

type Parasha = {
  id: string;
  slug: {
    he: string;
    en: string;
  };
};

async function readJson<T>(fileName: string): Promise<T> {
  const raw = await readFile(path.join(DATA_DIR, fileName), 'utf8');
  return JSON.parse(raw) as T;
}

function warn(message: string) {
  console.warn(`WARN: ${message}`);
}

function error(message: string) {
  console.error(`ERROR: ${message}`);
}

async function main() {
  const videos = await readJson<Video[]>('youtube-videos.json');
  const overrides = await readJson<ManualOverridesFile>('manual-overrides.json');
  const parashot = await readParashotFromSource();
  const validParashaSlugs = new Set(
    parashot.flatMap((parasha) => [parasha.id, parasha.slug.he, parasha.slug.en])
  );
  const videoIds = new Set(videos.map((video) => video.videoId).filter(Boolean));
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const video of videos) {
    if (!video.videoId) {
      errors.push('Imported video is missing videoId.');
    }

    if (video.category && !VALID_CATEGORIES.has(video.category)) {
      errors.push(`Invalid imported category "${video.category}" on ${video.videoId}.`);
    }

    if (video.parashaSlug && !validParashaSlugs.has(video.parashaSlug)) {
      errors.push(
        `Invalid imported parasha slug "${video.parashaSlug}" on ${video.videoId}.`
      );
    }
  }

  for (const [videoId, override] of Object.entries(overrides.videos ?? {})) {
    if (!videoIds.has(videoId) && videoId !== 'VIDEO_ID_HERE') {
      warnings.push(`Override references missing video ID "${videoId}".`);
    }

    if (override.category && !VALID_CATEGORIES.has(override.category)) {
      errors.push(`Invalid override category "${override.category}" on ${videoId}.`);
    }

    if (override.parashaSlug && !validParashaSlugs.has(override.parashaSlug)) {
      errors.push(
        `Invalid override parasha slug "${override.parashaSlug}" on ${videoId}.`
      );
    }
  }

  const slugSources = [
    ...videos.map((video) => ({
      id: video.videoId ?? 'missing-video-id',
      slug: video.slug
    })),
    ...Object.entries(overrides.videos ?? {}).map(([id, override]) => ({
      id,
      slug: override.slug
    }))
  ];
  const seenSlugs = new Map<string, string>();

  for (const source of slugSources) {
    for (const locale of ['he', 'en'] as const) {
      const slug = source.slug?.[locale];
      if (!slug) {
        continue;
      }

      const key = `${locale}:${slug}`;
      const existing = seenSlugs.get(key);
      if (existing && existing !== source.id) {
        warnings.push(
          `Duplicate ${locale} slug "${slug}" on "${existing}" and "${source.id}".`
        );
      }
      seenSlugs.set(key, source.id);
    }
  }

  warnings.forEach(warn);
  errors.forEach(error);

  console.log(`Checked ${videos.length} imported videos.`);
  console.log(`Checked ${Object.keys(overrides.videos ?? {}).length} overrides.`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

async function readParashotFromSource(): Promise<Parasha[]> {
  const source = await readFile(path.join(DATA_DIR, 'parashot.ts'), 'utf8');
  const matches = source.matchAll(
    /id: '([^']+)'[\s\S]*?slug: \{he: '([^']+)', en: '([^']+)'\}/g
  );

  return [...matches].map((match) => ({
    id: match[1],
    slug: {
      he: match[2],
      en: match[3]
    }
  }));
}

main().catch((caughtError) => {
  error(caughtError instanceof Error ? caughtError.message : String(caughtError));
  process.exitCode = 1;
});
