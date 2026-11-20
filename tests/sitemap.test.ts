import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { calculators } from '../src/data/calculators'

describe('sitemap (Phase 4 SEO)', () => {
  it('generator produces 35 canonical, indexable URLs: home + 29 calculators + 5 info pages', () => {
    execSync('node scripts/generate-sitemap.mjs', { cwd: join(__dirname, '..'), stdio: 'pipe' })
    const xml = readFileSync(join(__dirname, '..', 'public/sitemap.xml'), 'utf8')
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    // No lastmod: reliable per-page modification dates are unavailable,
    // and stamping every URL with the build date would misstate changes.
    expect(xml).not.toContain('<lastmod>')
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    expect(locs).toHaveLength(35)
    expect(new Set(locs).size).toBe(35) // no duplicates
    expect(locs[0]).toBe('https://exocalchub.com/')
    for (const loc of locs) {
      expect(loc.startsWith('https://exocalchub.com/')).toBe(true)
      expect(loc).not.toContain('?') // no query strings
      expect(loc).not.toContain('/404')
    }
    // Every calculator in the app data is in the sitemap.
    for (const calculator of calculators) {
      expect(locs).toContain(`https://exocalchub.com${calculator.path}`)
    }
    expect(calculators).toHaveLength(29)
    for (const page of ['about', 'privacy', 'terms', 'contact', 'disclaimer']) {
      expect(locs).toContain(`https://exocalchub.com/${page}`)
    }
  })
})
