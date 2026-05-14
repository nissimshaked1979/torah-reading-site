import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {VideoGrid} from '@/components/content/VideoGrid';
import {PageShell} from '@/components/layout/PageShell';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {getParashaBySlug, parashot} from '@/lib/content/repository';
import {decodeRouteSegment} from '@/lib/routing/segments';
import {JsonLd, buildBreadcrumbJsonLd} from '@/lib/seo/jsonld';
import {buildLocalizedMetadata} from '@/lib/seo/metadata';
import {getVideosByParasha} from '@/lib/youtube/repository';

type ParashaPageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ParashaPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const decodedSlug = decodeRouteSegment(slug);
  const parasha = getParashaBySlug(decodedSlug);
  const title = parasha?.title[locale] ?? decodedSlug;
  const description = parasha
    ? locale === 'he'
      ? `קריאת התורה לפרשת ${title}, טעמי המקרא ונוסח ספרדי ירושלמי.`
      : `Torah reading for Parashat ${title}, Sephardic Torah reading, and Weekly Parasha.`
    : locale === 'he'
      ? 'עמוד פרשה לקריאת התורה ופרשת השבוע.'
      : 'Parasha page for Torah reading and Weekly Parasha.';

  return buildLocalizedMetadata({
    locale,
    path: `/parasha/${slug}`,
    languagePaths: parasha
      ? {
          he: `/parasha/${parasha.slug.he}`,
          en: `/parasha/${parasha.slug.en}`
        }
      : undefined,
    title:
      locale === 'he'
        ? `פרשת ${title} | קריאת התורה`
        : `Parashat ${title} | Torah Reading`,
    description
  });
}

export default async function ParashaPage({params}: ParashaPageProps) {
  const {locale, slug} = await params;
  const decodedSlug = decodeRouteSegment(slug);
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'ParashaPage'});
  const parasha = getParashaBySlug(decodedSlug);
  const videos = parasha ? getVideosByParasha(parasha.slug.en) : [];
  const orderedParashot = parashot.sort((a, b) => a.order - b.order);
  const parashaIndex = parasha
    ? orderedParashot.findIndex((item) => item.id === parasha.id)
    : -1;
  const previousParasha =
    parashaIndex > 0 ? orderedParashot[parashaIndex - 1] : undefined;
  const nextParasha =
    parashaIndex >= 0 && parashaIndex < orderedParashot.length - 1
      ? orderedParashot[parashaIndex + 1]
      : undefined;

  return (
    <PageShell
      eyebrow={t('eyebrow')}
      title={parasha?.title[locale] ?? t('title')}
      description={
        parasha
          ? parasha.book[locale]
          : t('description', {slug: decodedSlug})
      }
    >
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          {name: locale === 'he' ? 'בית' : 'Home', path: '/'},
          {
            name: locale === 'he' ? 'פרשת השבוע' : 'Weekly Parasha',
            path: '/category/parashat-hashavua'
          },
          {
            name: parasha?.title[locale] ?? decodedSlug,
            path: `/parasha/${parasha?.slug[locale] ?? decodedSlug}`
          }
        ])}
      />
      <VideoGrid
        emptyMessage={
          locale === 'he'
            ? 'אין סרטונים משויכים לפרשה הזו עדיין.'
            : 'No videos are mapped to this parasha yet.'
        }
        locale={locale}
        videos={videos}
      />

      <nav className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between">
        {previousParasha ? (
          <Link
            className="text-sm font-medium text-slate-700"
            href={`/parasha/${previousParasha.slug[locale]}`}
          >
            {locale === 'he' ? 'הפרשה הקודמת: ' : 'Previous: '}
            {previousParasha.title[locale]}
          </Link>
        ) : (
          <span />
        )}
        {nextParasha ? (
          <Link
            className="text-sm font-medium text-slate-700"
            href={`/parasha/${nextParasha.slug[locale]}`}
          >
            {locale === 'he' ? 'הפרשה הבאה: ' : 'Next: '}
            {nextParasha.title[locale]}
          </Link>
        ) : null}
      </nav>
    </PageShell>
  );
}
