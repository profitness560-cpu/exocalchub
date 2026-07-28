export type CalculatorCategory =
  | 'finance'
  | 'health'
  | 'math'
  | 'everyday'
  | 'education'
  | 'conversion'

export interface Calculator {
  id: string
  name: string
  description: string
  category: CalculatorCategory
  icon: string
  path?: string
}

export const calculators: Calculator[] = [
  {
    id: 'bmi',
    name: 'BMI Calculator',
    description: 'Calculate your body mass index and health category.',
    category: 'health',
    icon: '⚖️',
    path: '/calculators/bmi',
  },
  {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    description: 'Estimate monthly payments, interest, and total cost.',
    category: 'finance',
    icon: '🏠',
  },
  {
    id: 'loan',
    name: 'Loan Calculator',
    description: 'Plan loan payments with interest and amortization.',
    category: 'finance',
    icon: '💰',
  },
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    description: 'Find percentages, increases, and decreases quickly.',
    category: 'math',
    icon: '📊',
  },
  {
    id: 'tip',
    name: 'Tip Calculator',
    description: 'Split bills and calculate tips for any group size.',
    category: 'everyday',
    icon: '🍽️',
  },
  {
    id: 'age',
    name: 'Age Calculator',
    description: 'Find exact age in years, months, and days.',
    category: 'everyday',
    icon: '🎂',
  },
  {
    id: 'gpa',
    name: 'GPA Calculator',
    description: 'Compute weighted grade point averages easily.',
    category: 'education',
    icon: '🎓',
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    description: 'Project savings growth with compound returns.',
    category: 'finance',
    icon: '📈',
  },
  {
    id: 'calorie',
    name: 'Calorie Calculator',
    description: 'Estimate daily calorie needs based on activity.',
    category: 'health',
    icon: '🔥',
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature, and more.',
    category: 'conversion',
    icon: '🔄',
  },
  {
    id: 'tax',
    name: 'Tax Calculator',
    description: 'Estimate income tax and take-home pay.',
    category: 'finance',
    icon: '🧾',
  },
  {
    id: 'salary',
    name: 'Salary Calculator',
    description: 'Convert hourly, weekly, and annual salary rates.',
    category: 'finance',
    icon: '💼',
  },
]
