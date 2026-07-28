import type {
  BMIFormValues,
  BMIResult,
  BMIValidationErrors,
  BMICategoryInfo,
} from './types'

const BMI_CATEGORIES: { max: number; info: BMICategoryInfo }[] = [
  {
    max: 18.5,
    info: {
      label: 'Underweight',
      variant: 'underweight',
      range: 'Below 18.5',
    },
  },
  {
    max: 25,
    info: {
      label: 'Normal Weight',
      variant: 'normal',
      range: '18.5–24.9',
    },
  },
  {
    max: 30,
    info: {
      label: 'Overweight',
      variant: 'overweight',
      range: '25–29.9',
    },
  },
  {
    max: Infinity,
    info: {
      label: 'Obese',
      variant: 'obese',
      range: '30+',
    },
  },
]

export function getBMICategory(bmi: number): BMICategoryInfo {
  for (const entry of BMI_CATEGORIES) {
    if (bmi < entry.max) {
      return entry.info
    }
  }
  return BMI_CATEGORIES[BMI_CATEGORIES.length - 1].info
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

function validateNumericField(
  value: string,
  fieldLabel: string,
): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return `Please enter your ${fieldLabel.toLowerCase()}.`
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

export function validateBMIInputs(
  values: BMIFormValues,
): BMIValidationErrors {
  const errors: BMIValidationErrors = {}

  const heightError = validateNumericField(values.height, 'Height')
  const weightError = validateNumericField(values.weight, 'Weight')

  if (heightError) errors.height = heightError
  if (weightError) errors.weight = weightError

  return errors
}

export function computeBMIResult(values: BMIFormValues): BMIResult {
  const heightCm = Number.parseFloat(values.height.trim())
  const weightKg = Number.parseFloat(values.weight.trim())
  const value = calculateBMI(weightKg, heightCm)

  return {
    value,
    category: getBMICategory(value),
  }
}

export const BMI_FORMULA =
  'BMI = weight (kg) ÷ [height (m)]²'

export const HEALTHY_BMI_EXPLANATION =
  'A healthy BMI typically falls between 18.5 and 24.9. BMI is a screening tool and does not diagnose body fatness or health. Consult a healthcare provider for personalized advice.'
