export type {
  BMICategoryVariant,
  BMICategoryInfo,
  BMIResult,
  BMIFormValues,
  BMIValidationErrors,
} from './types'

export {
  calculateBMI,
  getBMICategory,
  validateBMIInputs,
  computeBMIResult,
  BMI_FORMULA,
  HEALTHY_BMI_EXPLANATION,
} from './bmiLogic'
