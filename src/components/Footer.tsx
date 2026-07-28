import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" id="about">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">QuickCalcHub</span>
          <p className="footer__tagline">
            Free online calculators for finance, health, math, and more.
          </p>
        </div>
        <div className="footer__links">
          <div className="footer__column">
            <h4>Calculators</h4>
            <a href="#calculators">All tools</a>
            <a href="#categories">Categories</a>
          </div>
          <div className="footer__column">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#privacy">Privacy</a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {year} QuickCalcHub. All rights reserved.</p>
      </div>
    </footer>
  )
}
