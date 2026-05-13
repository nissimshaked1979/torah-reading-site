# Launch Checklist

## Local QA

- Run `npm install`.
- Run `npm run validate:content`.
- Run `npm run lint`.
- Run `npm run build`.
- Run `npm run dev`.
- Check:
  - `/he`
  - `/en`
  - `/he/search`
  - `/en/search`
  - `/he/category/פרשת-השבוע`
  - `/en/category/parashat-hashavua`
  - `/he/parasha/במדבר`
  - `/en/parasha/bamidbar`
  - `/sitemap.xml`
  - `/robots.txt`
- Confirm Hebrew pages use `dir="rtl"` and English pages use `dir="ltr"`.
- Test language switching from Hebrew to English and back.
- Test search form submission.
- Check category filtering and current parasha section.
- If `data/youtube-videos.json` has videos, test a `/watch/{videoId}` page,
  YouTube iframe loading, fallback YouTube link, and related videos.
- Review mobile and desktop widths for readable Hebrew text and no overlap.
- Confirm there are no obvious broken internal links.

## Vercel QA

- Import the GitHub repository into Vercel.
- Confirm settings:
  - Framework: Next.js
  - Install command: `npm install`
  - Build command: `npm run build`
  - Output directory: `.next`
- Add environment variables:
  - `YOUTUBE_API_KEY`
  - `NEXT_PUBLIC_SITE_URL`
- Deploy and confirm the production build succeeds.

## Post-Deploy Checks

- Open the production `/he` and `/en` pages.
- Confirm `/sitemap.xml` and `/robots.txt` resolve.
- Check canonical and hreflang tags in page source.
- Submit the sitemap in Google Search Console when ready.
- Test at least one mobile viewport and one desktop viewport.
- If videos are imported, open a video page and verify the YouTube embed.

## Remaining Launch Notes

- `data/youtube-videos.json` is currently empty. Run `npm run import:youtube`
  with `YOUTUBE_API_KEY` before launch if video pages and embeds should be live.
- Video page QA depends on imported metadata; verify `/he/watch/{videoId}` and
  `/en/watch/{videoId}` after the first import.

## Updating YouTube Metadata

```bash
npm run import:youtube
npm run validate:content
npm run build
```

Commit `data/youtube-videos.json` and any edits to
`data/manual-overrides.json`, then push to GitHub. Vercel redeploys on push.
