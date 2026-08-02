import type {
  MortgageFormValues,
  MortgageResult,
  MortgageValidationErrors,
} from './types'

export const MORTGAGE_FORMULA =
  'Monthly payment = P × [r(1 + r)ⁿ] ÷ [(1 + r)ⁿ − 1], where P = loan amount, r = monthly interest rate, n = number of months'

export const MORTGAGE_EXPLANATION =
  'This estimate covers principal and interest only. Property taxes, insurance, and HOA fees are not included.'

function validateNumericField(
  value: string,
  fieldLabel: string,
): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return `Please enter ${fieldLabel.toLowerCase()}.`
  }

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${fieldLabel} must be a valid number.`
  }

  const parsed = Number.parseFloat(trimmed)

  if (parsed <= 0) {
    return `${fieldLabel} must be greater than zero.`
  }

  return undefined
}

export function validateMortgageInputs(
  values: MortgageFormValues,
): MortgageValidationErrors {
  const errors: MortgageValidationErrors = {}

  const loanAmountError = validateNumericField(values.loanAmount, 'Loan amount')
  const interestRateError = validateNumericField(
    values.interestRate,
    'Interest rate',
  )
  const loanTermError = validateNumericField(values.loanTerm, 'Loan term')

  if (loanAmountError) errors.loanAmount = loanAmountError
  if (interestRateError) errors.interestRate = interestRateError
  if (loanTermError) errors.loanTerm = loanTermError

  if (!errors.interestRate) {
    const rate = Number.parseFloat(values.interestRate.trim())
    if (rate > 100) {
      errors.interestRate = 'Interest rate must be 100% or less.'
    }
  }

  if (!errors.loanTerm) {
    const years = Number.parseFloat(values.loanTerm.trim())
    if (years > 100) {
      errors.loanTerm = 'Loan term must be 100 years or less.'
    }
  }

  return errors
}

export function computeMortgageResult(
  values: MortgageFormValues,
): MortgageResult {
  const principal = Number.parseFloat(values.loanAmount.trim())
  const annualRate = Number.parseFloat(values.interestRate.trim())
  const years = Number.parseFloat(values.loanTerm.trim())
  const months = years * 12
  const monthlyRate = annualRate / 100 / 12

  let monthlyPayment: number

  if (monthlyRate === 0) {
    monthlyPayment = principal / months
  } else {
    const factor = (1 + monthlyRate) ** months
    monthlyPayment = (principal * monthlyRate * factor) / (factor - 1)
  }

  const totalPayment = monthlyPayment * months
  const totalInterest = totalPayment - principal

  return {
    monthlyPayment,
    totalInterest,
    totalPayment,
  }
}

export function formatCurrency(value: number): string {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
