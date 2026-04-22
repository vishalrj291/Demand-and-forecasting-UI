import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="page-shell" style={{ paddingTop: 68 }}>
      <div className="team-hero">
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:99, padding:"6px 16px", fontSize:"0.78rem", fontWeight:600, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:20 }}>
          ℹ️ About ForecastIQ
        </div>
        <h1 style={{ fontSize:"clamp(2.2rem,5vw,3.6rem)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:16 }}>
          What is ForecastIQ?
        </h1>
        <p style={{ color:"var(--muted)", maxWidth:560, margin:"0 auto", lineHeight:1.75, fontSize:"1.05rem" }}>
          An end-to-end AI platform that turns raw sales data into actionable inventory decisions.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 0, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>
        <div className="panel">
          <h2 style={{ fontSize:"1.3rem", fontWeight:700, marginBottom:14 }}>🎯 Project Goals</h2>
          <ul style={{ paddingLeft:20, color:"var(--muted)", lineHeight:1.8, fontSize:"0.92rem" }}>
            <li>Demonstrate practical ML applications in supply chain</li>
            <li>Predict demand using Gradient Boosting Regression</li>
            <li>Calculate optimal order quantities using EOQ</li>
            <li>Classify stockout risk using a trained classifier</li>
            <li>Deploy a full-stack app with a live backend API</li>
          </ul>
        </div>
        <div className="panel">
          <h2 style={{ fontSize:"1.3rem", fontWeight:700, marginBottom:14 }}>📊 Dataset</h2>
          <p style={{ color:"var(--muted)", lineHeight:1.75, fontSize:"0.92rem", marginBottom:12 }}>
            The <strong style={{ color:"var(--text)" }}>Sample Superstore dataset</strong> contains retail sales records across Furniture, Office Supplies, and Technology categories.
          </p>
          <ul style={{ paddingLeft:20, color:"var(--muted)", lineHeight:1.8, fontSize:"0.92rem" }}>
            <li>9,994 transaction records</li>
            <li>17 product sub-categories</li>
            <li>4 years of sales history (2014–2017)</li>
            <li>Columns: order date, product, sales, quantity, profit</li>
          </ul>
        </div>

        <div className="panel">
          <h2 style={{ fontSize:"1.3rem", fontWeight:700, marginBottom:14 }}>🤖 ML Models</h2>
          <p style={{ color:"var(--muted)", lineHeight:1.75, fontSize:"0.92rem", marginBottom:10 }}>
            <strong style={{ color:"var(--text)" }}>Demand Forecasting</strong> — Gradient Boosting Regressor trained on month, unit price, and one-hot encoded sub-category features.
          </p>
          <p style={{ color:"var(--muted)", lineHeight:1.75, fontSize:"0.92rem" }}>
            <strong style={{ color:"var(--text)" }}>Stockout Risk</strong> — Random Forest Classifier that takes predicted demand and current inventory level to output a risk probability.
          </p>
        </div>

        <div className="panel">
          <h2 style={{ fontSize:"1.3rem", fontWeight:700, marginBottom:14 }}>🚀 Architecture</h2>
          <ul style={{ paddingLeft:20, color:"var(--muted)", lineHeight:1.8, fontSize:"0.92rem" }}>
            <li><strong style={{ color:"var(--text)" }}>Frontend:</strong> React 18 + Vite, deployed on Vercel</li>
            <li><strong style={{ color:"var(--text)" }}>Backend:</strong> Python FastAPI, deployed on Render</li>
            <li><strong style={{ color:"var(--text)" }}>ML:</strong> Scikit-Learn, Pandas, NumPy</li>
            <li><strong style={{ color:"var(--text)" }}>API:</strong> RESTful JSON endpoints with CORS</li>
          </ul>
        </div>
      </section>

      <section style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 80px", textAlign:"center" }}>
        <div style={{ background:"var(--panel)", border:"1px solid var(--line)", borderRadius:28, padding:48, backdropFilter:"blur(18px)" }}>
          <p style={{ fontSize:"0.85rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16 }}>⚠️ Disclaimer</p>
          <p style={{ color:"var(--muted)", lineHeight:1.8, maxWidth:640, margin:"0 auto 28px", fontSize:"0.95rem" }}>
            ForecastIQ is an academic demonstration project. The predictions and recommendations are for 
            educational purposes only and should not be used as the sole basis for real business inventory decisions.
            Always consult domain experts for critical supply chain operations.
          </p>
          <Link to="/dashboard" className="btn-primary" style={{ display:"inline-flex" }}>Try the Dashboard →</Link>
        </div>
      </section>
    </div>
  );
}
