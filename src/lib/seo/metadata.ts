import type {Metadata} from 'next';

import type {Locale} from '@/i18n/routing';

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
);

export const seoKeywords = [
  'פרשת השבוע',
  'קריאת התורה',
  'טעמי המקרא',
  'נוסח ספרדי ירושלמי',
  'תהילים',
  'שיר השירים',
  'Torah reading',
  'Sephardic Torah reading',
  'Weekly Parasha'
];

type LocalizedMetadataInput = {
  description: string;
  image?: string;
  languagePaths?: Partial<Record<Locale, string>>;
  locale: Locale;
  path: string;
  title: string;
};

export function buildLocalizedMetadata({
  description,
  image,
  languagePaths,
  locale,
  path,
  title
}: LocalizedMetadataInput): Metadata {
  const canonical = localizedUrl(locale, path);
  const alternatePath = path.replace(/^\/(he|en)(?=\/|$)/, '');

  return {
    title,
    description,
    keywords: seoKeywords,
    alternates: {
      canonical,
      languages: {
        he: localizedUrl('he', languagePaths?.he ?? alternatePath),
        en: localizedUrl('en', languagePaths?.en ?? alternatePath),
        'x-default': localizedUrl('he', languagePaths?.he ?? alternatePath)
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Nissim Shaked Torah Readings',
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      alternateLocale: locale === 'he' ? ['en_US'] : ['he_IL'],
      type: 'website',
      images: image ? [{url: image}] : undefined
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}

export function localizedUrl(locale: Locale, path = ''): string {
  const cleanPath = path === '/' ? '' : path.replace(/^\/(he|en)(?=\/|$)/, '');
  return `${siteUrl}/${locale}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`.replace(
    /\/$/,
    ''
  );
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, '');
}
