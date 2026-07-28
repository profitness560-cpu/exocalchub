import type { InputHTMLAttributes } from 'react'
import './FormField.css'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        className={`form-field__input${error ? ' form-field__input--error' : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...inputProps}
      />
      {error && (
        <p className="form-field__error" id={`${fieldId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
