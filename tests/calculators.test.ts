import { calculators } from '../src/data/calculators'

const get = (id: string) => calculators.find((calculator) => calculator.id === id)!
const calculate = (id: string, values: Record<string, number>) => get(id).calculate(values)

describe('calculator formulas', () => {
  it('calculates BMI', () => expect(calculate('bmi', { weight: 70, height: 175 }).headline).toContain('22.86'))
  it('calculates BMR', () => expect(calculate('bmr', { weight: 70, height: 175, age: 30, sex: 1 }).headline).toContain('1,649'))
  // Phase 1 regression: the old expectation '1,673' was wrong. Mifflin–St Jeor
  // for a 30-year-old man, 70 kg, 175 cm is 10×70 + 6.25×175 − 5×30 + 5 = 1,648.75,
  // displayed rounded to whole calories as 1,649. The formula was not changed.
  it('calculates loan payments', () => expect(calculate('loan', { principal: 10000, rate: 12, years: 1 }).headline).toContain('888.49'))
  it('calculates mortgage payments', () => expect(calculate('mortgage', { principal: 200000, rate: 6, years: 30 }).headline).toContain('1,199.10'))
  it('calculates percentages', () => expect(calculate('percentage', { principal: 200, rate: 15 }).headline).toBe('30'))
  it('calculates age', () => expect(calculate('age', { birthYear: new Date().getFullYear() - 25 }).headline).toContain('25'))
  it('calculates water intake', () => expect(calculate('water-intake', { weight: 70, activity: 30 }).headline).toContain('2.8'))
  it('calculates compound interest', () => expect(calculate('compound-interest', { principal: 1000, rate: 10, years: 2, contributions: 0 }).headline).toContain('1,210'))
  it('calculates VAT', () => expect(calculate('vat', { principal: 100, rate: 20 }).headline).toContain('120'))
  it('calculates discount', () => expect(calculate('discount', { principal: 100, rate: 25 }).headline).toContain('75'))
})

describe('Phase 1 regression tests', () => {
  it('converts volume in both directions (was inverted)', () => {
    // 1 litre = 0.264172 US gallons; 1 US gallon = 3.78541 litres
    expect(calculate('volume', { value: 1, unit: 0 }).headline).toBe('0.26')
    expect(calculate('volume', { value: 1, unit: 1 }).headline).toBe('3.79')
    expect(calculate('volume', { value: 3.78541, unit: 0 }).headline).toBe('1')
  })
  it('converts speed in both directions (was inverted)', () => {
    // 100 km/h = 62.14 mph; 62.137 mph = 100 km/h
    expect(calculate('speed', { value: 100, unit: 0 }).headline).toBe('62.14')
    expect(calculate('speed', { value: 62.137, unit: 1 }).headline).toBe('100')
  })
  it('converts time in both directions (was inverted)', () => {
    // 120 minutes = 2 hours; 2 hours = 120 minutes
    expect(calculate('time', { value: 120, unit: 0 }).headline).toBe('2')
    expect(calculate('time', { value: 2, unit: 1 }).headline).toBe('120')
  })
  it('does not invert the other converters', () => {
    expect(calculate('length', { value: 1, unit: 0 }).headline).toBe('3.28')
    expect(calculate('length', { value: 1, unit: 1 }).headline).toBe('0.3')
    expect(calculate('weight', { value: 1, unit: 0 }).headline).toBe('2.2')
    expect(calculate('data-storage', { value: 1, unit: 0 }).headline).toBe('1,024')
  })
  it('allows Retirement with a $0 starting balance', () => {
    // $0 start, 7%, 30 years, $500/year = $47,230.39 (annual compounding model)
    expect(calculate('retirement', { principal: 0, rate: 7, years: 30, contributions: 500 }).headline).toContain('47,230.39')
  })
  it('still requires a positive starting balance for other finance calculators', () => {
    const principalField = (id: string) => get(id).fields.find((field) => field.id === 'principal')!
    expect(get('retirement').fields.find((field) => field.id === 'principal')!.min).toBe(0)
    expect(principalField('loan').min).toBe(0.01)
    expect(principalField('mortgage').min).toBe(0.01)
    expect(principalField('compound-interest').min).toBe(0.01)
    expect(principalField('savings').min).toBe(0.01)
    expect(principalField('investment-return').min).toBe(0.01)
  })
  it('formats mortgage payments with two decimal places', () => {
    expect(calculate('mortgage', { principal: 200000, rate: 6, years: 30 }).headline).toBe('$1,199.10 / month')
    expect(calculate('loan', { principal: 10000, rate: 5, years: 3 }).headline).toContain('/ month')
    // Currency amounts keep trailing zeros: $100 + 20% VAT = $120.00, not $120
    expect(calculate('vat', { principal: 100, rate: 20 }).headline).toContain('$120.00')
  })
  it('calculates BMR with the verified Mifflin–St Jeor formula', () => {
    // 10×70 + 6.25×175 − 5×30 + 5 = 1,648.75 → displayed as 1,649 calories/day
    expect(calculate('bmr', { weight: 70, height: 175, age: 30, sex: 1 }).headline).toBe('1,649 calories/day')
    // Female: same inputs, −161 instead of +5 → 1,482.75 → 1,483
    expect(calculate('bmr', { weight: 70, height: 175, age: 30, sex: 0 }).headline).toBe('1,483 calories/day')
  })
})
