import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { MortgageResult, MortgageValidationErrors } from '../../calculators/mortgage'
import {
  computeMortgageResult,
  formatCurrency,
  MORTGAGE_EXPLANATION,
  MORTGAGE_FORMULA,
  validateMortgageInputs,
} from '../../calculators/mortgage'
import {
  CalculatorButton,
  CalculatorCard,
  CalculatorInput,
  FormulaSection,
  ResultCard,
} from '../calculator'
import './MortgageCalculatorForm.css'

export function MortgageCalculatorForm() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [errors, setErrors] = useState<MortgageValidationErrors>({})
  const [result, setResult] = useState<MortgageResult | null>(null)

  function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values = { loanAmount, interestRate, loanTerm }
    const validationErrors = validateMortgageInputs(values)

    if (
      validationErrors.loanAmount ||
      validationErrors.interestRate ||
      validationErrors.loanTerm
    ) {
      setErrors(validationErrors)
      setResult(null)
      return
    }

    setErrors({})
    setResult(computeMortgageResult(values))
  }

  function handleReset() {
    setLoanAmount('')
    setInterestRate('')
    setLoanTerm('')
    setErrors({})
    setResult(null)
  }

  function handleLoanAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setLoanAmount(event.target.value)
  }

  function handleInterestRateChange(event: ChangeEvent<HTMLInputElement>) {
    setInterestRate(event.target.value)
  }

  function handleLoanTermChange(event: ChangeEvent<HTMLInputElement>) {
    setLoanTerm(event.target.value)
  }

  return (
    <div className="mortgage-calculator-form">
      <CalculatorCard>
        <form
          className="mortgage-calculator-form__form"
          onSubmit={handleCalculate}
        >
          <CalculatorInput
            label="Loan amount ($)"
            id="mortgage-loan-amount"
            name="loanAmount"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 350000"
            value={loanAmount}
            onChange={handleLoanAmountChange}
            error={errors.loanAmount}
          />
          <CalculatorInput
            label="Interest rate (%)"
            id="mortgage-interest-rate"
            name="interestRate"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 6.5"
            value={interestRate}
            onChange={handleInterestRateChange}
            error={errors.interestRate}
          />
          <CalculatorInput
            label="Loan term (years)"
            id="mortgage-loan-term"
            name="loanTerm"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 30"
            value={loanTerm}
            onChange={handleLoanTermChange}
            error={errors.loanTerm}
          />
          <div className="mortgage-calculator-form__actions">
            <CalculatorButton type="submit" variant="primary">
              Calculate
            </CalculatorButton>
            <CalculatorButton type="button" variant="secondary" onClick={handleReset}>
              Reset
            </CalculatorButton>
          </div>
        </form>
      </CalculatorCard>

      {result && (
        <div className="mortgage-calculator-form__result">
          <ResultCard title={formatCurrency(result.monthlyPayment)}>
            <ul className="mortgage-calculator-form__details">
              <li>
                <strong>Monthly payment:</strong>{' '}
                {formatCurrency(result.monthlyPayment)}
              </li>
              <li>
                <strong>Total interest:</strong>{' '}
                {formatCurrency(result.totalInterest)}
              </li>
              <li>
                <strong>Total payment:</strong>{' '}
                {formatCurrency(result.totalPayment)}
              </li>
            </ul>
            <p className="mortgage-calculator-form__explanation">
              {MORTGAGE_EXPLANATION}
            </p>
            <FormulaSection title="Mortgage Formula" formula={MORTGAGE_FORMULA} />
          </ResultCard>
        </div>
      )}
    </div>
  )
}
