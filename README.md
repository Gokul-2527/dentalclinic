# Dental clinic website (Next.js 15, GSAP, Lenis)

## Run
`npm install && cp .env.example .env.local && npm run dev` (type-check: `npm run lint`)

## Image sequence
Put frames in `public/images/sequence/dental-0001.webp … dental-00NN.webp` and set `frameCount`/`framePath` in the `story.sequence` manifest (`src/lib/api/mock.ts` or your API). Missing frames fall back to the nearest loaded frame; the poster shows if none load or reduced motion is on. Use ~60 frames at 1280px (≈30–60 KB each); ship a smaller manifest to mobile.

## Connecting the real admin API
Set `CONTENT_API_BASE_URL`. Expected endpoints:
- `GET /site-content` → `SiteContent` (see `src/types/content.ts`)
- `POST /appointments` (Bearer `APPOINTMENTS_API_KEY`) → 2xx on success
Replace mock values; mock content is placeholder only. Not yet tested against a real backend. Call `revalidateTag("site-content")` from a webhook for instant updates.

## Not yet built
Doctor pages, treatments index, contact/privacy/terms pages, gallery, technology pinned section, parallax. Lighthouse not yet run: test with `npm run build && npm start`.
