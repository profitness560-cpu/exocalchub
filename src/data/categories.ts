import type { CalculatorCategory } from './calculators'

export interface Category {
  id: CalculatorCategory
  name: string
  description: string
  icon: string
}

export const categories: Category[] = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Loans, mortgages, taxes, and salary tools.',
    icon: '💳',
  },
  {
    id: 'health',
    name: 'Health',
    description: 'BMI, calories, and wellness calculators.',
    icon: '❤️',
  },
  {
    id: 'math',
    name: 'Math',
    description: 'Percentages, ratios, and number utilities.',
    icon: '🔢',
  },
  {
    id: 'everyday',
    name: 'Everyday',
    description: 'Tips, age, and daily life helpers.',
    icon: '☀️',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'GPA and academic planning tools.',
    icon: '📚',
  },
  {
    id: 'conversion',
    name: 'Conversion',
    description: 'Unit and measurement converters.',
    icon: '📐',
  },
]
