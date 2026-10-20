import { PRODUCTS } from '../data/products';
import { SCHEMES } from '../data/schemes';

export interface Suggestion {
  label: string;
  hint: string;
  to: string;
}

const PAGES: Suggestion[] = [
  { label: 'Home', hint: 'Page', to: '/' },
  { label: 'Scan Crop', hint: 'Page', to: '/scan' },
  { label: 'Crop Market', hint: 'Page', to: '/market' },
  { label: 'AI Pricing Assistant', hint: 'Page', to: '/assistant' },
  { label: 'Soil Health', hint: 'Page', to: '/soil' },
  { label: 'Order Tracking', hint: 'Page', to: '/orders' },
];

export function suggest(q: string, locationName: string): Suggestion[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const out: Suggestion[] = [];
  if ('weather'.includes(s) || s.includes('weather') || s.includes('rain') || s.includes('temperature')) {
    out.push({ label: `Weather in ${locationName.split(',')[0]}`, hint: 'Weather', to: '/#weather' });
  }
  PRODUCTS.filter((p) => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)).forEach((p) =>
    out.push({ label: p.name, hint: `Crop, ${p.category}`, to: `/product/${p.id}` }),
  );
  SCHEMES.filter((x) => x.name.toLowerCase().includes(s) || x.tag.toLowerCase().includes(s) || 'scheme'.includes(s) || s.includes('scheme')).forEach((x) =>
    out.push({ label: x.name, hint: 'Scheme', to: `/schemes#${x.id}` }),
  );
  PAGES.filter((p) => p.label.toLowerCase().includes(s)).forEach((p) => out.push(p));
  return out.slice(0, 7);
}
