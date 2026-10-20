import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ring } from '../components/Charts';

const SOILS = ['Red soil', 'Black soil', 'Alluvial soil', 'Laterite soil', 'Sandy loam'] as const;
const LEVELS = ['Low', 'Medium', 'High'] as const;
type Level = (typeof LEVELS)[number];
type Soil = (typeof SOILS)[number];

const CROPS: Record<Soil, { id: string; name: string }[]> = {
  'Red soil': [{ id: 'ragi', name: 'Ragi' }, { id: 'groundnut', name: 'Groundnut' }, { id: 'tomato', name: 'Tomato' }],
  'Black soil': [{ id: 'sunflower', name: 'Sunflower' }, { id: 'maize', name: 'Maize' }, { id: 'onion', name: 'Onion' }],
  'Alluvial soil': [{ id: 'rice', name: 'Rice' }, { id: 'wheat', name: 'Wheat' }, { id: 'banana', name: 'Banana' }],
  'Laterite soil': [{ id: 'coffee', name: 'Coffee Beans' }, { id: 'coconut', name: 'Coconut' }, { id: 'turmeric', name: 'Turmeric' }],
  'Sandy loam': [{ id: 'carrot', name: 'Carrot' }, { id: 'potato', name: 'Potato' }, { id: 'groundnut', name: 'Groundnut' }],
};

const pts = (l: Level, hi: number) => (l === 'High' ? hi : l === 'Medium' ? Math.round(hi * 0.7) : 0);

interface Result {
  score: number;
  label: string;
  tips: string[];
  soil: Soil;
}

export default function SoilHealth() {
  const [soil, setSoil] = useState<Soil>('Red soil');
  const [ph, setPh] = useState(6.5);
  const [n, setN] = useState<Level>('Medium');
  const [p, setP] = useState<Level>('Medium');
  const [k, setK] = useState<Level>('Medium');
  const [om, setOm] = useState<Level>('Medium');
  const [res, setRes] = useState<Result | null>(null);

  const analyze = () => {
    const phPts = ph >= 6 && ph <= 7.5 ? 25 : ph >= 5.5 && ph <= 8 ? 12 : 0;
    const score = Math.min(100, 35 + phPts + pts(n, 10) + pts(p, 10) + pts(k, 10) + pts(om, 10));
    const tips: string[] = [];
    if (ph < 6) tips.push('Soil is acidic: apply agricultural lime based on a soil test recommendation.');
    if (ph > 7.5) tips.push('Soil is alkaline: add gypsum and organic matter, and avoid over-using alkaline fertilisers.');
    if (n === 'Low') tips.push('Low nitrogen: add compost or farmyard manure and split urea in 2 to 3 doses.');
    if (p === 'Low') tips.push('Low phosphorus: apply single super phosphate (SSP) at sowing.');
    if (k === 'Low') tips.push('Low potassium: apply muriate of potash (MOP) or wood ash in small amounts.');
    if (om === 'Low') tips.push('Low organic matter: add 4 to 5 tonnes of compost per acre and grow green manure crops.');
    if (!tips.length) tips.push('Your soil looks balanced. Keep adding compost and test again next season.');
    setRes({ score, label: score >= 80 ? 'Good' : score >= 55 ? 'Fair' : 'Needs care', tips, soil });
  };

  const Level = ({ v, set, name }: { v: Level; set: (l: Level) => void; name: string }) => (
    <div className="seg" role="radiogroup" aria-label={name}>
      {LEVELS.map((l) => (
        <button key={l} type="button" role="radio" aria-checked={v === l} className={v === l ? 'on' : ''} onClick={() => set(l)}>{l}</button>
      ))}
    </div>
  );

  return (
    <div className="page-pad narrow-page soil">
      <h1 className="page-title">Soil Health</h1>
      <p className="page-sub">Enter your soil test values to get a simple health score and fertiliser tips (demo).</p>
      <div className="soil-grid">
        <section className="card form">
          <label className="field">Soil type
            <select value={soil} onChange={(e) => setSoil(e.target.value as Soil)}>{SOILS.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="field">Soil pH: <b>{ph.toFixed(1)}</b>
            <input type="range" min={4} max={9} step={0.1} value={ph} onChange={(e) => setPh(parseFloat(e.target.value))} />
          </label>
          <div className="field">Nitrogen (N)<Level v={n} set={setN} name="Nitrogen" /></div>
          <div className="field">Phosphorus (P)<Level v={p} set={setP} name="Phosphorus" /></div>
          <div className="field">Potassium (K)<Level v={k} set={setK} name="Potassium" /></div>
          <div className="field">Organic matter<Level v={om} set={setOm} name="Organic matter" /></div>
          <button className="btn-solid big" onClick={analyze}>Check soil health</button>
        </section>

        <section className="card result" aria-live="polite">
          {!res ? (
            <p className="muted">Fill in your values and select <b>Check soil health</b> to see the result.</p>
          ) : (
            <>
              <div className="res-row">
                <Ring pct={res.score} label="Soil health score" />
                <div><h2>{res.label}</h2><p className="muted">Soil health score (sample calculation)</p></div>
              </div>
              <h3>What to do</h3>
              <ul className="plain">{res.tips.map((t) => <li key={t}>{t}</li>)}</ul>
              <h3>Crops that suit {res.soil.toLowerCase()}</h3>
              <div className="chips">
                {CROPS[res.soil].map((c) => <Link key={c.id} to={`/product/${c.id}`} className="chip-link">{c.name}</Link>)}
              </div>
            </>
          )}
        </section>
      </div>
      <p className="demo-line">Demo tool: results use simple sample rules, not a lab soil test.</p>
    </div>
  );
}
