import {getLocale} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';

export default async function LocalizedNotFound() {
  const locale = (await getLocale()) as Locale;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-bold uppercase text-amber-800">
        {locale === 'he' ? 'לא נמצא' : 'Not Found'}
      </p>
      <h1 className="text-3xl font-bold text-slate-950">
        {locale === 'he' ? 'העמוד לא נמצא' : 'Page Not Found'}
      </h1>
      <p className="text-lg leading-8 text-slate-700">
        {locale === 'he'
          ? 'ייתכן שהקישור השתנה או שהסרטון אינו זמין באתר.'
          : 'The link may have changed, or the video is not available on the site.'}
      </p>
      <Link
        className="mx-auto mt-3 inline-flex rounded-md bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-900"
        href="/"
      >
        {locale === 'he' ? 'חזרה לדף הבית' : 'Back Home'}
      </Link>
    </section>
  );
}
