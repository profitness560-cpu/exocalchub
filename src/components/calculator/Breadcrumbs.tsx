import { Link } from 'react-router-dom'
import './Breadcrumbs.css'

interface BreadcrumbsProps {
  current: string
}

export function Breadcrumbs({ current }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link to="/">Home</Link>
      <span aria-hidden="true">/</span>
      <span>{current}</span>
    </nav>
  )
}
