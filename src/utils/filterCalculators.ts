import type { Calculator } from '../data/calculators'

export function filterCalculators(
  calculator: Calculator,
  query: string,
): boolean {
  return (
    calculator.name.toLowerCase().includes(query) ||
    calculator.description.toLowerCase().includes(query) ||
    calculator.category.toLowerCase().includes(query)
  )
}
