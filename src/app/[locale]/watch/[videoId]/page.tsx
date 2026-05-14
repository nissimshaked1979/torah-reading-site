import {redirect} from 'next/navigation';

import type {Locale} from '@/i18n/routing';

type WatchRedirectPageProps = {
  params: Promise<{
    locale: Locale;
    videoId: string;
  }>;
};

export default async function WatchRedirectPage({params}: WatchRedirectPageProps) {
  const {locale, videoId} = await params;

  redirect(`/${locale}/video/${videoId}`);
}
