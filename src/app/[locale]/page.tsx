import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {CategoryCard} from '@/components/content/CategoryCard';
import {VideoGrid} from '@/components/content/VideoGrid';
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
import {
  getLatestVideos,
  getVideosByCategory,
  getVideosByParasha
} from '@/lib/youtube/repository';

type HomePageProps = {
  params: Promise<{locale: Locale}>;
};

export const revalidate = 3600;

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
  const visibleCategories = categories.filter(
    (category) => category.id !== 'other' || getVideosByCategory(category.id).length > 0
  );

  return (
    <section className="flex w-full flex-col gap-10 sm:gap-12">
      <JsonLd data={buildWebsiteJsonLd(locale)} />

      <section className="torah-hero rounded-2xl p-6 text-white shadow-[0_24px_60px_rgba(7,23,53,0.2)] sm:p-8 lg:p-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f1c66d]">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#e8eefb] sm:text-xl">
              {t('description')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex justify-center rounded-md bg-[#f1c66d] px-5 py-3 text-sm font-bold text-[#071735] shadow-sm transition hover:bg-white"
                href="/category/all"
              >
                {locale === 'he' ? 'לכל התוכן' : 'Browse All Content'}
              </Link>
              <Link
                className="inline-flex justify-center rounded-md border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                href={`/parasha/${currentParasha.slug.en}`}
              >
                {locale === 'he' ? 'פרשת השבוע' : 'Weekly Parasha'}
              </Link>
            </div>
          </div>

          <aside className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-bold text-[#f1c66d]">
              {locale === 'he' ? 'השבוע' : 'This Week'}
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {getParashaDisplayName(currentParasha, locale)}
            </h2>
            <p className="mt-2 text-[#e8eefb]">{currentParasha.book[locale]}</p>
            <div className="mt-4 grid gap-2 text-sm text-[#d8e0f4]">
              <span>
                {locale === 'he' ? 'הקודמת: ' : 'Previous: '}
                {getParashaDisplayName(previousParasha, locale)}
              </span>
              <span>
                {locale === 'he' ? 'הבאה: ' : 'Next: '}
                {getParashaDisplayName(nextParasha, locale)}
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="space-y-4">
        <h2 className="text-2xl font-bold text-[#071735]" id="categories-heading">
          {locale === 'he' ? 'קטגוריות קריאה' : 'Reading Categories'}
        </h2>
        <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((category) => (
          <CategoryCard
            description={category.description?.[locale] ?? ''}
            href={`/category/${category.slug.en}`}
            icon={categoryIcon(category.id)}
            key={category.id}
            tone={categoryTone(category.id)}
            title={category.title[locale]}
          />
        ))}
        </div>
      </section>

      <section
        aria-labelledby="current-parasha-heading"
        className="rounded-2xl border border-[#d8ad55]/35 bg-white/90 p-5 shadow-[0_16px_40px_rgba(28,37,65,0.1)] sm:p-6"
      >
        <p className="text-sm font-bold text-[#9a5a1b]">
          {locale === 'he' ? 'פרשת השבוע' : 'Weekly Parasha'}
        </p>
        <h2
          className="mt-2 text-3xl font-bold text-[#071735]"
          id="current-parasha-heading"
        >
          {getParashaDisplayName(currentParasha, locale)}
        </h2>
        <p className="mt-3 text-base leading-7 text-[#34415f] sm:text-lg">
          {currentParasha.book[locale]}
        </p>
        <div className="mt-4 flex flex-col gap-2 text-sm text-[#4b5875] sm:flex-row sm:gap-6">
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
          className="mt-5 inline-flex rounded-md bg-[#071735] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#8f3f2d]"
          href={`/parasha/${currentParasha.slug.en}`}
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
          className="text-2xl font-bold text-[#071735]"
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
    </section>
  );
}

function categoryIcon(categoryId: string): string {
  const icons: Record<string, string> = {
    'parashat-hashavua': 'פ',
    tehillim: 'ת',
    tefilot: '✦',
    haftarot: 'ה',
    piyutim: '♪',
    taamim: 'ט',
    megillot: 'א',
    'special-readings': 'ק'
  };

  return icons[categoryId] ?? '✦';
}

function categoryTone(categoryId: string): string {
  const tones: Record<string, string> = {
    'parashat-hashavua': 'from-[#fff5d8] to-white',
    tehillim: 'from-[#eaf1ff] to-white',
    tefilot: 'from-[#f9e7dc] to-white',
    haftarot: 'from-[#ece7ff] to-white',
    piyutim: 'from-[#fff0f4] to-white',
    taamim: 'from-[#e8f7f1] to-white',
    megillot: 'from-[#fff3df] to-white',
    'special-readings': 'from-[#eef0ff] to-white'
  };

  return tones[categoryId] ?? 'from-[#fdf7e8] to-white';
}
