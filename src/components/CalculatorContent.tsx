import type { Calculator } from '../data/calculators'
import { FAQ } from './FAQ'
import './CalculatorContent.css'

/**
 * Supporting content for a calculator page: a plain-language explanation,
 * a worked example with the calculator's real inputs and arithmetic, and
 * calculator-specific FAQs. Used by the generic CalculatorPage and by the
 * dedicated BMI, Mortgage and Scientific pages so all 29 calculators show
 * the same depth of content.
 */
export function CalculatorContent({ calculator }: { calculator: Calculator }) {
  const paragraphs = calculator.explanation.split('\n\n').map((paragraph) => paragraph.trim()).filter(Boolean)
  return <div className="calculator-content">
    <h2>About this calculator</h2>
    {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    <h2>Worked example</h2>
    <dl className="calculator-content__example">
      <div><dt>Inputs</dt><dd>{calculator.example.inputs}</dd></div>
      <div><dt>Calculation</dt><dd>{calculator.example.calculation}</dd></div>
      <div><dt>Result</dt><dd>{calculator.example.result}</dd></div>
    </dl>
    <h2 id="calculator-faq-title">Frequently asked questions</h2>
    <FAQ items={calculator.faq} />
  </div>
}
