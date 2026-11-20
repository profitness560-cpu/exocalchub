import { describe, expect, it } from 'vitest'
import { calculatorMap, type Calculator } from '../src/data/calculators'
import { buildShareUrl, parseSharedValues } from '../src/lib/shareUrl'
import { validateFieldValues } from '../src/lib/fieldValidation'

const bmr = calculatorMap.get('bmr')!
const vat = calculatorMap.get('vat')!
const length = calculatorMap.get('length')!

// A synthetic calculator whose select options are non-contiguous (0 and 2):
// the value 1 sits inside min/max but is not a permitted option.
const gapped = {
  id: 'gapped',
  fields: [
    {
      id: 'choice',
      label: 'Choice',
      type: 'select',
      options: [
        { value: 0, label: 'Zero' },
        { value: 2, label: 'Two' },
      ],
      // max covers the largest option, so only the membership check can
      // reject 1 — that is what this fixture isolates.
      min: 0,
      max: 2,
    },
  ],
} as unknown as Calculator

describe('shared-link select validation', () => {
  it('accepts a valid select option', () => {
    expect(validateFieldValues(bmr, { weight: '70', height: '175', age: '30', sex: '1' }).errors).toEqual({})
    expect(validateFieldValues(bmr, { weight: '70', height: '175', age: '30', sex: '1' }).numeric.sex).toBe(1)
    expect(validateFieldValues(bmr, { weight: '70', height: '175', age: '30', sex: '0' }).errors).toEqual({})
    expect(validateFieldValues(vat, { mode: '1', principal: '120', rate: '20' }).errors).toEqual({})
  })

  it('rejects a numeric value that is not a permitted option', () => {
    // 2 is numeric, but sex only permits 0 and 1.
    expect(validateFieldValues(bmr, { weight: '70', height: '175', age: '30', sex: '2' }).errors.sex).toBe('Select a valid option.')
    expect(validateFieldValues(vat, { mode: '2', principal: '100', rate: '20' }).errors.mode).toBe('Select a valid option.')
    expect(validateFieldValues(length, { value: '10', unit: '2' }).errors.unit).toBe('Select a valid option.')
  })

  it('rejects an unknown (non-numeric) option value', () => {
    expect(validateFieldValues(bmr, { weight: '70', height: '175', age: '30', sex: 'banana' }).errors.sex).toBe('Enter a valid number.')
    expect(validateFieldValues(vat, { mode: 'banana', principal: '100', rate: '20' }).errors.mode).toBe('Enter a valid number.')
  })

  it('rejects a value that is in range but not an option', () => {
    // 1 is inside min 0 / max 1, but the options are only 0 and 2.
    expect(validateFieldValues(gapped, { choice: '1' }).errors.choice).toBe('Select a valid option.')
    expect(validateFieldValues(gapped, { choice: '2' }).errors).toEqual({})
    expect(validateFieldValues(gapped, { choice: '0' }).errors).toEqual({})
    // The real fractional hole: unit=0.5 is in range 0–1 but is not an
    // option, and would previously have been treated as truthy (unit 1).
    expect(validateFieldValues(length, { value: '10', unit: '0.5' }).errors.unit).toBe('Select a valid option.')
  })

  it('round-trips a valid shared link that includes a select field', () => {
    const values = { weight: '70', height: '175', age: '30', sex: '1' }
    const url = buildShareUrl(bmr, values)
    const parsed = parseSharedValues(new URL(url).search, bmr)
    expect(parsed).toEqual(values)
    const { numeric, errors } = validateFieldValues(bmr, parsed!)
    expect(errors).toEqual({})
    expect(numeric).toEqual({ weight: 70, height: 175, age: 30, sex: 1 })
    // VAT remove-mode round trip.
    const vatValues = { mode: '1', principal: '120', rate: '20' }
    const vatUrl = buildShareUrl(vat, vatValues)
    const vatParsed = parseSharedValues(new URL(vatUrl).search, vat)
    expect(validateFieldValues(vat, vatParsed!).errors).toEqual({})
  })

  it('ignores malformed or unexpected URL parameters', () => {
    const loan = calculatorMap.get('loan')!
    // Unknown parameters are dropped; empty values are dropped.
    expect(parseSharedValues('?principal=10000&foo=bar&rate=12&years=1&principal=', loan)).toEqual({
      principal: '10000',
      rate: '12',
      years: '1',
    })
    // A script-looking value is parsed as a plain string, then rejected
    // by validation as a non-number — it can never become a result.
    const parsed = parseSharedValues('?principal=%3Cscript%3E&rate=12&years=1', loan)!
    expect(parsed.principal).toBe('<script>')
    expect(validateFieldValues(loan, parsed).errors.principal).toBe('Enter a valid number.')
    // No usable parameters at all.
    expect(parseSharedValues('???', loan)).toBeNull()
    expect(parseSharedValues('?foo=bar&result=999', loan)).toBeNull()
    // Incomplete parameters parse, but validation rejects them, so a
    // shared link missing a required field restores nothing.
    const partial = parseSharedValues('?principal=10000&rate=12', loan)!
    expect(validateFieldValues(loan, partial).errors.years).toBeDefined()
  })
})
