import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { KEYS, load, save } from '../lib/storage';
import { LOCATIONS } from '../data/weather';

interface Ctx {
  location: string;
  setLocation: (l: string) => void;
  toast: (msg: string) => void;
}

const AppCtx = createContext<Ctx>({ location: LOCATIONS[0], setLocation: () => {}, toast: () => {} });
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }: { children: ReactNode }) {
  const [location, setLoc] = useState<string>(() => {
    const l = load<string>(KEYS.location, LOCATIONS[0]);
    return LOCATIONS.includes(l) ? l : LOCATIONS[0];
  });
  const [msg, setMsg] = useState<string | null>(null);

  const setLocation = useCallback((l: string) => {
    setLoc(l);
    save(KEYS.location, l);
  }, []);
  const toast = useCallback((m: string) => setMsg(m), []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3200);
    return () => clearTimeout(t);
  }, [msg]);

  const value = useMemo(() => ({ location, setLocation, toast }), [location, setLocation, toast]);
  return (
    <AppCtx.Provider value={value}>
      {children}
      <div className="toast-wrap" aria-live="polite">{msg && <div className="toast" role="status">{msg}</div>}</div>
    </AppCtx.Provider>
  );
}
