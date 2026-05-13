import type {Locale} from '@/i18n/routing';
import type {YouTubeVideo} from '@/lib/youtube/types';

import {VideoCard} from './VideoCard';

type VideoGridProps = {
  emptyMessage: string;
  locale: Locale;
  videos: YouTubeVideo[];
};

export function VideoGrid({emptyMessage, locale, videos}: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div
        aria-live="polite"
        className="rounded-lg border border-dashed border-amber-300 bg-white/85 p-6 text-center shadow-sm sm:p-8"
        role="status"
      >
        <p className="text-base font-semibold text-slate-800">
          {locale === 'he' ? 'לא נמצאו סרטונים' : 'No videos found'}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.videoId} locale={locale} video={video} />
      ))}
    </div>
  );
}
