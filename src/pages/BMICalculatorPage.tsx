import { PageHeader } from '../components/PageHeader'
import { BMICalculatorForm } from '../components/bmi/BMICalculatorForm'
import { usePageMeta } from '../hooks/usePageMeta'
import './BMICalculatorPage.css'

export function BMICalculatorPage() {
  usePageMeta(
    'BMI Calculator | QuickCalcHub',
    'Free online BMI calculator. Calculate Body Mass Index instantly and understand your healthy weight category.',
  )

  return (
    <div className="bmi-page">
      <PageHeader
        title="BMI Calculator"
        description="Calculate your Body Mass Index instantly."
      />
      <BMICalculatorForm />
    </div>
  )
}
