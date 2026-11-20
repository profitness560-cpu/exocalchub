import { CalculatorLayout } from '../components/calculator'
import { ScientificCalculator } from '../components/calculator/ScientificCalculator'
import { FormulaSection } from '../components/calculator/FormulaSection'
import { FAQ } from '../components/FAQ'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Dedicated Scientific Calculator page (Phase 2).
 * Uses the integrated keypad component instead of the generic text field,
 * so users get DEG/RAD, scientific buttons and specific error messages.
 * The generic CalculatorPage route is not used for this calculator.
 */
export function ScientificCalculatorPage() {
  usePageMeta({
    title: 'Scientific Calculator | ExoCalcHub',
    description: 'Evaluate arithmetic expressions with scientific functions: square roots, powers, trigonometry, logarithms and more.',
    path: '/calculators/scientific',
  })

  return (
    <CalculatorLayout
      title="Scientific Calculator"
      description="Evaluate safe arithmetic expressions with common functions."
    >
      <ScientificCalculator />
      <FormulaSection formula="Standard arithmetic order of operations. Use ^ for powers and sqrt(...) for square roots. Angles use the selected DEG / RAD mode." />
      <h2>About this calculator</h2>
      <p>
        Type an expression or tap the keypad. The calculator supports +, −, ×, ÷, powers (^ and **),
        square roots, nth roots, sin, cos, tan and their inverses, log (base 10), ln, absolute value,
        exponentials, factorials and the constants π and e.
      </p>
      <h2>Frequently asked questions</h2>
      <FAQ
        items={[
          ['Are the results exact?', 'Results are estimates based on the inputs you provide. Verify important decisions with an appropriate professional.'],
          ['How are results calculated?', 'Each tool shows its formula and calculation steps so you can understand the estimate.'],
          ['Degrees or radians?', 'Use the DEG / RAD selector above the keypad. In DEG mode, sin(30) = 0.5. In RAD mode, sin(pi/6) = 0.5.'],
        ]}
      />
    </CalculatorLayout>
  )
}
