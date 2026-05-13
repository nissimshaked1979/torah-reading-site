import {getTranslations} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';

import {LanguageSwitcher} from '../navigation/LanguageSwitcher';
import {SearchBar} from '../navigation/SearchBar';

type HeaderProps = {
  locale: Locale;
};

export async function Header({locale}: HeaderProps) {
  const site = await getTranslations({locale, namespace: 'Site'});
  const nav = await getTranslations({locale, namespace: 'Navigation'});
  const components = await getTranslations({locale, namespace: 'Components'});

  return (
    <header className="border-b border-amber-200/70 bg-white/95 shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            aria-label={site('name')}
            className="group space-y-1 rounded-md"
            href="/"
          >
            <span className="block text-xl font-bold text-slate-950 transition group-hover:text-amber-900">
              {site('name')}
            </span>
            <span className="block max-w-xl text-sm leading-6 text-slate-600">
              {site('tagline')}
            </span>
          </Link>
          <LanguageSwitcher label={components('language')} />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <nav
            aria-label={locale === 'he' ? 'ניווט ראשי' : 'Primary navigation'}
            className="flex flex-wrap gap-2"
          >
            <Link className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-950" href="/">
              {nav('home')}
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-950"
              href="/category/parashat-hashavua"
            >
              {nav('parasha')}
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-950"
              href="/category/all"
            >
              {nav('categories')}
            </Link>
          </nav>
          <SearchBar
            locale={locale}
            label={nav('search')}
            placeholder={nav('searchPlaceholder')}
            buttonLabel={components('searchButton')}
            id="header-search"
          />
        </div>
      </div>
    </header>
  );
}
