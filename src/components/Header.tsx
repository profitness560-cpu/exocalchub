import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Header.css'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => setMenuOpen(false)}>
          <span className="header__logo-icon" aria-hidden="true">∑</span>
          <span className="header__logo-text">ExoCalcHub</span>
        </Link>
        <button
          className="header__menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>
        <ThemeToggle />
        <nav
          className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          <NavLink to="/#calculators" onClick={() => setMenuOpen(false)}>Calculators</NavLink>
          <NavLink to="/#categories" onClick={() => setMenuOpen(false)}>Categories</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        </nav>
      </div>
    </header>
  )
}
