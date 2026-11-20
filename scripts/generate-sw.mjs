// Injects the build version into dist/sw.js.
//
// Runs as `npm run postbuild` (npm runs postbuild automatically after
// `npm run build`). It reads the content hash embedded in the built
// JavaScript filename (e.g. index-CYTI70q5.js -> CYTI70q5) and replaces
// the __BUILD_VERSION__ placeholder in dist/sw.js with it, so the service
// worker's cache name changes with every build. Returning visitors then
// get the new worker, whose activate handler deletes the previous cache.
//
// Fails loudly if the built assets or the placeholder are missing, so a
// broken service worker can never be deployed silently.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const distDir = new URL('../dist/', import.meta.url).pathname
const swPath = join(distDir, 'sw.js')
const assetsDir = join(distDir, 'assets')

const bundles = readdirSync(assetsDir).filter((file) =>
  /^index-[A-Za-z0-9_-]+\.js$/.test(file),
)
if (bundles.length !== 1) {
  throw new Error(
    `generate-sw: expected exactly one index-*.js in dist/assets, found ${bundles.length}`,
  )
}
const version = bundles[0].match(/^index-([A-Za-z0-9_-]+)\.js$/)[1]

let sw = readFileSync(swPath, 'utf8')
if (!sw.includes('__BUILD_VERSION__')) {
  throw new Error(
    'generate-sw: placeholder __BUILD_VERSION__ not found in dist/sw.js',
  )
}
sw = sw.replaceAll('__BUILD_VERSION__', version)
writeFileSync(swPath, sw)
console.log(`generate-sw: service worker cache version ${version}`)
