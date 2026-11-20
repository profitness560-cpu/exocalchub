import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { calculatorMap, type Calculator } from '../data/calculators'
import { usePageMeta } from '../hooks/usePageMeta'
import { breadcrumbList, faqPage } from '../lib/structuredData'
import { buildShareUrl, parseSharedValues } from '../lib/shareUrl'
import { validateFieldValues } from '../lib/fieldValidation'
import { useFavorites } from '../hooks/useFavorites'
import { useRecentCalculations } from '../hooks/useRecentCalculations'
import { track } from '../utils/analytics'
import { FavoriteButton } from '../components/FavoriteButton'
import { ResultCard } from '../components/ResultCard'
import { FAQ } from '../components/FAQ'
import { Formula } from '../components/Formula'
import './CalculatorPage.css'

interface CalculatorPageProps { calculator: Calculator }

export function CalculatorPage({ calculator }: CalculatorPageProps) {
  // Shared-link restoration (finding F5-09): a link built by buildShareUrl
  // carries the calculator's inputs. Only known field names are accepted,
  // they are validated exactly like form input, and the result is
  // recomputed — never taken from the URL. Invalid or missing parameters
  // are ignored and the page opens with its defaults. This is derived
  // initial state, not an effect, so no state is set after mount. A
  // restored result is not recorded in history and no calculator_use event
  // is sent for it — it is not a new calculation by this visitor.
  const [sharedValues] = useState<Record<string, string> | null>(() => {
    const shared = parseSharedValues(window.location.search, calculator)
    if (!shared) return null
    const { errors } = validateFieldValues(calculator, shared)
    return Object.keys(errors).length ? null : shared
  })
  const [values, setValues] = useState<Record<string, string>>(() => sharedValues ?? Object.fromEntries(calculator.fields.map((field) => [field.id, field.defaultValue ?? ''])))
  const [result, setResult] = useState<ReturnType<Calculator['calculate']> | null>(() => {
    if (!sharedValues) return null
    const { numeric } = validateFieldValues(calculator, sharedValues)
    return calculator.calculate(numeric)
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addCalculation } = useRecentCalculations()
  usePageMeta({
    title: `${calculator.name} | ExoCalcHub`,
    description: calculator.description,
    path: calculator.path,
    structuredData: [
      breadcrumbList([
        { name: 'Home', path: '/' },
        { name: calculator.name, path: calculator.path },
      ]),
      faqPage(calculator.faq),
    ],
  })

  function calculate() {
    const { numeric, errors: nextErrors } = validateFieldValues(calculator, values)
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setResult(null); track('error', { id: calculator.id }); return }
    const nextResult = calculator.calculate(numeric); setErrors({}); setResult(nextResult); track('calculator_use', { id: calculator.id }); addCalculation({ id: calculator.id, name: calculator.name, inputs: values, result: nextResult.headline })
  }

  function reset() { setValues(Object.fromEntries(calculator.fields.map((field) => [field.id, field.defaultValue ?? '']))); setErrors({}); setResult(null) }
  const related = calculator.related.map((id) => calculatorMap.get(id)).filter(Boolean)

  return <article className="calculator-page">
    <div className="calculator-page__title-row"><PageHeader title={calculator.name} description={calculator.description} /><FavoriteButton active={isFavorite(calculator.id)} onClick={() => toggleFavorite(calculator.id)} /></div>
    <div className="calculator-page__layout">
      <section className="calculator-panel" aria-labelledby="calculator-inputs-title">
        <h2 id="calculator-inputs-title">Enter your details</h2>
        <div className="calculator-page__form">
          {calculator.fields.map((field) => <div className="calculator-page__field" key={field.id}>
            <label htmlFor={`field-${field.id}`}>{field.label}{field.unit ? ` (${field.unit})` : ''}</label>
            {field.type === 'select' ? (
              <select id={`field-${field.id}`} value={values[field.id]} onChange={(event) => setValues({ ...values, [field.id]: event.target.value })} aria-invalid={Boolean(errors[field.id])} aria-describedby={errors[field.id] ? `error-${field.id}` : undefined}>
                {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            ) : (
              <input id={`field-${field.id}`} type={field.id === 'expression' ? 'text' : 'number'} inputMode={field.id === 'expression' ? 'text' : 'decimal'} value={values[field.id]} min={field.min} max={field.max} step={field.step} onChange={(event) => setValues({ ...values, [field.id]: event.target.value })} aria-invalid={Boolean(errors[field.id])} aria-describedby={errors[field.id] ? `error-${field.id}` : undefined} />
            )}
            {errors[field.id] && <span className="calculator-page__error" id={`error-${field.id}`} role="alert">{errors[field.id]}</span>}
          </div>)}
          <div className="calculator-page__actions"><Button type="button" onClick={calculate}>Calculate</Button><Button type="button" variant="secondary" onClick={reset}>Reset</Button></div>
        </div>
      </section>
      <ResultCard title={result?.headline ?? 'Your result'} onCopy={result ? () => navigator.clipboard?.writeText(result.headline) : undefined} onShare={result ? () => { const url = buildShareUrl(calculator, values); navigator.share?.({ title: calculator.name, url }).catch(() => navigator.clipboard?.writeText(url)); track('share', { id: calculator.id }) } : undefined} onPrint={result ? () => window.print() : undefined}>{result ? <><ul>{result.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>{result.steps && <><h3>Calculation steps</h3><ul>{result.steps.map((step) => <li key={step}>{step}</li>)}</ul></>}</> : <p>Complete the fields to see a clear, calculated result.</p>}<Formula>{calculator.formula}</Formula></ResultCard>
    </div>
    <section className="calculator-page__details" aria-labelledby="calculator-faq-title">
      <h2>About this calculator</h2><p>{calculator.description} Review the formula and steps above to understand the estimate.</p>
      <h2 id="calculator-faq-title">Frequently asked questions</h2><FAQ items={calculator.faq} />
      {related.length > 0 && <><h2>Related calculators</h2><ul className="calculator-page__related">{related.map((item) => item && <li key={item.id}><Link to={item.path}>{item.name}</Link></li>)}</ul></>}
    </section>
  </article>
}
