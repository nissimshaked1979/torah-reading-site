import type {YouTubeVideo} from '@/lib/youtube/types';

type YouTubeEmbedProps = {
  title: string;
  video: YouTubeVideo;
};

export function YouTubeEmbed({title, video}: YouTubeEmbedProps) {
  return (
    <figure className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
        <iframe
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={video.embedUrl}
          title={title}
        />
      </div>
      <figcaption>
        <a
        className="inline-flex rounded-md text-sm font-bold text-amber-900 underline underline-offset-4 hover:text-slate-950"
        href={video.watchUrl}
        rel="noreferrer"
        target="_blank"
      >
          Watch on YouTube
        </a>
      </figcaption>
    </figure>
  );
}
