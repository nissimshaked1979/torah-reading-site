import youtubeVideosJson from '../../../data/youtube-videos.json';
import manualOverridesJson from '../../../data/manual-overrides.json';
import {getParashaBySlug} from '@/lib/content/repository';
import type {ManualOverridesFile, YouTubeVideo} from './types';

const youtubeVideos = youtubeVideosJson as YouTubeVideo[];
const manualOverrides = manualOverridesJson as ManualOverridesFile;

export function getAllVideos(): YouTubeVideo[] {
  return youtubeVideos
    .map(applyManualOverride)
    .filter((video) => !video.hidden)
    .sort(compareVideos);
}

export function getVideosByCategory(category: string): YouTubeVideo[] {
  return getAllVideos().filter((video) => video.category === category);
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

  return getAllVideos().filter(
    (video) => video.parashaSlug && slugs.has(video.parashaSlug)
  );
}

export function getLatestVideos(limit: number): YouTubeVideo[] {
  const videos = getAllVideos();
  const featured = videos.filter((video) => video.featured);
  const regular = videos.filter((video) => !video.featured);

  return [...featured, ...regular].slice(0, limit);
}

export function getVideoById(videoId: string): YouTubeVideo | undefined {
  return getAllVideos().find((video) => video.videoId === videoId);
}

export function getRelatedVideos(video: YouTubeVideo): YouTubeVideo[] {
  const tags = new Set(video.tags);

  return getAllVideos()
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

export function getBestThumbnail(video: YouTubeVideo): string | undefined {
  return (
    video.thumbnails.maxres?.url ??
    video.thumbnails.standard?.url ??
    video.thumbnails.high?.url ??
    video.thumbnails.medium?.url ??
    video.thumbnails.default?.url
  );
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
