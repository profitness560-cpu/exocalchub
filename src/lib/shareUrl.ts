import type { Calculator } from '../data/calculators'

/**
 * Share URLs (finding F5-09, Phase 5 audit).
 *
 * The old share link carried `?result=<headline>`, but nothing in the app
 * ever read it, so a shared link opened the calculator without the result.
 * The new link carries the calculator's *inputs* instead, e.g.
 * `/calculators/loan?principal=10000&rate=12&years=1`.
 *
 * Safety: nothing from the URL is ever rendered as a result. On open, the
 * page takes only parameters whose names match this calculator's fields,
 * validates them with the same rules as the form (required, numeric,
 * min/max, allowed select values), and recomputes the result from them.
 * Invalid, missing or extra parameters are ignored — the page simply opens
 * with its defaults. A crafted link can therefore never inject content or
 * a fake result. Old `?result=` links degrade gracefully to the plain
 * calculator page, because `result` is not a field name.
 */
export function buildShareUrl(
  calculator: Calculator,
  values: Record<string, string>,
): string {
  const params = new URLSearchParams()
  for (const field of calculator.fields) {
    const value = (values[field.id] ?? '').trim()
    if (value) params.set(field.id, value)
  }
  const query = params.toString()
  return `${window.location.origin}${calculator.path}${query ? `?${query}` : ''}`
}

export function parseSharedValues(
  search: string,
  calculator: Calculator,
): Record<string, string> | null {
  const params = new URLSearchParams(search)
  const known = new Set(calculator.fields.map((field) => field.id))
  const values: Record<string, string> = {}
  for (const [key, value] of params) {
    if (known.has(key) && value.trim()) values[key] = value
  }
  return Object.keys(values).length > 0 ? values : null
}
