export type BMICategoryVariant =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese'

export interface BMICategoryInfo {
  label: string
  variant: BMICategoryVariant
  range: string
}

export interface BMIResult {
  value: number
  category: BMICategoryInfo
}

export interface BMIFormValues {
  height: string
  weight: string
}

export interface BMIValidationErrors {
  height?: string
  weight?: string
}
