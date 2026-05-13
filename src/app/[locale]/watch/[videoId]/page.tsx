import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {VideoGrid} from '@/components/content/VideoGrid';
import {PageShell} from '@/components/layout/PageShell';
import {YouTubeEmbed} from '@/components/video/YouTubeEmbed';
import type {Locale} from '@/i18n/routing';
import {JsonLd, buildBreadcrumbJsonLd, buildVideoJsonLd} from '@/lib/seo/jsonld';
import {buildLocalizedMetadata} from '@/lib/seo/metadata';
import {
  getAllVideos,
  getBestThumbnail,
  getRelatedVideos,
  getVideoById
} from '@/lib/youtube/repository';

type VideoPageProps = {
  params: Promise<{
    locale: Locale;
    videoId: string;
  }>;
};

export function generateStaticParams() {
  return getAllVideos().flatMap((video) => [
    {locale: 'he', videoId: video.videoId},
    {locale: 'en', videoId: video.videoId}
  ]);
}

export async function generateMetadata({
  params
}: VideoPageProps): Promise<Metadata> {
  const {locale, videoId} = await params;
  const video = getVideoById(videoId);

  if (!video) {
    return buildLocalizedMetadata({
      locale,
      path: `/watch/${videoId}`,
      title: locale === 'he' ? 'סרטון לא נמצא' : 'Video Not Found',
      description:
        locale === 'he'
          ? 'הסרטון המבוקש לא נמצא.'
          : 'The requested video was not found.'
    });
  }

  return buildLocalizedMetadata({
    locale,
    path: `/watch/${video.videoId}`,
    title:
      locale === 'he'
        ? `${video.title.he} | קריאת התורה`
        : `${video.title.en} | Torah Reading`,
    description:
      video.description ||
      (locale === 'he'
        ? 'סרטון קריאת תורה, פרשת השבוע, תהילים או תפילה.'
        : 'Torah reading, Weekly Parasha, Tehillim, or prayer video.'),
    image: getBestThumbnail(video)
  });
}

export default async function VideoPage({params}: VideoPageProps) {
  const {locale, videoId} = await params;
  setRequestLocale(locale);

  const video = getVideoById(videoId);

  if (!video) {
    notFound();
  }

  const relatedVideos = getRelatedVideos(video);

  return (
    <PageShell
      eyebrow={locale === 'he' ? 'סרטון' : 'Video'}
      title={video.title[locale]}
      description={
        video.description ||
        (locale === 'he'
          ? 'מטא-דאטה מיובא מיוטיוב.'
          : 'Imported YouTube metadata.')
      }
    >
      <JsonLd data={buildVideoJsonLd(video, locale)} />
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          {name: locale === 'he' ? 'בית' : 'Home', path: '/'},
          {name: video.title[locale], path: `/watch/${video.videoId}`}
        ])}
      />
      <YouTubeEmbed title={video.title[locale]} video={video} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-950">
          {locale === 'he' ? 'סרטונים קשורים' : 'Related Videos'}
        </h2>
        <VideoGrid
          emptyMessage={
            locale === 'he'
              ? 'אין סרטונים קשורים זמינים עדיין.'
              : 'No related videos are available yet.'
          }
          locale={locale}
          videos={relatedVideos}
        />
      </section>
    </PageShell>
  );
}
