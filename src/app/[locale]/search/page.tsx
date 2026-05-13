import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {PageShell} from '@/components/layout/PageShell';
import {SearchBar} from '@/components/navigation/SearchBar';
import type {Locale} from '@/i18n/routing';
import {buildLocalizedMetadata} from '@/lib/seo/metadata';

type SearchPageProps = {
  params: Promise<{locale: Locale}>;
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

export default async function SearchPage({params}: SearchPageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  const page = await getTranslations({locale, namespace: 'SearchPage'});
  const nav = await getTranslations({locale, namespace: 'Navigation'});
  const components = await getTranslations({locale, namespace: 'Components'});

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
      />
    </PageShell>
  );
}
