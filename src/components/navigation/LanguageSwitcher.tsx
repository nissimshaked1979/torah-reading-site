'use client';

import {useLocale} from 'next-intl';

import type {Locale} from '@/i18n/routing';
import {Link, usePathname} from '@/i18n/navigation';
import {categories} from '../../../data/content';
import {routableParashot} from '../../../data/parashot';
import {decodeRouteSegment} from '@/lib/routing/segments';

type LanguageSwitcherProps = {
  label: string;
};

const localeOptions: Array<{locale: Locale; label: string}> = [
  {locale: 'he', label: 'עברית'},
  {locale: 'en', label: 'English'}
];

export function LanguageSwitcher({label}: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {localeOptions.map((option) => {
        const isActive = option.locale === currentLocale;

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive
                ? 'rounded-md bg-[#f1c66d] px-3 py-2 font-bold text-[#071735]'
                : 'rounded-md px-3 py-2 font-semibold text-[#d8e0f4] transition hover:bg-white/10 hover:text-[#f1c66d]'
            }
            href={getLocalizedPathname(pathname, option.locale)}
            key={option.locale}
            locale={option.locale}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}

function getLocalizedPathname(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  const [section, slug] = segments;

  if (section === 'category' && slug) {
    const decodedSlug = decodeRouteSegment(slug);
    const category = categories.find(
      (item) =>
        item.id === decodedSlug ||
        item.slug.he === decodedSlug ||
        item.slug.en === decodedSlug
    );

    return category ? `/category/${category.slug[locale]}` : pathname;
  }

  if (section === 'parasha' && slug) {
    const decodedSlug = decodeRouteSegment(slug);
    const parasha = routableParashot.find(
      (item) =>
        item.id === decodedSlug ||
        item.slug.he === decodedSlug ||
        item.slug.en === decodedSlug
    );

    return parasha ? `/parasha/${parasha.slug[locale]}` : pathname;
  }

  return pathname;
}
