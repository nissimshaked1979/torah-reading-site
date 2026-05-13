import type {Locale} from '@/i18n/routing';

import {categories, contentItems, tags} from '../../../data/content';
import {parashot} from '../../../data/parashot';
import type {CategoryId, ContentItem, Parasha} from './types';

export {categories, contentItems, parashot, tags};

export function getAllContent(): ContentItem[] {
  return contentItems.filter((item) => item.status === 'published');
}

export function getContentBySlug(
  slug: string,
  locale: Locale
): ContentItem | undefined {
  return getAllContent().find((item) => item.slug[locale] === slug);
}

export function getContentByCategory(category: CategoryId | string): ContentItem[] {
  const categoryId =
    categories.find(
      (item) =>
        item.id === category ||
        item.slug.he === category ||
        item.slug.en === category
    )?.id ?? category;

  return getAllContent().filter((item) => item.categoryId === categoryId);
}

export function getParashaBySlug(slug: string): Parasha | undefined {
  return parashot.find(
    (parasha) =>
      parasha.id === slug || parasha.slug.he === slug || parasha.slug.en === slug
  );
}

export function getVideosForParasha(parasha: Parasha | string) {
  const parashaId = typeof parasha === 'string' ? parasha : parasha.id;

  return getAllContent()
    .filter((item) => item.parashaId === parashaId)
    .flatMap((item) => item.videos);
}

export function getRelatedContent(item: ContentItem): ContentItem[] {
  const tagIds = new Set(item.tagIds);

  return getAllContent()
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => ({
      candidate,
      score:
        Number(candidate.categoryId === item.categoryId) +
        Number(candidate.parashaId && candidate.parashaId === item.parashaId) +
        candidate.tagIds.filter((tagId) => tagIds.has(tagId)).length
    }))
    .filter(({score}) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({candidate}) => candidate)
    .slice(0, 6);
}
