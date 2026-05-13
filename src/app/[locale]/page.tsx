import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {CategoryCard} from '@/components/content/CategoryCard';
import {VideoGrid} from '@/components/content/VideoGrid';
import {PageShell} from '@/components/layout/PageShell';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {
  getCurrentParasha,
  getNextParasha,
  getParashaDisplayName,
  getPreviousParasha
} from '@/lib/calendar/parashaCalendar';
import {categories} from '@/lib/content/repository';
import {JsonLd, buildWebsiteJsonLd} from '@/lib/seo/jsonld';
import {buildLocalizedMetadata} from '@/lib/seo/metadata';
import {getLatestVideos, getVideosByParasha} from '@/lib/youtube/repository';

type HomePageProps = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({
  params
}: HomePageProps): Promise<Metadata> {
  const {locale} = await params;

  return buildLocalizedMetadata({
    locale,
    path: '/',
    title:
      locale === 'he'
        ? 'קריאת התורה, פרשת השבוע ותהילים'
        : 'Torah Reading, Weekly Parasha, and Tehillim',
    description:
      locale === 'he'
        ? 'ספריית קריאות תורה בנוסח ספרדי ירושלמי, פרשת השבוע, טעמי המקרא, תהילים, שיר השירים ותפילות.'
        : 'A bilingual library for Sephardic Torah reading, Weekly Parasha, Tehillim, Shir Hashirim, prayers, and Jewish readings.'
  });
}

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'HomePage'});
  const latestVideos = getLatestVideos(6);
  const currentParasha = getCurrentParasha();
  const previousParasha = getPreviousParasha(currentParasha);
  const nextParasha = getNextParasha(currentParasha);
  const currentParashaVideos = getVideosByParasha(currentParasha.slug.en);

  return (
    <PageShell
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <JsonLd data={buildWebsiteJsonLd(locale)} />
      <section aria-labelledby="categories-heading" className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-950" id="categories-heading">
          {locale === 'he' ? 'קטגוריות קריאה' : 'Reading Categories'}
        </h2>
        <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            description={category.description?.[locale] ?? ''}
            href={`/category/${category.slug[locale]}`}
            key={category.id}
            title={category.title[locale]}
          />
        ))}
        </div>
      </section>

      <section
        aria-labelledby="current-parasha-heading"
        className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <p className="text-sm font-bold text-amber-800">
          {locale === 'he' ? 'פרשת השבוע' : 'Weekly Parasha'}
        </p>
        <h2
          className="mt-2 text-3xl font-bold text-slate-950"
          id="current-parasha-heading"
        >
          {getParashaDisplayName(currentParasha, locale)}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
          {currentParasha.book[locale]} · {currentParasha.torahReference}
        </p>
        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:gap-6">
          <span>
            {locale === 'he' ? 'הקודמת: ' : 'Previous: '}
            {getParashaDisplayName(previousParasha, locale)}
          </span>
          <span>
            {locale === 'he' ? 'הבאה: ' : 'Next: '}
            {getParashaDisplayName(nextParasha, locale)}
          </span>
        </div>
        <Link
          className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-900"
          href={`/parasha/${currentParasha.slug[locale]}`}
        >
          {locale === 'he' ? 'לעמוד הפרשה המלא' : 'Open full parasha page'}
        </Link>

        <div className="mt-6">
          <VideoGrid
            emptyMessage={
              locale === 'he'
                ? 'עדיין אין סרטונים משויכים לפרשה הנוכחית.'
                : 'No imported videos are mapped to the current parasha yet.'
            }
            locale={locale}
            videos={currentParashaVideos}
          />
        </div>
      </section>

      <section aria-labelledby="latest-videos-heading" className="space-y-4">
        <h2
          className="text-2xl font-bold text-slate-950"
          id="latest-videos-heading"
        >
          {locale === 'he' ? 'סרטונים אחרונים' : 'Latest Videos'}
        </h2>
        <VideoGrid
          emptyMessage={
            locale === 'he'
              ? 'עדיין אין מטא-דאטה מיובא מיוטיוב.'
              : 'No imported YouTube metadata yet.'
          }
          locale={locale}
          videos={latestVideos}
        />
      </section>
    </PageShell>
  );
}
