import {getTranslations} from 'next-intl/server';

import type {Locale} from '@/i18n/routing';

type FooterProps = {
  locale: Locale;
};

export async function Footer({locale}: FooterProps) {
  const site = await getTranslations({locale, namespace: 'Site'});
  const footer = await getTranslations({locale, namespace: 'Footer'});

  return (
    <footer className="mt-8 border-t border-[#d8ad55]/30 bg-[#071735] text-[#d8e0f4]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10 text-sm leading-6 sm:px-6 lg:px-8">
        <span className="text-lg font-bold text-white">{site('name')}</span>
        <span className="max-w-2xl">{site('tagline')}</span>
        <span className="text-[#f1c66d]">{footer('copyright')}</span>
      </div>
    </footer>
  );
}
