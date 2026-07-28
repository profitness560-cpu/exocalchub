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

  if (calculator.path) {
    return (
      <Link to={calculator.path} className="calculator-card">
        {content}
      </Link>
    )
  }

  return (
    <a href={`#${calculator.id}`} className="calculator-card">
      {content}
    </a>
  )
}
