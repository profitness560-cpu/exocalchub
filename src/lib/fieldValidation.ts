import type { Calculator } from '../data/calculators'

// Field validation, shared by the form and by shared-link restoration.
// Same rules in both paths: required, numeric (finite), within min/max.
// Select fields carry numeric option values, so Number() covers them too.
// A select value must additionally be one of the field's actual permitted
// option values: a merely numeric, in-range value is not enough. Without
// this, a shared link like ?unit=0.5 (in range 0–1, but not an option)
// would be accepted and silently treated as the truthy option, and a
// field with non-contiguous options would accept values between them.
// The 'expression' field (Scientific, dedicated page) passes its raw text
// through to the safe parser; it is never executed.
export function validateFieldValues(
  calculator: Calculator,
  values: Record<string, string>,
): { numeric: Record<string, number>; errors: Record<string, string> } {
  const nextErrors: Record<string, string> = {}
  const numeric: Record<string, number> = {}
  for (const field of calculator.fields) {
    const raw = values[field.id]?.trim() ?? ''
    if (!raw) {
      nextErrors[field.id] = `Enter ${field.label.toLowerCase()}.`
      continue
    }
    if (field.id === 'expression') {
      numeric[field.id] = raw as unknown as number
      continue
    }
    const value = Number(raw)
    if (!Number.isFinite(value)) nextErrors[field.id] = 'Enter a valid number.'
    else if (
      field.type === 'select' &&
      !field.options?.some((option) => option.value === value)
    )
      nextErrors[field.id] = 'Select a valid option.'
    else if (field.min !== undefined && value < field.min)
      nextErrors[field.id] = `Must be at least ${field.min}.`
    else if (field.max !== undefined && value > field.max)
      nextErrors[field.id] = `Must be no more than ${field.max}.`
    else numeric[field.id] = value
  }
  return { numeric, errors: nextErrors }
}
