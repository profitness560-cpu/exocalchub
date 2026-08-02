import type {
  BMIFormValues,
  BMIResult,
  BMIValidationErrors,
  BMICategoryInfo,
} from './types'

const BMI_CATEGORIES: { max: number; info: BMICategoryInfo }[] = [
  { max: 18.5, info: { label: 'Underweight', variant: 'underweight', range: 'Below 18.5' } },
  { max: 25, info: { label: 'Normal Weight', variant: 'normal', range: '18.5–24.9' } },
  { max: 30, info: { label: 'Overweight', variant: 'overweight', range: '25–29.9' } },
  { max: Infinity, info: { label: 'Obese', variant: 'obese', range: '30+' } },
]

export function getBMICategory(bmi: number): BMICategoryInfo {
  return BMI_CATEGORIES.find((entry) => bmi < entry.max)?.info ?? BMI_CATEGORIES[3].info
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || weightKg <= 0 || heightCm <= 0) {
    return Number.NaN
  }
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

function validateNumericField(value: string, fieldLabel: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return `Please enter your ${fieldLabel.toLowerCase()}.`
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return `${fieldLabel} must be a valid number.`
  const parsed = Number.parseFloat(trimmed)
  if (!Number.isFinite(parsed) || parsed <= 0) return `${fieldLabel} must be greater than zero.`
  return undefined
}

export function validateBMIInputs(values: BMIFormValues): BMIValidationErrors {
  const errors: BMIValidationErrors = {}
  const heightError = validateNumericField(values.height, 'Height')
  const weightError = validateNumericField(values.weight, 'Weight')
  if (heightError) errors.height = heightError
  if (weightError) errors.weight = weightError
  return errors
}

export function computeBMIResult(values: BMIFormValues): BMIResult {
  const value = calculateBMI(Number(values.weight.trim()), Number(values.height.trim()))
  return { value, category: getBMICategory(value) }
}

export const BMI_FORMULA = 'BMI = weight (kg) ÷ [height (m)]²'
export const HEALTHY_BMI_EXPLANATION =
  'A healthy BMI typically falls between 18.5 and 24.9. BMI is a screening tool and does not diagnose body fatness or health. Consult a healthcare provider for personalized advice.'
