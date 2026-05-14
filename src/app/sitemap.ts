import type {MetadataRoute} from 'next';

import {categories, parashot} from '@/lib/content/repository';
import {localizedUrl} from '@/lib/seo/metadata';
import {getAllVideos} from '@/lib/youtube/repository';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    ...localizedEntries('', now),
    ...localizedEntries('/search', now)
  ];

  for (const category of categories) {
    routes.push({
      url: localizedUrl('he', `/category/${category.slug.he}`),
      lastModified: now,
      alternates: {
        languages: {
          he: localizedUrl('he', `/category/${category.slug.he}`),
          en: localizedUrl('en', `/category/${category.slug.en}`)
        }
      }
    });
    routes.push({
      url: localizedUrl('en', `/category/${category.slug.en}`),
      lastModified: now,
      alternates: {
        languages: {
          he: localizedUrl('he', `/category/${category.slug.he}`),
          en: localizedUrl('en', `/category/${category.slug.en}`)
        }
      }
    });
  }

  for (const parasha of parashot) {
    routes.push({
      url: localizedUrl('he', `/parasha/${parasha.slug.he}`),
      lastModified: now,
      alternates: {
        languages: {
          he: localizedUrl('he', `/parasha/${parasha.slug.he}`),
          en: localizedUrl('en', `/parasha/${parasha.slug.en}`)
        }
      }
    });
    routes.push({
      url: localizedUrl('en', `/parasha/${parasha.slug.en}`),
      lastModified: now,
      alternates: {
        languages: {
          he: localizedUrl('he', `/parasha/${parasha.slug.he}`),
          en: localizedUrl('en', `/parasha/${parasha.slug.en}`)
        }
      }
    });
  }

  for (const video of getAllVideos()) {
    const modified = video.publishedAt ? new Date(video.publishedAt) : now;
    routes.push({
      url: localizedUrl('he', `/video/${video.videoId}`),
      lastModified: modified,
      alternates: {
        languages: {
          he: localizedUrl('he', `/video/${video.videoId}`),
          en: localizedUrl('en', `/video/${video.videoId}`)
        }
      }
    });
    routes.push({
      url: localizedUrl('en', `/video/${video.videoId}`),
      lastModified: modified,
      alternates: {
        languages: {
          he: localizedUrl('he', `/video/${video.videoId}`),
          en: localizedUrl('en', `/video/${video.videoId}`)
        }
      }
    });
  }

  return routes;
}

function localizedEntries(path: string, date: Date): MetadataRoute.Sitemap {
  return (['he', 'en'] as const).map((locale) => ({
    url: localizedUrl(locale, path),
    lastModified: date,
    alternates: {
      languages: {
        he: localizedUrl('he', path),
        en: localizedUrl('en', path)
      }
    }
  }));
}
