# ExoCalcHub

ExoCalcHub is a fast, accessible collection of free online calculators. The current release includes a searchable calculator directory, category browsing, and a BMI calculator with instant results.

## Tech stack

- React 19 with TypeScript
- Vite for development and production builds
- React Router for page navigation
- Plain CSS with shared design variables

## Project structure

- `src/components` contains reusable UI components.
- `src/pages` contains route-level screens.
- `src/calculators` contains calculator-specific logic and types.
- `src/data` contains calculator and category definitions.
- `src/hooks` contains reusable React hooks, including search and page metadata.
- `public` contains static assets such as the favicon.

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The production build can be created with:

```bash
npm run build
```

Run the linter with `npm run lint`.

The app includes route-level metadata, canonical URLs, Open Graph tags, JSON-LD structured data, `public/robots.txt`, and `public/sitemap.xml`. Informational routes cover About, Privacy, Terms, Contact, and Disclaimer.

## Available routes

- `/` — calculator directory and category overview
- `/calculators/bmi` — BMI calculator

## SEO

- `public/sitemap.xml` is generated from the calculator data by
  `scripts/generate-sitemap.mjs` (`npm run sitemap`). It runs automatically
  before every build (`prebuild`) and fails the build if it finds anything
  other than 29 calculators, so the sitemap can never silently go stale.
  It lists the home page, all 29 calculator pages and the 5 information
  pages — only valid, canonical, indexable URLs.
- `public/robots.txt` allows all crawling and points to the sitemap.
- Every page sets a unique title, meta description, canonical URL
  (always `https://exocalchub.com`, never the serving origin) and Open Graph
  tags via `src/hooks/usePageMeta.ts`. Calculator and information pages
  also emit BreadcrumbList JSON-LD, and pages with visible FAQs emit
  FAQPage JSON-LD. The 404 page is `noindex`.
- The shared Open Graph image is `public/og-image.png` (1200×630).

## Analytics (Google Analytics 4)

GA4 is integrated but **inactive until a Measurement ID is configured** —
without one, no analytics script is loaded and nothing is sent.

1. In Google Analytics, create a GA4 property for exocalchub.com and copy
   its Measurement ID (`G-XXXXXXXXXX`).
2. Locally: copy `.env.example` to `.env.local` and set
   `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`, then restart `npm run dev`.
3. For the live site: set the same variable in Netlify under
   Site settings → Environment variables, then redeploy.

What is tracked: one `page_view` per route change (React Router navigation
is counted exactly once — gtag is configured with `send_page_view: false`
and the app sends page views manually), plus `calculator_use`, `favorite`, `share` and `error` events carrying
only the calculator id, and `search` events that record only that a search
occurred (never the search text). **Calculator input values, results and
search text are never sent** — the app's analytics payloads contain no
value fields at all, and the search event is forwarded to GA4 without
its query.

Verify in GA4 under Reports → Realtime after the Measurement ID is set:
visit the site and confirm page views and a `calculator_use` event appear.
