import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

import {loadLocalEnv} from './load-local-env.ts';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const CHANNEL_HANDLE = 'nissimshaked';
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'youtube-videos.json');
const OVERRIDES_PATH = path.join(process.cwd(), 'data', 'manual-overrides.json');
const MAX_RETRIES = 3;

export type CategoryId =
  | 'parashat-hashavua'
  | 'tehillim'
  | 'shir-hashirim'
  | 'tefilot'
  | 'haftarot'
  | 'holidays'
  | 'other';

type LocaleText = {
  he?: string;
  en?: string;
};

export type ManualOverride = {
  category?: CategoryId;
  subcategory?: string | null;
  title?: LocaleText;
  slug?: LocaleText;
  parashaSlug?: string | null;
  tags?: string[];
  nusach?: string | null;
  displayOrder?: number | null;
  featured?: boolean;
  hidden?: boolean;
};

export type ManualOverridesFile = {
  videos?: Record<string, ManualOverride>;
};

type YouTubeThumbnail = {
  url: string;
  width?: number;
  height?: number;
};

type YouTubeThumbnails = Record<string, YouTubeThumbnail>;

type PlaylistItem = {
  snippet?: {
    resourceId?: {
      videoId?: string;
    };
  };
};

type VideoResource = {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails?: YouTubeThumbnails;
  };
  contentDetails?: {
    duration?: string;
  };
};

type YouTubeListResponse<T> = {
  items?: T[];
  nextPageToken?: string;
  error?: {
    code?: number;
    message?: string;
  };
};

export type ImportedVideo = {
  videoId: string;
  title: {
    source: string;
    he: string;
    en: string;
  };
  description: string;
  publishedAt: string;
  duration: string;
  thumbnails: YouTubeThumbnails;
  watchUrl: string;
  embedUrl: string;
  category: CategoryId;
  subcategory: string | null;
  slug: {
    he?: string;
    en?: string;
  };
  parashaSlug: string | null;
  tags: string[];
  nusach: string | null;
  displayOrder: number | null;
  featured: boolean;
  hidden: boolean;
  classification: {
    automaticCategory: CategoryId;
    matchedKeywords: string[];
    manualOverrideApplied: boolean;
  };
};

const categoryKeywords: Record<CategoryId, string[]> = {
  'parashat-hashavua': [
    'פרשת',
    'פרשה',
    'parasha',
    'parashat',
    'weekly portion',
    'torah portion'
  ],
  tehillim: ['תהילים', 'תהלים', 'מזמור', 'tehillim', 'psalm', 'psalms'],
  'shir-hashirim': [
    'שיר השירים',
    'מגילת שיר השירים',
    'מגילת  שיר השירים',
    'shir hashirim',
    'song of songs',
    'song of solomon'
  ],
  tefilot: [
    'תפילה',
    'תפילת',
    'תפילות',
    'מנחה',
    'ערבית',
    'שחרית',
    'מוסף',
    'קדיש',
    'סליחות',
    'ברכה',
    'ברכת',
    'שמע ישראל',
    'prayer',
    'tefila',
    'tefilah',
    'tefilot',
    'mincha',
    'arvit',
    'maariv',
    'shacharit',
    'mussaf',
    'kaddish',
    'selichot',
    'blessing',
    'shema'
  ],
  haftarot: [
    'הפטרה',
    'הפטרת',
    'הפטרות',
    'haftara',
    'haftarah',
    'haftarot',
    'haftaroth'
  ],
  holidays: [
    'חג',
    'פסח',
    'סוכות',
    'ראש השנה',
    'יום כיפור',
    'כיפור',
    'חנוכה',
    'פורים',
    'שבועות',
    'pesach',
    'passover',
    'sukkot',
    'rosh hashanah',
    'yom kippur',
    'hanukkah',
    'chanukah',
    'purim',
    'shavuot',
    'holiday'
  ],
  other: []
};

const categoryPriority: Record<CategoryId, number> = {
  tehillim: 1,
  'shir-hashirim': 1,
  tefilot: 1,
  haftarot: 1,
  holidays: 2,
  'parashat-hashavua': 3,
  other: 4
};

const parashaSlugKeywords: Array<{slug: string; keywords: string[]}> = [
  {slug: 'bereshit', keywords: ['בראשית', 'bereshit', 'bereishit', 'genesis']},
  {slug: 'noach', keywords: ['נח', 'noach', 'noah']},
  {slug: 'lech-lecha', keywords: ['לך לך', 'לך-לך', 'lech lecha', 'lech-lecha']},
  {slug: 'vayera', keywords: ['וירא', 'vayera']},
  {slug: 'chayei-sarah', keywords: ['חיי שרה', 'chayei sarah']},
  {slug: 'toldot', keywords: ['תולדות', 'toldot', 'toledot']},
  {slug: 'vayetze', keywords: ['ויצא', 'vayetze', 'vayetzei']},
  {slug: 'vayishlach', keywords: ['וישלח', 'vayishlach']},
  {slug: 'vayeshev', keywords: ['וישב', 'vayeshev']},
  {slug: 'miketz', keywords: ['מקץ', 'miketz']},
  {slug: 'vayigash', keywords: ['ויגש', 'vayigash']},
  {slug: 'vayechi', keywords: ['ויחי', 'vayechi']},
  {slug: 'shemot', keywords: ['שמות', 'shemot', 'shmot', 'exodus']},
  {slug: 'vaera', keywords: ['וארא', 'vaera', "va'era"]},
  {slug: 'bo', keywords: ['בא', 'bo']},
  {slug: 'beshalach', keywords: ['בשלח', 'beshalach', 'beshallach']},
  {slug: 'yitro', keywords: ['יתרו', 'yitro', 'jethro']},
  {slug: 'mishpatim', keywords: ['משפטים', 'mishpatim']},
  {slug: 'terumah', keywords: ['תרומה', 'terumah']},
  {slug: 'tetzaveh', keywords: ['תצוה', 'תצווה', 'tetzaveh']},
  {slug: 'ki-tisa', keywords: ['כי תשא', 'כי-תשא', 'ki tisa', 'ki-tisa']},
  {slug: 'vayakhel-pekudei', keywords: ['ויקהל פקודי', 'ויקהל-פקודי', 'vayakhel pekudei', 'vayakhel-pekudei']},
  {slug: 'vayakhel', keywords: ['ויקהל', 'vayakhel']},
  {slug: 'pekudei', keywords: ['פקודי', 'pekudei']},
  {slug: 'vayikra', keywords: ['ויקרא', 'vayikra', 'leviticus']},
  {slug: 'tzav', keywords: ['צו', 'tzav', 'tsav']},
  {slug: 'shemini', keywords: ['שמיני', 'shemini']},
  {slug: 'tazria-metzora', keywords: ['תזריע מצורע', 'תזריע-מצורע', 'tazria metzora', 'tazria-metzora']},
  {slug: 'tazria', keywords: ['תזריע', 'tazria']},
  {slug: 'metzora', keywords: ['מצורע', 'metzora']},
  {slug: 'acharei-mot-kedoshim', keywords: ['אחרי מות קדושים', 'אחרי-מות-קדושים', 'acharei mot kedoshim', 'acharei-mot-kedoshim']},
  {slug: 'acharei-mot', keywords: ['אחרי מות', 'אחרי-מות', 'acharei mot']},
  {slug: 'kedoshim', keywords: ['קדושים', 'kedoshim']},
  {slug: 'emor', keywords: ['אמור', 'emor']},
  {slug: 'behar-bechukotai', keywords: ['בהר בחוקותי', 'בהר-בחוקותי', 'behar bechukotai', 'behar-bechukotai']},
  {slug: 'behar', keywords: ['בהר', 'behar']},
  {slug: 'bechukotai', keywords: ['בחוקותי', 'bechukotai']},
  {slug: 'bamidbar', keywords: ['במדבר', 'bamidbar', 'numbers']},
  {slug: 'nasso', keywords: ['נשא', 'nasso', 'naso']},
  {slug: 'behaalotcha', keywords: ['בהעלותך', 'בהעלתך', 'behaalotcha']},
  {slug: 'shelach', keywords: ['שלח', 'shelach', 'shlach']},
  {slug: 'korach', keywords: ['קרח', 'korach']},
  {slug: 'chukat-balak', keywords: ['חקת בלק', 'חקת-בלק', 'chukat balak', 'chukat-balak']},
  {slug: 'chukat', keywords: ['חקת', 'chukat']},
  {slug: 'balak', keywords: ['בלק', 'balak']},
  {slug: 'pinchas', keywords: ['פינחס', 'pinchas']},
  {slug: 'matot-masei', keywords: ['מטות מסעי', 'מטות-מסעי', 'matot masei', 'matot-masei']},
  {slug: 'matot', keywords: ['מטות', 'matot']},
  {slug: 'masei', keywords: ['מסעי', 'masei']},
  {slug: 'devarim', keywords: ['דברים', 'devarim', 'deuteronomy']},
  {slug: 'vaetchanan', keywords: ['ואתחנן', 'vaetchanan']},
  {slug: 'eikev', keywords: ['עקב', 'eikev']},
  {slug: 'reeh', keywords: ['ראה', 'reeh']},
  {slug: 'shoftim', keywords: ['שופטים', 'shoftim']},
  {slug: 'ki-teitzei', keywords: ['כי תצא', 'כי-תצא', 'ki teitzei', 'ki-teitzei']},
  {slug: 'ki-tavo', keywords: ['כי תבוא', 'כי-תבוא', 'ki tavo', 'ki-tavo']},
  {slug: 'nitzavim-vayelech', keywords: ['נצבים וילך', 'נצבים-וילך', 'nitzavim vayelech', 'nitzavim-vayelech']},
  {slug: 'nitzavim', keywords: ['נצבים', 'nitzavim']},
  {slug: 'vayelech', keywords: ['וילך', 'vayelech']},
  {slug: 'haazinu', keywords: ['האזינו', 'haazinu']},
  {slug: 'vezot-haberakhah', keywords: ['וזאת הברכה', 'וזאת-הברכה', 'vezot haberakhah', 'vezot-haberakhah']}
];

function buildUrl(endpoint: string, params: Record<string, string | undefined>) {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return url;
}

async function fetchJson<T>(url: URL, attempt = 1): Promise<T> {
  const response = await fetch(url);

  if (response.ok) {
    return (await response.json()) as T;
  }

  const responseText = await response.text();
  const isTransient =
    response.status === 429 || response.status === 500 || response.status === 503;

  if (isTransient && attempt < MAX_RETRIES) {
    const delay = 1000 * 2 ** (attempt - 1);
    console.warn(
      `Transient YouTube API error ${response.status}. Retrying in ${delay}ms.`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchJson<T>(url, attempt + 1);
  }

  throw new Error(
    `YouTube API request failed (${response.status}): ${responseText}`
  );
}

export async function resolveUploadsPlaylistId(apiKey: string): Promise<string> {
  const url = buildUrl('channels', {
    part: 'contentDetails',
    forHandle: CHANNEL_HANDLE,
    key: apiKey
  });
  const data = await fetchJson<
    YouTubeListResponse<{
      contentDetails?: {
        relatedPlaylists?: {
          uploads?: string;
        };
      };
    }>
  >(url);
  const uploadsPlaylistId =
    data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error(`Could not resolve uploads playlist for @${CHANNEL_HANDLE}.`);
  }

  return uploadsPlaylistId;
}

export async function fetchAllPlaylistVideoIds(
  apiKey: string,
  playlistId: string
): Promise<string[]> {
  const videoIds: string[] = [];
  let pageToken: string | undefined;

  do {
    const url = buildUrl('playlistItems', {
      part: 'snippet',
      maxResults: '50',
      playlistId,
      pageToken,
      key: apiKey
    });
    const data = await fetchJson<YouTubeListResponse<PlaylistItem>>(url);

    for (const item of data.items ?? []) {
      const videoId = item.snippet?.resourceId?.videoId;
      if (videoId) {
        videoIds.push(videoId);
      }
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return [...new Set(videoIds)];
}

export async function fetchVideoDetails(
  apiKey: string,
  videoIds: string[]
): Promise<VideoResource[]> {
  const videos: VideoResource[] = [];

  for (let index = 0; index < videoIds.length; index += 50) {
    const batch = videoIds.slice(index, index + 50);
    const url = buildUrl('videos', {
      part: 'snippet,contentDetails',
      id: batch.join(','),
      maxResults: '50',
      key: apiKey
    });
    const data = await fetchJson<YouTubeListResponse<VideoResource>>(url);
    videos.push(...(data.items ?? []));
  }

  return videos;
}

export async function readManualOverrides(): Promise<ManualOverridesFile> {
  try {
    const raw = await readFile(OVERRIDES_PATH, 'utf8');
    return JSON.parse(raw) as ManualOverridesFile;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return {videos: {}};
    }
    throw error;
  }
}

function findKeywordMatches(text: string, keywords: string[]): string[] {
  const normalized = text.toLowerCase();

  return keywords.filter((keyword) =>
    containsKeyword(normalized, keyword.toLowerCase())
  );
}

function containsKeyword(text: string, keyword: string): boolean {
  if (hasHebrew(keyword)) {
    return new RegExp(
      `(^|[^\\u0590-\\u05ff])${escapeRegExp(keyword)}($|[^\\u0590-\\u05ff])`
    ).test(text);
  }

  if (/^[a-z0-9]+$/i.test(keyword)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(keyword)}($|[^a-z0-9])`, 'i').test(
      text
    );
  }

  return text.includes(keyword);
}

function hasHebrew(value: string): boolean {
  return /[\u0590-\u05ff]/.test(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function classifyVideo(title: string, description: string) {
  void description;

  const titleCategoryMatches = Object.entries(categoryKeywords)
    .map(([category, keywords]) => ({
      category: category as CategoryId,
      matches: findKeywordMatches(title, keywords)
    }))
    .filter(({matches}) => matches.length > 0)
    .sort(
      (a, b) =>
        b.matches.length - a.matches.length ||
        categoryPriority[a.category] - categoryPriority[b.category]
    );
  const primaryCategory = titleCategoryMatches[0];
  const titleParashaMatch = parashaSlugKeywords.find(({keywords}) =>
    findKeywordMatches(title, keywords).length
  );

  if (primaryCategory && primaryCategory.category !== 'parashat-hashavua') {
    return {
      category: primaryCategory.category,
      parashaSlug: null,
      matchedKeywords: primaryCategory.matches
    };
  }

  if (titleParashaMatch) {
    return {
      category: 'parashat-hashavua' as CategoryId,
      parashaSlug: titleParashaMatch.slug,
      matchedKeywords: [
        ...new Set([
          ...(primaryCategory?.matches ?? []),
          ...findKeywordMatches(title, titleParashaMatch.keywords)
        ])
      ]
    };
  }

  return {
    category: primaryCategory?.category ?? ('other' as CategoryId),
    parashaSlug: null,
    matchedKeywords: primaryCategory?.matches ?? []
  };
}

export function defaultTags(
  category: CategoryId,
  parashaSlug: string | null
): string[] {
  const tags: string[] = [category];

  if (parashaSlug) {
    tags.push('torah-reading', parashaSlug);
  }

  return [...new Set(tags)];
}

export function toImportedVideo(
  video: VideoResource,
  overrides: Record<string, ManualOverride>
): ImportedVideo {
  const automatic = classifyVideo(video.snippet.title, video.snippet.description);
  const override = overrides[video.id];
  const category = override?.category ?? automatic.category;
  const parashaSlug =
    override && 'parashaSlug' in override
      ? (override.parashaSlug ?? null)
      : automatic.parashaSlug;
  const tags = override?.tags ?? defaultTags(category, parashaSlug);
  const titleHe = override?.title?.he ?? video.snippet.title;
  const titleEn = override?.title?.en ?? video.snippet.title;

  return {
    videoId: video.id,
    title: {
      source: video.snippet.title,
      he: titleHe,
      en: titleEn
    },
    description: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
    duration: video.contentDetails?.duration ?? '',
    thumbnails: video.snippet.thumbnails ?? {},
    watchUrl: `https://www.youtube.com/watch?v=${video.id}`,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    category,
    subcategory: override?.subcategory ?? null,
    slug: {
      he: override?.slug?.he,
      en: override?.slug?.en
    },
    parashaSlug,
    tags,
    nusach: override?.nusach ?? null,
    displayOrder: override?.displayOrder ?? null,
    featured: override?.featured ?? false,
    hidden: override?.hidden ?? false,
    classification: {
      automaticCategory: automatic.category,
      matchedKeywords: automatic.matchedKeywords,
      manualOverrideApplied: Boolean(override)
    }
  };
}

export function logClassificationCounts(videos: ImportedVideo[]) {
  const counts = videos.reduce<Record<string, number>>((accumulator, video) => {
    accumulator[video.category] = (accumulator[video.category] ?? 0) + 1;
    return accumulator;
  }, {});

  console.log('Classification counts:');
  for (const category of Object.keys(categoryKeywords)) {
    console.log(`- ${category}: ${counts[category] ?? 0}`);
  }
}

export async function importYouTubeVideos(): Promise<ImportedVideo[]> {
  loadLocalEnv();

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing YOUTUBE_API_KEY. Add it to your environment and rerun npm run import:youtube.'
    );
  }

  console.log(`Resolving YouTube channel @${CHANNEL_HANDLE}.`);
  const uploadsPlaylistId = await resolveUploadsPlaylistId(apiKey);
  console.log(`Uploads playlist: ${uploadsPlaylistId}`);

  const videoIds = await fetchAllPlaylistVideoIds(apiKey, uploadsPlaylistId);
  console.log(`Fetched ${videoIds.length} public video IDs.`);

  const videoDetails = await fetchVideoDetails(apiKey, videoIds);
  console.log(`Fetched metadata for ${videoDetails.length} public videos.`);

  const manualOverrides = await readManualOverrides();
  const importedVideos = videoDetails
    .map((video) => toImportedVideo(video, manualOverrides.videos ?? {}))
    .sort((a, b) => {
      if (a.displayOrder !== null || b.displayOrder !== null) {
        return (a.displayOrder ?? Number.MAX_SAFE_INTEGER) -
          (b.displayOrder ?? Number.MAX_SAFE_INTEGER);
      }

      return b.publishedAt.localeCompare(a.publishedAt);
    });

  await writeFile(OUTPUT_PATH, `${JSON.stringify(importedVideos, null, 2)}\n`);

  console.log(`Saved metadata to ${OUTPUT_PATH}.`);
  console.log(`Videos fetched: ${importedVideos.length}`);
  logClassificationCounts(importedVideos);

  return importedVideos;
}

if (process.argv[1]?.endsWith('import-youtube.ts')) {
  importYouTubeVideos().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
