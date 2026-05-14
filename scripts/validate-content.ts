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
const PUBLIC_CATEGORY_IDS = [...VALID_CATEGORIES];

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
  const visibleVideos = videos.filter((video) => !video.hidden && !isIrrelevantVideo(video));
  const visibleCategoryCounts = new Map<string, number>();
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

    if (!video.hidden && video.category === 'tehillim' && !extractTehillimChapter(video)) {
      warnings.push(`Tehillim video has no detected chapter number: ${video.videoId}.`);
    }

    if (!video.hidden && video.category === 'parashat-hashavua' && !video.parashaSlug) {
      warnings.push(`Parasha video has no parasha slug: ${video.videoId}.`);
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

  for (const video of visibleVideos) {
    if (video.category) {
      visibleCategoryCounts.set(
        video.category,
        (visibleCategoryCounts.get(video.category) ?? 0) + 1
      );
    }

    if (video.hidden || isIrrelevantVideo(video)) {
      warnings.push(`Hidden or irrelevant video appears in public helper input: ${video.videoId}.`);
    }
  }

  if (videos.length > 0) {
    for (const category of PUBLIC_CATEGORY_IDS) {
      if (category !== 'other' && !visibleCategoryCounts.has(category)) {
        warnings.push(`Category link may point to an empty category: ${category}.`);
      }
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

function extractTehillimChapter(video: Video): number | undefined {
  const text = normalizeForSearch(
    `${video.title?.source ?? ''} ${video.title?.he ?? ''} ${video.title?.en ?? ''} ${video.description ?? ''}`
  );
  const directMatch = text.match(
    /\b(?:tehillim|psalm|psalms)\s*(?:chapter|chap\.?|פרק)?\s*(\d{1,3})\b/i
  );

  if (directMatch) {
    return clampTehillimChapter(Number(directMatch[1]));
  }

  const hebrewMatch = text.match(/תהילים\s*(?:פרק)?\s*([א-ת]{1,5}|\d{1,3})/);

  if (!hebrewMatch) {
    return undefined;
  }

  const chapter = /^\d+$/.test(hebrewMatch[1])
    ? Number(hebrewMatch[1])
    : hebrewNumeralToNumber(hebrewMatch[1]);

  return clampTehillimChapter(chapter);
}

function normalizeForSearch(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0591-\u05c7]/g, '')
    .replace(/[״"׳']/g, '')
    .replace(/[ך]/g, 'כ')
    .replace(/[ם]/g, 'מ')
    .replace(/[ן]/g, 'נ')
    .replace(/[ף]/g, 'פ')
    .replace(/[ץ]/g, 'צ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function hebrewNumeralToNumber(value: string): number | undefined {
  const numerals: Record<string, number> = {
    א: 1,
    ב: 2,
    ג: 3,
    ד: 4,
    ה: 5,
    ו: 6,
    ז: 7,
    ח: 8,
    ט: 9,
    י: 10,
    כ: 20,
    ל: 30,
    מ: 40,
    נ: 50,
    ס: 60,
    ע: 70,
    פ: 80,
    צ: 90,
    ק: 100,
    ר: 200
  };
  let total = 0;

  for (const letter of normalizeForSearch(value)) {
    total += numerals[letter] ?? 0;
  }

  return total || undefined;
}

function clampTehillimChapter(value: number | undefined): number | undefined {
  return value && value >= 1 && value <= 150 ? value : undefined;
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
