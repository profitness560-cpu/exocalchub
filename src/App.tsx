import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { InfoPage } from './pages/InfoPages'
import { NotFoundPage } from './pages/NotFoundPage'
import { CalculatorPage } from './pages/CalculatorPage'
import { BMICalculatorPage } from './pages/BMICalculatorPage'
import { MortgageCalculatorPage } from './pages/MortgageCalculatorPage'
import { ScientificCalculatorPage } from './pages/ScientificCalculatorPage'
import { calculators } from './data/calculators'
import { initGA, trackGAEvent, trackPageView } from './lib/ga4'

const dedicatedCalculatorIds = new Set(['bmi', 'mortgage', 'scientific'])

// Phase 2: the SPA did not scroll to the top on navigation, so a calculator
// page opened scrolled down at the previous page's position.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// GA4 bridge (Phase 4): initialises analytics once, sends exactly one
// page_view per route change, and forwards the app's own analytics events
// (src/utils/analytics.ts) to GA4. Calculator ids only — never input values.
function AnalyticsBridge() {
  const { pathname } = useLocation()
  useEffect(() => {
    initGA()
  }, [])
  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])
  useEffect(() => {
    const handler = (event: Event) => {
      const { event: name, payload } = (event as CustomEvent<{
        event: string
        payload: { id?: string; query?: string; message?: string }
      }>).detail
      if (name === 'calculator_use') trackGAEvent('calculator_use', { calculator_id: payload.id })
      else if (name === 'search') trackGAEvent('search', { search_term: payload.query })
      else if (name === 'favorite') trackGAEvent('favorite', { calculator_id: payload.id })
      else if (name === 'share') trackGAEvent('share', { calculator_id: payload.id })
      else if (name === 'error') trackGAEvent('error', { calculator_id: payload.id })
    }
    window.addEventListener('exocalchub:analytics', handler)
    return () => window.removeEventListener('exocalchub:analytics', handler)
  }, [])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnalyticsBridge />
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route path="/about" element={<MainLayout><InfoPage kind="about" /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><InfoPage kind="privacy" /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><InfoPage kind="terms" /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><InfoPage kind="contact" /></MainLayout>} />
        <Route path="/disclaimer" element={<MainLayout><InfoPage kind="disclaimer" /></MainLayout>} />
        <Route
          path="/calculators/bmi"
          element={
            <MainLayout>
              <BMICalculatorPage />
            </MainLayout>
          }
        />
        <Route
          path="/calculators/scientific"
          element={
            <MainLayout>
              <ScientificCalculatorPage />
            </MainLayout>
          }
        />
        <Route
          path="/calculators/mortgage"
          element={
            <MainLayout>
              <MortgageCalculatorPage />
            </MainLayout>
          }
        />
        {calculators
          .filter((calculator) => !dedicatedCalculatorIds.has(calculator.id))
          .map((calculator) => (
            <Route
              key={calculator.id}
              path={calculator.path}
              element={
                <MainLayout>
                  <CalculatorPage calculator={calculator} />
                </MainLayout>
              }
            />
          ))}
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
