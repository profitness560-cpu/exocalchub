import { describe, expect, it } from 'vitest'
import {
  HISTORY_MAX_ENTRIES,
  HISTORY_TTL_DAYS,
  isHistoryEntryExpired,
  pruneExpiredHistory,
  type RecentCalculation,
} from '../src/hooks/useRecentCalculations'

function entry(daysAgo: number, now: number): RecentCalculation {
  return {
    id: 'bmi',
    name: 'BMI Calculator',
    timestamp: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    inputs: { weight: '70', height: '175' },
    result: '22.86',
  }
}

describe('recent calculation history expiry (F5-06)', () => {
  const now = Date.parse('2026-11-20T12:00:00.000Z')

  it('keeps entries within the 30-day retention period', () => {
    expect(HISTORY_TTL_DAYS).toBe(30)
    expect(isHistoryEntryExpired(entry(0, now), now)).toBe(false)
    expect(isHistoryEntryExpired(entry(29, now), now)).toBe(false)
    // Exactly 30 days old is still within the period (expiry is "older than").
    expect(isHistoryEntryExpired(entry(30, now), now)).toBe(false)
  })

  it('expires entries older than 30 days', () => {
    expect(isHistoryEntryExpired(entry(31, now), now)).toBe(true)
    expect(isHistoryEntryExpired(entry(365, now), now)).toBe(true)
  })

  it('treats a missing or unparseable timestamp as expired', () => {
    expect(
      isHistoryEntryExpired({ ...entry(0, now), timestamp: '' }, now),
    ).toBe(true)
    expect(
      isHistoryEntryExpired({ ...entry(0, now), timestamp: 'not-a-date' }, now),
    ).toBe(true)
  })

  it('prunes only the expired entries and keeps the rest in order', () => {
    const kept = entry(5, now)
    const expired = entry(60, now)
    expect(pruneExpiredHistory([expired, kept, entry(40, now)], now)).toEqual([
      kept,
    ])
    expect(pruneExpiredHistory([], now)).toEqual([])
  })

  it('keeps the 12-entry cap', () => {
    expect(HISTORY_MAX_ENTRIES).toBe(12)
  })
})
