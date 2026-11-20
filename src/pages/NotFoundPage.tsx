import { Link } from 'react-router-dom'
import { ContentPage } from '../components/ContentPage'
import { usePageMeta } from '../hooks/usePageMeta'

export function NotFoundPage() {
  usePageMeta({
    title: 'Page Not Found | ExoCalcHub',
    description: 'The page you requested could not be found on ExoCalcHub.',
    path: '/404',
    noindex: true,
  })

  return (
    <ContentPage title="Page not found" description="That page does not exist or may have moved.">
      <p>Try returning to the <Link to="/">ExoCalcHub homepage</Link> to find a calculator.</p>
    </ContentPage>
  )
}
