import { Link } from 'react-router-dom'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">ExoCalcHub</Link>
          <p className="footer__tagline">Clear, quick calculators for everyday decisions.</p>
        </div>
        <div className="footer__links">
          <div className="footer__column">
            <h4>Explore</h4>
            <Link to="/#calculators">All calculators</Link>
            <Link to="/#categories">Categories</Link>
          </div>
          <div className="footer__column">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer__column">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {year} ExoCalcHub. All rights reserved.</p>
      </div>
    </footer>
  )
}
