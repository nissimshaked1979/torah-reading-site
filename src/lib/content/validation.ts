import type {Category, ContentItem, Parasha, Tag} from './types';

type SluggedEntity = {
  id: string;
  slug: {
    he: string;
    en: string;
  };
};

export function hasRequiredLocalizedText(value?: {
  he?: string;
  en?: string;
}): boolean {
  return Boolean(value?.he?.trim() && value.en?.trim());
}

export function validateUniqueIds(items: Array<{id: string}>): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      duplicates.push(item.id);
    }
    seen.add(item.id);
  }

  return duplicates;
}

export function validateUniqueLocalizedSlugs(items: SluggedEntity[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const item of items) {
    for (const locale of ['he', 'en'] as const) {
      const key = `${locale}:${item.slug[locale]}`;
      if (seen.has(key)) {
        duplicates.push(key);
      }
      seen.add(key);
    }
  }

  return duplicates;
}

export function validateContentFoundation(data: {
  categories: Category[];
  contentItems: ContentItem[];
  parashot: Parasha[];
  tags: Tag[];
}): string[] {
  const errors: string[] = [];
  const categoryIds = new Set(data.categories.map((category) => category.id));
  const parashaIds = new Set(data.parashot.map((parasha) => parasha.id));
  const tagIds = new Set(data.tags.map((tag) => tag.id));

  for (const item of data.contentItems) {
    if (!categoryIds.has(item.categoryId)) {
      errors.push(`Unknown category for content item: ${item.id}`);
    }

    if (item.parashaId && !parashaIds.has(item.parashaId)) {
      errors.push(`Unknown parasha for content item: ${item.id}`);
    }

    for (const tagId of item.tagIds) {
      if (!tagIds.has(tagId)) {
        errors.push(`Unknown tag "${tagId}" for content item: ${item.id}`);
      }
    }

    if (!hasRequiredLocalizedText(item.title)) {
      errors.push(`Missing localized title for content item: ${item.id}`);
    }
  }

  return [
    ...errors,
    ...validateUniqueIds(data.categories).map((id) => `Duplicate category: ${id}`),
    ...validateUniqueIds(data.contentItems).map(
      (id) => `Duplicate content item: ${id}`
    ),
    ...validateUniqueIds(data.parashot).map((id) => `Duplicate parasha: ${id}`),
    ...validateUniqueIds(data.tags).map((id) => `Duplicate tag: ${id}`),
    ...validateUniqueLocalizedSlugs(data.contentItems).map(
      (slug) => `Duplicate content slug: ${slug}`
    ),
    ...validateUniqueLocalizedSlugs(data.parashot).map(
      (slug) => `Duplicate parasha slug: ${slug}`
    )
  ];
}
