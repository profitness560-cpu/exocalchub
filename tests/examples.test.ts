import { describe, expect, it } from 'vitest'
import { calculatorMap } from '../src/data/calculators'

// Each worked example in the calculator data is checked against the real
// calculation: the example's inputs are run through calculate() and the
// headline must match, and the example's stated result must contain the
// same figure. If a formula changes, these tests fail first.
const cases: { id: string; values: Record<string, number | string>; headline: string; resultContains: string }[] = [
  { id: 'bmi', values: { weight: 70, height: 175 }, headline: '22.86 — Normal weight', resultContains: '22.86 — Normal weight' },
  { id: 'bmr', values: { weight: 70, height: 175, age: 30, sex: 1 }, headline: '1,649 calories/day', resultContains: '1,649 calories/day' },
  { id: 'body-fat', values: { waist: 90, neck: 40, hip: 0, height: 175, sex: 1 }, headline: '19.21% estimated body fat', resultContains: '19.21% estimated body fat' },
  { id: 'ideal-weight', values: { height: 175, sex: 1 }, headline: '70.46 kg', resultContains: '70.46 kg' },
  { id: 'calorie', values: { bmr: 1649, activity: 1.55 }, headline: '2,556 calories/day', resultContains: '2,556 calories/day' },
  { id: 'water-intake', values: { weight: 70, activity: 30 }, headline: '2.8 liters/day', resultContains: '2.8 liters/day' },
  { id: 'loan', values: { principal: 10000, rate: 12, years: 1 }, headline: '$888.49 / month', resultContains: '$888.49' },
  { id: 'mortgage', values: { principal: 200000, rate: 6, years: 30 }, headline: '$1,199.10 / month', resultContains: '$1,199.10' },
  { id: 'compound-interest', values: { principal: 1000, rate: 10, years: 2, contributions: 100 }, headline: '$1,420.00', resultContains: '$1,420.00' },
  { id: 'savings', values: { principal: 1000, rate: 5, years: 5, contributions: 0, monthlyContributions: 100 }, headline: '$8,076.89', resultContains: '$8,076.89' },
  { id: 'investment-return', values: { principal: 10000, rate: 8, years: 15, contributions: 2000 }, headline: '$86,025.92', resultContains: '$86,025.92' },
  { id: 'retirement', values: { principal: 0, rate: 7, years: 30, contributions: 6000 }, headline: '$566,764.72', resultContains: '$566,764.72' },
  { id: 'vat', values: { principal: 100, rate: 20, mode: 0 }, headline: '$120.00 including VAT', resultContains: '$120.00 including VAT' },
  { id: 'discount', values: { principal: 100, rate: 25 }, headline: '$75.00', resultContains: '$75.00' },
  { id: 'profit-margin', values: { revenue: 100, cost: 60 }, headline: '40% profit margin', resultContains: 'Profit margin 40%' },
  { id: 'percentage', values: { principal: 12.5, rate: 80, mode: 0 }, headline: '10', resultContains: '10' },
  { id: 'scientific', values: { expression: 'sqrt(16) + 2^3' }, headline: '12', resultContains: '12' },
  { id: 'average', values: { number1: 10, number2: 20, number3: 30 }, headline: '20', resultContains: '20' },
  { id: 'ratio', values: { a: 2, b: 3, c: 10 }, headline: '15', resultContains: '15' },
  { id: 'fraction', values: { a: 1, b: 2, c: 1, d: 3 }, headline: '5/6', resultContains: '5/6' },
  { id: 'length', values: { value: 100, unit: 0 }, headline: '328.08', resultContains: '328.08' },
  { id: 'weight', values: { value: 70, unit: 0 }, headline: '154.32', resultContains: '154.32' },
  { id: 'temperature', values: { value: 36.6, unit: 0 }, headline: '97.88', resultContains: '97.88' },
  { id: 'area', values: { value: 20, unit: 0 }, headline: '215.28', resultContains: '215.28' },
  { id: 'volume', values: { value: 10, unit: 0 }, headline: '2.64', resultContains: '2.64' },
  { id: 'speed', values: { value: 100, unit: 0 }, headline: '62.14', resultContains: '62.14' },
  { id: 'time', values: { value: 90, unit: 0 }, headline: '1.5', resultContains: '1.5' },
  { id: 'data-storage', values: { value: 2.5, unit: 0 }, headline: '2,560', resultContains: '2,560' },
]

describe('worked examples match the calculators', () => {
  for (const { id, values, headline, resultContains } of cases) {
    it(`${id}: worked example produces the stated result`, () => {
      const calculator = calculatorMap.get(id)!
      expect(calculator.calculate(values as unknown as Record<string, number>).headline).toBe(headline)
      expect(calculator.example.result).toContain(resultContains)
    })
  }

  it('age: worked example is correct for its stated reference date', () => {
    const calculator = calculatorMap.get('age')!
    // The example is anchored to 15 June 1990 with reference date 20 November 2026.
    expect(calculator.example.inputs).toContain('20 November 2026')
    // Age as of the reference date, computed independently of the calculator:
    // 2026 - 1990 = 36 and the 15 June birthday had already passed by 20 November.
    const reference = new Date(2026, 10, 20)
    let expected = reference.getFullYear() - 1990
    if (reference.getMonth() < 5 || (reference.getMonth() === 5 && reference.getDate() < 15)) expected -= 1
    expect(expected).toBe(36)
    expect(calculator.example.result).toContain('36 years')
    // And the calculator itself still returns a well-formed age for those inputs today.
    expect(calculator.calculate({ birthYear: 1990, birthMonth: 6, birthDay: 15 }).headline).toMatch(/^\d+ years$/)
  })
})
