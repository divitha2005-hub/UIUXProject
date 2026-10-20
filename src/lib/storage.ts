// Safe localStorage helpers (storage can be blocked or full).
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const KEYS = {
  orders: 'agri.orders.v1',
  scan: 'agri.lastScan.v1',
  scanHistory: 'agri.scanHistory.v1',
  location: 'agri.location.v1',
  lastProduct: 'agri.lastProduct.v1',
};

export function resetDemoData() {
  Object.values(KEYS).forEach(remove);
}
