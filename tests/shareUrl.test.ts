import { describe, expect, it } from 'vitest'
import { calculatorMap } from '../src/data/calculators'
import { buildShareUrl, parseSharedValues } from '../src/lib/shareUrl'

describe('share URLs (F5-09)', () => {
  const loan = calculatorMap.get('loan')!

  it('builds a URL carrying the inputs, never the result', () => {
    const url = buildShareUrl(loan, { principal: '10000', rate: '12', years: '1' })
    expect(url).toContain('/calculators/loan?')
    expect(url).toContain('principal=10000')
    expect(url).toContain('rate=12')
    expect(url).toContain('years=1')
    expect(url).not.toContain('result=')
    expect(url).not.toContain('888.49')
  })

  it('omits empty values and unknown fields from the URL', () => {
    const url = buildShareUrl(loan, { principal: '10000', rate: '', years: '1', nope: 'x' })
    expect(url).not.toContain('rate=')
    expect(url).not.toContain('nope=')
  })

  it('parses only known field names back out of a shared link', () => {
    const parsed = parseSharedValues(
      '?principal=10000&rate=12&years=1&result=FAKE&evil=<script>',
      loan,
    )
    expect(parsed).toEqual({ principal: '10000', rate: '12', years: '1' })
  })

  it('returns null when a link carries no usable inputs', () => {
    expect(parseSharedValues('?result=22.86', loan)).toBeNull()
    expect(parseSharedValues('', loan)).toBeNull()
    expect(parseSharedValues('?principal=', loan)).toBeNull()
  })

  it('round-trips: a built URL parses back to the same inputs', () => {
    const values = { principal: '10000', rate: '12', years: '1' }
    const url = buildShareUrl(loan, values)
    expect(parseSharedValues(new URL(url).search, loan)).toEqual(values)
  })
})
