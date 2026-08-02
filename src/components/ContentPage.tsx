import type { ReactNode } from 'react'
import { PageHeader } from './PageHeader'
import './ContentPage.css'

interface ContentPageProps {
  title: string
  description: string
  children: ReactNode
}

export function ContentPage({ title, description, children }: ContentPageProps) {
  return (
    <article className="content-page">
      <PageHeader title={title} description={description} />
      <div className="content-page__body">{children}</div>
    </article>
  )
}
