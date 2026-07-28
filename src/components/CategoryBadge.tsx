import type { BMICategoryVariant } from '../calculators/bmi'
import './CategoryBadge.css'

interface CategoryBadgeProps {
  label: string
  variant: BMICategoryVariant
}

export function CategoryBadge({ label, variant }: CategoryBadgeProps) {
  return (
    <span className={`category-badge category-badge--${variant}`}>
      {label}
    </span>
  )
}
