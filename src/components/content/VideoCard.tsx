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
    <article className="group h-full overflow-hidden rounded-xl border border-[#d8ad55]/25 bg-white shadow-[0_12px_30px_rgba(28,37,65,0.08)] transition hover:-translate-y-1 hover:border-[#d8ad55] hover:shadow-[0_20px_46px_rgba(28,37,65,0.16)]">
      <div className="relative flex aspect-video items-center justify-center bg-[#e8dcc6]">
        {resolvedThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            src={resolvedThumbnail}
          />
        ) : (
          <span className="px-4 text-center text-sm font-medium text-slate-500">
            {locale === 'he' ? 'תמונת וידאו תופיע כאן' : 'Video thumbnail'}
          </span>
        )}
        <span className="absolute bottom-3 inline-flex rounded-full bg-[#071735]/90 px-3 py-1 text-xs font-bold text-[#f1c66d] ltr:right-3 rtl:left-3">
          YouTube
        </span>
      </div>
      <div className="space-y-3 p-5">
        <h2 className="text-lg font-bold leading-snug text-[#071735] group-hover:text-[#8f3f2d]">
          {resolvedTitle}
        </h2>
        {resolvedDescription ? (
          <p className="line-clamp-3 text-sm leading-6 text-[#4b5875] sm:text-base">
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
