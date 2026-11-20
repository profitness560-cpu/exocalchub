import type { Calculator, CalculatorCategory } from './calculators'

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

/**
 * F-02 (Phase 3 corrective action): only show categories that have at least
 * one calculator. The full `categories` list above is kept unchanged, so
 * Everyday and Education reappear automatically when calculators are added
 * to them — nothing is deleted from the project architecture.
 */
export function visibleCategories(allCalculators: Calculator[]): Category[] {
  return categories.filter((category) =>
    allCalculators.some((calculator) => calculator.category === category.id),
  )
}
