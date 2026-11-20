/**
 * ExoCalcHub — Scientific Calculator: safe expression parser (TypeScript)
 *
 * Integrated in Phase 2 from the separately developed repair package
 * (~/workspace/your_files/exocalchub-scientific-fix/, commit 0a9489a).
 * The original package was JavaScript; this file is the TypeScript port,
 * with the same parser, functions and tests — it was not rebuilt from scratch.
 *
 * It replaces the old Scientific Calculator calculation in
 * src/data/calculators.ts, which used a character-whitelist regex plus the
 * Function constructor to run user input as JavaScript. That code rejected
 * every letter (sqrt, sin, cos, log, ln, pi, e) and `^`, while `2**3`
 * worked only by accident.
 *
 * This parser uses no eval-style execution at all. It tokenises the input
 * and parses it with a recursive-descent parser (proper precedence,
 * parentheses, unary minus, right-associative ^/**), recognising only an
 * explicit allow-list of numbers, operators, functions and constants.
 *
 * Supported:
 *  Operators: + - * / % (modulo, and trailing % as percent)  ^ ** (power, right-assoc)
 *  Functions: sqrt(x) cbrt(x) root(x,n) sin cos tan asin acos atan
 *             log(x) [base 10, or log(x,base)] ln(x) log2(x)
 *             abs(x) exp(x) fact(x) / factorial(x) sq(x) cube(x) recip(x)
 *  Postfix:   x!  (factorial),  x%  (percent, when no right operand follows)
 *  Constants: pi, e
 *  Angle mode: 'deg' | 'rad' — default 'deg'. Trig functions convert degrees
 *  to radians when mode is 'deg'; inverse trig returns degrees in DEG mode.
 */

export type AngleMode = 'deg' | 'rad'

export class CalcError extends Error {
  code: string
  constructor(message: string, code = 'INVALID_EXPRESSION') {
    super(message)
    this.name = 'CalcError'
    this.code = code
  }
}

const FUNCTIONS_1 = new Set([
  'sqrt', 'cbrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'log', 'ln', 'log2', 'abs', 'exp', 'fact', 'factorial',
  'sq', 'cube', 'recip',
])
const FUNCTIONS_2 = new Set(['root', 'nthroot', 'log'])
const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E }

type Token =
  | { type: 'number'; value: number; raw: string }
  | { type: 'name'; value: string }
  | { type: 'op'; value: string }
  | { type: 'comma'; value: ',' }
  | { type: 'paren'; value: '(' | ')' }
  | { type: 'eof'; value: '' }

function tokenize(input: string): Token[] {
  const s = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/–/g, '-')
  const tokens: Token[] = []
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (/\s/.test(ch)) { i++; continue }
    if (/[0-9.]/.test(ch)) {
      let j = i
      let dots = 0
      while (j < s.length && /[0-9.]/.test(s[j])) {
        if (s[j] === '.') dots++
        j++
      }
      const raw = s.slice(i, j)
      if (dots > 1 || raw === '.' || raw === '') {
        throw new CalcError(`Invalid number "${raw}".`, 'INVALID_EXPRESSION')
      }
      const value = Number(raw)
      if (!Number.isFinite(value)) throw new CalcError(`Invalid number "${raw}".`, 'INVALID_EXPRESSION')
      tokens.push({ type: 'number', value, raw })
      i = j
      continue
    }
    if (/[a-zA-Z]/.test(ch)) {
      let j = i
      while (j < s.length && /[a-zA-Z0-9_]/.test(s[j])) j++
      tokens.push({ type: 'name', value: s.slice(i, j).toLowerCase() })
      i = j
      continue
    }
    if (s.startsWith('**', i)) { tokens.push({ type: 'op', value: '**' }); i += 2; continue }
    if ('+-*/%^!'.includes(ch)) { tokens.push({ type: 'op', value: ch }); i++; continue }
    if (ch === '(' || ch === ')') { tokens.push({ type: 'paren', value: ch }); i++; continue }
    if (ch === ',') { tokens.push({ type: 'comma', value: ',' }); i++; continue }
    throw new CalcError(`Invalid character "${ch}". Only numbers, operators, parentheses and named functions are allowed.`, 'INVALID_EXPRESSION')
  }
  tokens.push({ type: 'eof', value: '' })
  return tokens
}

function toRadians(angle: number, angleMode: AngleMode): number {
  return angleMode === 'deg' ? (angle * Math.PI) / 180 : angle
}
function fromRadians(angle: number, angleMode: AngleMode): number {
  return angleMode === 'deg' ? (angle * 180) / Math.PI : angle
}

function factorial(x: number): number {
  if (!Number.isInteger(x) || x < 0) {
    throw new CalcError('Factorial is only defined for whole numbers 0, 1, 2, …', 'DOMAIN_ERROR')
  }
  if (x > 170) throw new CalcError('Factorial result is too large (maximum 170!).', 'OVERFLOW')
  let r = 1
  for (let i = 2; i <= x; i++) r *= i
  return r
}

function applyFunction(name: string, args: number[], angleMode: AngleMode): number {
  const [x, y] = args
  switch (name) {
    case 'sqrt':
      if (x < 0) throw new CalcError('sqrt is not defined for negative numbers.', 'DOMAIN_ERROR')
      return Math.sqrt(x)
    case 'cbrt': return Math.cbrt(x)
    case 'root':
    case 'nthroot': {
      if (y === 0) throw new CalcError('Root degree cannot be zero.', 'DOMAIN_ERROR')
      if (x < 0 && Math.trunc(y) !== y) throw new CalcError('A negative number has no real root of this degree.', 'DOMAIN_ERROR')
      if (x < 0 && y % 2 === 0) throw new CalcError('An even root of a negative number is not a real number.', 'DOMAIN_ERROR')
      const r = Math.pow(Math.abs(x), 1 / y)
      return x < 0 ? -r : r
    }
    case 'sin': return Math.sin(toRadians(x, angleMode))
    case 'cos': return Math.cos(toRadians(x, angleMode))
    case 'tan': {
      const rad = toRadians(x, angleMode)
      const c = Math.cos(rad)
      if (Math.abs(c) < 1e-12) throw new CalcError('tan is not defined at 90 degrees (and 90 + 180k degrees).', 'DOMAIN_ERROR')
      return Math.tan(rad)
    }
    case 'asin':
      if (x < -1 || x > 1) throw new CalcError('asin is only defined for values between -1 and 1.', 'DOMAIN_ERROR')
      return fromRadians(Math.asin(x), angleMode)
    case 'acos':
      if (x < -1 || x > 1) throw new CalcError('acos is only defined for values between -1 and 1.', 'DOMAIN_ERROR')
      return fromRadians(Math.acos(x), angleMode)
    case 'atan': return fromRadians(Math.atan(x), angleMode)
    case 'log':
      if (args.length === 2) {
        if (x <= 0) throw new CalcError('log is not defined for zero or negative numbers.', 'DOMAIN_ERROR')
        if (y <= 0 || y === 1) throw new CalcError('Log base must be positive and not 1.', 'DOMAIN_ERROR')
        return Math.log(x) / Math.log(y)
      }
      if (x <= 0) throw new CalcError('log is not defined for zero or negative numbers.', 'DOMAIN_ERROR')
      return Math.log10(x)
    case 'ln':
      if (x <= 0) throw new CalcError('ln is not defined for zero or negative numbers.', 'DOMAIN_ERROR')
      return Math.log(x)
    case 'log2':
      if (x <= 0) throw new CalcError('log2 is not defined for zero or negative numbers.', 'DOMAIN_ERROR')
      return Math.log2(x)
    case 'abs': return Math.abs(x)
    case 'exp': return Math.exp(x)
    case 'fact':
    case 'factorial': return factorial(x)
    case 'sq': return x * x
    case 'cube': return x * x * x
    case 'recip':
      if (x === 0) throw new CalcError('Division by zero: 1 divided by 0 is not defined.', 'DIVISION_BY_ZERO')
      return 1 / x
    default:
      throw new CalcError(`Unknown function "${name}".`, 'INVALID_EXPRESSION')
  }
}

function checkFinite(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new CalcError('The expression does not produce a finite number.', 'INVALID_RESULT')
  }
  return value
}

/** Clean binary floating-point noise, e.g. sin(30 deg) 0.49999999999999994 -> 0.5. */
function cleanFloat(value: number): number {
  if (value === 0 || !Number.isFinite(value)) return value
  const cleaned = Number(value.toPrecision(12))
  return Number.isFinite(cleaned) ? cleaned : value
}

/** Parse and evaluate. Throws CalcError with a specific message on any failure. */
export function evaluateScientific(input: string, options: { angleMode?: AngleMode } = {}): number {
  const angleMode: AngleMode = options.angleMode === 'rad' ? 'rad' : 'deg'
  if (input == null || String(input).trim() === '') {
    throw new CalcError('Enter an expression (e.g. 2 + 2 * 5).', 'EMPTY_EXPRESSION')
  }
  const tokens = tokenize(String(input))
  let pos = 0
  const peek = (): Token => tokens[pos]
  const next = (): Token => tokens[pos++]
  const expectParenClose = (): void => {
    const t = next()
    if (t.type !== 'paren' || t.value !== ')') {
      throw new CalcError("Unmatched '(' — missing a closing parenthesis.", 'INVALID_EXPRESSION')
    }
  }

  function parseExpression(): number { return parseAddSub() }

  function parseAddSub(): number {
    let left = parseMulDiv()
    while (peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = (next() as { value: string }).value
      if (peek().type === 'op' && peek().value === '+') {
        throw new CalcError("Missing operand after '+'. '2++3' is not a valid expression.", 'INVALID_EXPRESSION')
      }
      const right = parseMulDiv()
      left = op === '+' ? left + right : left - right
      checkFinite(left)
    }
    return left
  }

  function parseMulDiv(): number {
    let left = parsePower()
    while (peek().type === 'op' && (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
      const op = (next() as { value: string }).value
      if (peek().type === 'op' && peek().value === '+') {
        throw new CalcError(`Missing operand after '${op}'.`, 'INVALID_EXPRESSION')
      }
      const right = parsePower()
      if (op === '*') left = left * right
      else if (op === '/') {
        if (right === 0) throw new CalcError('Division by zero: the expression does not produce a finite number.', 'DIVISION_BY_ZERO')
        left = left / right
      } else {
        if (right === 0) throw new CalcError('Division by zero: modulo by zero is not defined.', 'DIVISION_BY_ZERO')
        left = left % right
      }
      checkFinite(left)
    }
    return left
  }

  function parsePower(): number {
    const left = parseUnary()
    if (peek().type === 'op' && (peek().value === '^' || peek().value === '**')) {
      next()
      const right = parsePower() // right-associative: 2^3^2 = 2^(3^2) = 512
      return checkFinite(Math.pow(left, right))
    }
    return left
  }

  function parseUnary(): number {
    if (peek().type === 'op' && peek().value === '-') {
      next()
      return -parseUnary()
    }
    if (peek().type === 'op' && peek().value === '+') {
      const prev = tokens[pos - 1]
      if (pos === 0 || (prev && ((prev.type === 'paren' && prev.value === '(') || prev.type === 'comma'))) {
        next()
        return parseUnary()
      }
      throw new CalcError("Missing operand after '+'.", 'INVALID_EXPRESSION')
    }
    return parsePostfix()
  }

  function parsePostfix(): number {
    let value = parsePrimary()
    for (;;) {
      const t = peek()
      if (t.type === 'op' && t.value === '!') {
        next()
        value = factorial(value)
        checkFinite(value)
        continue
      }
      if (t.type === 'op' && t.value === '%') {
        const after = tokens[pos + 1]
        const isValueStart =
          after != null && (after.type === 'number' || after.type === 'name' || (after.type === 'paren' && after.value === '('))
        if (!isValueStart) {
          next()
          value = value / 100
          checkFinite(value)
          continue
        }
      }
      break
    }
    return value
  }

  function parsePrimary(): number {
    const t = next()
    if (t.type === 'number') return t.value
    if (t.type === 'paren' && t.value === '(') {
      const value = parseExpression()
      expectParenClose()
      return value
    }
    if (t.type === 'name') {
      const name = t.value
      if (peek().type === 'paren' && peek().value === '(') {
        next()
        const args: number[] = []
        if (!(peek().type === 'paren' && peek().value === ')')) {
          args.push(parseExpression())
          while (peek().type === 'comma') {
            next()
            args.push(parseExpression())
          }
        }
        expectParenClose()
        if (FUNCTIONS_2.has(name)) {
          if (name === 'log' && args.length !== 1 && args.length !== 2) {
            throw new CalcError('log takes 1 or 2 arguments: log(x) or log(x, base).', 'INVALID_EXPRESSION')
          }
          if (name !== 'log' && args.length !== 2) {
            throw new CalcError(`${name} takes 2 arguments.`, 'INVALID_EXPRESSION')
          }
          return checkFinite(applyFunction(name, args, angleMode))
        }
        if (FUNCTIONS_1.has(name)) {
          if (args.length !== 1) throw new CalcError(`${name} takes exactly 1 argument.`, 'INVALID_EXPRESSION')
          return checkFinite(applyFunction(name, args, angleMode))
        }
        throw new CalcError(`Unknown function "${name}".`, 'INVALID_EXPRESSION')
      }
      if (name in CONSTANTS) return CONSTANTS[name]
      throw new CalcError(`Unknown function or constant "${name}".`, 'INVALID_EXPRESSION')
    }
    if (t.type === 'eof') throw new CalcError('Missing operand: the expression ends unexpectedly.', 'INVALID_EXPRESSION')
    throw new CalcError('Invalid expression: check the expression and try again.', 'INVALID_EXPRESSION')
  }

  const value = parseExpression()
  if (peek().type !== 'eof') {
    const t = peek()
    if (t.type === 'paren' && t.value === ')') {
      throw new CalcError("Unmatched ')' — there is a closing parenthesis with no opening parenthesis.", 'INVALID_EXPRESSION')
    }
    throw new CalcError('Invalid expression: check the expression and try again.', 'INVALID_EXPRESSION')
  }
  return cleanFloat(checkFinite(value))
}

/** Format a result like the old site did: 8 decimal places, trailing zeros trimmed. */
export function formatResult(value: number, decimals = 8): string {
  if (!Number.isFinite(value)) throw new CalcError('The expression does not produce a finite number.', 'INVALID_RESULT')
  const rounded = Math.round(value * 10 ** decimals) / 10 ** decimals
  if (Object.is(rounded, -0)) return '0'
  return String(rounded)
}

export interface ScientificResult {
  headline: string
  details: string[]
  steps?: string[]
}

/**
 * Drop-in replacement for the old calculator's `calculate` function.
 * Returns the site's { headline, details, steps } shape and never throws.
 */
export function calculateScientific({ expression, angleMode = 'deg' }: { expression: string; angleMode?: AngleMode }): ScientificResult {
  const raw = String(expression ?? '')
  try {
    if (raw.trim() === '') {
      return { headline: 'Enter an expression', details: ['Enter an expression (e.g. 2 + 2 * 5).'], steps: [] }
    }
    const value = evaluateScientific(raw, { angleMode })
    const formatted = formatResult(value)
    return {
      headline: formatted,
      details: [`Expression evaluated using standard order of operations${angleMode === 'deg' ? ' (angles in degrees)' : ' (angles in radians)'}.`],
      steps: [`${raw.trim()} = ${formatted}`],
    }
  } catch (err) {
    if (err instanceof CalcError) {
      if (err.code === 'DIVISION_BY_ZERO' || err.code === 'INVALID_RESULT' || err.code === 'OVERFLOW') {
        return { headline: 'Invalid result', details: [err.message], steps: [] }
      }
      return { headline: 'Invalid expression', details: [err.message], steps: [] }
    }
    return { headline: 'Invalid expression', details: ['Check the expression and try again.'], steps: [] }
  }
}

export const SCIENTIFIC_FUNCTIONS = [...FUNCTIONS_1, ...FUNCTIONS_2]
export const SCIENTIFIC_CONSTANTS = Object.keys(CONSTANTS)
