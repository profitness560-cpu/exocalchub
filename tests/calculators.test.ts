import { calculators } from '../src/data/calculators'

const get = (id: string) => calculators.find((calculator) => calculator.id === id)!
const calculate = (id: string, values: Record<string, number>) => get(id).calculate(values)

describe('calculator formulas', () => {
  it('calculates BMI', () => expect(calculate('bmi', { weight: 70, height: 175 }).headline).toContain('22.86'))
  it('calculates BMR', () => expect(calculate('bmr', { weight: 70, height: 175, age: 30, sex: 1 }).headline).toContain('1,673'))
  it('calculates loan payments', () => expect(calculate('loan', { principal: 10000, rate: 12, years: 1 }).headline).toContain('888.49'))
  it('calculates mortgage payments', () => expect(calculate('mortgage', { principal: 200000, rate: 6, years: 30 }).headline).toContain('1,199.10'))
  it('calculates percentages', () => expect(calculate('percentage', { principal: 200, rate: 15 }).headline).toBe('30'))
  it('calculates age', () => expect(calculate('age', { birthYear: new Date().getFullYear() - 25 }).headline).toContain('25'))
  it('calculates water intake', () => expect(calculate('water-intake', { weight: 70, activity: 30 }).headline).toContain('2.8'))
  it('calculates compound interest', () => expect(calculate('compound-interest', { principal: 1000, rate: 10, years: 2, contributions: 0 }).headline).toContain('1,210'))
  it('calculates VAT', () => expect(calculate('vat', { principal: 100, rate: 20 }).headline).toContain('120'))
  it('calculates discount', () => expect(calculate('discount', { principal: 100, rate: 25 }).headline).toContain('75'))
})
