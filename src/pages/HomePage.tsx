import { useCallback } from 'react'
import { Hero } from '../components/Hero'
import { SearchBar } from '../components/SearchBar'
import { CalculatorCard } from '../components/CalculatorCard'
import { Categories } from '../components/Categories'
import { calculators } from '../data/calculators'
import { visibleCategories } from '../data/categories'
import { useSearch } from '../hooks/useSearch'
import { filterCalculators } from '../utils/filterCalculators'
import './HomePage.css'
import { usePageMeta } from '../hooks/usePageMeta'
import { useFavorites } from '../hooks/useFavorites'
import { useRecentCalculations } from '../hooks/useRecentCalculations'

export function HomePage() {
  usePageMeta({
    title: 'ExoCalcHub — Free Online Calculators',
    description: 'Fast, clear online calculators for health, finance, math, and everyday decisions.',
    path: '/',
  })
  const filterFn = useCallback(
    (calculator: (typeof calculators)[number], query: string) =>
      filterCalculators(calculator, query),
    [],
  )

  const { query, setQuery, filteredItems } = useSearch(calculators, filterFn)
  const featured = calculators.filter((calculator) => ['bmi', 'loan', 'percentage', 'length'].includes(calculator.id))
  const recent = calculators.slice(-4)
  const { favorites } = useFavorites()
  const { history, clearHistory } = useRecentCalculations()
  const favoriteCalculators = calculators.filter((calculator) => favorites.includes(calculator.id))

  return (
    <>
      <Hero />
      <SearchBar value={query} onChange={setQuery} />

      {!query && favoriteCalculators.length > 0 && <section className="home-showcase" aria-labelledby="favorites-title"><div className="home-showcase__header"><h2 id="favorites-title">Your favorites</h2><p>Saved on this device for quick access.</p></div><div className="calculators__grid">{favoriteCalculators.map((calculator) => <CalculatorCard key={calculator.id} calculator={calculator} />)}</div></section>}

      {!query && <section className="home-showcase" aria-labelledby="featured-title">
        <div className="home-showcase__header"><p className="home-showcase__eyebrow">Start here</p><h2 id="featured-title">Featured calculators</h2><p>Trusted starting points for your next decision.</p></div>
        <div className="calculators__grid">{featured.map((calculator) => <CalculatorCard key={calculator.id} calculator={calculator} />)}</div>
      </section>}

      <section className="calculators" id="calculators">
        <div className="calculators__header">
          <h2 className="calculators__title">{query ? 'Search results' : 'All calculators'}</h2>
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

      {!query && <section className="home-showcase home-showcase--recent" aria-labelledby="recent-title"><div className="home-showcase__header"><h2 id="recent-title">Recently added</h2><p>New tools joining the ExoCalcHub collection.</p></div><div className="calculators__grid">{recent.map((calculator) => <CalculatorCard key={calculator.id} calculator={calculator} />)}</div></section>}

      {!query && history.length > 0 && <section className="home-showcase" aria-labelledby="history-title"><div className="home-showcase__header"><h2 id="history-title">Recent calculations</h2><button type="button" onClick={clearHistory}>Clear history</button></div><ul className="history-list">{history.slice(0, 5).map((item) => <li key={`${item.id}-${item.timestamp}`}><span>{item.name}</span><strong>{item.result}</strong><time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleDateString()}</time></li>)}</ul></section>}

      <Categories categories={visibleCategories(calculators)} onSelect={(categoryId) => setQuery(categoryId)} />
    </>
  )
}
