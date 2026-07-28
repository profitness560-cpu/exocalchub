import { useCallback } from 'react'
import { Hero } from '../components/Hero'
import { SearchBar } from '../components/SearchBar'
import { CalculatorCard } from '../components/CalculatorCard'
import { Categories } from '../components/Categories'
import { calculators } from '../data/calculators'
import { categories } from '../data/categories'
import { useSearch } from '../hooks/useSearch'
import { filterCalculators } from '../utils/filterCalculators'
import './HomePage.css'

export function HomePage() {
  const filterFn = useCallback(
    (calculator: (typeof calculators)[number], query: string) =>
      filterCalculators(calculator, query),
    [],
  )

  const { query, setQuery, filteredItems } = useSearch(calculators, filterFn)

  return (
    <>
      <Hero />
      <SearchBar value={query} onChange={setQuery} />

      <section className="calculators" id="calculators">
        <div className="calculators__header">
          <h2 className="calculators__title">Popular calculators</h2>
          {query && (
            <p className="calculators__count">
              {filteredItems.length} result
              {filteredItems.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {filteredItems.length > 0 ? (
          <div className="calculators__grid">
            {filteredItems.map((calculator) => (
              <CalculatorCard key={calculator.id} calculator={calculator} />
            ))}
          </div>
        ) : (
          <p className="calculators__empty">
            No calculators match your search. Try a different keyword.
          </p>
        )}
      </section>

      <Categories categories={categories} />
    </>
  )
}
