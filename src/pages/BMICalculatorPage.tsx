import { CalculatorLayout } from '../components/calculator'
import { BMICalculatorForm } from '../components/bmi/BMICalculatorForm'
import { usePageMeta } from '../hooks/usePageMeta'

export function BMICalculatorPage() {
  usePageMeta({
    title: 'BMI Calculator | ExoCalcHub',
    description:
      'Free online BMI calculator. Calculate Body Mass Index instantly and understand your healthy weight category.',
    path: '/calculators/bmi',
  })

  return (
    <CalculatorLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index instantly."
    >
      <BMICalculatorForm />
    </CalculatorLayout>
  )
}
