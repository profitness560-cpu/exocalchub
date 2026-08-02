import {
  BMI_FORMULA,
  HEALTHY_BMI_EXPLANATION,
} from '../../calculators/bmi'
import { CategoryBadge, FormulaSection } from '../calculator'
import './BMIResultSection.css'

interface BMIResultSectionProps {
  result: {
    value: number
    category: {
      label: string
      variant: 'underweight' | 'normal' | 'overweight' | 'obese'
    }
  }
}

export function BMIResultSection({ result }: BMIResultSectionProps) {
  return (
    <section className="bmi-result" aria-live="polite">
      <div className="bmi-result__card">
        <div className="bmi-result__row">
          <span className="bmi-result__label">BMI Value</span>
          <span className="bmi-result__value">{result.value.toFixed(2)}</span>
        </div>

        <div className="bmi-result__row">
          <span className="bmi-result__label">Weight Category</span>
          <CategoryBadge
            label={result.category.label}
            variant={result.category.variant}
          />
        </div>

        <div className="bmi-result__info">
          <h3 className="bmi-result__info-title">Healthy BMI</h3>
          <p className="bmi-result__info-text">{HEALTHY_BMI_EXPLANATION}</p>
        </div>

        <FormulaSection title="BMI Formula" formula={BMI_FORMULA} />
      </div>
    </section>
  )
}
