import type {Metadata} from 'next';
import {Analytics} from '@vercel/analytics/react';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';

import {AnalyticsEvents} from '@/components/analytics/AnalyticsEvents';
import {DedicationBanner} from '@/components/layout/DedicationBanner';
import {Footer} from '@/components/layout/Footer';
import {Header} from '@/components/layout/Header';
import {routing, type Locale} from '@/i18n/routing';
import {getDirection} from '@/lib/i18n/direction';
import {siteUrl} from '@/lib/seo/metadata';

import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nissim Shaked Torah Readings',
    template: '%s | Nissim Shaked'
  },
  description:
    'Bilingual Hebrew and English Torah reading library with parasha, Tehillim, prayers, holidays, and Jewish reading content.'
};

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  return (
    <html lang={typedLocale} dir={getDirection(typedLocale)}>
      <body>
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col">
            <a className="skip-link" href="#main-content">
              {typedLocale === 'he' ? 'דלג לתוכן המרכזי' : 'Skip to content'}
            </a>
            <DedicationBanner />
            <Header locale={typedLocale} />
            <main
              className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
              id="main-content"
              tabIndex={-1}
            >
              {children}
            </main>
            <Footer locale={typedLocale} />
          </div>
          <Suspense fallback={null}>
            <AnalyticsEvents />
          </Suspense>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
