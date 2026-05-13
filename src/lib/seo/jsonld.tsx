import type {Locale} from '@/i18n/routing';
import {getBestThumbnail} from '@/lib/youtube/repository';
import type {YouTubeVideo} from '@/lib/youtube/types';

import {localizedUrl, siteUrl} from './metadata';

type JsonLdProps = {
  data: object;
};

export function JsonLd({data}: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
      type="application/ld+json"
    />
  );
}

export function buildWebsiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name:
      locale === 'he'
        ? 'ניסים שקד - קריאות תורה'
        : 'Nissim Shaked Torah Readings',
    url: localizedUrl(locale),
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${localizedUrl(locale, '/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function buildBreadcrumbJsonLd(
  locale: Locale,
  items: Array<{name: string; path: string}>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.path)
    }))
  };
}

export function buildVideoJsonLd(video: YouTubeVideo, locale: Locale) {
  const thumbnail = getBestThumbnail(video);

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title[locale],
    description: video.description || video.title[locale],
    thumbnailUrl: thumbnail ? [thumbnail] : undefined,
    uploadDate: video.publishedAt,
    duration: video.duration || undefined,
    embedUrl: video.embedUrl,
    url: video.watchUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Nissim Shaked',
      url: siteUrl
    }
  };
}
