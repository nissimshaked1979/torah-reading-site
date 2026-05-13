import {getTranslations} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';

type FooterProps = {
  locale: Locale;
};

export async function Footer({locale}: FooterProps) {
  const site = await getTranslations({locale, namespace: 'Site'});
  const footer = await getTranslations({locale, namespace: 'Footer'});

  return (
    <footer className="border-t border-amber-200/70 bg-white/95">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm leading-6 text-slate-600 sm:px-6 lg:px-8">
        <span className="font-bold text-slate-950">{site('name')}</span>
        <span>{site('tagline')}</span>
        <span className="text-slate-500">{footer('copyright')}</span>
      </div>
    </footer>
  );
}
