import './FormulaSection.css'

interface FormulaSectionProps {
  title?: string
  formula: string
}

export function FormulaSection({
  title = 'Formula',
  formula,
}: FormulaSectionProps) {
  return (
    <div className="formula-section">
      <h3 className="formula-section__title">{title}</h3>
      <p className="formula-section__text">{formula}</p>
    </div>
  )
}
