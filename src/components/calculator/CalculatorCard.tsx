import type { ReactNode } from 'react'
import '../CalculatorPanel.css'

interface CalculatorCardProps {
  children: ReactNode
}

export function CalculatorCard({ children }: CalculatorCardProps) {
  return <div className="calculator-panel">{children}</div>
}
