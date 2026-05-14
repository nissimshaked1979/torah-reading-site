import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {VideoGrid} from '@/components/content/VideoGrid';
import {PageShell} from '@/components/layout/PageShell';
import {YouTubeEmbed} from '@/components/video/YouTubeEmbed';
import type {Locale} from '@/i18n/routing';
import {categories} from '@/lib/content/repository';
import {JsonLd, buildBreadcrumbJsonLd, buildVideoJsonLd} from '@/lib/seo/jsonld';
import {buildLocalizedMetadata} from '@/lib/seo/metadata';
import {
  getAllVideos,
  getBestThumbnail,
  getRelatedVideos,
  getVideoByIdentifier
} from '@/lib/youtube/repository';

type VideoPageProps = {
  params: Promise<{
    locale: Locale;
    videoId: string;
  }>;
};

export function generateStaticParams() {
  return getAllVideos().flatMap((video) => {
    const identifiers = [
      video.videoId,
      video.slug?.he,
      video.slug?.en
    ].filter(Boolean) as string[];

    return identifiers.flatMap((videoId) => [
      {locale: 'he', videoId},
      {locale: 'en', videoId}
    ]);
  });
}

export async function generateMetadata({
  params
}: VideoPageProps): Promise<Metadata> {
  const {locale, videoId} = await params;
  const video = getVideoByIdentifier(videoId);

  if (!video) {
    return buildLocalizedMetadata({
      locale,
      path: `/video/${videoId}`,
      title: locale === 'he' ? 'סרטון לא נמצא' : 'Video Not Found',
      description:
        locale === 'he'
          ? 'הסרטון המבוקש לא נמצא.'
          : 'The requested video was not found.'
    });
  }

  return buildLocalizedMetadata({
    locale,
    path: `/video/${video.videoId}`,
    languagePaths: {
      he: `/video/${video.videoId}`,
      en: `/video/${video.videoId}`
    },
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

  const video = getVideoByIdentifier(videoId);

  if (!video) {
    notFound();
  }

  const relatedVideos = getRelatedVideos(video);
  const category = categories.find((item) => item.id === video.category);

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
          {name: video.title[locale], path: `/video/${video.videoId}`}
        ])}
      />
      <YouTubeEmbed title={video.title[locale]} video={video} />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">
          {locale === 'he' ? 'פרטי הסרטון' : 'Video Details'}
        </h2>
        <dl className="mt-4 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-bold text-slate-950">
              {locale === 'he' ? 'קטגוריה' : 'Category'}
            </dt>
            <dd>{category?.title[locale] ?? video.category}</dd>
          </div>
          {video.tags.length > 0 ? (
            <div>
              <dt className="font-bold text-slate-950">
                {locale === 'he' ? 'תגיות' : 'Tags'}
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span
                    className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-950"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
        <a
          className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-900"
          href={video.watchUrl}
          rel="noreferrer"
          target="_blank"
        >
          {locale === 'he' ? 'פתיחה ביוטיוב' : 'Open on YouTube'}
        </a>
      </section>

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
