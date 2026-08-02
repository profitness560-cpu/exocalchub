import { CalculatorLayout } from '../components/calculator'
import { MortgageCalculatorForm } from '../components/mortgage/MortgageCalculatorForm'
import { usePageMeta } from '../hooks/usePageMeta'

export function MortgageCalculatorPage() {
  usePageMeta({
    title: 'Mortgage Calculator | ExoCalcHub',
    description:
      'Free online mortgage calculator. Estimate monthly payments, total interest, and total loan cost instantly.',
    path: '/calculators/mortgage',
  })

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Estimate your monthly payment, total interest, and total cost."
    >
      <MortgageCalculatorForm />
    </CalculatorLayout>
  )
}
