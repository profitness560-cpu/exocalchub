import type { ReactNode } from 'react'
import { PageHeader } from '../PageHeader'
import { Breadcrumbs } from './Breadcrumbs'
import './CalculatorLayout.css'

interface CalculatorLayoutProps {
  title: string
  description: string
  breadcrumbLabel?: string
  children: ReactNode
}

export function CalculatorLayout({
  title,
  description,
  breadcrumbLabel,
  children,
}: CalculatorLayoutProps) {
  return (
    <div className="calculator-layout">
      {breadcrumbLabel && <Breadcrumbs current={breadcrumbLabel} />}
      <PageHeader title={title} description={description} />
      {children}
    </div>
  )
}
