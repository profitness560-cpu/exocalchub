import { CalculatorLayout } from '../components/calculator'
import { MortgageCalculatorForm } from '../components/mortgage/MortgageCalculatorForm'
import { usePageMeta } from '../hooks/usePageMeta'
import { breadcrumbList } from '../lib/structuredData'
import { RelatedCalculators } from '../components/RelatedCalculators'

export function MortgageCalculatorPage() {
  usePageMeta({
    title: 'Mortgage Calculator | ExoCalcHub',
    description:
      'Free online mortgage calculator. Estimate monthly payments, total interest, and total loan cost instantly.',
    path: '/calculators/mortgage',
    structuredData: [
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Mortgage Calculator', path: '/calculators/mortgage' },
      ]),
    ],
  })

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Estimate your monthly payment, total interest, and total cost."
    >
      <MortgageCalculatorForm />
      <RelatedCalculators ids={['loan', 'investment-return']} />
    </CalculatorLayout>
  )
}
