import { useEffect, useMemo, useRef, useState } from 'react';
import { DemandGauge, TrendChart } from '../components/Charts';
import { IconChevronDown, IconPinGreen } from '../components/Icons';
import { QtyStepper } from '../components/Bits';
import { PRICING_CROPS, PRICING_LOCATIONS, getInsights } from '../data/pricing';

const demandLabel = (d: number) => (d >= 75 ? 'High Demand' : d >= 55 ? 'Moderate Demand' : 'Low Demand');
const trendIcon = { High: '↑', Moderate: '→', Low: '↓' } as const;

export default function Pricing() {
  const [cropId, setCropId] = useState('tomato');
  const [qty, setQty] = useState(1);
  const [loc, setLoc] = useState(PRICING_LOCATIONS[0]);
  const [applied, setApplied] = useState({ cropId: 'tomato', qty: 1, loc: PRICING_LOCATIONS[0] });
  const [loading, setLoading] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ins = useMemo(() => getInsights(applied.cropId, applied.qty, applied.loc), [applied]);
  const dirty = applied.cropId !== cropId || applied.qty !== qty || applied.loc !== loc;

  const run = (next = { cropId, qty, loc }) => {
    setLoading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setApplied(next);
      setLoading(false);
    }, 700);
  };

  const similar = ['capsicum', 'potato', 'persimmon', 'onion', 'carrot', 'green-chilli'].filter((c) => c !== applied.cropId).slice(0, 3);

  return (
    <div className="page-pad pricing">
      <h1 className="page-title">AI Pricing Assistant</h1>
      <p className="page-sub big">Get intelligent price recommendations based on market trends</p>

      <form className="p-controls" onSubmit={(e) => { e.preventDefault(); run(); }}>
        <label className="pc"><span>Select Crop</span>
          <div className="box">
            <select value={cropId} onChange={(e) => setCropId(e.target.value)} aria-label="Select crop">
              {PRICING_CROPS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <IconChevronDown size={30} />
          </div>
        </label>
        <div className="pc"><span>Quantity</span>
          <div className="box qbox"><QtyStepper value={qty} onChange={setQty} max={999} /></div>
        </div>
        <label className="pc"><span>Location</span>
          <div className="box locbox">
            <IconPinGreen size={34} />
            <select value={loc} onChange={(e) => setLoc(e.target.value)} aria-label="Location">
              {PRICING_LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </label>
        <button type="submit" className={`btn-get${dirty ? ' dirty' : ''}`} disabled={loading}>{loading ? 'Analyzing...' : 'Get Price Insights'}</button>
      </form>

      <div className={`p-cards${loading ? ' loading' : ''}`} aria-busy={loading}>
        <section className="card pc-rec">
          <h2>Recommended Price</h2>
          <div className="gauge-wrap"><DemandGauge pct={ins.demand} /></div>
          <div className="gtxt">
            <b>{ins.demand}%</b>
            <span>{demandLabel(ins.demand)}</span>
            <small className="est-line">≈ ₹{(ins.recommended * 100 * ins.qty).toLocaleString('en-IN')} for {ins.qty} quintal{ins.qty > 1 ? 's' : ''}</small>
          </div>
          <div className="big-price">₹ {ins.recommended}/Kg</div>
        </section>

        <section className="card pc-trend">
          <h2>Price Trend (Last 30 days)</h2>
          <TrendChart values={ins.series} labels={ins.labels} height={165} unit="₹/kg" badge={`${ins.trendPct >= 0 ? '+' : ''}${ins.trendPct}%`} />
        </section>

        <section className="card pc-ai">
          <h2>AI Recommendation</h2>
          <ol>{ins.advice.map((a) => <li key={a}>{a}</li>)}</ol>
        </section>
      </div>

      <div className="table-wrap">
        <table className="ptable">
          <caption>Price Comparison (₹/kg) <small>Sample data for {ins.crop.name}, {ins.location}</small></caption>
          <thead>
            <tr><th>Price Type</th><th>Current</th><th>Last Week</th><th>Last Month</th><th>Demand Trend</th></tr>
          </thead>
          <tbody>
            {ins.rows.map((r) => (
              <tr key={r.type}>
                <td>{r.type}</td><td>₹{r.current}</td><td>₹{r.week}</td><td>₹{r.month}</td>
                <td className={`tr-${r.trend.toLowerCase()}`}>{trendIcon[r.trend]} {r.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="sec-title">Similar crops insights</h2>
      <div className="sim-row">
        {similar.map((id) => {
          const c = PRICING_CROPS.find((x) => x.id === id)!;
          return (
            <button key={id} className="sim-card" onClick={() => { setCropId(id); const n = { cropId: id, qty, loc }; run(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              {c.thumb ? <img src={c.thumb} alt="" /> : <span className="emoji">{c.emoji}</span>}
              <b>{c.name}</b>
            </button>
          );
        })}
      </div>
      <p className="demo-line">Demo data: recommendations and trends are simulated and are not real market predictions.</p>
    </div>
  );
}
