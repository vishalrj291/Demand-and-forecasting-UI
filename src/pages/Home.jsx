import { Link } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function compactNumber(v) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v);
}
function money(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

import { useEffect, useState } from "react";

export default function Home() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    let active = true;
    getJson("/api/insights").then(d => { if (active) setInsights(d); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const bars = [
    { name: "Phones", pct: 0.92, val: "$330K" },
    { name: "Chairs", pct: 0.78, val: "$328K" },
    { name: "Storage", pct: 0.65, val: "$223K" },
    { name: "Tables", pct: 0.55, val: "$206K" },
    { name: "Machines", pct: 0.42, val: "$189K" },
  ];

  return (
    <div className="page-shell">
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero__left">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            AI-Powered Forecasting Platform
          </div>
          <h1 className="hero__title">
            Predict Demand.<br />
            <em className="glitch" data-text="Optimize Inventory.">Optimize Inventory.</em><br />
            Reduce Risk.
          </h1>
          <p className="hero__desc">
            ForecastIQ combines machine learning with classical inventory formulas to
            help you predict product demand, calculate optimal order quantities, and
            assess stockout risk — all in seconds.
          </p>
          <div className="hero__actions">
            <Link to="/dashboard" className="btn-primary">Try the Dashboard →</Link>
            <Link to="/about" className="btn-ghost">Learn More</Link>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__card">
            <div className="hero__card-label">📊 Top Revenue Sub-Categories</div>
            <div className="hero__card-bar-group">
              {bars.map((b, i) => (
                <div className="hero__card-bar" key={b.name}>
                  <span className="hero__card-bar-name">{b.name}</span>
                  <div className="hero__card-bar-track">
                    <div className="hero__card-bar-fill" style={{ width: `${b.pct * 100}%`, animationDelay: `${i * 0.1}s` }} />
                  </div>
                  <span className="hero__card-bar-val">{b.val}</span>
                </div>
              ))}
            </div>
            <div className="hero__stat-chips">
              <span className="chip">9,994 Rows</span>
              <span className="chip chip--green">17 Sub-Categories</span>
              <span className="chip chip--purple">ML Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <div className="stats-row">
        <div className="stat-chip">
          <span className="stat-chip__val">{insights ? compactNumber(insights.records) : "9.9K"}</span>
          <div className="stat-chip__label">Dataset Transactions</div>
        </div>
        <div className="stat-chip">
          <span className="stat-chip__val">{insights ? money(insights.total_sales) : "$2.3M"}</span>
          <div className="stat-chip__label">Total Revenue Tracked</div>
        </div>
        <div className="stat-chip">
          <span className="stat-chip__val">{insights ? insights.subcategories : "17"}</span>
          <div className="stat-chip__label">Product Sub-Categories</div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="section__badge">⚙️ How It Works</div>
        <h2 className="section__title">Three Steps to Smarter Inventory</h2>
        <p className="section__sub">
          Pick a product, set your cost parameters, and run three ML-powered steps to get actionable recommendations.
        </p>
        <div className="steps-grid">
          {[
            { num: "01", icon: "🧠", title: "Predict Demand", desc: "Our Gradient Boosting model analyzes the month, unit price, and sub-category to predict monthly demand units." },
            { num: "02", icon: "📦", title: "Calculate EOQ & ROP", desc: "Using the demand forecast, we calculate the Economic Order Quantity and Reorder Point using classical inventory formulas." },
            { num: "03", icon: "⚠️", title: "Assess Stockout Risk", desc: "A trained classifier evaluates your current inventory level against demand to estimate the probability of running out of stock." },
          ].map(s => (
            <div className="step-card" key={s.num}>
              <div className="step-card__num">{s.num}</div>
              <div className="step-card__icon">{s.icon}</div>
              <div className="step-card__title">{s.title}</div>
              <p className="step-card__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: "center", padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>
            Ready to optimize your inventory?
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 32, lineHeight: 1.7 }}>
            Jump into the interactive dashboard and run a scenario in under 30 seconds.
          </p>
          <Link to="/dashboard" className="btn-primary" style={{ display: "inline-flex" }}>
            Open Dashboard →
          </Link>
        </div>
      </section>
    </div>
  );
}
