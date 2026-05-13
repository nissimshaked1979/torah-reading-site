import type {Locale} from '@/i18n/routing';

const hebrewNiqqud = /[\u0591-\u05C7]/g;
const unsafeSlugChars = /[^\p{Letter}\p{Number}]+/gu;

export function generateSlug(value: string, locale: Locale): string {
  const normalized =
    locale === 'he' ? value.normalize('NFKD').replace(hebrewNiqqud, '') : value;

  return normalized
    .trim()
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(unsafeSlugChars, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateLocalizedSlugs(title: Record<Locale, string>) {
  return {
    he: generateSlug(title.he, 'he'),
    en: generateSlug(title.en, 'en')
  };
}
