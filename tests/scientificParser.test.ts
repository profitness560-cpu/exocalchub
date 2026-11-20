import { describe, expect, it } from 'vitest'
import { calculateScientific, evaluateScientific, formatResult } from '../src/lib/scientificParser'

/**
 * Phase 2 regression tests for the integrated Scientific Calculator.
 * Ported from the repair package's test suite (test/scientificParser.test.js,
 * 11 groups, all passing) into the real app's Vitest suite, calling the
 * TypeScript parser directly. The mandatory regression cases from the
 * 2026-11-20 repair assignment are all covered here.
 */
describe('scientific parser — mandatory regression cases', () => {
  it('basic arithmetic, precedence and parentheses (unchanged behaviour)', () => {
    expect(evaluateScientific('2+3*4')).toBe(14)
    expect(evaluateScientific('(2+3)*4')).toBe(20)
    expect(evaluateScientific('10/4')).toBe(2.5)
    expect(evaluateScientific('1.5+2.25')).toBe(3.75)
    expect(evaluateScientific('0.1+0.2')).toBe(0.3)
    expect(evaluateScientific('1/3')).toBeCloseTo(0.33333333, 8)
  })

  it('powers: ^ and **, right-associative', () => {
    expect(evaluateScientific('2^3')).toBe(8)
    expect(evaluateScientific('2**3')).toBe(8)
    expect(evaluateScientific('3^2')).toBe(9)
    expect(evaluateScientific('2^3^2')).toBe(512)
  })

  it('square roots', () => {
    expect(evaluateScientific('sqrt(16)')).toBe(4)
    expect(evaluateScientific('sqrt(2)')).toBeCloseTo(1.41421356, 8)
  })

  it('trigonometry in degrees (default) and radians', () => {
    expect(evaluateScientific('sin(0)')).toBe(0)
    expect(evaluateScientific('sin(30)')).toBe(0.5)
    expect(evaluateScientific('cos(0)')).toBe(1)
    expect(evaluateScientific('cos(60)')).toBe(0.5)
    expect(evaluateScientific('tan(45)')).toBe(1)
    expect(evaluateScientific('sin(pi/6)', { angleMode: 'rad' })).toBe(0.5)
    expect(evaluateScientific('cos(0)', { angleMode: 'rad' })).toBe(1)
  })

  it('logarithms, absolute value, factorial', () => {
    expect(evaluateScientific('log(100)')).toBe(2)
    expect(evaluateScientific('ln(e)')).toBe(1)
    expect(evaluateScientific('abs(-5)')).toBe(5)
    expect(evaluateScientific('5!')).toBe(120)
  })

  it('invalid inputs are rejected with specific errors, not "Invalid expression" for everything', () => {
    expect(() => evaluateScientific('2++3')).toThrow(/Missing operand/)
    expect(() => evaluateScientific('sqrt(-1)')).toThrow(/not defined for negative/)
    expect(() => evaluateScientific('log(0)')).toThrow(/not defined for zero/)
    expect(() => evaluateScientific('1/0')).toThrow(/Division by zero/)
    expect(() => evaluateScientific('abc')).toThrow(/Unknown function or constant/)
    expect(() => evaluateScientific('(2+3')).toThrow(/Unmatched/)
    expect(() => evaluateScientific('')).toThrow(/Enter an expression/)
    expect(() => evaluateScientific('2 + @')).toThrow(/Invalid character/)
  })
})

describe('scientific calculator — site result shape', () => {
  it('returns the site headline/details/steps shape and never throws', () => {
    expect(calculateScientific({ expression: 'sqrt(16)' }).headline).toBe('4')
    expect(calculateScientific({ expression: 'sin(30)' }).headline).toBe('0.5')
    expect(calculateScientific({ expression: '2^3' }).headline).toBe('8')
    const invalid = calculateScientific({ expression: 'sqrt(-1)' })
    expect(invalid.headline).toBe('Invalid expression')
    expect(invalid.details[0]).toMatch(/negative/)
    expect(calculateScientific({ expression: '1/0' }).headline).toBe('Invalid result')
    expect(calculateScientific({ expression: '' }).headline).toBe('Enter an expression')
  })

  it('formats results to 8 decimal places, trimming trailing zeros', () => {
    expect(formatResult(0.333333333333)).toBe('0.33333333')
    expect(formatResult(8)).toBe('8')
    expect(formatResult(1.41421356237)).toBe('1.41421356')
  })
})
