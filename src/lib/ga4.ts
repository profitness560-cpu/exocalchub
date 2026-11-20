import { SITE_URL } from '../hooks/usePageMeta'

/**
 * Google Analytics 4 bridge.
 *
 * Env-gated: the Measurement ID comes from VITE_GA_MEASUREMENT_ID. When it
 * is not set, nothing is loaded and nothing is sent — the site works exactly
 * as before. Set it in .env.local (see .env.example) or as a Netlify/Vercel
 * environment variable; it is a public identifier, not a secret.
 *
 * Privacy: only page paths and calculator ids are ever sent. Calculator
 * input values, results and search contents beyond the calculator name are
 * never passed to analytics — the app's track() payloads contain no value
 * fields at all (see src/utils/analytics.ts).
 *
 * Page views: gtag is configured with send_page_view: false, and the App
 * sends exactly one page_view per route change (including the landing page).
 * That is what stops the SPA double-counting page views.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as
  | string
  | undefined

let initialized = false

export function isAnalyticsEnabled(): boolean {
  return Boolean(MEASUREMENT_ID)
}

export function getMeasurementId(): string | undefined {
  return MEASUREMENT_ID
}

export function initGA(): boolean {
  if (initialized) return true
  if (!MEASUREMENT_ID) return false
  window.dataLayer = window.dataLayer ?? []
  window.gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args)
  }
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  })
  initialized = true
  return true
}

/** One page_view per route change. page_location uses the canonical site
 *  URL so local/preview visits are recorded against the real page. */
export function trackPageView(path: string): void {
  if (!initialized || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: new URL(path, SITE_URL).href,
  })
}

export function trackGAEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (!initialized || !window.gtag) return
  window.gtag('event', name, params)
}
