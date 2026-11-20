import { describe, expect, it } from 'vitest'
import { breadcrumbList, faqPage } from '../src/lib/structuredData'

describe('structured data (Phase 4 SEO)', () => {
  it('breadcrumbList mirrors the visible breadcrumb: Home, then the page', () => {
    const data = breadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'BMI Calculator', path: '/calculators/bmi' },
    ])
    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('BreadcrumbList')
    const items = data.itemListElement as { position: number; name: string; item: string }[]
    expect(items).toHaveLength(2)
    expect(items[0]).toEqual({ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://exocalchub.com/' })
    expect(items[1]).toEqual({ '@type': 'ListItem', position: 2, name: 'BMI Calculator', item: 'https://exocalchub.com/calculators/bmi' })
  })

  it('faqPage lists each visible question with its answer', () => {
    const data = faqPage([
      ['Are the results exact?', 'Results are estimates.'],
      ['Degrees or radians?', 'Use the DEG / RAD selector.'],
    ])
    expect(data['@type']).toBe('FAQPage')
    const entities = data.mainEntity as { '@type': string; name: string; acceptedAnswer: { text: string } }[]
    expect(entities).toHaveLength(2)
    expect(entities[0].name).toBe('Are the results exact?')
    expect(entities[0].acceptedAnswer.text).toBe('Results are estimates.')
    expect(entities[1].acceptedAnswer.text).toBe('Use the DEG / RAD selector.')
  })
})
