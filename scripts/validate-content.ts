import {readFile} from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VALID_CATEGORIES = new Set([
  'parashat-hashavua',
  'tehillim',
  'shir-hashirim',
  'tefilot',
  'haftarot',
  'piyutim',
  'taamim',
  'megillot',
  'special-readings',
  'holidays',
  'other'
]);

const IRRELEVANT_KEYWORDS = [
  'lego',
  'לגו',
  'ninja',
  "נינג'ה",
  'נינג׳ה',
  'ניסוי',
  'כרוב',
  'לימון',
  'led',
  'birthday',
  'יום הולדת',
  'סבא',
  'מילואים',
  'פוליטי',
  'shorts',
  '#shorts',
  '/shorts/'
];

type Video = {
  videoId?: string;
  category?: string;
  hidden?: boolean;
  title?: {
    source?: string;
    he?: string;
    en?: string;
  };
  description?: string;
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
  const seenVideoIds = new Set<string>();
  const seenContent = new Map<string, string>();
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const video of videos) {
    if (!video.videoId) {
      errors.push('Imported video is missing videoId.');
    } else if (seenVideoIds.has(video.videoId)) {
      warnings.push(`Duplicate videoId "${video.videoId}".`);
    } else {
      seenVideoIds.add(video.videoId);
    }

    if (video.category && !VALID_CATEGORIES.has(video.category)) {
      errors.push(`Invalid imported category "${video.category}" on ${video.videoId}.`);
    }

    if (!video.hidden && isIrrelevantVideo(video)) {
      warnings.push(`Irrelevant video is not hidden: ${video.videoId}.`);
    }

    const contentKey = normalizeText(
      `${video.title?.source ?? video.title?.he ?? video.title?.en ?? ''}\n${video.description ?? ''}`
    );
    const duplicateOf = seenContent.get(contentKey);
    if (contentKey && duplicateOf && duplicateOf !== video.videoId) {
      warnings.push(`Duplicate title/description on "${duplicateOf}" and "${video.videoId}".`);
    } else if (contentKey && video.videoId) {
      seenContent.set(contentKey, video.videoId);
    }

    const cardExcerpt = makeCardExcerpt(video.description ?? '');
    if (cardExcerpt.length > 160) {
      warnings.push(`Card description excerpt is too long on ${video.videoId}.`);
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

function isIrrelevantVideo(video: Video): boolean {
  const text = `${video.title?.source ?? ''}\n${video.title?.he ?? ''}\n${video.title?.en ?? ''}\n${video.description ?? ''}`.toLowerCase();

  return IRRELEVANT_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()));
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function makeCardExcerpt(value: string): string {
  const cleaned = normalizeText(value).replace(/\byoutube\b/gi, '').trim();

  return cleaned.length <= 160 ? cleaned : `${cleaned.slice(0, 157).trimEnd()}...`;
}

async function readParashotFromSource(): Promise<Parasha[]> {
  const source = await readFile(path.join(DATA_DIR, 'parashot.ts'), 'utf8');
  const parashaMatches = source.matchAll(
    /\{id: '([^']+)', order: [^,]+, slug: \{he: '([^']+)', en: '([^']+)'\}/g
  );
  const parashot = [...parashaMatches].map((match) => ({
    id: match[1],
    slug: {
      he: match[2],
      en: match[3]
    }
  }));

  const byId = new Map(parashot.map((parasha) => [parasha.id, parasha]));
  const doubleMatches = source.matchAll(
    /makeDoubleParasha\('([^']+)', \['([^']+)', '([^']+)'\]/g
  );

  for (const match of doubleMatches) {
    const first = byId.get(match[2]);
    const second = byId.get(match[3]);

    if (!first || !second) {
      continue;
    }

    parashot.push({
      id: match[1],
      slug: {
        he: `${first.slug.he}-${second.slug.he}`,
        en: `${first.slug.en}-${second.slug.en}`
      }
    });
  }

  return parashot;
}

main().catch((caughtError) => {
  error(caughtError instanceof Error ? caughtError.message : String(caughtError));
  process.exitCode = 1;
});
