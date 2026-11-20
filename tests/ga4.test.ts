import { describe, expect, it } from 'vitest'
import { getMeasurementId, initGA, isAnalyticsEnabled, trackGAEvent, trackPageView } from '../src/lib/ga4'

describe('GA4 bridge (Phase 4)', () => {
  it('is inactive when no Measurement ID is configured: nothing loads, nothing is sent', () => {
    expect(getMeasurementId()).toBeUndefined()
    expect(isAnalyticsEnabled()).toBe(false)
    expect(initGA()).toBe(false)
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull()
    expect(window.dataLayer).toBeUndefined()
    // These must be safe no-ops, not errors.
    expect(() => trackPageView('/calculators/bmi')).not.toThrow()
    expect(() => trackGAEvent('calculator_use', { calculator_id: 'bmi' })).not.toThrow()
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull()
  })
})
