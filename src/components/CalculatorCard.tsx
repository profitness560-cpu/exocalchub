import { Link } from 'react-router-dom'
import type { Calculator } from '../data/calculators'
import './CalculatorCard.css'

interface CalculatorCardProps {
  calculator: Calculator
}

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const content = (
    <>
      <span className="calculator-card__icon" aria-hidden="true">
        {calculator.icon}
      </span>
      <h3 className="calculator-card__title">{calculator.name}</h3>
      <p className="calculator-card__description">{calculator.description}</p>
      <span className="calculator-card__category">{calculator.category}</span>
    </>
  )

  return calculator.path ? (
    <Link to={calculator.path} className="calculator-card">
      {content}
      <span className="calculator-card__action">Open calculator →</span>
    </Link>
  ) : (
    <div className="calculator-card calculator-card--coming-soon" aria-disabled="true">
      {content}
      <span className="calculator-card__action">Coming soon</span>
    </div>
  )
}
