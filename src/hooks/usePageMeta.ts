import { useEffect } from 'react'

const SITE_NAME = 'ExoCalcHub'
const DEFAULT_TITLE = `${SITE_NAME} — Free Online Calculators`
const DEFAULT_DESCRIPTION =
  'Free online calculators for finance, health, math, and everyday use.'

interface PageMetaOptions {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
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
  link.href = new URL(path, window.location.origin).href
  return link
}

export function usePageMeta({
  title,
  description,
  path = '/',
  type = 'website',
}: PageMetaOptions) {
  useEffect(() => {
    document.title = title
    const meta = setMeta('name', 'description', description)
    const ogTitle = setMeta('property', 'og:title', title)
    const ogDescription = setMeta('property', 'og:description', description)
    const ogType = setMeta('property', 'og:type', type)
    const ogUrl = setMeta(
      'property',
      'og:url',
      new URL(path, window.location.origin).href,
    )
    const twitterCard = setMeta('name', 'twitter:card', 'summary')
    const canonical = setCanonical(path)

    return () => {
      document.title = DEFAULT_TITLE
      meta.content = DEFAULT_DESCRIPTION
      ogTitle.content = DEFAULT_TITLE
      ogDescription.content = DEFAULT_DESCRIPTION
      ogType.content = 'website'
      ogUrl.content = new URL('/', window.location.origin).href
      twitterCard.content = 'summary'
      canonical.href = new URL('/', window.location.origin).href
    }
  }, [title, description, path, type])
}

export { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME }
