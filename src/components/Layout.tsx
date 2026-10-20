import { useEffect, useRef, useState, type FormEvent } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IconMenu, IconPin, IconSearch } from './Icons';
import { useApp } from './AppContext';
import { LOCATIONS } from '../data/weather';
import { suggest } from '../lib/search';
import { resetDemoData } from '../lib/storage';

const LIGHT_PREFIXES = ['/product', '/assistant', '/orders'];

export function Layout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const variant = LIGHT_PREFIXES.some((p) => pathname.startsWith(p)) ? 'light' : 'dark';

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // jump to #weather etc. after navigating from search
    const h = window.location.hash;
    if (h) setTimeout(() => document.getElementById(h.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }, [pathname]);

  const nav = [
    { label: 'Home', to: '/', end: true },
    { label: 'Scan Crop', to: '/scan' },
    { label: 'Crop Market', to: '/market' },
    { label: 'Product Details', to: '/product' },
    { label: 'AI Assistant', to: '/assistant' },
    { label: 'Soil Health', to: '/soil' },
    { label: pathname.startsWith('/assistant') || pathname.startsWith('/orders') ? 'Order Tracking' : 'Order', to: '/orders' },
  ];

  return (
    <div className="app" data-variant={variant}>
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <NavLink to="/" className="brand">Smart AgriConnect</NavLink>
        <nav>
          {nav.map((n) => (
            <NavLink key={n.label} to={n.to} end={n.end} className={({ isActive }) => `navbtn${isActive ? ' active' : ''}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <p className="demo-note">Demo prototype. Weather, prices, scans and tracking are sample data, not live information.</p>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <Topbar onMenu={() => setOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { location, setLocation, toast } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const [menu, setMenu] = useState<'loc' | 'user' | null>(null);
  const [idx, setIdx] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const sugg = suggest(q, location);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setFocus(false);
      if (!bar.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const go = (to: string) => {
    setFocus(false);
    setQ('');
    setIdx(-1);
    navigate(to);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (idx >= 0 && sugg[idx]) return go(sugg[idx].to);
    if (sugg[0]) return go(sugg[0].to);
    if (q.trim()) return go(`/market?q=${encodeURIComponent(q.trim())}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => Math.min(sugg.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => Math.max(-1, i - 1));
    } else if (e.key === 'Escape') setFocus(false);
  };

  return (
    <header className="topbar" ref={bar}>
      <button className="hamburger icon-btn" onClick={onMenu} aria-label="Open menu"><IconMenu /></button>
      <div className="searchwrap" ref={box}>
        <form className="search" onSubmit={submit} role="search">
          <IconSearch size={34} />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(-1);
              setFocus(true);
            }}
            onFocus={() => setFocus(true)}
            onKeyDown={onKey}
            placeholder="Search crops,Weather,Schemes.."
            aria-label="Search crops, weather, schemes"
          />
        </form>
        {focus && q.trim() && (
          <ul className="suggest" role="listbox">
            {sugg.length === 0 && (
              <li><button onMouseDown={(e) => e.preventDefault()} onClick={() => go(`/market?q=${encodeURIComponent(q.trim())}`)}>Search the market for "{q.trim()}"</button></li>
            )}
            {sugg.map((s, i) => (
              <li key={s.label + s.to} className={i === idx ? 'sel' : ''}>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => go(s.to)}>
                  <span>{s.label}</span>
                  <em>{s.hint}</em>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="menuwrap">
        <button className="loc" onClick={() => setMenu(menu === 'loc' ? null : 'loc')} aria-haspopup="listbox" aria-expanded={menu === 'loc'}>
          <IconPin size={44} />
          <span>{location}</span>
        </button>
        {menu === 'loc' && (
          <ul className="dropdown" role="listbox">
            {LOCATIONS.map((l) => (
              <li key={l}>
                <button className={l === location ? 'on' : ''} onClick={() => { setLocation(l); setMenu(null); toast(`Location set to ${l}`); }}>{l}</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="menuwrap">
        <button className="user" onClick={() => setMenu(menu === 'user' ? null : 'user')} aria-haspopup="menu" aria-expanded={menu === 'user'}>
          <span className="avatar" />
          <span className="who"><b>Ramesh</b><small>Farmer</small></span>
        </button>
        {menu === 'user' && (
          <ul className="dropdown right" role="menu">
            <li><button onClick={() => { setMenu(null); navigate('/orders'); }}>My orders</button></li>
            <li><button onClick={() => { setMenu(null); navigate('/schemes'); }}>Government schemes</button></li>
            <li>
              <button
                onClick={() => {
                  resetDemoData();
                  setMenu(null);
                  toast('Demo data reset');
                  setTimeout(() => window.location.assign('/'), 500);
                }}
              >
                Reset demo data
              </button>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
