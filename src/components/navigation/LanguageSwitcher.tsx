'use client';

import {useLocale} from 'next-intl';

import type {Locale} from '@/i18n/routing';
import {Link, usePathname} from '@/i18n/navigation';

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
                ? 'rounded-md bg-amber-100 px-3 py-2 font-bold text-amber-950'
                : 'rounded-md px-3 py-2 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950'
            }
            href={pathname}
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
