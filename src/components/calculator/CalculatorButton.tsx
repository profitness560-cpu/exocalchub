import type { ButtonHTMLAttributes } from 'react'
import { Button } from '../Button'

interface CalculatorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function CalculatorButton(props: CalculatorButtonProps) {
  return <Button {...props} />
}
