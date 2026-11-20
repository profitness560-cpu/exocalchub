import { CalculatorLayout } from '../components/calculator'
import { MortgageCalculatorForm } from '../components/mortgage/MortgageCalculatorForm'
import { CalculatorContent } from '../components/CalculatorContent'
import { calculatorMap } from '../data/calculators'
import { usePageMeta } from '../hooks/usePageMeta'
import { breadcrumbList, faqPage } from '../lib/structuredData'
import { RelatedCalculators } from '../components/RelatedCalculators'

const calculator = calculatorMap.get('mortgage')!

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
      faqPage(calculator.faq),
    ],
  })

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Estimate your monthly payment, total interest, and total cost."
    >
      <MortgageCalculatorForm />
      <CalculatorContent calculator={calculator} />
      <RelatedCalculators ids={['loan', 'investment-return']} />
    </CalculatorLayout>
  )
}
