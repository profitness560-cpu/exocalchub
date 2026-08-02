export type CalculatorCategory = 'health' | 'finance' | 'math' | 'conversion' | 'everyday' | 'education'

export interface Calculator {
  id: string
  name: string
  description: string
  category: CalculatorCategory
  icon: string
  path: string
  fields: CalculatorField[]
  formula: string
  calculate: (values: Record<string, number>) => CalculationResult
  faq: [string, string][]
  related: string[]
}

export interface CalculatorField {
  id: string
  label: string
  unit?: string
  min?: number
  max?: number
  step?: string
  defaultValue?: string
}

export interface CalculationResult {
  headline: string
  details: string[]
  steps?: string[]
}

const n = (value: number, digits = 2) => value.toLocaleString(undefined, { maximumFractionDigits: digits })
const money = (value: number) => n(value, 2)
const field = (id: string, label: string, unit: string, min = 0, max?: number): CalculatorField => ({ id, label, unit, min, max, step: 'any' })
const standardFaq: [string, string][] = [['Are the results exact?', 'Results are estimates based on the inputs you provide. Verify important decisions with an appropriate professional.'], ['How are results calculated?', 'Each tool shows its formula and calculation steps so you can understand the estimate.']]

const definitions: Calculator[] = [
  {
    id: 'bmi', name: 'BMI Calculator', description: 'Calculate body mass index and understand the standard weight category.', category: 'health', icon: '⚖', path: '/calculators/bmi',
    fields: [field('weight', 'Weight', 'kg', 1, 500), field('height', 'Height', 'cm', 30, 280)], formula: 'BMI = weight (kg) ÷ height (m)²',
    calculate: ({ weight, height }) => { const value = weight / ((height / 100) ** 2); const category = value < 18.5 ? 'Underweight' : value < 25 ? 'Normal weight' : value < 30 ? 'Overweight' : 'Obese'; return { headline: `${n(value)} — ${category}`, details: ['BMI is a screening measure, not a diagnosis.'], steps: [`Height converted to ${n(height / 100, 2)} m`, `BMI = ${n(weight)} ÷ (${n(height / 100, 2)} × ${n(height / 100, 2)})`, `Your BMI is ${n(value)}`] } }, faq: standardFaq, related: ['calorie', 'ideal-weight'],
  },
  {
    id: 'bmr', name: 'BMR Calculator', description: 'Estimate how many calories your body uses at rest.', category: 'health', icon: '🔥', path: '/calculators/bmr',
    fields: [field('weight', 'Weight', 'kg', 1, 500), field('height', 'Height', 'cm', 30, 280), field('age', 'Age', 'years', 13, 120), { id: 'sex', label: 'Sex (1 = male, 0 = female)', min: 0, max: 1, step: '1' }], formula: 'Mifflin–St Jeor: BMR = 10w + 6.25h − 5a + s',
    calculate: ({ weight, height, age, sex }) => { const value = 10 * weight + 6.25 * height - 5 * age + (sex ? 5 : -161); return { headline: `${n(value, 0)} calories/day`, details: ['This is an estimate of resting energy expenditure.'], steps: [`10 × ${n(weight)} + 6.25 × ${n(height)} − 5 × ${n(age)} + ${sex ? 5 : '−161'}`, `Estimated BMR: ${n(value, 0)} calories/day`] } }, faq: standardFaq, related: ['calorie', 'water-intake'],
  },
  {
    id: 'body-fat', name: 'Body Fat Calculator', description: 'Estimate body fat percentage using the U.S. Navy method.', category: 'health', icon: '◉', path: '/calculators/body-fat',
    fields: [field('waist', 'Waist circumference', 'cm', 30, 250), field('neck', 'Neck circumference', 'cm', 15, 100), field('hip', 'Hip circumference (use 0 for male)', 'cm', 0, 250), field('height', 'Height', 'cm', 80, 280), { id: 'sex', label: 'Sex (1 = male, 0 = female)', min: 0, max: 1, step: '1' }], formula: 'U.S. Navy circumference method (logarithmic estimate)',
    calculate: ({ waist, neck, hip, height, sex }) => { const value = sex ? 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450 : 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450; return { headline: `${n(Math.max(0, value))}% estimated body fat`, details: ['The U.S. Navy method is an estimate and can vary with measurement technique.'] } }, faq: standardFaq, related: ['bmi', 'ideal-weight'],
  },
  {
    id: 'ideal-weight', name: 'Ideal Weight Calculator', description: 'Estimate an ideal weight range using the Devine formula.', category: 'health', icon: '♥', path: '/calculators/ideal-weight', fields: [field('height', 'Height', 'cm', 120, 240), { id: 'sex', label: 'Sex (1 = male, 0 = female)', min: 0, max: 1, step: '1' }], formula: 'Devine: male 50 + 2.3 × inches over 5 ft; female 45.5 + 2.3 × inches over 5 ft', calculate: ({ height, sex }) => { const inches = height / 2.54; const value = (sex ? 50 : 45.5) + 2.3 * Math.max(0, inches - 60); return { headline: `${n(value)} kg`, details: ['This is a population estimate, not a medical target.'], steps: [`Height: ${n(inches)} inches`, `Estimated ideal weight: ${n(value)} kg`] } }, faq: standardFaq, related: ['bmi', 'calorie'],
  },
  {
    id: 'calorie', name: 'Calorie Calculator', description: 'Estimate daily calories based on BMR and activity level.', category: 'health', icon: '✦', path: '/calculators/calorie', fields: [field('bmr', 'BMR', 'calories', 500, 5000), field('activity', 'Activity multiplier', '×', 1, 2.5)], formula: 'Daily calories = BMR × activity multiplier', calculate: ({ bmr, activity }) => { const value = bmr * activity; return { headline: `${n(value, 0)} calories/day`, details: ['Use this as a starting point and adjust based on real-world results.'], steps: [`${n(bmr, 0)} × ${n(activity, 2)} = ${n(value, 0)} calories/day`] } }, faq: standardFaq, related: ['bmr', 'water-intake'],
  },
  {
    id: 'water-intake', name: 'Water Intake Calculator', description: 'Estimate a daily water intake target from body weight.', category: 'health', icon: '◇', path: '/calculators/water-intake', fields: [field('weight', 'Weight', 'kg', 1, 500), field('activity', 'Exercise time', 'minutes/day', 0, 300)], formula: 'Base water = weight × 35 ml, plus 350 ml per 30 minutes of exercise', calculate: ({ weight, activity }) => { const ml = weight * 35 + activity / 30 * 350; return { headline: `${n(ml / 1000)} liters/day`, details: ['Needs vary with climate, health, diet, and activity.'], steps: [`${n(weight)} × 35 = ${n(weight * 35)} ml base`, `Exercise adjustment: ${n(activity / 30 * 350)} ml`, `Total: ${n(ml)} ml`] } }, faq: standardFaq, related: ['calorie', 'bmr'],
  },
]

const financeFields = (principalLabel = 'Principal'): CalculatorField[] => [field('principal', principalLabel, '$', 0.01, 100000000), field('rate', 'Annual interest rate', '%', 0, 100), field('years', 'Term', 'years', 0.1, 100)]
const loanCalc = ({ principal, rate, years }: Record<string, number>): CalculationResult => { const months = years * 12; const monthlyRate = rate / 1200; const payment = monthlyRate === 0 ? principal / months : principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1); const total = payment * months; return { headline: `$${money(payment)} / month`, details: [`Total paid: $${money(total)}`, `Total interest: $${money(total - principal)}`], steps: [`${n(months, 0)} monthly payments`, `Monthly rate: ${n(monthlyRate * 100, 4)}%`] } }
const compoundCalc = ({ principal, rate, years, contributions = 0 }: Record<string, number>): CalculationResult => { const value = principal * (1 + rate / 100) ** years + contributions * (((1 + rate / 100) ** years - 1) / (rate / 100 || 1)); return { headline: `$${money(value)}`, details: [`Growth: $${money(value - principal - contributions * years)}`], steps: [`Future value = principal × (1 + rate)^years`, `Estimated balance: $${money(value)}`] } }

const finance: Calculator[] = [
  { id: 'loan', name: 'Loan Calculator', description: 'Estimate monthly payments, total interest, and total cost.', category: 'finance', icon: '$', path: '/calculators/loan', fields: financeFields('Loan amount'), formula: 'Payment = P × r(1+r)ⁿ ÷ ((1+r)ⁿ−1)', calculate: loanCalc, faq: standardFaq, related: ['mortgage', 'compound-interest'] },
  { id: 'mortgage', name: 'Mortgage Calculator', description: 'Estimate a home loan payment and long-term interest.', category: 'finance', icon: '⌂', path: '/calculators/mortgage', fields: financeFields('Home price'), formula: 'Monthly principal and interest payment using amortization.', calculate: loanCalc, faq: standardFaq, related: ['loan', 'investment-return'] },
  { id: 'compound-interest', name: 'Compound Interest Calculator', description: 'Project how savings grow with compound interest.', category: 'finance', icon: '↗', path: '/calculators/compound-interest', fields: [...financeFields(), field('contributions', 'Annual contribution', '$', 0, 10000000)], formula: 'A = P(1+r)ⁿ + contributions × (((1+r)ⁿ−1)/r)', calculate: compoundCalc, faq: standardFaq, related: ['savings', 'investment-return'] },
  { id: 'savings', name: 'Savings Calculator', description: 'Estimate future savings from a starting balance and deposits.', category: 'finance', icon: '▣', path: '/calculators/savings', fields: [...financeFields('Starting balance'), field('contributions', 'Annual deposit', '$', 0, 10000000)], formula: 'Future value with annual compound growth and deposits.', calculate: compoundCalc, faq: standardFaq, related: ['compound-interest', 'retirement'] },
  { id: 'investment-return', name: 'Investment Return Calculator', description: 'Estimate an investment’s return and ending value.', category: 'finance', icon: '◒', path: '/calculators/investment-return', fields: [...financeFields('Initial investment'), field('contributions', 'Annual contribution', '$', 0, 10000000)], formula: 'Return = ending value − contributions and initial investment.', calculate: compoundCalc, faq: standardFaq, related: ['compound-interest', 'retirement'] },
  { id: 'retirement', name: 'Retirement Calculator', description: 'Project a retirement balance from contributions and growth.', category: 'finance', icon: '◎', path: '/calculators/retirement', fields: [...financeFields('Current savings'), field('contributions', 'Annual contribution', '$', 0, 10000000)], formula: 'Projected balance using annual compounding.', calculate: compoundCalc, faq: standardFaq, related: ['savings', 'investment-return'] },
  { id: 'vat', name: 'VAT Calculator', description: 'Add or remove VAT from a net or gross price.', category: 'finance', icon: '%', path: '/calculators/vat', fields: [field('principal', 'Price before VAT', '$', 0.01, 100000000), field('rate', 'VAT rate', '%', 0, 100)], formula: 'VAT = net price × rate; gross = net + VAT', calculate: ({ principal, rate }) => { const tax = principal * rate / 100; return { headline: `$${money(principal + tax)} including VAT`, details: [`VAT amount: $${money(tax)}`, `Net price: $${money(principal)}`], steps: [`${money(principal)} × ${n(rate)}% = $${money(tax)}`] } }, faq: standardFaq, related: ['discount', 'profit-margin'] },
  { id: 'discount', name: 'Discount Calculator', description: 'Calculate sale price and savings from a discount.', category: 'finance', icon: '−', path: '/calculators/discount', fields: [field('principal', 'Original price', '$', 0.01, 100000000), field('rate', 'Discount', '%', 0, 100)], formula: 'Sale price = original price × (1 − discount rate)', calculate: ({ principal, rate }) => { const savings = principal * rate / 100; return { headline: `$${money(principal - savings)}`, details: [`You save: $${money(savings)}`], steps: [`${money(principal)} × ${n(rate)}% = $${money(savings)} saved`] } }, faq: standardFaq, related: ['vat', 'profit-margin'] },
  { id: 'profit-margin', name: 'Profit Margin Calculator', description: 'Calculate gross profit and profit margin from cost and revenue.', category: 'finance', icon: '▰', path: '/calculators/profit-margin', fields: [field('revenue', 'Revenue', '$', 0.01, 100000000), field('cost', 'Cost', '$', 0, 100000000)], formula: 'Margin = (revenue − cost) ÷ revenue × 100', calculate: ({ revenue, cost }) => { const profit = revenue - cost; return { headline: `${n(profit / revenue * 100)}% profit margin`, details: [`Profit: $${money(profit)}`], steps: [`$${money(revenue)} − $${money(cost)} = $${money(profit)}`, `$${money(profit)} ÷ $${money(revenue)} × 100 = ${n(profit / revenue * 100)}%`] } }, faq: standardFaq, related: ['discount', 'vat'] },
]

const math: Calculator[] = [
  { id: 'percentage', name: 'Percentage Calculator', description: 'Find percentages, changes, and percentage differences.', category: 'math', icon: '%', path: '/calculators/percentage', fields: [field('principal', 'Base number', '', -100000000, 100000000), field('rate', 'Percentage', '%', -100000, 100000)], formula: 'Result = base × percentage ÷ 100', calculate: ({ principal, rate }) => { const value = principal * rate / 100; return { headline: n(value), details: [`${n(rate)}% of ${n(principal)} is ${n(value)}`], steps: [`${n(principal)} × ${n(rate)} ÷ 100 = ${n(value)}`] } }, faq: standardFaq, related: ['discount', 'average'] },
  { id: 'scientific', name: 'Scientific Calculator', description: 'Evaluate safe arithmetic expressions with common functions.', category: 'math', icon: '∑', path: '/calculators/scientific', fields: [{ id: 'expression', label: 'Expression (e.g. 2 + 2 × 5)' }], formula: 'Standard arithmetic order of operations.', calculate: ({ expression }) => { const text = String(expression); if (!/^[0-9+\-*/().%\s]+$/.test(text)) return { headline: 'Invalid expression', details: ['Use numbers, parentheses, decimal points, and + − × ÷ % operators.'] }; try { const value = Function(`"use strict"; return (${text})`)(); if (!Number.isFinite(value)) return { headline: 'Invalid result', details: ['The expression does not produce a finite number.'] }; return { headline: n(value, 8), details: ['Expression evaluated using standard order of operations.'], steps: [`${text} = ${n(value, 8)}`] } } catch { return { headline: 'Invalid expression', details: ['Check the expression and try again.'] } } }, faq: standardFaq, related: ['percentage', 'fraction'] },
  { id: 'age', name: 'Age Calculator', description: 'Calculate age from a date of birth.', category: 'math', icon: '◷', path: '/calculators/age', fields: [{ id: 'birthYear', label: 'Birth year', min: 1900, max: 2100, step: '1' }], formula: 'Age = current year − birth year', calculate: ({ birthYear }) => { const year = new Date().getFullYear(); const value = year - birthYear; return { headline: `${n(value, 0)} years`, details: [`Based on the current year, ${year}.`], steps: [`${year} − ${birthYear} = ${value} years`] } }, faq: standardFaq, related: ['average', 'percentage'] },
  { id: 'average', name: 'Average Calculator', description: 'Calculate the mean of a set of numbers.', category: 'math', icon: '≈', path: '/calculators/average', fields: [field('number1', 'Number 1', '', -100000000, 100000000), field('number2', 'Number 2', '', -100000000, 100000000), field('number3', 'Number 3', '', -100000000, 100000000)], formula: 'Mean = sum of values ÷ number of values', calculate: ({ number1, number2, number3 }) => { const value = (number1 + number2 + number3) / 3; return { headline: n(value), details: [`Average of ${n(number1)}, ${n(number2)}, and ${n(number3)}`], steps: `(${n(number1)} + ${n(number2)} + ${n(number3)}) ÷ 3 = ${n(value)}`.split('\n') } }, faq: standardFaq, related: ['percentage', 'ratio'] },
  { id: 'ratio', name: 'Ratio Calculator', description: 'Scale a ratio to find an equivalent value.', category: 'math', icon: '∶', path: '/calculators/ratio', fields: [field('a', 'First ratio value', '', 0.0001, 100000000), field('b', 'Second ratio value', '', 0.0001, 100000000), field('c', 'Known value', '', 0.0001, 100000000)], formula: 'a:b = c:x, so x = b × c ÷ a', calculate: ({ a, b, c }) => { const value = b * c / a; return { headline: n(value), details: [`Equivalent ratio: ${n(c)}:${n(value)}`], steps: [`${n(b)} × ${n(c)} ÷ ${n(a)} = ${n(value)}`] } }, faq: standardFaq, related: ['fraction', 'average'] },
  { id: 'fraction', name: 'Fraction Calculator', description: 'Add two fractions and simplify the result.', category: 'math', icon: '½', path: '/calculators/fraction', fields: [{ id: 'a', label: 'First numerator', min: -100000, max: 100000, step: '1' }, { id: 'b', label: 'First denominator', min: 1, max: 100000, step: '1' }, { id: 'c', label: 'Second numerator', min: -100000, max: 100000, step: '1' }, { id: 'd', label: 'Second denominator', min: 1, max: 100000, step: '1' }], formula: 'a/b + c/d = (ad + bc) / bd', calculate: ({ a, b, c, d }) => { const numerator = a * d + c * b; const denominator = b * d; const gcd = (x: number, y: number): number => y ? gcd(y, x % y) : Math.abs(x); const divisor = gcd(numerator, denominator); return { headline: `${numerator / divisor}/${denominator / divisor}`, details: [`Decimal: ${n(numerator / denominator)}`], steps: [`(${a} × ${d} + ${c} × ${b}) ÷ (${b} × ${d})`, `Simplified: ${numerator / divisor}/${denominator / divisor}`] } }, faq: standardFaq, related: ['ratio', 'scientific'] },
]

const conversion = (id: string, name: string, description: string, icon: string, units: string[], convert: (value: number, unit: number) => number, formula: string): Calculator => ({ id, name, description, category: 'conversion', icon, path: `/calculators/${id}`, fields: [field('value', 'Value', units[0], -100000000, 100000000), { id: 'unit', label: `Input unit (0 = ${units[0]}, 1 = ${units[1]})`, min: 0, max: 1, step: '1' }], formula, calculate: ({ value, unit }) => { const result = convert(value, unit); return { headline: n(result), details: [`Converted from ${units[unit]} to ${units[unit ? 0 : 1]}.`], steps: [`${n(value)} ${units[unit]} → ${n(result)} ${units[unit ? 0 : 1]}`] } }, faq: standardFaq, related: ['percentage'] })

const conversions = [
  conversion('length', 'Length Converter', 'Convert between meters and feet.', '↔', ['meters', 'feet'], (v, u) => u ? v / 3.28084 : v * 3.28084, '1 meter = 3.28084 feet'),
  conversion('weight', 'Weight Converter', 'Convert between kilograms and pounds.', '↔', ['kilograms', 'pounds'], (v, u) => u ? v / 2.20462 : v * 2.20462, '1 kilogram = 2.20462 pounds'),
  conversion('temperature', 'Temperature Converter', 'Convert Celsius and Fahrenheit.', '°', ['°C', '°F'], (v, u) => u ? (v - 32) * 5 / 9 : v * 9 / 5 + 32, '°F = °C × 9/5 + 32'),
  conversion('area', 'Area Converter', 'Convert square meters and square feet.', '□', ['m²', 'ft²'], (v, u) => u ? v / 10.7639 : v * 10.7639, '1 m² = 10.7639 ft²'),
  conversion('volume', 'Volume Converter', 'Convert liters and US gallons.', '◫', ['liters', 'US gallons'], (v, u) => u ? v / 3.78541 : v * 3.78541, '1 gallon = 3.78541 liters'),
  conversion('speed', 'Speed Converter', 'Convert kilometers per hour and miles per hour.', '➜', ['km/h', 'mph'], (v, u) => u ? v / 1.60934 : v * 1.60934, '1 mph = 1.60934 km/h'),
  conversion('time', 'Time Converter', 'Convert minutes and hours.', '◷', ['minutes', 'hours'], (v, u) => u ? v / 60 : v * 60, '1 hour = 60 minutes'),
  conversion('data-storage', 'Data Storage Converter', 'Convert gigabytes and megabytes.', '▦', ['gigabytes', 'megabytes'], (v, u) => u ? v / 1024 : v * 1024, '1 GB = 1024 MB'),
]

export const calculators = [...definitions, ...finance, ...math, ...conversions]
export const calculatorMap = new Map(calculators.map((calculator) => [calculator.id, calculator]))
