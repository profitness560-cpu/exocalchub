import { useEffect } from 'react'

const SITE_NAME = 'ExoCalcHub'
/** The production origin. Canonical URLs and og:url must always point here,
 *  never at whatever origin served the page (localhost, a preview, staging). */
const SITE_URL = 'https://exocalchub.com'
const DEFAULT_TITLE = `${SITE_NAME} — Free Online Calculators`
const DEFAULT_DESCRIPTION =
  'Free online calculators for finance, health, math, and everyday use.'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export interface BreadcrumbItem {
  name: string
  path: string
}

interface PageMetaOptions {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
  /** Set on pages that must not be indexed (e.g. the 404 page). */
  noindex?: boolean
  /** Structured data (JSON-LD) objects, e.g. BreadcrumbList / FAQPage. */
  structuredData?: Record<string, unknown>[]
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  )
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
  return element
}

function setCanonical(path: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = new URL(path, SITE_URL).href
  return link
}

function setRobots(content: string) {
  let element = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', 'robots')
    document.head.appendChild(element)
  }
  element.content = content
  return element
}

export function usePageMeta({
  title,
  description,
  path = '/',
  type = 'website',
  noindex = false,
  structuredData = [],
}: PageMetaOptions) {
  // Stringify once so the effect only re-runs when the data actually
  // changes, not on every render (callers build these arrays inline).
  const structuredDataJson = JSON.stringify(structuredData)
  useEffect(() => {
    document.title = title
    const meta = setMeta('name', 'description', description)
    const ogTitle = setMeta('property', 'og:title', title)
    const ogDescription = setMeta('property', 'og:description', description)
    const ogType = setMeta('property', 'og:type', type)
    const ogUrl = setMeta('property', 'og:url', new URL(path, SITE_URL).href)
    const ogImage = setMeta('property', 'og:image', DEFAULT_IMAGE)
    const twitterCard = setMeta('name', 'twitter:card', 'summary_large_image')
    const twitterTitle = setMeta('name', 'twitter:title', title)
    const twitterDescription = setMeta('name', 'twitter:description', description)
    const twitterImage = setMeta('name', 'twitter:image', DEFAULT_IMAGE)
    const canonical = noindex ? null : setCanonical(path)
    const robots = noindex ? setRobots('noindex, nofollow') : null
    const jsonLdScripts = (
      JSON.parse(structuredDataJson) as Record<string, unknown>[]
    ).map((data) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'structured-data')
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
      return script
    })

    return () => {
      document.title = DEFAULT_TITLE
      meta.content = DEFAULT_DESCRIPTION
      ogTitle.content = DEFAULT_TITLE
      ogDescription.content = DEFAULT_DESCRIPTION
      ogType.content = 'website'
      ogUrl.content = `${SITE_URL}/`
      ogImage.content = DEFAULT_IMAGE
      twitterCard.content = 'summary_large_image'
      twitterTitle.content = DEFAULT_TITLE
      twitterDescription.content = DEFAULT_DESCRIPTION
      twitterImage.content = DEFAULT_IMAGE
      if (canonical) canonical.href = `${SITE_URL}/`
      if (robots) robots.remove()
      jsonLdScripts.forEach((script) => script.remove())
    }
  }, [title, description, path, type, noindex, structuredDataJson])
}

export { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, DEFAULT_TITLE, SITE_NAME, SITE_URL }
