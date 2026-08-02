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
