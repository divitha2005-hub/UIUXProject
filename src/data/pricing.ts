import { PRODUCTS } from './products';

export interface PricingCrop {
  id: string;
  name: string;
  thumb?: string;
  emoji: string;
  recommended: number;
  demand: number; // %
  productId?: string;
}

// Demonstration pricing data only - not real market predictions.
export const PRICING_CROPS: PricingCrop[] = [
  { id: 'tomato', name: 'Tomato', thumb: '/assets/tomato.jpg', emoji: '🍅', recommended: 40, demand: 94, productId: 'tomato' },
  { id: 'onion', name: 'Onion', thumb: '/assets/onion.jpg', emoji: '🧅', recommended: 32, demand: 71, productId: 'onion' },
  { id: 'potato', name: 'Potatoes', thumb: '/assets/potato-sm.jpg', emoji: '🥔', recommended: 28, demand: 78, productId: 'potato' },
  { id: 'capsicum', name: 'Capsicum', thumb: '/assets/capsicum.jpg', emoji: '🫑', recommended: 56, demand: 82 },
  { id: 'persimmon', name: 'Persimmon', thumb: '/assets/persimmon.jpg', emoji: '🍅', recommended: 90, demand: 64 },
  { id: 'green-chilli', name: 'Green Chilli', thumb: '/assets/chilli.jpg', emoji: '🌶️', recommended: 24, demand: 69, productId: 'green-chilli' },
  { id: 'carrot', name: 'Carrot', thumb: '/assets/carrot.jpg', emoji: '🥕', recommended: 30, demand: 73, productId: 'carrot' },
  { id: 'cabbage', name: 'Cabbage', thumb: '/assets/cabbage.jpg', emoji: '🥬', recommended: 38, demand: 58, productId: 'cabbage' },
  { id: 'rice', name: 'Rice', emoji: '🍚', recommended: 56, demand: 85, productId: 'rice' },
  { id: 'maize', name: 'Maize', emoji: '🌽', recommended: 26, demand: 60, productId: 'maize' },
  { id: 'banana', name: 'Banana', emoji: '🍌', recommended: 38, demand: 76, productId: 'banana' },
];

export const PRICING_LOCATIONS = ['Mysore, Karnataka', 'Mandya, Karnataka', 'Hassan, Karnataka', 'Bengaluru, Karnataka', 'Coorg, Karnataka'];
const LOC_FACTOR: Record<string, number> = {
  'Mysore, Karnataka': 1,
  'Mandya, Karnataka': 0.96,
  'Hassan, Karnataka': 0.98,
  'Bengaluru, Karnataka': 1.08,
  'Coorg, Karnataka': 1.04,
};

export interface Insights {
  crop: PricingCrop;
  location: string;
  qty: number;
  recommended: number;
  demand: number;
  trendPct: number;
  low: number;
  high: number;
  series: number[]; // 6 points over the last 30 days
  labels: string[];
  rows: { type: string; current: number; week: number; month: number; trend: 'High' | 'Moderate' | 'Low' }[];
  advice: string[];
}

const dayLabel = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export function getInsights(cropId: string, qty: number, location: string): Insights {
  const crop = PRICING_CROPS.find((c) => c.id === cropId) ?? PRICING_CROPS[0];
  const f = LOC_FACTOR[location] ?? 1;
  const ratio = (crop.recommended / 40) * f;
  const r = (n: number) => Math.max(1, Math.round(n * ratio));
  const recommended = r(40);
  const trendPct = crop.id === 'tomato' ? 12 : Math.round((crop.demand - 60) / 3);
  const trend = (d: number): 'High' | 'Moderate' | 'Low' => (d >= 75 ? 'High' : d >= 55 ? 'Moderate' : 'Low');
  const series = [0.8, 0.82, 0.86, 0.9, 0.93, 1].map((k) => Math.round(recommended * k));
  const labels = [29, 23, 17, 11, 5, 0].map(dayLabel);
  const lo = Math.max(1, Math.round(recommended * 0.87));
  const hi = Math.round(recommended * 1.12);
  const rows = [
    { type: 'Your Price', current: r(40), week: r(35), month: r(32), trend: trend(crop.demand) },
    { type: 'Market Average', current: r(38), week: r(34), month: r(30), trend: trend(crop.demand) },
    { type: 'Lowest Price', current: r(28), week: r(25), month: r(22), trend: 'Moderate' as const },
    { type: 'Highest Price', current: r(60), week: r(55), month: r(50), trend: trend(crop.demand) },
  ];
  const base = crop.name.toLowerCase();
  const name = base.endsWith('s') ? base : base.endsWith('o') ? `${base}es` : `${base}s`;
  const advice = [
    crop.demand >= 75 ? `High market demand for ${name}.` : crop.demand >= 55 ? `Steady market demand for ${name}.` : `Demand for ${name} is soft right now.`,
    `Keep prices between ₹${Math.round(recommended * 0.88)}–₹${Math.round(recommended * 1.12)}/kg for faster sales.`,
    qty >= 10 ? `For ${qty} quintals, offer a small bulk discount (3–5%) to close the deal quickly.` : 'Quality organic products can fetch 10–15% higher prices.',
  ];
  return { crop, location, qty, recommended, demand: crop.demand, trendPct, low: lo, high: hi, series, labels, rows, advice };
}

export const productForCrop = (id: string) => PRODUCTS.find((p) => p.id === id);
