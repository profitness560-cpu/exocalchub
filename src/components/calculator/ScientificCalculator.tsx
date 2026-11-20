import { useRef, useState } from 'react'
import { calculateScientific, type AngleMode } from '../../lib/scientificParser'
import './ScientificCalculator.css'

/**
 * Scientific Calculator keypad (Phase 2 integration).
 * Ported from the repair package's ScientificCalculator.jsx to TypeScript
 * and to this app's CSS variables (no Tailwind — the app does not use it).
 *
 * Buttons insert the correct expression text (sin -> "sin(", sqrt -> "sqrt(",
 * pi -> "pi"). Keyboard typing still works in the expression box; Enter
 * calculates, Esc clears. DEG/RAD applies to sin/cos/tan and asin/acos/atan.
 * Clear resets expression + result; Delete removes the last character.
 */
export function ScientificCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [steps, setSteps] = useState('')
  const [angleMode, setAngleMode] = useState<AngleMode>('deg')
  const inputRef = useRef<HTMLInputElement>(null)

  const insert = (text: string) => {
    setExpression((prev) => prev + text)
    setError('')
    inputRef.current?.focus()
  }

  const doCalculate = () => {
    const out = calculateScientific({ expression, angleMode })
    if (out.headline === 'Invalid expression' || out.headline === 'Invalid result' || out.headline === 'Enter an expression') {
      setError(out.details[0] ?? 'Check the expression and try again.')
      setResult('')
      setSteps('')
    } else {
      setResult(out.headline)
      setSteps(out.steps?.[0] ?? '')
      setError('')
    }
  }

  const doClear = () => {
    setExpression('')
    setResult('')
    setError('')
    setSteps('')
    inputRef.current?.focus()
  }

  const doDelete = () => {
    setExpression((prev) => prev.slice(0, -1))
    setError('')
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') { event.preventDefault(); doCalculate() }
    if (event.key === 'Escape') { event.preventDefault(); doClear() }
  }

  const keys: Array<{ label: string; insert: string; kind: 'fn' | 'num' | 'eq' | 'action'; aria: string }> = [
    { label: 'sin', insert: 'sin(', kind: 'fn', aria: 'sine' },
    { label: 'cos', insert: 'cos(', kind: 'fn', aria: 'cosine' },
    { label: 'tan', insert: 'tan(', kind: 'fn', aria: 'tangent' },
    { label: 'sin⁻¹', insert: 'asin(', kind: 'fn', aria: 'inverse sine' },
    { label: 'cos⁻¹', insert: 'acos(', kind: 'fn', aria: 'inverse cosine' },
    { label: 'tan⁻¹', insert: 'atan(', kind: 'fn', aria: 'inverse tangent' },
    { label: '√', insert: 'sqrt(', kind: 'fn', aria: 'square root' },
    { label: 'xʸ', insert: '^', kind: 'fn', aria: 'power' },
    { label: 'log', insert: 'log(', kind: 'fn', aria: 'log base 10' },
    { label: 'ln', insert: 'ln(', kind: 'fn', aria: 'natural log' },
    { label: 'π', insert: 'pi', kind: 'fn', aria: 'pi' },
    { label: 'e', insert: 'e', kind: 'fn', aria: 'euler number' },
    { label: 'x!', insert: '!', kind: 'fn', aria: 'factorial' },
    { label: '|x|', insert: 'abs(', kind: 'fn', aria: 'absolute value' },
    { label: 'exp', insert: 'exp(', kind: 'fn', aria: 'exponential' },
    { label: '(', insert: '(', kind: 'fn', aria: 'open parenthesis' },
    { label: ')', insert: ')', kind: 'fn', aria: 'close parenthesis' },
    { label: '%', insert: '%', kind: 'fn', aria: 'percent' },
    { label: '⌫', insert: 'DEL', kind: 'action', aria: 'delete last character' },
    { label: 'C', insert: 'CLR', kind: 'action', aria: 'clear' },
    { label: '7', insert: '7', kind: 'num', aria: '7' },
    { label: '8', insert: '8', kind: 'num', aria: '8' },
    { label: '9', insert: '9', kind: 'num', aria: '9' },
    { label: '÷', insert: '/', kind: 'num', aria: 'divide' },
    { label: 'x²', insert: 'sq(', kind: 'num', aria: 'square' },
    { label: '4', insert: '4', kind: 'num', aria: '4' },
    { label: '5', insert: '5', kind: 'num', aria: '5' },
    { label: '6', insert: '6', kind: 'num', aria: '6' },
    { label: '×', insert: '*', kind: 'num', aria: 'multiply' },
    { label: 'x³', insert: 'cube(', kind: 'num', aria: 'cube' },
    { label: '1', insert: '1', kind: 'num', aria: '1' },
    { label: '2', insert: '2', kind: 'num', aria: '2' },
    { label: '3', insert: '3', kind: 'num', aria: '3' },
    { label: '−', insert: '-', kind: 'num', aria: 'subtract' },
    { label: '1/x', insert: 'recip(', kind: 'num', aria: 'reciprocal' },
    { label: '0', insert: '0', kind: 'num', aria: '0' },
    { label: '.', insert: '.', kind: 'num', aria: 'decimal point' },
    { label: '=', insert: '=', kind: 'eq', aria: 'equals' },
    { label: '+', insert: '+', kind: 'num', aria: 'add' },
    { label: 'ⁿ√', insert: 'root(', kind: 'fn', aria: 'nth root' },
  ]

  return (
    <div className="scientific-calculator">
      <div className="scientific-calculator__top">
        <div className="scientific-calculator__mode" role="group" aria-label="Angle mode">
          <button type="button" aria-pressed={angleMode === 'deg'} className={angleMode === 'deg' ? 'scientific-calculator__mode-btn scientific-calculator__mode-btn--on' : 'scientific-calculator__mode-btn'} onClick={() => setAngleMode('deg')}>DEG</button>
          <button type="button" aria-pressed={angleMode === 'rad'} className={angleMode === 'rad' ? 'scientific-calculator__mode-btn scientific-calculator__mode-btn--on' : 'scientific-calculator__mode-btn'} onClick={() => setAngleMode('rad')}>RAD</button>
        </div>
      </div>
      <label className="scientific-calculator__label" htmlFor="scientific-expression">Expression (e.g. 2 + 2 × 5)</label>
      <input
        id="scientific-expression"
        ref={inputRef}
        className="scientific-calculator__input"
        type="text"
        value={expression}
        onChange={(event) => { setExpression(event.target.value); setError('') }}
        onKeyDown={onKeyDown}
        placeholder="2 + 2 × 5"
        aria-label="Mathematical expression"
      />
      <div className="scientific-calculator__result" aria-live="polite">
        {error ? (
          <p className="scientific-calculator__error">{error}</p>
        ) : result ? (
          <>
            <p className="scientific-calculator__result-label">Result</p>
            <p className="scientific-calculator__result-value">{result}</p>
            {steps && <p className="scientific-calculator__steps">{steps}</p>}
          </>
        ) : (
          <p className="scientific-calculator__placeholder">Complete the fields to see a clear, calculated result.</p>
        )}
      </div>
      <div className="scientific-calculator__pad" role="group" aria-label="Scientific keypad">
        {keys.map((key) => (
          <button
            key={key.label}
            type="button"
            className={`scientific-calculator__key scientific-calculator__key--${key.kind}`}
            aria-label={key.aria}
            onClick={() => {
              if (key.insert === '=') doCalculate()
              else if (key.insert === 'CLR') doClear()
              else if (key.insert === 'DEL') doDelete()
              else insert(key.insert)
            }}
          >
            {key.label}
          </button>
        ))}
      </div>
      <p className="scientific-calculator__hint">
        Angles in {angleMode === 'deg' ? 'degrees' : 'radians'}. Type an expression or tap the keypad.
        Press Enter to calculate, Esc to clear. Powers use ^, e.g. 2^3 = 8.
      </p>
    </div>
  )
}
