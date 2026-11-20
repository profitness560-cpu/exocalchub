import { SITE_URL } from '../hooks/usePageMeta'

/**
 * Structured data (JSON-LD) builders.
 *
 * BreadcrumbList mirrors the visible breadcrumb exactly: Home, then the
 * current page. The visible breadcrumb has no category level, so neither
 * does the structured data — the two must agree.
 */
export function breadcrumbList(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).href,
    })),
  }
}

/** FAQPage — only use with questions that are actually shown on the page. */
export function faqPage(items: readonly (readonly [string, string])[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}
