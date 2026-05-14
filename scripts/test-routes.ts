import {categories} from '../data/content.ts';
import {parashot} from '../data/parashot.ts';
import videosJson from '../data/youtube-videos.json' with {type: 'json'};
import manualOverridesJson from '../data/manual-overrides.json' with {type: 'json'};
import type {YouTubeVideo} from '../src/lib/youtube/types.ts';

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3000';
const PLACEHOLDER_PATTERNS = ['עמוד זמני', 'Temporary page'];
const videos = getVisibleVideosForRoutes();

type RouteCheck = {
  path: string;
  allowEmpty?: boolean;
};

function localized(path: string): RouteCheck[] {
  return [
    {path: `/he${path}`},
    {path: `/en${path}`}
  ];
}

async function main() {
  await assertServerReachable();

  const sampleVideo = videos[0];
  const routes: RouteCheck[] = [
    ...localized(''),
    ...localized('/search'),
    ...localized('/search?q=%D7%AA%D7%94%D7%99%D7%9C%D7%99%D7%9D'),
    ...localized('/category/all'),
    ...categories.flatMap((category) => [
      {path: `/he/category/${category.slug.en}`},
      {path: `/en/category/${category.slug.en}`}
    ]),
    ...parashot.slice(0, 3).flatMap((parasha) => [
      {path: `/he/parasha/${parasha.slug.en}`},
      {path: `/en/parasha/${parasha.slug.en}`}
    ])
  ];

  if (sampleVideo) {
    routes.push(
      {path: `/he/video/${sampleVideo.videoId}`},
      {path: `/en/video/${sampleVideo.videoId}`}
    );
  } else {
    console.warn('WARN: No visible videos found. Skipping video detail routes.');
  }

  let failures = 0;

  for (const route of routes) {
    const url = `${BASE_URL}${encodeURI(route.path)}`;
    try {
      const response = await fetch(url);
      const text = await response.text();
      const hasPlaceholder = PLACEHOLDER_PATTERNS.some((pattern) =>
        text.includes(pattern)
      );
      const hasUnexpectedEmpty =
        text.includes('לא נמצאו סרטונים') && !route.allowEmpty && videos.length > 0;
      const ok =
        response.ok &&
        text.trim().length > 200 &&
        !hasPlaceholder &&
        !hasUnexpectedEmpty;

      console.log(
        `${ok ? 'OK' : 'FAIL'} ${response.status} ${route.path} length=${text.length}`
      );

      if (!ok) {
        failures += 1;
      }
    } catch (error) {
      failures += 1;
      console.log(
        `FAIL 000 ${route.path} ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  if (failures > 0) {
    console.error(`Route test failures: ${failures}`);
    process.exitCode = 1;
  }
}

async function assertServerReachable() {
  try {
    await fetch(`${BASE_URL}/he`);
  } catch {
    throw new Error(
      `Could not reach ${BASE_URL}. Start the app first, for example: npm run dev`
    );
  }
}

function getVisibleVideosForRoutes(): YouTubeVideo[] {
  const overrides = manualOverridesJson as {
    videos?: Record<string, {hidden?: boolean}>;
  };
  const seen = new Set<string>();

  return (videosJson as YouTubeVideo[]).filter((video) => {
    const hidden = overrides.videos?.[video.videoId]?.hidden ?? video.hidden;

    if (hidden || seen.has(video.videoId)) {
      return false;
    }

    seen.add(video.videoId);
    return true;
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
