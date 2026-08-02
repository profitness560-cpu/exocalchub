export type AnalyticsEvent = 'search' | 'calculator_use' | 'favorite' | 'share' | 'error'
export interface AnalyticsPayload { id?: string; query?: string; message?: string }
export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  window.dispatchEvent(new CustomEvent('exocalchub:analytics', { detail: { event, payload, timestamp: Date.now() } }))
}
