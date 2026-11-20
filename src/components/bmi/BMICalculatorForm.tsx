import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { BMIResult, BMIValidationErrors } from '../../calculators/bmi'
import {
  computeBMIResult,
  validateBMIInputs,
} from '../../calculators/bmi'
import {
  CalculatorButton,
  CalculatorCard,
  CalculatorInput,
} from '../calculator'
import { BMIResultSection } from './BMIResultSection'
import { track } from '../../utils/analytics'
import './BMICalculatorForm.css'

export function BMICalculatorForm() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [errors, setErrors] = useState<BMIValidationErrors>({})
  const [result, setResult] = useState<BMIResult | null>(null)

  function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values = { height, weight }
    const validationErrors = validateBMIInputs(values)

    if (validationErrors.height || validationErrors.weight) {
      setErrors(validationErrors)
      setResult(null)
      return
    }

    setErrors({})
    setResult(computeBMIResult(values))
    track('calculator_use', { id: 'bmi' })
  }

  function handleReset() {
    setHeight('')
    setWeight('')
    setErrors({})
    setResult(null)
  }

  function handleHeightChange(event: ChangeEvent<HTMLInputElement>) {
    setHeight(event.target.value)
  }

  function handleWeightChange(event: ChangeEvent<HTMLInputElement>) {
    setWeight(event.target.value)
  }

  return (
    <div className="bmi-calculator-form">
      <CalculatorCard>
        <form className="bmi-calculator-form__form" onSubmit={handleCalculate}>
          <CalculatorInput
            label="Height (cm)"
            id="bmi-height"
            name="height"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 175"
            value={height}
            onChange={handleHeightChange}
            error={errors.height}
          />
          <CalculatorInput
            label="Weight (kg)"
            id="bmi-weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 70"
            value={weight}
            onChange={handleWeightChange}
            error={errors.weight}
          />
          <div className="bmi-calculator-form__actions">
            <CalculatorButton type="submit" variant="primary">
              Calculate BMI
            </CalculatorButton>
            <CalculatorButton type="button" variant="secondary" onClick={handleReset}>
              Reset
            </CalculatorButton>
          </div>
        </form>
      </CalculatorCard>

      {result && <BMIResultSection result={result} />}
    </div>
  )
}
