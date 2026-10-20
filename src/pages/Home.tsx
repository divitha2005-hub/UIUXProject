import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBulb, IconChevronLeft, IconChevronRight, IconCloud, IconSun, ShortcutAI, ShortcutMarket, ShortcutOrder, ShortcutProduct } from '../components/Icons';
import { UploadCard } from '../components/UploadCard';
import { useApp } from '../components/AppContext';
import { TIPS, WEATHER } from '../data/weather';

const SLIDES = [
  { img: '/assets/banner-field.jpg', baked: true },
  { img: '/assets/sprout.jpg', title: 'Scan early, save your yield', text: 'Spot crop disease before it spreads.' },
  { img: '/assets/tomato-main.jpg', title: 'Sell at the right price', text: 'See live-style price trends for your crop.' },
];

export function greeting(h = new Date().getHours()) {
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
}

export default function Home() {
  const navigate = useNavigate();
  const { location } = useApp();
  const w = WEATHER[location] ?? WEATHER['Mysore, India'];
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const tipIdx = useMemo(() => new Date().getDate() % TIPS.length, []);
  const [tip, setTip] = useState(tipIdx);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (d: number) => setSlide((s) => (s + d + SLIDES.length) % SLIDES.length);

  const quick = [
    { label: 'Check Crop prices', cls: 'qa-green', to: '/market' },
    { label: 'Buy Products >', cls: 'qa-yellow', to: '/market' },
    { label: 'Check Trends >', cls: 'qa-blue', to: '/assistant' },
    { label: 'Ask AI Assistant >', cls: 'qa-pink', to: '/assistant' },
  ];

  const shortcuts = [
    { label: 'Crop Market', icon: <ShortcutMarket />, to: '/market' },
    { label: 'Product Details', icon: <ShortcutProduct />, to: '/product' },
    { label: 'Order Product', icon: <ShortcutOrder />, to: '/orders' },
    { label: 'AI Assistant', icon: <ShortcutAI />, to: '/assistant' },
  ];

  return (
    <div className="split">
      <div className="split-main">
        <div className="greet">
          <h1>{greeting()} , Ramesh !</h1>
          <IconSun size={76} />
        </div>
        <p className="greet-sub">Let's keep your crops healthy today</p>

        <div className="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel">
          {SLIDES.map((s, i) => (
            <div key={s.img} className={`slide${i === slide ? ' on' : ''}`} aria-hidden={i !== slide}>
              <img src={s.img} alt={s.baked ? 'Better Crops, Brighter Futures: smart solutions for a sustainable agriculture' : s.title} />
              {!s.baked && (
                <div className="slide-text">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              )}
            </div>
          ))}
          <button className="car-arrow l" onClick={() => go(-1)} aria-label="Previous slide"><IconChevronLeft size={20} /></button>
          <button className="car-arrow r" onClick={() => go(1)} aria-label="Next slide"><IconChevronRight size={20} /></button>
          <div className="car-dots">
            {SLIDES.map((_, i) => (
              <button key={i} className={i === slide ? 'on' : ''} onClick={() => setSlide(i)} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </div>

        <UploadCard />

        <div className="shortcuts">
          {shortcuts.map((s) => (
            <button key={s.label} className="shortcut" onClick={() => navigate(s.to)}>
              {s.icon}
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <aside className="split-side">
        <section className="card weather" id="weather" aria-label="Today's weather (sample data)">
          <h2>Today's Weather</h2>
          <div className="weather-top">
            <IconCloud size={140} />
            <span className="temp">{w.temp} C</span>
          </div>
          <dl>
            <div><dt>Humidity</dt><dd>{w.humidity}%</dd></div>
            <div><dt>Wind</dt><dd>{w.wind}km/hr</dd></div>
            <div><dt>Rain Chance</dt><dd>{w.rain}%</dd></div>
          </dl>
        </section>

        <section className="card qa" aria-label="Quick actions">
          <h2>Quick Actions</h2>
          <div className="qa-grid">
            {quick.map((q) => (
              <button key={q.label} className={q.cls} onClick={() => navigate(q.to)}>{q.label}</button>
            ))}
          </div>
        </section>

        <section className="card tip" aria-label="Today's tip">
          <h2>
            <button className="bulb" onClick={() => setTip((t) => (t + 1) % TIPS.length)} title="Show another tip" aria-label="Show another tip"><IconBulb size={28} /></button>
            Today's Tip
          </h2>
          <p>{TIPS[tip]}</p>
        </section>
      </aside>
    </div>
  );
}
