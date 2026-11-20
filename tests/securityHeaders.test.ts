import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const toml = readFileSync(join(process.cwd(), 'netlify.toml'), 'utf8')
const sw = readFileSync(join(process.cwd(), 'public/sw.js'), 'utf8')

describe('security headers (F5-01, F5-04)', () => {
  it('sets a CSP without unsafe-inline or unsafe-eval', () => {
    const csp = toml.match(/Content-Security-Policy = "([^"]+)"/)?.[1] ?? ''
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("script-src 'self' https://www.googletagmanager.com")
    expect(csp).toContain("style-src 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain('https://www.google-analytics.com')
    expect(csp).not.toContain('unsafe-inline')
    expect(csp).not.toContain('unsafe-eval')
  })

  it('sets the other hardening headers on all paths', () => {
    expect(toml).toContain('X-Content-Type-Options = "nosniff"')
    expect(toml).toContain('X-Frame-Options = "DENY"')
    expect(toml).toContain('Referrer-Policy = "strict-origin-when-cross-origin"')
    expect(toml).toContain('Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"')
  })

  it('keeps the SPA redirect and applies immutable caching only to hashed assets', () => {
    expect(toml).toContain('to = "/index.html"')
    expect(toml).toContain('for = "/assets/*"')
    expect(toml).toContain('Cache-Control = "public, max-age=31536000, immutable"')
    // index.html must NOT get immutable caching: no Cache-Control header
    // is assigned before the /assets/* section (the word appears in a
    // comment explaining exactly that, so match the assignment form).
    const globalSection = toml.split('for = "/assets/*"')[0]
    expect(globalSection).not.toContain('Cache-Control = "')
  })
})

describe('service worker (F5-02, F5-07)', () => {
  it('versions the cache from the build, with a static fallback', () => {
    expect(sw).toContain('__BUILD_VERSION__')
    expect(sw).toContain("const FALLBACK_VERSION = 'v2'")
    expect(sw).toContain('exocalchub-${VERSION}')
  })

  it('serves navigation requests network-first', () => {
    expect(sw).toContain("request.mode === 'navigate'")
    // Network is attempted before any cache lookup for navigations.
    const navBlock = sw.slice(sw.indexOf("request.mode === 'navigate'"))
    expect(navBlock.indexOf('fetch(request)')).toBeLessThan(
      navBlock.indexOf('caches.match'),
    )
  })

  it('deletes obsolete caches on activation', () => {
    expect(sw).toContain('caches.delete')
    expect(sw).toContain('self.clients.claim()')
    expect(sw).toContain('self.skipWaiting()')
  })

  it('caches only successful same-origin GET responses', () => {
    expect(sw).toContain("request.method !== 'GET'")
    expect(sw).toContain('isSameOrigin(request.url)')
    expect(sw).toContain('response.ok')
    expect(sw).not.toContain('cache.put(event.request')
  })

  it('cache-first applies only to content-hashed assets', () => {
    expect(sw).toContain('isHashedAsset')
    expect(sw).toContain('assets')
    expect(sw).toContain('(js|css)')
  })
})
