import { type ReactNode } from 'react';
import type { Product } from '../data/products';

/** Original photo when we have it, a clearly-labelled tile with an emoji otherwise. */
export function ProductImage({ product, className = '', small = false, alt }: { product: Pick<Product, 'name' | 'image' | 'thumb' | 'emoji' | 'tint'>; className?: string; small?: boolean; alt?: string }) {
  const src = small ? product.thumb ?? product.image : product.image;
  if (src) return <img className={className} src={src} alt={alt ?? product.name} loading="lazy" />;
  return (
    <div className={`img-tile ${className}`} style={{ background: product.tint }} role="img" aria-label={alt ?? product.name}>
      <span>{product.emoji}</span>
    </div>
  );
}

export function QtyStepper({ value, onChange, min = 1, max = 9999 }: { value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  const clamp = (n: number) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : min));
  return (
    <div className="qty">
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(clamp(value + 1))}>+</button>
      <input
        aria-label="Quantity"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(clamp(parseInt(e.target.value.replace(/\D/g, ''), 10)))}
      />
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(clamp(value - 1))}>-</button>
    </div>
  );
}

export function Tabs<T extends string>({ tabs, active, onChange, className = '' }: { tabs: readonly T[]; active: T; onChange: (t: T) => void; className?: string }) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {tabs.map((t) => (
        <button key={t} role="tab" aria-selected={t === active} className={t === active ? 'on' : ''} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  );
}

export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`page-pad ${className}`}>{children}</div>;
}
