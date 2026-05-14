import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound, redirect} from 'next/navigation';

import {VideoGrid} from '@/components/content/VideoGrid';
import {CategorySuggestions} from '@/components/content/CategorySuggestions';
import {PageShell} from '@/components/layout/PageShell';
import type {Locale} from '@/i18n/routing';
import {categories} from '@/lib/content/repository';
import {decodeRouteSegment} from '@/lib/routing/segments';
import {JsonLd, buildBreadcrumbJsonLd} from '@/lib/seo/jsonld';
import {buildLocalizedMetadata} from '@/lib/seo/metadata';
import {
  getVideosByCategorySlug,
  sortVideosForCategory
} from '@/lib/youtube/repository';

type CategoryPageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const decodedSlug = decodeRouteSegment(slug);
  const isAllVideos = decodedSlug === 'all';
  const category = categories.find(
    (item) =>
      item.id === decodedSlug ||
      item.slug.he === decodedSlug ||
      item.slug.en === decodedSlug
  );
  const title = isAllVideos
    ? locale === 'he'
      ? 'כל הסרטונים'
      : 'All Videos'
    : category?.title[locale] ??
      (locale === 'he' ? 'קטגוריית קריאות' : 'Reading Category');
  const description = isAllVideos
    ? locale === 'he'
      ? 'כל הסרטונים הזמינים באתר.'
      : 'All visible videos on the site.'
    : category?.description?.[locale] ??
      (locale === 'he'
        ? 'קטגוריית תוכן לקריאות תורה, תהילים, תפילות ומועדים.'
        : 'Content category for Torah reading, Tehillim, prayers, and holidays.');

  return buildLocalizedMetadata({
    locale,
    path: `/category/${category?.slug.en ?? slug}`,
    languagePaths: category
      ? {
          he: `/category/${category.slug.en}`,
          en: `/category/${category.slug.en}`
        }
      : isAllVideos
        ? {
            he: '/category/all',
            en: '/category/all'
          }
        : undefined,
    title:
      locale === 'he'
        ? `${title} | קריאת התורה`
        : `${title} | Torah Reading`,
    description
  });
}

export default async function CategoryPage({params}: CategoryPageProps) {
  const {locale, slug} = await params;
  const decodedSlug = decodeRouteSegment(slug);
  const isAllVideos = decodedSlug === 'all';
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'CategoryPage'});
  const category = categories.find(
    (item) =>
      item.id === decodedSlug ||
      item.slug.he === decodedSlug ||
      item.slug.en === decodedSlug
  );

  if (!category && !isAllVideos) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[category] Invalid category slug "${decodedSlug}" (${locale}).`);
    }
    notFound();
  }

  if (category && decodedSlug !== category.slug.en) {
    redirect(`/${locale}/category/${category.slug.en}`);
  }

  const videos = sortVideosForCategory(
    getVideosByCategorySlug(decodedSlug),
    decodedSlug
  );
  const title = isAllVideos
    ? locale === 'he'
      ? 'כל הסרטונים'
      : 'All Videos'
    : category?.title[locale] ?? t('title');
  const description = isAllVideos
    ? locale === 'he'
      ? 'כל הסרטונים הזמינים באתר.'
      : 'All visible videos on the site.'
    : category?.description?.[locale] ?? t('description', {slug: decodedSlug});

  if (process.env.NODE_ENV === 'development' && videos.length === 0) {
    console.warn(`[category] Page "${decodedSlug}" loaded with 0 videos (${locale}).`);
  }

  return (
    <PageShell
      eyebrow={t('eyebrow')}
      title={title}
      description={description}
    >
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          {name: locale === 'he' ? 'בית' : 'Home', path: '/'},
          {
            name: title,
            path: `/category/${category?.slug.en ?? decodedSlug}`
          }
        ])}
      />
      <p className="text-sm font-semibold text-slate-600" aria-live="polite">
        {locale === 'he' ? `${videos.length} סרטונים` : `${videos.length} videos`}
      </p>
      <VideoGrid
        emptyMessage={
          locale === 'he'
            ? 'אין סרטונים זמינים בקטגוריה הזו עדיין.'
            : 'No videos are available in this category yet.'
        }
        fallback={<CategorySuggestions locale={locale} />}
        locale={locale}
        videos={videos}
      />
    </PageShell>
  );
}
