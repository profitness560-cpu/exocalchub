import { useMemo, useState } from 'react'

export function useSearch<T>(
  items: T[],
  filterFn: (item: T, query: string) => boolean,
) {
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return items
    return items.filter((item) => filterFn(item, trimmed))
  }, [items, query, filterFn])

  return { query, setQuery, filteredItems }
}
