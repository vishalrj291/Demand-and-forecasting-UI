import { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const SUB_CATEGORIES = [
  "Accessories","Appliances","Art","Binders","Bookcases","Chairs","Copiers",
  "Envelopes","Fasteners","Furnishings","Labels","Machines","Paper","Phones",
  "Storage","Supplies","Tables",
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Preset scenarios
const SCENARIOS = {
  safe: {
    label: "🟢 Safe Stock",
    desc: "High inventory — Low risk expected",
    form: {
      month: "6", unit_price: "80", sub_category: "Chairs",
      ordering_cost: "300", holding_cost: "50", lead_time_days: "5",
      safety_stock: "150", inventory_level: "800",
    },
  },
  high: {
    label: "🔴 High Risk Demo",
    desc: "Low inventory — High risk expected",
    form: {
      month: "11", unit_price: "40", sub_category: "Phones",
      ordering_cost: "200", holding_cost: "30", lead_time_days: "14",
      safety_stock: "20", inventory_level: "15",
    },
  },
};

async function postJson(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function money(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

function StatCard({ label, value, hint, accentColor }) {
  return (
    <div className="stat-card" style={accentColor ? { borderColor: accentColor, boxShadow: `0 0 18px ${accentColor}22` } : {}}>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      <span className="stat-card__hint">{hint}</span>
    </div>
  );
}

export default function Dashboard() {
  const [form, setForm] = useState({
    month: "1", unit_price: "100", sub_category: "Accessories",
    ordering_cost: "250", holding_cost: "40", lead_time_days: "7",
    safety_stock: "100", inventory_level: "300",
  });
  const [demand, setDemand] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [risk, setRisk] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState({ demand: false, inventory: false, risk: false, insights: true });
  const [error, setError] = useState("");
  const [activeScenario, setActiveScenario] = useState(null);

  useEffect(() => {
    let active = true;
    getJson("/api/insights")
      .then(d => { if (active) { setInsights(d); setLoading(c => ({ ...c, insights: false })); } })
      .catch(e => { if (active) { setError(e.message); setLoading(c => ({ ...c, insights: false })); } });
    return () => { active = false; };
  }, []);

  const handleChange = e => {
    setForm(c => ({ ...c, [e.target.name]: e.target.value }));
    setActiveScenario(null);
  };

  // Auto-run all 3 steps for a preset scenario
  const applyScenario = async (key) => {
    const s = SCENARIOS[key];
    setActiveScenario(key);
    setForm(s.form);
    setDemand(null); setInventory(null); setRisk(null); setError("");

    // Step 1: demand
    setLoading(c => ({ ...c, demand: true }));
    let demandResult;
    try {
      demandResult = await postJson("/api/predict/demand", {
        month: Number(s.form.month),
        unit_price: Number(s.form.unit_price),
        sub_category: s.form.sub_category,
      });
      setDemand(demandResult);
    } catch (e) { setError(e.message); setLoading(c => ({ ...c, demand: false })); return; }
    finally { setLoading(c => ({ ...c, demand: false })); }

    // Step 2: inventory
    setLoading(c => ({ ...c, inventory: true }));
    let invResult;
    try {
      invResult = await postJson("/api/calculate/inventory", {
        predicted_demand: demandResult.predicted_demand,
        ordering_cost: Number(s.form.ordering_cost),
        holding_cost: Number(s.form.holding_cost),
        lead_time_days: Number(s.form.lead_time_days),
        safety_stock: Number(s.form.safety_stock),
      });
      setInventory(invResult);
    } catch (e) { setError(e.message); setLoading(c => ({ ...c, inventory: false })); return; }
    finally { setLoading(c => ({ ...c, inventory: false })); }

    // Step 3: risk
    setLoading(c => ({ ...c, risk: true }));
    try {
      const riskResult = await postJson("/api/predict/risk", {
        predicted_demand: demandResult.predicted_demand,
        inventory_level: Number(s.form.inventory_level),
      });
      setRisk(riskResult);
    } catch (e) { setError(e.message); }
    finally { setLoading(c => ({ ...c, risk: false })); }
  };

  const predictedDemand = demand?.predicted_demand ?? 0;
  const monthLabel = MONTHS[Number(form.month) - 1];
  const highRiskPercent = risk ? Math.round(risk.probabilities.high * 100) : 0;
  const invLevel = Number(form.inventory_level);

  // Live pre-check: warn before even running step 3
  const preRiskWarning = demand && invLevel < predictedDemand
    ? `⚠️ Current inventory (${invLevel}) is below predicted demand (${predictedDemand}). High stockout risk likely.`
    : demand && invLevel < predictedDemand * 1.3
    ? `⚡ Inventory is close to demand level. Moderate risk zone.`
    : null;

  const recommendation = (() => {
    if (!demand) return "Run a prediction to generate a realistic scenario summary.";
    if (!inventory) return "Demand is ready — calculate EOQ and reorder point to build an inventory plan.";
    if (!risk) return "Inventory plan is set. Check stockout risk to complete the operational picture.";
    if (risk.risk_level === "high") return `🚨 High risk! Demand (${predictedDemand} units) exceeds inventory (${invLevel} units). Increase safety stock or replenish immediately.`;
    if (invLevel <= inventory.reorder_point) return "Inventory is near the reorder threshold. Plan the next purchase soon.";
    return `✅ Scenario looks stable — inventory (${invLevel}) is comfortably above predicted demand (${predictedDemand}) and stockout risk is low.`;
  })();

  const handleDemand = async () => {
    setError(""); setLoading(c => ({ ...c, demand: true }));
    try {
      const r = await postJson("/api/predict/demand", { month: Number(form.month), unit_price: Number(form.unit_price), sub_category: form.sub_category });
      setDemand(r); setInventory(null); setRisk(null);
    } catch (e) { setError(e.message); }
    finally { setLoading(c => ({ ...c, demand: false })); }
  };

  const handleInventory = async () => {
    setError(""); setLoading(c => ({ ...c, inventory: true }));
    try {
      const r = await postJson("/api/calculate/inventory", { predicted_demand: predictedDemand, ordering_cost: Number(form.ordering_cost), holding_cost: Number(form.holding_cost), lead_time_days: Number(form.lead_time_days), safety_stock: Number(form.safety_stock) });
      setInventory(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(c => ({ ...c, inventory: false })); }
  };

  const handleRisk = async () => {
    setError(""); setLoading(c => ({ ...c, risk: true }));
    try {
      const r = await postJson("/api/predict/risk", { predicted_demand: predictedDemand, inventory_level: invLevel });
      setRisk(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(c => ({ ...c, risk: false })); }
  };

  const isRunningScenario = loading.demand || loading.inventory || loading.risk;

  return (
    <div className="dash-wrap">
      <div className="dash-hero">
        <div className="data-ping" style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 99, padding: "5px 20px 5px 14px", fontSize: "0.78rem", fontWeight: 600, color: "var(--accent-2)", marginBottom: 16, display: "inline-flex" }}>
          Live — Connected to Deployed API
        </div>
        <h1 className="cursor-blink">Forecast Dashboard</h1>
        <p>Choose a preset scenario or fill in your own parameters and run the three steps.</p>

        {/* PRESET SCENARIO BUTTONS */}
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          {Object.entries(SCENARIOS).map(([key, s]) => (
            <button
              key={key}
              onClick={() => applyScenario(key)}
              disabled={isRunningScenario}
              className="action-btn"
              style={{
                background: activeScenario === key
                  ? key === "high"
                    ? "linear-gradient(135deg, #fb7185, #fda4af)"
                    : "linear-gradient(135deg, #4ade80, #86efac)"
                  : "rgba(255,255,255,0.06)",
                color: activeScenario === key ? "#020e1a" : "var(--muted)",
                border: `1px solid ${activeScenario === key ? "transparent" : "rgba(148,163,184,0.2)"}`,
                padding: "10px 18px",
                fontSize: "0.85rem",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                cursor: isRunningScenario ? "wait" : "pointer",
              }}
            >
              <span style={{ fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: "0.75rem", opacity: 0.75 }}>{s.desc}</span>
            </button>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--muted)", padding: "0 4px" }}>
            or fill manually ↓
          </div>
        </div>
      </div>

      <div className="dash-body">
        {/* INPUTS */}
        <div className="panel">
          <div className="panel__header">
            <h2>Scenario Inputs</h2>
            <p>Fill in parameters and run the three steps below.</p>
          </div>

          <div className="grid-2">
            <label>
              <span>Month</span>
              <select name="month" value={form.month} onChange={handleChange}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </label>

            <label>
              <span>Unit Price ($)</span>
              <input name="unit_price" type="number" min="1" step="0.01" value={form.unit_price} onChange={handleChange} />
            </label>

            <label className="full-width">
              <span>Sub-Category</span>
              <select name="sub_category" value={form.sub_category} onChange={handleChange}>
                {SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <label>
              <span>Ordering Cost ($)</span>
              <input name="ordering_cost" type="number" min="1" value={form.ordering_cost} onChange={handleChange} />
            </label>

            <label>
              <span>Holding Cost ($)</span>
              <input name="holding_cost" type="number" min="1" value={form.holding_cost} onChange={handleChange} />
            </label>

            <label>
              <span>Lead Time (Days)</span>
              <input name="lead_time_days" type="number" min="0" value={form.lead_time_days} onChange={handleChange} />
            </label>

            <label>
              <span>Safety Stock (Units)</span>
              <input name="safety_stock" type="number" min="0" value={form.safety_stock} onChange={handleChange} />
            </label>

            <label className="full-width">
              <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Current Inventory (Units)</span>
                {demand && (
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 600, padding: "2px 10px", borderRadius: 99,
                    background: invLevel < predictedDemand ? "rgba(251,113,133,0.15)" : "rgba(74,222,128,0.12)",
                    color: invLevel < predictedDemand ? "var(--danger)" : "var(--accent)",
                  }}>
                    {invLevel < predictedDemand ? `⚠️ Below demand (${predictedDemand})` : `✓ Above demand (${predictedDemand})`}
                  </span>
                )}
              </span>
              <input
                name="inventory_level"
                type="number"
                min="0"
                value={form.inventory_level}
                onChange={handleChange}
                style={demand && invLevel < predictedDemand ? { borderColor: "rgba(251,113,133,0.5)", boxShadow: "0 0 0 3px rgba(251,113,133,0.08)" } : {}}
              />
              {preRiskWarning && (
                <div style={{ marginTop: 8, fontSize: "0.8rem", color: invLevel < predictedDemand ? "var(--danger)" : "#fb923c", display: "flex", alignItems: "center", gap: 6 }}>
                  {preRiskWarning}
                </div>
              )}
            </label>
          </div>

          {/* HOW RISK WORKS CALLOUT */}
          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--accent-2)" }}>ℹ️ How Stockout Risk works:</strong> The model predicts <strong style={{ color: "var(--text)" }}>HIGH</strong> risk when <code style={{ background: "rgba(255,255,255,0.07)", padding: "1px 6px", borderRadius: 4 }}>Inventory &lt; Demand</code>, and <strong style={{ color: "var(--text)" }}>LOW</strong> risk otherwise. Try the <strong style={{ color: "#fb7185" }}>🔴 High Risk Demo</strong> preset above to see it.
          </div>

          <div className="actions">
            <button className="action-btn action-btn--1" onClick={handleDemand} disabled={loading.demand || isRunningScenario}>
              {loading.demand ? <><span className="spinner" /> Forecasting…</> : "1. Predict Demand"}
            </button>
            <button className="action-btn action-btn--2" onClick={handleInventory} disabled={!demand || loading.inventory || isRunningScenario}>
              {loading.inventory ? <><span className="spinner" /> Calculating…</> : "2. EOQ & ROP"}
            </button>
            <button className="action-btn action-btn--3" onClick={handleRisk} disabled={!demand || loading.risk || isRunningScenario}>
              {loading.risk ? <><span className="spinner" /> Checking…</> : "3. Stockout Risk"}
            </button>
          </div>

          {error && <div className="error-banner">⚠️ {error}</div>}
        </div>

        {/* RESULTS */}
        <div className="panel">
          <div className="panel__header">
            <h2>Decision Snapshot</h2>
            <p>Grounded in your scenario and the dataset.</p>
          </div>

          <div className="results-grid">
            <StatCard
              label="Predicted Monthly Demand"
              value={demand ? <span className="value-revealed">{demand.predicted_demand} units</span> : "--"}
              hint={`${form.sub_category} · ${monthLabel}`}
            />
            <StatCard
              label="Economic Order Qty"
              value={inventory ? <span className="value-revealed">{inventory.economic_order_quantity} units</span> : "--"}
              hint="Suggested order size"
            />
            <StatCard
              label="Reorder Point"
              value={inventory ? <span className="value-revealed">{inventory.reorder_point} units</span> : "--"}
              hint="Trigger level for next purchase"
            />
            <StatCard
              label="Stockout Risk"
              accentColor={risk?.risk_level === "high" ? "#fb7185" : risk?.risk_level === "low" ? "#4ade80" : undefined}
              value={risk ? (
                <span className={`risk-badge risk-badge--${risk.risk_level} value-revealed`}>
                  {risk.risk_level.toUpperCase()} · {highRiskPercent}%
                </span>
              ) : "--"}
              hint={risk
                ? `Low: ${Math.round(risk.probabilities.low * 100)}% · High: ${highRiskPercent}%`
                : "ML probability of running short"}
            />
          </div>

          {/* RISK BREAKDOWN BAR */}
          {risk && (
            <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 14, background: "rgba(10,24,50,0.8)", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#93c5fd", marginBottom: 10 }}>Risk Probability Breakdown</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: "0.8rem", color: "var(--accent)", minWidth: 36 }}>LOW</span>
                <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${Math.round(risk.probabilities.low * 100)}%`, height: "100%", background: "var(--accent)", borderRadius: 99, transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)", minWidth: 36, textAlign: "right" }}>{Math.round(risk.probabilities.low * 100)}%</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--danger)", minWidth: 36 }}>HIGH</span>
                <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${highRiskPercent}%`, height: "100%", background: "var(--danger)", borderRadius: 99, transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--danger)", minWidth: 36, textAlign: "right" }}>{highRiskPercent}%</span>
              </div>
            </div>
          )}

          <div className="summary-card">
            <span className="summary-card__label">💡 Business Recommendation</span>
            <p className="summary-card__text">{recommendation}</p>
          </div>

          <div className="summary-card">
            <span className="summary-card__label">🏆 Top Revenue Sub-Categories</span>
            <div className="top-list">
              {insights?.top_subcategories?.map(item => (
                <div className="top-list__item" key={item.name}>
                  <span>{item.name}</span>
                  <strong>{money(item.sales)}</strong>
                </div>
              )) ?? <p className="summary-card__text">Loading dataset insights…</p>}
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-card__label">📝 Model Notes</span>
            <ul>{(insights?.data_notes ?? []).map(n => <li key={n}>{n}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
