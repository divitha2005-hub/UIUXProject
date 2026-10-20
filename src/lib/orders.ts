import { KEYS, load, save } from './storage';
import { getProduct } from '../data/products';

export const STAGE_SECONDS = 20; // demo speed: one tracking update every 20 seconds

export interface Order {
  id: number;
  productId: string;
  name: string; // line item title, e.g. "Heirloom Tomatoes (25kg)"
  image: string;
  qty: number;
  unitPrice: number;
  total: number;
  seller: string;
  sellerLocation: string;
  phone: string;
  address: string;
  createdAt: number; // ms
  estDelivery: number; // ms
  pinnedStage?: number; // seeded demo order stays at this step until advanced
  boost: number; // steps advanced through "Simulate update"
}

// Timeline steps (5) and the stepper (4) they map onto
export const TIMELINE = ['Order Confirmed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
export const STEPPER = ['Order Placed', 'In Transit', 'Out for Delivery', 'Delivered'];
export const stepperIndex = (t: number) => (t <= 1 ? 0 : t - 1);

const DAY = 86_400_000;

function seed(): Order[] {
  const now = Date.now();
  return [
    {
      id: 1104,
      productId: 'tomato',
      name: 'Heirloom Tomatoes (25kg)',
      image: '/assets/order-tomato.jpg',
      qty: 25,
      unitPrice: 60,
      total: 1500,
      seller: 'Green Valley Farmers',
      sellerLocation: 'Mysore, Karnataka',
      phone: '9515797711',
      address: 'Ramesh, Mysore, Karnataka',
      createdAt: new Date(now - 2 * DAY).setHours(10, 30, 0, 0),
      estDelivery: now + 2 * DAY,
      pinnedStage: 2,
      boost: 0,
    },
  ];
}

export function getOrders(): Order[] {
  const stored = load<Order[] | null>(KEYS.orders, null);
  if (stored && stored.length) return stored;
  const s = seed();
  save(KEYS.orders, s);
  return s;
}

export const getOrder = (id: number) => getOrders().find((o) => o.id === id);

export function nextOrderId() {
  return Math.max(1104, ...getOrders().map((o) => o.id)) + 1;
}

export function createOrder(productId: string, qty: number, address: string): Order | null {
  const prod = getProduct(productId);
  if (!prod) return null;
  const now = Date.now();
  const order: Order = {
    id: nextOrderId(),
    productId,
    name: `${prod.title} (${qty}kg)`,
    image: prod.image ?? '',
    qty,
    unitPrice: prod.price,
    total: prod.price * qty,
    seller: prod.farmer,
    sellerLocation: prod.location,
    phone: prod.phone,
    address,
    createdAt: now,
    estDelivery: now + 3 * DAY,
    boost: 0,
  };
  save(KEYS.orders, [order, ...getOrders()]);
  return order;
}

export function advanceOrder(id: number) {
  const all = getOrders().map((o) => (o.id === id ? { ...o, boost: o.boost + 1 } : o));
  save(KEYS.orders, all);
}

/** Current timeline index (0..4) for an order. Simulated, not real tracking. */
export function currentStep(o: Order, now = Date.now()): number {
  const base = o.pinnedStage ?? Math.floor((now - o.createdAt) / (STAGE_SECONDS * 1000));
  return Math.max(0, Math.min(4, base + o.boost));
}

export const progressPct = (t: number) => [25, 40, 55, 80, 100][t];

export const stepTime = (o: Order, i: number): number => {
  if (o.pinnedStage !== undefined) {
    // seeded order: placed 2 days ago, picked up yesterday, in transit today
    const today1620 = new Date().setHours(16, 20, 0, 0);
    const base = [o.createdAt, o.createdAt + DAY - 75 * 60_000, Math.min(today1620, Date.now() - 30 * 60_000)];
    if (i < 3) return base[i];
    return o.createdAt + (i - 1) * DAY;
  }
  return o.createdAt + i * STAGE_SECONDS * 1000;
};

export const fmtDate = (ms: number) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtDateTime = (ms: number) => `${fmtDate(ms)}, ${new Date(ms).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
export const fmtDateLong = (ms: number) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
export const daysRemaining = (ms: number) => Math.max(0, Math.ceil((ms - Date.now()) / DAY));
export const rupees = (n: number) => `₹${n >= 10000 ? n.toLocaleString('en-IN') : n}`;
