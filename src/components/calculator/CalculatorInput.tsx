import type { InputHTMLAttributes } from 'react'
import { FormField } from '../FormField'

interface CalculatorInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function CalculatorInput(props: CalculatorInputProps) {
  return <FormField {...props} />
}
