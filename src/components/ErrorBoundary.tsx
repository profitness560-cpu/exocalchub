import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { track } from '../utils/analytics'

interface Props { children: ReactNode }
interface State { hasError: boolean }
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(): State { return { hasError: true } }
  componentDidCatch(error: Error, info: ErrorInfo) {
    void info
    track('error', { message: error.message })
  }
  render() { return this.state.hasError ? <main className="error-page"><h1>Something went wrong</h1><p>We could not load this page. Try returning home and starting again.</p><Link to="/">Return home</Link></main> : this.props.children }
}
