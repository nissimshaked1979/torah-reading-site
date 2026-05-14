import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {VideoGrid} from '@/components/content/VideoGrid';
import {PageShell} from '@/components/layout/PageShell';
import {SearchBar} from '@/components/navigation/SearchBar';
import type {Locale} from '@/i18n/routing';
import {buildLocalizedMetadata} from '@/lib/seo/metadata';
import {searchVisibleVideos} from '@/lib/youtube/repository';

type SearchPageProps = {
  params: Promise<{locale: Locale}>;
  searchParams?: Promise<{q?: string}>;
};

export async function generateMetadata({
  params
}: SearchPageProps): Promise<Metadata> {
  const {locale} = await params;

  return buildLocalizedMetadata({
    locale,
    path: '/search',
    title: locale === 'he' ? 'חיפוש קריאות תורה' : 'Search Torah Readings',
    description:
      locale === 'he'
        ? 'חיפוש פרשת השבוע, קריאת התורה, תהילים, שיר השירים ותפילות.'
        : 'Search Weekly Parasha, Torah reading, Tehillim, Shir Hashirim, and prayers.'
  });
}

export default async function SearchPage({params, searchParams}: SearchPageProps) {
  const {locale} = await params;
  const query = (await searchParams)?.q?.trim() ?? '';
  setRequestLocale(locale);

  const page = await getTranslations({locale, namespace: 'SearchPage'});
  const nav = await getTranslations({locale, namespace: 'Navigation'});
  const components = await getTranslations({locale, namespace: 'Components'});
  const videos = searchVisibleVideos(query, locale);

  return (
    <PageShell
      eyebrow={page('eyebrow')}
      title={page('title')}
      description={page('description')}
    >
      <SearchBar
        locale={locale}
        label={nav('search')}
        placeholder={nav('searchPlaceholder')}
        buttonLabel={components('searchButton')}
        id="page-search"
        defaultValue={query}
      />
      <section className="space-y-4" aria-labelledby="search-results-heading">
        <div className="flex flex-col gap-1">
          <h2
            className="text-2xl font-bold text-slate-950"
            id="search-results-heading"
          >
            {query
              ? locale === 'he'
                ? 'תוצאות חיפוש'
                : 'Search Results'
              : locale === 'he'
                ? 'סרטונים אחרונים'
                : 'Latest Videos'}
          </h2>
          <p className="text-sm font-semibold text-slate-600" aria-live="polite">
            {locale === 'he'
              ? `${videos.length} תוצאות`
              : `${videos.length} results`}
          </p>
          {!query ? (
            <p className="text-base leading-7 text-slate-700">
              {locale === 'he'
                ? 'הקלד שם פרשה, תהילים, תפילה, מגילה או נושא לחיפוש.'
                : 'Search by parasha, Tehillim, prayer, megillah, or topic.'}
            </p>
          ) : null}
        </div>
        <VideoGrid
          emptyMessage={
            locale === 'he'
              ? 'לא נמצאו סרטונים התואמים לחיפוש.'
              : 'No videos match this search.'
          }
          locale={locale}
          videos={videos}
        />
      </section>
    </PageShell>
  );
}
