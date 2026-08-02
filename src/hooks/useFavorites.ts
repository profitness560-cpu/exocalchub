import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const FAVORITES_KEY = 'exocalchub:favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, [])
  const toggleFavorite = useCallback((id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]), [setFavorites])
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])
  return { favorites, toggleFavorite, isFavorite, clearFavorites: () => setFavorites([]) }
}
