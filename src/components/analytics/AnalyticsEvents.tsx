'use client';

import {track} from '@vercel/analytics';
import {usePathname, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export function AnalyticsEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const routeType = getRouteType(pathname);

    if (!routeType) {
      return;
    }

    track(routeType, {
      locale: pathname.split('/')[1] || 'unknown',
      hasQuery: searchParams.has('q') ? 'true' : 'false'
    });
  }, [pathname, searchParams]);

  return null;
}

function getRouteType(pathname: string) {
  if (/^\/(he|en)\/search/.test(pathname)) {
    return 'search_page_visit';
  }

  if (/^\/(he|en)\/watch\//.test(pathname)) {
    return 'video_page_visit';
  }

  if (/^\/(he|en)\/category\//.test(pathname)) {
    return 'category_page_visit';
  }

  if (/^\/(he|en)\/parasha\//.test(pathname)) {
    return 'parasha_page_visit';
  }

  return null;
}
