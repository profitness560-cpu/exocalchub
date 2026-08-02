import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type ThemePreference = 'light' | 'dark' | 'system'
export function useTheme() {
  const [preference, setPreference] = useLocalStorage<ThemePreference>('exocalchub:theme', 'system')
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference
    apply(); media.addEventListener('change', apply); return () => media.removeEventListener('change', apply)
  }, [preference])
  return { preference, setPreference }
}
