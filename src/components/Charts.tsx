import { useId, useState } from 'react';

interface TrendProps {
  values: number[];
  labels: string[];
  height?: number;
  unit?: string; // tooltip unit
  yTicks?: number;
  compact?: boolean;
  badge?: string;
}

/** Line + soft bars chart with hover tooltip (SVG, no library). */
export function TrendChart({ values, labels, height = 170, unit = '₹/kg', yTicks = 4, compact, badge }: TrendProps) {
  const id = useId().replace(/:/g, '');
  const [hover, setHover] = useState<number | null>(null);
  const W = compact ? 270 : 400;
  const padL = compact ? 36 : 42;
  const padR = 14;
  const padT = 22;
  const padB = 24;
  const H = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = Math.floor((min * 0.85) / 5) * 5;
  const hi = Math.ceil((max * 1.08) / 5) * 5;
  const x = (i: number) => padL + (i * (W - padL - padR)) / (values.length - 1);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo || 1)) * (H - padT - padB);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const ticks = Array.from({ length: yTicks }, (_, i) => Math.round(lo + ((hi - lo) * i) / (yTicks - 1)));
  const barW = Math.min(14, (W - padL - padR) / values.length / 2);
  const tipLeft = hover !== null ? Math.min(Math.max((x(hover) / W) * 100, 16), 84) : 0;

  return (
    <div className="trend" style={{ position: 'relative' }}>
      {badge && <span className="trend-badge">{badge} ↗</span>}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Price trend chart" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfe9c8" /><stop offset="1" stopColor="#e9f7ec" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#e6ece8" />
            <text x={padL - 6} y={y(t) + 4} fontSize={compact ? 11 : 14} textAnchor="end" fill="#666">{t.toLocaleString('en-IN')}</text>
          </g>
        ))}
        {values.map((v, i) => (
          <rect key={i} x={x(i) - barW / 2} y={y(v)} width={barW} height={H - padB - y(v)} rx="2" fill={`url(#g${id})`} opacity={hover === i ? 1 : 0.85} />
        ))}
        <path d={line} fill="none" stroke="#1ea04a" strokeWidth="2.200" strokeLinejoin="round" strokeLinecap="round" />
        {values.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.400} fill="#1ea04a" />
            <rect x={x(i) - 22} y={0} width={44} height={H} fill="transparent" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => setHover(i)} tabIndex={0} aria-label={`${labels[i]}: ${v} ${unit}`} />
            <text x={x(i)} y={H - 7} fontSize={compact ? 11 : 13.5} textAnchor="middle" fill="#555">{labels[i]}</text>
          </g>
        ))}
      </svg>
      {hover !== null && (
        <div className="trend-tip" style={{ left: `${tipLeft}%`, top: `${(y(values[hover]) / H) * 100}%` }}>
          <strong>{labels[hover]}</strong>
          <span>{values[hover].toLocaleString('en-IN')} {unit}</span>
        </div>
      )}
    </div>
  );
}

/** Half-circle gauge with needle (scan severity) */
export function SeverityGauge({ score }: { score: number }) {
  const id = useId().replace(/:/g, '');
  const r = 80;
  const cx = 92;
  const cy = 94;
  const ang = Math.PI * (1 - Math.min(10, Math.max(0, score)) / 10);
  const nx = cx + (r - 6) * Math.cos(ang);
  const ny = cy - (r - 6) * Math.sin(ang);
  const bx = cx + 14 * Math.cos(ang + Math.PI);
  const by = cy - 14 * Math.sin(ang + Math.PI);
  return (
    <svg viewBox="0 0 184 102" width="182" height="101" role="img" aria-label={`Severity ${score} out of 10`}>
      <defs>
        <linearGradient id={`s${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#33c11a" /><stop offset=".45" stopColor="#7ccf1b" /><stop offset=".62" stopColor="#f5a60d" /><stop offset="1" stopColor="#d31616" />
        </linearGradient>
      </defs>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={`url(#s${id})`} strokeWidth="19" strokeLinecap="butt" />
      <path d={`M ${cx - r + 12} ${cy} A ${r - 12} ${r - 12} 0 0 1 ${cx + r - 12} ${cy}`} fill="#fff" opacity="0" />
      <line x1={bx} y1={by} x2={nx} y2={ny} stroke="#0a0a0a" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** Half ring (AI price demand) */
export function DemandGauge({ pct }: { pct: number }) {
  const id = useId().replace(/:/g, '');
  const r = 58;
  const cx = 90;
  const cy = 80;
  const a = Math.PI * (1 - pct / 100);
  const ex = cx + r * Math.cos(a);
  const ey = cy - r * Math.sin(a);
  return (
    <svg viewBox="0 10 180 76" width="180" height="76" role="img" aria-label={`${pct}% demand`}>
      <defs>
        <linearGradient id={`d${id}`} x1="0" x2="1"><stop offset="0" stopColor="#22c55e" /><stop offset="1" stopColor="#7de0a0" /></linearGradient>
      </defs>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e3f6e8" strokeWidth="16" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${pct > 50 ? 1 : 0} 1 ${ex} ${ey}`} fill="none" stroke={`url(#d${id})`} strokeWidth="16" strokeLinecap="round" />
    </svg>
  );
}

export function Ring({ pct, label }: { pct: number; label: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" role="img" aria-label={`${label} ${pct}%`}>
      <svg viewBox="0 0 140 140" width="150" height="150">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e3f6e8" strokeWidth="18" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="#36c75a" strokeWidth="18" strokeDasharray={`${(c * pct) / 100} ${c}`} strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray .6s ease' }} />
      </svg>
      <span className="ring-pct">{pct}%</span>
    </div>
  );
}
