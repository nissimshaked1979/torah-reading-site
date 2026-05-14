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
    <header className="border-b border-[#d8ad55]/40 bg-[#071735] text-white shadow-[0_18px_45px_rgba(7,23,53,0.18)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            aria-label={site('name')}
            className="group space-y-1 rounded-md"
            href="/"
          >
            <span className="block text-2xl font-bold tracking-wide text-white transition group-hover:text-[#f1c66d]">
              {site('name')}
            </span>
            <span className="block max-w-xl text-sm leading-6 text-[#d8e0f4]">
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
            <Link className="rounded-md px-3 py-2 text-sm font-bold text-[#e8eefb] transition hover:bg-white/10 hover:text-[#f1c66d]" href="/">
              {nav('home')}
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-sm font-bold text-[#e8eefb] transition hover:bg-white/10 hover:text-[#f1c66d]"
              href="/category/parashat-hashavua"
            >
              {nav('parasha')}
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-sm font-bold text-[#e8eefb] transition hover:bg-white/10 hover:text-[#f1c66d]"
              href="/search"
            >
              {nav('search')}
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
