import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface RecentCalculation { id: string; name: string; timestamp: string; inputs: Record<string, string>; result: string }
const HISTORY_KEY = 'exocalchub:recent-calculations'

export function useRecentCalculations() {
  const [history, setHistory] = useLocalStorage<RecentCalculation[]>(HISTORY_KEY, [])
  const addCalculation = useCallback((item: Omit<RecentCalculation, 'timestamp'>) => setHistory((current) => [{ ...item, timestamp: new Date().toISOString() }, ...current.filter((entry) => entry.id !== item.id)].slice(0, 12)), [setHistory])
  return { history, addCalculation, clearHistory: () => setHistory([]) }
}
