import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconBack, IconDownload, IconWarn, IconWarnRed } from '../components/Icons';
import { SeverityGauge } from '../components/Charts';
import { Tabs } from '../components/Bits';
import { useApp } from '../components/AppContext';
import { downloadScanReport } from '../lib/download';
import { getLastScan, scanDisease, scanSeverity } from '../lib/scans';

const TABS = ['Overview', 'Remedies', 'Prevention'] as const;
type Tab = (typeof TABS)[number];
type Remedy = 'organic' | 'physical' | 'chemical';

const ACTIONS: { key: Remedy; label: string }[] = [
  { key: 'organic', label: 'Organic Neem Spray' },
  { key: 'physical', label: 'Physical Pruning' },
  { key: 'chemical', label: 'Chemical Fungicide' },
];

export default function ScanResults() {
  const navigate = useNavigate();
  const { toast } = useApp();
  const scan = useMemo(getLastScan, []);
  const d = scanDisease(scan);
  const healthy = d.id === 'healthy';
  const [tab, setTab] = useState<Tab>('Overview');
  const [remedy, setRemedy] = useState<Remedy | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = (r: Remedy) => {
    setRemedy(r);
    setTab('Remedies');
  };

  const download = async () => {
    setBusy(true);
    try {
      await downloadScanReport(scan);
      toast('Report downloaded');
    } catch {
      toast('Could not create the report. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const remedyBlock = (r: Remedy) => (
    <div key={r} className="rem-block">
      <h4>{ACTIONS.find((a) => a.key === r)!.label}</h4>
      <ul>{d.remedies[r].map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  );

  return (
    <div className="page-pad results">
      <button className="back" onClick={() => navigate('/')}><IconBack size={34} /> Back Home</button>
      <div className="res-head">
        <div>
          <h1 className="res-title">Scan Results</h1>
          <p className="res-sub">Here is the analysis of your crop image</p>
        </div>
        <div className="res-btns">
          <button className="btn-line big" onClick={download} disabled={busy}><IconDownload size={26} /> {busy ? 'Preparing...' : 'Download report'}</button>
          <Link className="btn-solid big" to="/scan">Scan other</Link>
        </div>
      </div>

      <div className="res-frame">
        <div className="res-top">
          <img className="res-img" src={scan.image} alt="Scanned crop leaf" />
          <div className="detect card">
            <div className="detect-row">
              <div>
                <p className="detect-label">Detected Disease</p>
                <h2 className="detect-name">{d.name}</h2>
                <span className={`sev ${scan.score < 4 ? 'low' : scan.score < 7 ? 'mod' : 'high'}`}>{scanSeverity(scan)}</span>
              </div>
              <div className="gauge-box">
                <SeverityGauge score={scan.score} />
                <b>{scan.score.toFixed(1)}/10</b>
              </div>
            </div>
            {healthy ? (
              <p className="warn ok"><b>No disease detected. Keep scouting your crop regularly.</b></p>
            ) : (
              <p className="warn"><IconWarn size={22} /> <b>This disease can reduce yield if not controlled</b></p>
            )}
          </div>
        </div>

        <div className="res-mid">
          <section className="card conf" aria-label="Confidence breakdown">
            <h3>Confidence Breakdown</h3>
            {scan.conf.map((c, i) => (
              <div className="conf-row" key={c.name}>
                <span>{c.name}</span>
                <div className="bar" role="progressbar" aria-valuenow={c.pct} aria-valuemin={0} aria-valuemax={100} aria-label={c.name}>
                  <i style={{ width: `${c.pct}%` }} className={i === 0 ? 'top' : ''} />
                </div>
                <b>{c.pct}%</b>
              </div>
            ))}
          </section>

          <section className="card qact" aria-label="Quick actions">
            <h3>Quick Actions</h3>
            <ul>
              {ACTIONS.map((a) => (
                <li key={a.key}>
                  <button className={remedy === a.key ? 'on' : ''} onClick={() => pick(a.key)}>
                    <span className="gdot" /> {a.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="res-tabs card">
          <Tabs tabs={TABS} active={tab} onChange={setTab} className="tabs-3" />
          <div className="tab-body">
            {tab === 'Overview' && <p className="center">{d.overview}</p>}
            {tab === 'Remedies' && (
              <div>
                {remedy ? remedyBlock(remedy) : (['organic', 'physical', 'chemical'] as Remedy[]).map(remedyBlock)}
                {remedy && <button className="link-btn" onClick={() => setRemedy(null)}>Show all remedies</button>}
                <p className="small-note">Always read the product label and follow the recommended dose. <Link to="/market">Find products in the market</Link></p>
              </div>
            )}
            {tab === 'Prevention' && (
              <ul className="plain">{d.prevention.map((t) => <li key={t}>{t}</li>)}</ul>
            )}
          </div>
        </div>

        {!healthy && (
          <div className="outbreak" role="alert">
            <IconWarnRed size={34} />
            <div>
              <b>Local Outbreak</b>
              <p>High risk of {d.name.toLowerCase()} in your area due to recent rainfall</p>
            </div>
          </div>
        )}
        <p className="demo-line">Demo result: this analysis is simulated from sample data and is not a real diagnosis.</p>
      </div>
    </div>
  );
}
