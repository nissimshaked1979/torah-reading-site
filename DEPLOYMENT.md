# Deployment

## GitHub

1. Create a GitHub repository.
2. Push this project:

```bash
git add .
git commit -m "Initial Torah reading site"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

## Vercel

1. In Vercel, choose **Add New > Project**.
2. Import the GitHub repository.
3. Use these settings:
   - Framework: Next.js
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `.next`

## Environment Variables

Add these in Vercel project settings:

```txt
YOUTUBE_API_KEY
NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` should be the production domain, for example
`https://www.example.com`.

## Updating YouTube Metadata

Run locally after setting `YOUTUBE_API_KEY`:

```bash
npm run update:youtube
npm run validate:content
```

Commit the updated `data/youtube-videos.json` and push to GitHub. Vercel will
redeploy automatically on push, or you can trigger **Redeploy** from the Vercel
dashboard.

For the first full import, use `npm run import:youtube`. For ongoing refreshes,
prefer `npm run update:youtube`.
