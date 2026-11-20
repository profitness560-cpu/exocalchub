/**
 * Generate public/sitemap.xml from the calculator data.
 *
 * Run automatically before every build (package.json "prebuild"), so the
 * sitemap can never drift out of sync with the calculators that exist.
 * Run directly with: npm run sitemap
 *
 * The sitemap lists only valid, canonical, indexable URLs:
 *  - the home page
 *  - all 29 calculator pages
 *  - the 5 information pages
 * It deliberately excludes the 404 page and any URL with a query string.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = 'https://exocalchub.com'
const INFO_PAGES = ['about', 'privacy', 'terms', 'contact', 'disclaimer']

const calculatorsSource = readFileSync(
  join(root, 'src/data/calculators.ts'),
  'utf8',
)
// Most calculators declare their path literally; the 8 converters are built
// by the conversion() helper, which derives the path from the id.
const calculatorPaths = [
  ...new Set([
    ...[...calculatorsSource.matchAll(/path:\s*'(\/calculators\/[\w-]+)'/g)].map(
      (match) => match[1],
    ),
    ...[...calculatorsSource.matchAll(/conversion\('([\w-]+)',/g)].map(
      (match) => `/calculators/${match[1]}`,
    ),
  ]),
].sort()

// Fail loudly instead of shipping a short sitemap if a calculator is missed.
if (calculatorPaths.length !== 29) {
  console.error(
    `Expected 29 calculator paths, found ${calculatorPaths.length}: ${calculatorPaths.join(', ')}`,
  )
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const entries = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  ...calculatorPaths.map((path) => ({
    loc: path,
    changefreq: 'weekly',
    priority: '0.8',
  })),
  ...INFO_PAGES.map((page) => ({
    loc: `/${page}`,
    changefreq: 'monthly',
    priority: '0.5',
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) =>
      `  <url><loc>${SITE_URL}${entry.loc}</loc><lastmod>${today}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(
  `Wrote public/sitemap.xml with ${entries.length} URLs (${calculatorPaths.length} calculators, ${INFO_PAGES.length} info pages, home).`,
)
