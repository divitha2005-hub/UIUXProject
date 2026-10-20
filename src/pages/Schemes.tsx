import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SCHEMES } from '../data/schemes';
import { useApp } from '../components/AppContext';

export default function Schemes() {
  const { hash } = useLocation();
  const { toast } = useApp();
  const [open, setOpen] = useState<string | null>(hash.slice(1) || null);
  useEffect(() => {
    if (hash) {
      setOpen(hash.slice(1));
      setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
    }
  }, [hash]);
  return (
    <div className="page-pad narrow-page">
      <h1 className="page-title">Government Schemes</h1>
      <p className="page-sub">A few schemes that may help you. This is sample information. Please confirm details on the official portal.</p>
      <ul className="schemes">
        {SCHEMES.map((s) => (
          <li key={s.id} id={s.id} className={`card${open === s.id ? ' open' : ''}`}>
            <button className="sch-head" onClick={() => setOpen(open === s.id ? null : s.id)} aria-expanded={open === s.id}>
              <span><b>{s.name}</b><small>{s.tag}</small></span>
              <i>{open === s.id ? '−' : '+'}</i>
            </button>
            <p>{s.summary}</p>
            {open === s.id && (
              <div className="sch-more">
                <ul className="plain">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
                <p><b>Who can apply:</b> {s.eligibility}</p>
                <button className="btn-solid" onClick={() => toast('Eligibility check is a demo feature')}>Check eligibility</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
