import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IconBars, IconChevronDown, IconMiniPin, IconPerson, IconSearch } from '../components/Icons';
import { ProductImage } from '../components/Bits';
import { CATEGORIES, PRODUCTS, getProduct, type Category } from '../data/products';

type Cat = 'All' | Category;
const SORTS = ['Latest', 'Price: Low to High', 'Price: High to Low', 'Name (A-Z)'] as const;
const RANGES = ['All', 'Under ₹15', '₹15 - ₹30', 'Above ₹30'] as const;
const QUICK = ['Organic', 'Near by', 'Best Price', 'In stock'] as const;

export default function Market() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState<Cat>('Vegetables');
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Latest');
  const [range, setRange] = useState<(typeof RANGES)[number]>('All');
  const [quick, setQuick] = useState<Set<string>>(new Set());
  const q = params.get('q') ?? '';

  const setQ = (v: string) => {
    const n = new URLSearchParams(params);
    if (v) n.set('q', v);
    else n.delete('q');
    setParams(n, { replace: true });
  };

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => (q ? true : cat === 'All' || p.category === cat));
    // a typed search looks through everything; with no text the tab decides
    if (q) l = l.filter((p) => `${p.name} ${p.category} ${p.farmer} ${p.location}`.toLowerCase().includes(q.toLowerCase()));
    if (range === 'Under ₹15') l = l.filter((p) => p.price < 15);
    if (range === '₹15 - ₹30') l = l.filter((p) => p.price >= 15 && p.price <= 30);
    if (range === 'Above ₹30') l = l.filter((p) => p.price > 30);
    if (quick.has('Organic')) l = l.filter((p) => p.organic);
    if (quick.has('Near by')) l = l.filter((p) => p.nearby);
    if (quick.has('In stock')) l = l.filter((p) => p.stock > 0);
    if (quick.has('Best Price')) l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === 'Price: Low to High') l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') l = [...l].sort((a, b) => b.price - a.price);
    else if (sort === 'Name (A-Z)') l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [cat, q, sort, range, quick]);

  const toggleQuick = (k: string) =>
    setQuick((s) => {
      const n = new Set(s);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });

  const insights = ['tomato', 'onion', 'potato'].map((id) => getProduct(id)!);

  return (
    <div className="market">
      <div className="market-wrap">
        <div className="hero-banner">
          <img src="/assets/hero-farmer.jpg" alt="Fresh Crops, Brighter Futures. A smarter marketplace for stronger farms: better prices, direct buyers, more opportunities." />
          <button className="hero-hot" aria-label="Explore Market" onClick={() => document.getElementById('market-grid')?.scrollIntoView({ behavior: 'smooth' })} />
        </div>

        <div className="market-body">
        <div className="market-left">
        <div className="cat-tabs" role="tablist" aria-label="Crop categories">
          {CATEGORIES.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c && !q} className={cat === c && !q ? 'on' : ''} onClick={() => { setCat(c); if (q) setQ(''); }}>{c}</button>
          ))}
        </div>

        <div className="filters">
          <label className="msearch">
            <IconSearch size={30} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search in ${cat === 'All' ? 'all crops' : cat}.....`} aria-label="Search crops" />
          </label>
          <label className="sel">
            <small>Sort by</small>
            <select value={sort} onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])} aria-label="Sort by">
              {SORTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <IconChevronDown size={18} />
          </label>
          <label className="sel">
            <small>Price Range</small>
            <select value={range} onChange={(e) => setRange(e.target.value as (typeof RANGES)[number])} aria-label="Price range">
              {RANGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <IconChevronDown size={18} />
          </label>
        </div>

        <div id="market-grid" className="grid">
          {list.map((p) => (
            <article key={p.id} className="pcard">
              <Link to={`/product/${p.id}`} className="pcard-img" aria-label={`${p.name} details`}>
                <ProductImage product={p} />
              </Link>
              <div className="pcard-body">
                <div className="pcard-top">
                  <h3>{p.name}</h3>
                  <span className="avail">{p.stock} kg available</span>
                </div>
                <div className="price">₹ {p.price}/kg</div>
                <div className="meta"><IconPerson size={15} /> {p.farmer}</div>
                <div className="meta"><IconMiniPin size={13} /> {p.location}</div>
                <button className="btn-view" onClick={() => navigate(`/product/${p.id}`)}>View Details</button>
              </div>
            </article>
          ))}
          {list.length === 0 && (
            <div className="empty">
              <p>No crops match your filters.</p>
              <button className="btn-line" onClick={() => { setQ(''); setRange('All'); setQuick(new Set()); setCat('All'); }}>Clear filters</button>
            </div>
          )}
        </div>
        </div>

        <aside className="market-side">
        <section className="card insights" aria-label="Market insights">
          <h2><IconBars size={20} color="#222" /> Market Insights</h2>
          <ul>
            {insights.map((p) => (
              <li key={p.id}>
                <button onClick={() => navigate(`/product/${p.id}`)}>
                  <span><b>{p.name}</b><br /><em className="gp">₹ {p.price}/kg</em></span>
                  <span className={`arrow ${p.trend >= 0 ? 'up' : 'down'}`}>{p.trend >= 0 ? '↑' : '↓'}</span>
                  <span className={`pct ${p.trend >= 0 ? 'up' : 'down'}`}>{p.trend >= 0 ? '+' : ''}{p.trend}%</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="card qf" aria-label="Quick filters">
          <h2>Quick Filters</h2>
          <div className="qf-list">
            {QUICK.map((k) => (
              <button key={k} className={quick.has(k) ? 'on' : ''} aria-pressed={quick.has(k)} onClick={() => toggleQuick(k)}>{k}</button>
            ))}
          </div>
        </section>
        <img className="sprout" src="/assets/sprout.jpg" alt="A young plant growing in soil" />
        </aside>
        </div>
      </div>
    </div>
  );
}

