import { Link } from 'react-router-dom'
import './Header.css'

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon" aria-hidden="true">
            ∑
          </span>
          <span className="header__logo-text">QuickCalcHub</span>
        </Link>
        <nav className="header__nav" aria-label="Main navigation">
          <a href="/#calculators">Calculators</a>
          <a href="/#categories">Categories</a>
          <a href="/#about">About</a>
        </nav>
      </div>
    </header>
  )
}
