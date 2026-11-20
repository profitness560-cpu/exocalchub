import { CalculatorLayout } from '../components/calculator'
import { ScientificCalculator } from '../components/calculator/ScientificCalculator'
import { FormulaSection } from '../components/calculator/FormulaSection'
import { CalculatorContent } from '../components/CalculatorContent'
import { calculatorMap } from '../data/calculators'
import { usePageMeta } from '../hooks/usePageMeta'
import { breadcrumbList, faqPage } from '../lib/structuredData'
import { RelatedCalculators } from '../components/RelatedCalculators'

/**
 * Dedicated Scientific Calculator page (Phase 2).
 * Uses the integrated keypad component instead of the generic text field,
 * so users get DEG/RAD, scientific buttons and specific error messages.
 * The generic CalculatorPage route is not used for this calculator.
 * Supporting content (explanation, worked example, FAQs) comes from the
 * shared calculator data, like every other calculator.
 */
const calculator = calculatorMap.get('scientific')!

export function ScientificCalculatorPage() {
  usePageMeta({
    title: 'Scientific Calculator | ExoCalcHub',
    description: 'Evaluate arithmetic expressions with scientific functions: square roots, powers, trigonometry, logarithms and more.',
    path: '/calculators/scientific',
    structuredData: [
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Scientific Calculator', path: '/calculators/scientific' },
      ]),
      faqPage(calculator.faq),
    ],
  })

  return (
    <CalculatorLayout
      title="Scientific Calculator"
      description="Evaluate safe arithmetic expressions with common functions."
    >
      <ScientificCalculator />
      <FormulaSection formula="Standard arithmetic order of operations. Use ^ for powers and sqrt(...) for square roots. Angles use the selected DEG / RAD mode." />
      <CalculatorContent calculator={calculator} />
      <RelatedCalculators ids={['percentage', 'fraction']} />
    </CalculatorLayout>
  )
}
