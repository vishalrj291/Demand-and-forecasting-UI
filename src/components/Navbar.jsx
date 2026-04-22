import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand">
            <div className="navbar__brand-icon">📈</div>
            <span className="navbar__brand-text">ForecastIQ</span>
          </Link>

          <div className="navbar__links">
            <NavLink to="/" end className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>Home</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>Dashboard</NavLink>
            <NavLink to="/team" className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>Our Team</NavLink>
            <NavLink to="/about" className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>About</NavLink>
          </div>

          <Link to="/dashboard" className="navbar__cta">Launch App →</Link>

          <div className="navbar__hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
            <span style={open ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}} />
            <span style={open ? { opacity: 0 } : {}} />
            <span style={open ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}} />
          </div>
        </div>
      </nav>

      {open && (
        <div style={{
          position: "fixed", top: 68, left: 0, right: 0, zIndex: 99,
          background: "rgba(6,13,26,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(148,163,184,0.15)",
          padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: "4px"
        }}>
          {[["Home", "/", true], ["Dashboard", "/dashboard", false], ["Our Team", "/team", false], ["About", "/about", false]].map(([label, path, end]) => (
            <NavLink key={path} to={path} end={end}
              className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}
              onClick={() => setOpen(false)}
              style={{ padding: "12px 14px" }}
            >{label}</NavLink>
          ))}
          <Link to="/dashboard" className="btn-primary" onClick={() => setOpen(false)}
            style={{ marginTop: 8, justifyContent: "center" }}>Launch App →</Link>
        </div>
      )}
    </>
  );
}
