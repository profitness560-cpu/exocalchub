export type {
  MortgageFormValues,
  MortgageValidationErrors,
  MortgageResult,
} from './types'

export {
  validateMortgageInputs,
  computeMortgageResult,
  formatCurrency,
  MORTGAGE_FORMULA,
  MORTGAGE_EXPLANATION,
} from './mortgageLogic'
