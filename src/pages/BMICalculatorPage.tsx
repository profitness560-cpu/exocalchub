import { CalculatorLayout } from '../components/calculator'
import { BMICalculatorForm } from '../components/bmi/BMICalculatorForm'
import { CalculatorContent } from '../components/CalculatorContent'
import { calculatorMap } from '../data/calculators'
import { usePageMeta } from '../hooks/usePageMeta'
import { breadcrumbList, faqPage } from '../lib/structuredData'
import { RelatedCalculators } from '../components/RelatedCalculators'

const calculator = calculatorMap.get('bmi')!

export function BMICalculatorPage() {
  usePageMeta({
    title: 'BMI Calculator | ExoCalcHub',
    description:
      'Free online BMI calculator. Calculate Body Mass Index instantly and understand your healthy weight category.',
    path: '/calculators/bmi',
    structuredData: [
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'BMI Calculator', path: '/calculators/bmi' },
      ]),
      faqPage(calculator.faq),
    ],
  })

  return (
    <CalculatorLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index instantly."
    >
      <BMICalculatorForm />
      <CalculatorContent calculator={calculator} />
      <RelatedCalculators ids={['calorie', 'ideal-weight']} />
    </CalculatorLayout>
  )
}
