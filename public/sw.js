// ExoCalcHub service worker.
//
// Cache versioning: the __BUILD_VERSION__ placeholder is replaced at build
// time by scripts/generate-sw.mjs (npm run postbuild) with the content hash
// of the built JavaScript bundle, so the cache name changes with every
// build. If the placeholder is still present (e.g. `vite build` run
// directly), the static fallback version below is used instead, so the
// worker still works and old caches are still cleaned up.
//
// Strategy summary (see also findings F5-02 and F5-07, Phase 5 audit):
// - Navigation requests (the HTML app shell): network-first, so returning
//   visitors always receive the latest deployed version. Falls back to the
//   cache when offline, then to the cached home page.
// - Content-hashed JS/CSS assets: cache-first. The filename changes when
//   the content changes, so a cached copy can never be stale.
// - Other same-origin GETs (sitemap, manifest, icons): stale-while-revalidate.
// - Only successful (response.ok) same-origin GET responses are cached.
//   Non-GET requests, error responses and cross-origin responses (such as
//   the optional Google Analytics script) are never cached.
// - On activation, every cache whose name does not match the current one
//   is deleted, including the old 'exocalchub-v1' cache.

const FALLBACK_VERSION = 'v2'
const BUILD_VERSION = '__BUILD_VERSION__'
const VERSION = BUILD_VERSION.startsWith('__')
  ? FALLBACK_VERSION
  : BUILD_VERSION
const CACHE = `exocalchub-${VERSION}`
const PRECACHE = ['/', '/manifest.webmanifest', '/favicon.svg']

function isSameOrigin(url) {
  return new URL(url).origin === self.location.origin
}

function isHashedAsset(pathname) {
  return /^\/assets\/[^/]+-[A-Za-z0-9_-]+\.(js|css)$/.test(pathname)
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only GET requests are ever cached. Everything else goes to the network.
  if (request.method !== 'GET') return

  // Never cache cross-origin (third-party) responses, e.g. the optional
  // Google Analytics script.
  if (!isSameOrigin(request.url)) return

  const url = new URL(request.url)

  // Navigation requests: network-first so a new deployment reaches
  // returning visitors. Fall back to the cache, then the cached home page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match('/')),
        ),
    )
    return
  }

  // Content-hashed assets: cache-first is safe because the URL changes
  // whenever the content changes.
  if (isHashedAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone()
              caches.open(CACHE).then((cache) => cache.put(request, copy))
            }
            return response
          }),
      ),
    )
    return
  }

  // Other same-origin GETs: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})
