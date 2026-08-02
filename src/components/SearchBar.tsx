import './SearchBar.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search calculators...',
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="calculator-search" className="search-bar__label">
        Search calculators
      </label>
      <div className="search-bar__wrapper">
        <span className="search-bar__icon" aria-hidden="true">⌕</span>
        <input
          id="calculator-search"
          type="search"
          className="search-bar__input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          aria-describedby="calculator-search-help"
        />
      </div>
      <p className="search-bar__help" id="calculator-search-help">
        Search by calculator name, category, or what you need to calculate.
      </p>
    </div>
  )
}
