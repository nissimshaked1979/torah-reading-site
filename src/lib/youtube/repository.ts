import youtubeVideosJson from '../../../data/youtube-videos.json';
import manualOverridesJson from '../../../data/manual-overrides.json';
import {categories, getParashaBySlug} from '@/lib/content/repository';
import type {Locale} from '@/i18n/routing';
import type {ManualOverridesFile, YouTubeVideo} from './types';

const youtubeVideos = youtubeVideosJson as YouTubeVideo[];
const manualOverrides = manualOverridesJson as ManualOverridesFile;
const irrelevantKeywords = [
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

export function getAllVideos(): YouTubeVideo[] {
  return getVisibleVideos();
}

export function getVisibleVideos(): YouTubeVideo[] {
  return dedupeVideos(youtubeVideos)
    .map(applyManualOverride)
    .filter(isPublicVideo)
    .sort(compareVideos);
}

export function getVideosByCategory(category: string): YouTubeVideo[] {
  return sortVideosForCategory(
    getVisibleVideos().filter((video) => video.category === category),
    category
  );
}

export function getVideosByCategorySlug(categorySlug: string): YouTubeVideo[] {
  const decodedSlug = safeDecode(categorySlug);

  if (decodedSlug === 'all') {
    return sortVideosForCategory(getVisibleVideos(), decodedSlug);
  }

  const category = categories.find(
    (item) =>
      item.id === decodedSlug ||
      item.slug.he === decodedSlug ||
      item.slug.en === decodedSlug
  );

  return category ? getVideosByCategory(category.id) : [];
}

export function getVideosByParasha(parashaSlug: string): YouTubeVideo[] {
  const parasha = getParashaBySlug(parashaSlug);
  const slugs = new Set(
    parasha
      ? [
          parasha.id,
          parasha.slug.he,
          parasha.slug.en,
          ...(parasha.combinedParashaIds ?? [])
        ]
      : [parashaSlug]
  );

  return sortVideosForCategory(
    getVisibleVideos().filter(
      (video) => video.parashaSlug && slugs.has(video.parashaSlug)
    ),
    'parashat-hashavua'
  );
}

export function getLatestVideos(limit: number): YouTubeVideo[] {
  const videos = getVisibleVideos();
  const featured = videos.filter((video) => video.featured);
  const regular = videos.filter((video) => !video.featured);

  return [...featured, ...regular].slice(0, limit);
}

export function getVideoById(videoId: string): YouTubeVideo | undefined {
  return getVisibleVideos().find((video) => video.videoId === videoId);
}

export function getVideoByIdentifier(identifier: string): YouTubeVideo | undefined {
  const decodedIdentifier = decodeURIComponent(identifier);

  return getVisibleVideos().find(
    (video) =>
      video.videoId === decodedIdentifier ||
      video.slug?.he === decodedIdentifier ||
      video.slug?.en === decodedIdentifier
  );
}

export function getRelatedVideos(video: YouTubeVideo): YouTubeVideo[] {
  const tags = new Set(video.tags);

  return getVisibleVideos()
    .filter((candidate) => candidate.videoId !== video.videoId)
    .map((candidate) => ({
      candidate,
      score:
        Number(candidate.category === video.category) +
        Number(candidate.parashaSlug && candidate.parashaSlug === video.parashaSlug) +
        candidate.tags.filter((tag) => tags.has(tag)).length
    }))
    .filter(({score}) => score > 0)
    .sort((a, b) => b.score - a.score || compareVideos(a.candidate, b.candidate))
    .map(({candidate}) => candidate)
    .slice(0, 6);
}

export function searchVisibleVideos(query: string, locale: Locale): YouTubeVideo[] {
  const normalizedQuery = normalizeForSearch(query);

  if (!normalizedQuery) {
    return getLatestVideos(12);
  }

  return getVisibleVideos()
    .map((video) => ({
      video,
      score: getSearchScore(video, normalizedQuery, locale)
    }))
    .filter(({score}) => score > 0)
    .sort((a, b) => b.score - a.score || compareVideos(a.video, b.video))
    .map(({video}) => video);
}

export function sortVideosForCategory(
  videos: YouTubeVideo[],
  categorySlug: string
): YouTubeVideo[] {
  const decodedSlug = safeDecode(categorySlug);
  const category = categories.find(
    (item) =>
      item.id === decodedSlug ||
      item.slug.he === decodedSlug ||
      item.slug.en === decodedSlug
  );
  const categoryId = category?.id ?? decodedSlug;

  if (categoryId === 'parashat-hashavua') {
    return [...videos].sort(
      (a, b) => getParashaOrder(a) - getParashaOrder(b) || compareVideos(a, b)
    );
  }

  if (categoryId === 'tehillim') {
    return [...videos].sort(
      (a, b) =>
        (extractTehillimChapter(a) ?? Number.MAX_SAFE_INTEGER) -
          (extractTehillimChapter(b) ?? Number.MAX_SAFE_INTEGER) ||
        compareVideos(a, b)
    );
  }

  return [...videos].sort(compareVideos);
}

export function extractTehillimChapter(video: YouTubeVideo): number | undefined {
  const text = `${video.title.source} ${video.title.he} ${video.title.en} ${video.description}`;
  const normalized = normalizeForSearch(text);
  const directMatch = normalized.match(
    /\b(?:tehillim|psalm|psalms)\s*(?:chapter|chap\.?|פרק)?\s*(\d{1,3})\b/i
  );

  if (directMatch) {
    return clampTehillimChapter(Number(directMatch[1]));
  }

  const hebrewMatch = normalized.match(/תהילים\s*(?:פרק)?\s*([א-ת]{1,5}|\d{1,3})/);

  if (!hebrewMatch) {
    return undefined;
  }

  const chapter = /^\d+$/.test(hebrewMatch[1])
    ? Number(hebrewMatch[1])
    : hebrewNumeralToNumber(hebrewMatch[1]);

  return clampTehillimChapter(chapter);
}

export function getParashaOrder(video: YouTubeVideo): number {
  const parasha = video.parashaSlug ? getParashaBySlug(video.parashaSlug) : undefined;

  return parasha?.order ?? Number.MAX_SAFE_INTEGER;
}

export function getBestThumbnail(video: YouTubeVideo): string | undefined {
  return (
    video.thumbnails.maxres?.url ??
    video.thumbnails.standard?.url ??
    video.thumbnails.high?.url ??
    video.thumbnails.medium?.url ??
    video.thumbnails.default?.url
  );
}

export function getVideoCardDescription(video: YouTubeVideo): string {
  return makeExcerpt(video.description);
}

function dedupeVideos(videos: YouTubeVideo[]): YouTubeVideo[] {
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();
  const unique: YouTubeVideo[] = [];

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

function isPublicVideo(video: YouTubeVideo): boolean {
  return !video.hidden && !isIrrelevantVideo(video);
}

function isIrrelevantVideo(video: YouTubeVideo): boolean {
  const text = normalizeText(
    `${video.title.source}\n${video.title.he}\n${video.title.en}\n${video.description}\n${video.watchUrl}`
  );

  return irrelevantKeywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function makeExcerpt(value: string): string {
  const cleaned = collapseWhitespace(value)
    .replace(/\byoutube\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.length <= 160 ? cleaned : `${cleaned.slice(0, 157).trimEnd()}...`;
}

function normalizeText(value: string): string {
  return collapseWhitespace(value).toLowerCase();
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function getSearchScore(
  video: YouTubeVideo,
  normalizedQuery: string,
  locale: Locale
): number {
  const category = categories.find((item) => item.id === video.category);
  const parasha = video.parashaSlug ? getParashaBySlug(video.parashaSlug) : undefined;
  const haystack = normalizeForSearch(
    [
      video.title[locale],
      video.title.he,
      video.title.en,
      video.title.source,
      video.description,
      video.category,
      category?.title.he,
      category?.title.en,
      parasha?.title.he,
      parasha?.title.en,
      parasha?.slug.he,
      parasha?.slug.en,
      video.tags.join(' ')
    ]
      .filter(Boolean)
      .join(' ')
  );

  if (!haystack.includes(normalizedQuery)) {
    return 0;
  }

  let score = 1;
  const title = normalizeForSearch(
    `${video.title[locale]} ${video.title.source} ${video.title.he} ${video.title.en}`
  );

  if (title.includes(normalizedQuery)) {
    score += 5;
  }

  if (normalizeForSearch(category?.title[locale] ?? '').includes(normalizedQuery)) {
    score += 3;
  }

  if (normalizeForSearch(parasha?.title[locale] ?? '').includes(normalizedQuery)) {
    score += 3;
  }

  return score;
}

function normalizeForSearch(value: string): string {
  return collapseWhitespace(
    value
      .normalize('NFKD')
      .replace(/[\u0591-\u05c7]/g, '')
      .replace(/[״"׳']/g, '')
      .replace(/[ך]/g, 'כ')
      .replace(/[ם]/g, 'מ')
      .replace(/[ן]/g, 'נ')
      .replace(/[ף]/g, 'פ')
      .replace(/[ץ]/g, 'צ')
      .toLowerCase()
  );
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
  const normalized = normalizeForSearch(value);
  let total = 0;

  for (const letter of normalized) {
    total += numerals[letter] ?? 0;
  }

  return total || undefined;
}

function clampTehillimChapter(value: number | undefined): number | undefined {
  return value && value >= 1 && value <= 150 ? value : undefined;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function applyManualOverride(video: YouTubeVideo): YouTubeVideo {
  const override = manualOverrides.videos?.[video.videoId];

  if (!override) {
    return video;
  }

  return {
    ...video,
    category: override.category ?? video.category,
    subcategory:
      'subcategory' in override ? (override.subcategory ?? null) : video.subcategory,
    title: {
      source: video.title.source,
      he: override.title?.he ?? video.title.he,
      en: override.title?.en ?? video.title.en
    },
    slug: {
      he: override.slug?.he ?? video.slug?.he,
      en: override.slug?.en ?? video.slug?.en
    },
    parashaSlug:
      'parashaSlug' in override
        ? (override.parashaSlug ?? null)
        : video.parashaSlug,
    tags: override.tags ?? video.tags,
    nusach: 'nusach' in override ? (override.nusach ?? null) : video.nusach,
    displayOrder:
      'displayOrder' in override
        ? (override.displayOrder ?? null)
        : video.displayOrder,
    featured: override.featured ?? video.featured ?? false,
    hidden: override.hidden ?? video.hidden ?? false,
    classification: {
      ...video.classification,
      manualOverrideApplied: true
    }
  };
}

function compareVideos(a: YouTubeVideo, b: YouTubeVideo): number {
  if (a.featured !== b.featured) {
    return Number(b.featured) - Number(a.featured);
  }

  if (a.displayOrder !== null || b.displayOrder !== null) {
    return (
      (a.displayOrder ?? Number.MAX_SAFE_INTEGER) -
      (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
    );
  }

  return b.publishedAt.localeCompare(a.publishedAt);
}
