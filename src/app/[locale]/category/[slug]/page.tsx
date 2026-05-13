import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {VideoGrid} from '@/components/content/VideoGrid';
import {PageShell} from '@/components/layout/PageShell';
import type {Locale} from '@/i18n/routing';
import {categories} from '@/lib/content/repository';
import {decodeRouteSegment} from '@/lib/routing/segments';
import {JsonLd, buildBreadcrumbJsonLd} from '@/lib/seo/jsonld';
import {buildLocalizedMetadata} from '@/lib/seo/metadata';
import {getVideosByCategory} from '@/lib/youtube/repository';

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
  const category = categories.find(
    (item) =>
      item.id === decodedSlug ||
      item.slug.he === decodedSlug ||
      item.slug.en === decodedSlug
  );
  const title =
    category?.title[locale] ??
    (locale === 'he' ? 'קטגוריית קריאות' : 'Reading Category');
  const description =
    category?.description?.[locale] ??
    (locale === 'he'
      ? 'קטגוריית תוכן לקריאות תורה, תהילים, תפילות ומועדים.'
      : 'Content category for Torah reading, Tehillim, prayers, and holidays.');

  return buildLocalizedMetadata({
    locale,
    path: `/category/${slug}`,
    languagePaths: category
      ? {
          he: `/category/${category.slug.he}`,
          en: `/category/${category.slug.en}`
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
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'CategoryPage'});
  const category = categories.find(
    (item) =>
      item.id === decodedSlug ||
      item.slug.he === decodedSlug ||
      item.slug.en === decodedSlug
  );
  const videos = category ? getVideosByCategory(category.id) : [];

  return (
    <PageShell
      eyebrow={t('eyebrow')}
      title={category?.title[locale] ?? t('title')}
      description={
        category?.description?.[locale] ?? t('description', {slug: decodedSlug})
      }
    >
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          {name: locale === 'he' ? 'בית' : 'Home', path: '/'},
          {
            name: category?.title[locale] ?? decodedSlug,
            path: `/category/${category?.slug[locale] ?? decodedSlug}`
          }
        ])}
      />
      <VideoGrid
        emptyMessage={
          locale === 'he'
            ? 'אין סרטונים זמינים בקטגוריה הזו עדיין.'
            : 'No videos are available in this category yet.'
        }
        locale={locale}
        videos={videos}
      />
    </PageShell>
  );
}
