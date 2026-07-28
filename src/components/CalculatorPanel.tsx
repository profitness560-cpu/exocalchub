import type { ReactNode } from 'react'
import './CalculatorPanel.css'

interface CalculatorPanelProps {
  children: ReactNode
}

export function CalculatorPanel({ children }: CalculatorPanelProps) {
  return <div className="calculator-panel">{children}</div>
}
