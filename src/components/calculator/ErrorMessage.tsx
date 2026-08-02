interface ErrorMessageProps {
  id?: string
  message: string
}

export function ErrorMessage({ id, message }: ErrorMessageProps) {
  return (
    <p className="form-field__error" id={id} role="alert">
      {message}
    </p>
  )
}
