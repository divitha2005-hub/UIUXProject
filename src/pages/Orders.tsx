import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductImage } from '../components/Bits';
import { STEPPER, currentStep, fmtDate, getOrders, rupees, stepperIndex } from '../lib/orders';
import { getProduct } from '../data/products';

export function OrderThumb({ productId, image, className }: { productId: string; image: string; className?: string }) {
  const p = getProduct(productId);
  if (image) return <img className={className} src={image} alt="" />;
  return p ? <ProductImage product={p} className={className} /> : <div className={className} />;
}

export default function Orders() {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 3000);
    return () => clearInterval(t);
  }, []);
  const orders = getOrders();

  return (
    <div className="page-pad orders-page">
      <h1 className="page-title">Order Tracking</h1>
      <p className="page-sub big">Your orders. Select one to see where it is.</p>
      <ul className="olist">
        {orders.map((o) => {
          const t = currentStep(o);
          return (
            <li key={o.id} className="card">
              <OrderThumb productId={o.productId} image={o.image} className="o-img" />
              <div className="o-info">
                <h3>{o.name}</h3>
                <p>Order #{o.id} · Placed {fmtDate(o.createdAt)}</p>
                <p>{o.qty}kg × ₹{o.unitPrice}/kg = <b>{rupees(o.total)}</b></p>
              </div>
              <span className={`chip ${t === 4 ? 'done' : ''}`}>{STEPPER[stepperIndex(t)]}</span>
              <Link className="btn-solid" to={`/orders/${o.id}`}>Track order</Link>
            </li>
          );
        })}
      </ul>
      <p className="muted">Want to order something else? <Link to="/market">Browse the Crop Market</Link></p>
    </div>
  );
}
