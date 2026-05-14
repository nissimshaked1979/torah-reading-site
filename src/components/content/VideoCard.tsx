import type {Locale} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';
import {
  getBestThumbnail,
  getVideoCardDescription
} from '@/lib/youtube/repository';
import type {YouTubeVideo} from '@/lib/youtube/types';

type VideoCardProps = {
  description?: string;
  href?: string;
  locale?: Locale;
  thumbnailUrl?: string;
  title?: string;
  video?: YouTubeVideo;
};

export function VideoCard({
  title,
  description,
  href,
  locale = 'he',
  thumbnailUrl,
  video
}: VideoCardProps) {
  const resolvedTitle = video ? video.title[locale] : title;
  const resolvedDescription = video ? getVideoCardDescription(video) : description;
  const resolvedThumbnail = video ? getBestThumbnail(video) : thumbnailUrl;
  const resolvedHref = video ? `/video/${video.videoId}` : href;

  const content = (
    <article className="group h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
      <div className="relative flex aspect-video items-center justify-center bg-slate-100">
        {resolvedThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            src={resolvedThumbnail}
          />
        ) : (
          <span className="px-4 text-center text-sm font-medium text-slate-500">
            {locale === 'he' ? 'תמונת וידאו תופיע כאן' : 'Video thumbnail'}
          </span>
        )}
        <span className="absolute bottom-3 inline-flex rounded-full bg-slate-950/90 px-3 py-1 text-xs font-bold text-white ltr:right-3 rtl:left-3">
          YouTube
        </span>
      </div>
      <div className="space-y-3 p-5">
        <h2 className="text-lg font-bold leading-snug text-slate-950 group-hover:text-amber-950">
          {resolvedTitle}
        </h2>
        {resolvedDescription ? (
          <p className="line-clamp-3 text-sm leading-6 text-slate-600 sm:text-base">
            {resolvedDescription}
          </p>
        ) : null}
      </div>
    </article>
  );

  if (!resolvedHref) {
    return content;
  }

  return (
    <Link href={resolvedHref} locale={locale}>
      {content}
    </Link>
  );
}
