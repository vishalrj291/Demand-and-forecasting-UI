import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <div className="footer__brand-name">ForecastIQ</div>
          <p className="footer__brand-desc">
            An AI-powered demand forecasting and inventory optimization platform.
            Built with machine learning on the Sample Superstore dataset, designed for
            real operational decision-making.
          </p>
          <div className="footer__badges">
            <span className="footer__badge">🤖 ML-Powered</span>
            <span className="footer__badge">📊 Real Dataset</span>
            <span className="footer__badge">⚡ FastAPI</span>
          </div>
        </div>

        <div>
          <div className="footer__col-title">Navigation</div>
          <div className="footer__links">
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/dashboard" className="footer__link">Dashboard</Link>
            <Link to="/team" className="footer__link">Our Team</Link>
            <Link to="/about" className="footer__link">About</Link>
          </div>
        </div>

        <div>
          <div className="footer__col-title">Legal</div>
          <div className="footer__links">
            <Link to="/terms" className="footer__link">Terms & Conditions</Link>
            <Link to="/privacy" className="footer__link">Privacy Policy</Link>
            <Link to="/about" className="footer__link">Disclaimer</Link>
          </div>
        </div>

        <div>
          <div className="footer__col-title">Technology</div>
          <div className="footer__links">
            <span className="footer__link">React + Vite</span>
            <span className="footer__link">Python FastAPI</span>
            <span className="footer__link">Scikit-Learn</span>
            <span className="footer__link">Render (Backend)</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span className="footer__copy">
          © {year} ForecastIQ. Built by Team ForecastIQ. Academic Project.
        </span>
        <div className="footer__legal">
          <Link to="/terms" className="footer__legal-link">Terms & Conditions</Link>
          <Link to="/privacy" className="footer__legal-link">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
