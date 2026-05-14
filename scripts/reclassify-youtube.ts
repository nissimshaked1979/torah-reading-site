import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

import {
  classifyVideo,
  defaultTags,
  logClassificationCounts,
  readManualOverrides,
  type ImportedVideo
} from './import-youtube.ts';

const OUTPUT_PATH = path.join(process.cwd(), 'data', 'youtube-videos.json');

async function main() {
  const raw = await readFile(OUTPUT_PATH, 'utf8');
  const videos = JSON.parse(raw) as ImportedVideo[];
  const overrides = await readManualOverrides();
  const reclassified = videos.map((video) => {
    const automatic = classifyVideo(video.title.source, video.description);
    const override = overrides.videos?.[video.videoId];
    const category = override?.category ?? automatic.category;
    const parashaSlug =
      override && 'parashaSlug' in override
        ? (override.parashaSlug ?? null)
        : automatic.parashaSlug;

    return {
      ...video,
      category,
      parashaSlug,
      tags: override?.tags ?? defaultTags(category, parashaSlug),
      classification: {
        automaticCategory: automatic.category,
        matchedKeywords: automatic.matchedKeywords,
        manualOverrideApplied: Boolean(override)
      }
    };
  });

  await writeFile(OUTPUT_PATH, `${JSON.stringify(reclassified, null, 2)}\n`);

  console.log(`Reclassified videos: ${reclassified.length}`);
  logClassificationCounts(reclassified);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
