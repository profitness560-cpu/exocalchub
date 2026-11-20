import { useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface RecentCalculation { id: string; name: string; timestamp: string; inputs: Record<string, string>; result: string }
const HISTORY_KEY = 'exocalchub:recent-calculations'

/** Recent calculations are kept for 30 days (finding F5-06, Phase 5 audit).
 *  Health-related inputs and results (e.g. BMI, body fat) sit in this
 *  history, so it must not grow without bound on shared devices. */
export const HISTORY_TTL_DAYS = 30
export const HISTORY_MAX_ENTRIES = 12
const HISTORY_TTL_MS = HISTORY_TTL_DAYS * 24 * 60 * 60 * 1000

/**
 * An entry is expired when its timestamp is missing, unparseable, or more
 * than HISTORY_TTL_DAYS old. Entries written before this change already
 * carry ISO timestamps, so migration needs no special case: on first load
 * after the update, entries within the retention period are kept with
 * their original timestamps and only entries past 30 days are removed.
 * Nothing else is deleted — the 12-entry cap and Clear History are
 * unchanged, and no history is ever sent anywhere (see the Privacy Policy).
 */
export function isHistoryEntryExpired(entry: RecentCalculation, now: number = Date.now()): boolean {
  const time = Date.parse(entry.timestamp)
  if (Number.isNaN(time)) return true
  return now - time > HISTORY_TTL_MS
}

export function pruneExpiredHistory(entries: RecentCalculation[], now: number = Date.now()): RecentCalculation[] {
  return entries.filter((entry) => !isHistoryEntryExpired(entry, now))
}

export function useRecentCalculations() {
  const [history, setHistory] = useLocalStorage<RecentCalculation[]>(HISTORY_KEY, [])
  // Expired entries are hidden immediately and removed from storage by
  // the effect below, so they never reappear on the next visit.
  const visibleHistory = useMemo(() => pruneExpiredHistory(history), [history])
  useEffect(() => {
    if (visibleHistory.length !== history.length) setHistory(visibleHistory)
  }, [visibleHistory, history, setHistory])
  const addCalculation = useCallback((item: Omit<RecentCalculation, 'timestamp'>) => setHistory((current) => [{ ...item, timestamp: new Date().toISOString() }, ...pruneExpiredHistory(current).filter((entry) => entry.id !== item.id)].slice(0, HISTORY_MAX_ENTRIES)), [setHistory])
  return { history: visibleHistory, addCalculation, clearHistory: () => setHistory([]) }
}
