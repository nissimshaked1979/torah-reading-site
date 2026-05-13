# Monitoring

## Analytics

This project uses Vercel Analytics via `@vercel/analytics`.

Tracked automatically:

- Page views

Tracked as lightweight custom events:

- `search_page_visit`
- `video_page_visit`
- `category_page_visit`
- `parasha_page_visit`

Vercel Analytics is privacy-friendly and does not require adding a tracking ID
or committing secrets.

Setup:

1. Deploy the site on Vercel.
2. Open the Vercel project.
3. Go to **Analytics**.
4. Enable Web Analytics for the project.

If Google Analytics is added later, put its public measurement ID in an
environment variable such as `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Do not commit
private analytics credentials.

## Production Logs

In Vercel:

1. Open the project dashboard.
2. Go to **Deployments**.
3. Select the latest deployment.
4. Open **Runtime Logs** or **Build Logs**.

Use logs to check:

- Build failures
- Route errors
- API/import script failures
- Unexpected 404s

## Broken Routes

Check these after deployment:

- `/he`
- `/en`
- `/he/search`
- `/en/search`
- `/sitemap.xml`
- `/robots.txt`
- Category pages from homepage cards
- Current parasha page
- Video pages after YouTube metadata is imported

If a route fails, check:

- Vercel Runtime Logs
- Whether `NEXT_PUBLIC_SITE_URL` is correct
- Whether route slugs exist in data files
- Whether hidden/manual overrides removed expected videos

## Failed YouTube Embeds

If a video page loads but the iframe fails:

- Open the fallback YouTube link.
- Confirm the video is public.
- Confirm embedding is allowed for the video.
- Confirm `embedUrl` uses `https://www.youtube.com/embed/{videoId}`.
- Re-run `npm run import:youtube` and `npm run validate:content`.

## Weekly Maintenance

- Check Vercel Analytics for top pages and searches.
- Review Vercel Runtime Logs for errors.
- Run `npm run update:youtube` if new videos were uploaded.
- Review `data/manual-overrides.json` for title/parasha corrections.
- Run `npm run validate:content`.
- Run `npm run build`.
- Commit and push updated metadata or overrides.
