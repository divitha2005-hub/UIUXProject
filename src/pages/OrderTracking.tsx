import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IconCalendar, IconCheck, IconCheckBox, IconDownload, IconHeadset, IconHouse, IconPhone, IconTruck, IconTruckGreen } from '../components/Icons';
import { Ring } from '../components/Charts';
import { Modal } from '../components/Modal';
import { OrderThumb } from './Orders';
import { useApp } from '../components/AppContext';
import { downloadInvoice, downloadTrackingSummary } from '../lib/download';
import { getProduct } from '../data/products';
import { STEPPER, TIMELINE, advanceOrder, currentStep, daysRemaining, fmtDate, fmtDateLong, fmtDateTime, getOrder, progressPct, rupees, stepTime, stepperIndex } from '../lib/orders';

const DONE_MSG = ['Your order has been confirmed', 'Package picked up from Mysore Collection Center', 'Your order is on the way to your location', 'Your order is out for delivery', 'Your order has been delivered'];
const WAIT_MSG = ['', '', '', 'Will be out for delivery soon', 'Estimated delivery date'];

const ROUTE: [number, number][] = [[22, 88], [48, 82], [74, 62], [112, 70], [150, 44], [184, 36], [206, 22]];

function pointAt(f: number): [number, number] {
  const seg = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = f * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const k = d / seg[i];
      return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * k, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * k];
    }
    d -= seg[i];
  }
  return ROUTE[ROUTE.length - 1];
}

export default function OrderTracking() {
  const { id } = useParams();
  const { toast } = useApp();
  const [, tick] = useState(0);
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState<'' | 'dl' | 'inv'>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const order = getOrder(Number(id));
  if (!order) {
    return (
      <div className="page-pad">
        <h1 className="page-title">Order not found</h1>
        <p className="muted">We could not find order #{id}. <Link to="/orders">See all orders</Link></p>
      </div>
    );
  }

  const t = currentStep(order);
  const s = stepperIndex(t);
  const pct = progressPct(t);
  const [tx, ty] = pointAt(pct / 100);
  const delivered = t === 4;

  const dl = async (kind: 'dl' | 'inv') => {
    setBusy(kind);
    try {
      await (kind === 'dl' ? downloadTrackingSummary(order) : downloadInvoice(order));
      toast(kind === 'dl' ? 'Tracking summary downloaded' : 'Invoice downloaded');
    } catch {
      toast('Could not create the file. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const nodeState = (i: number) => (i < s ? 'done' : i === s ? (s === 3 ? 'done' : 'active') : 'wait');

  return (
    <div className="page-pad tracking">
      <div className="trk-head">
        <div>
          <h1 className="page-title">Order Tracking</h1>
          <p className="trk-sub">{getProduct(order.productId)?.name ?? ''} Order #{order.id}</p>
        </div>
        <button className="btn-dl" onClick={() => dl('dl')} disabled={busy === 'dl'}><IconDownload size={34} /> {busy === 'dl' ? 'Preparing...' : 'Download'}</button>
      </div>

      <ol className="stepper" aria-label="Order status">
        {STEPPER.map((label, i) => {
          const st = nodeState(i);
          return (
            <li key={label} className={`stp ${st}`} aria-current={i === s ? 'step' : undefined}>
              <span className="circle">
                {st === 'done' && <IconCheckBox size={40} />}
                {st === 'active' && (i === 0 ? <IconCheckBox size={40} /> : <IconTruck size={44} />)}
              </span>
              <span className="lbl">{label}</span>
              {i < STEPPER.length - 1 && <span className={`conn${i < s ? ' on' : ''}`} />}
            </li>
          );
        })}
      </ol>

      <div className="trk-grid">
        <div className="trk-left">
          <section className="card odetails">
            <h2>Order Details</h2>
            <div className="od-row">
              <OrderThumb productId={order.productId} image={order.image} className="od-img" />
              <div className="od-info">
                <h3>{order.name}</h3>
                <p>₹{order.unitPrice}/kg</p>
                <p className="q">Quantity : {order.qty}kg</p>
              </div>
              <div className="od-total">
                <span>Total Amount</span>
                <b>{rupees(order.total)}</b>
                <button className="btn-inv" onClick={() => dl('inv')} disabled={busy === 'inv'}>{busy === 'inv' ? 'Preparing...' : 'View Invoice'}</button>
              </div>
            </div>
          </section>

          <section className="card seller">
            <span className="s-icon"><IconHouse size={30} /></span>
            <div className="s-info">
              <small>Seller</small>
              <b>{order.seller}</b>
              <span>{order.sellerLocation}</span>
            </div>
            <span className="vr" />
            <a className="s-phone" href={`tel:${order.phone.replace(/\s/g, '')}`}><IconPhone size={30} /> {order.phone}</a>
          </section>
        </div>

        <section className="card shipment" aria-label="Shipment tracking">
          <div className="ship-head">
            <h2>Shipment Tracking</h2>
            <button className="link-btn" disabled={delivered} onClick={() => { advanceOrder(order.id); tick((n) => n + 1); }} title="Demo only: move the order to its next step">
              {delivered ? 'Delivered' : 'Simulate update'}
            </button>
          </div>
          <ol className="timeline">
            {TIMELINE.map((label, i) => {
              const done = i <= t;
              const when = done ? fmtDateTime(stepTime(order, i)) : i === 4 ? `${fmtDate(order.estDelivery)} (Expected)` : fmtDate(order.estDelivery - 86400000);
              return (
                <li key={label} className={done ? 'done' : 'wait'}>
                  <span className="node">{done && <IconCheck size={12} />}</span>
                  <div className="tl-l"><b>{label}</b><small>{when}</small></div>
                  <div className="tl-r">{done ? DONE_MSG[i] : WAIT_MSG[i]}</div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <div className="trk-bottom">
        <section className="card est">
          <div className="est-top"><span className="cal"><IconCalendar size={34} /></span><b>Estimated Delivery</b></div>
          <p className="est-date">{delivered ? 'Delivered' : fmtDateLong(order.estDelivery)}</p>
          <p className="est-rem">{delivered ? 'Thank you for ordering!' : `${daysRemaining(order.estDelivery)} days remaining`}</p>
        </section>

        <section className="card live">
          <h3>Live Location</h3>
          <svg viewBox="0 0 230 110" role="img" aria-label={`Delivery progress ${pct}% (simulated map)`}>
            <rect width="230" height="110" fill="#f0ede8" />
            <path d="M0 98L70 78 150 98 230 66" stroke="#fff" strokeWidth="9" fill="none" />
            <path d="M120 0L128 110" stroke="#f3e6a4" strokeWidth="6" fill="none" />
            <path d="M0 30L90 40 170 10 230 24" stroke="#fff" strokeWidth="6" fill="none" />
            <polyline points={ROUTE.map((p) => p.join(',')).join(' ')} fill="none" stroke="#c5d9cb" strokeWidth="3" strokeDasharray="1 5" strokeLinecap="round" />
            <polyline points={[...ROUTE.filter((_, i) => i / (ROUTE.length - 1) < pct / 100), [tx, ty]].map((p) => p.join(',')).join(' ')} fill="none" stroke="#1d9a45" strokeWidth="3.500" strokeLinecap="round" strokeLinejoin="round" />
            <g transform="translate(206 22)"><path d="M0 0c-6-8-8-12-8-16a8 8 0 0 1 16 0c0 4-2 8-8 16z" fill="#e53935" transform="translate(0 3)" /><circle cy="-10" r="3" fill="#fff" /></g>
            <g transform={`translate(${tx - 14} ${ty - 14}) scale(.5)`} style={{ transition: 'transform .8s linear' }}><IconTruckGreen size={56} /></g>
          </svg>
        </section>

        <section className="card prog"><Ring pct={pct} label="Delivery progress" /><p>Delivery progress</p></section>

        <section className="card help">
          <div className="help-top"><IconHeadset size={46} /><b>Need Help ?</b></div>
          <p>Our support team is here to assist you</p>
          <button className="btn-support" onClick={() => setHelp(true)}>Contact Support</button>
        </section>
      </div>
      <p className="demo-line">Demo data: tracking updates are simulated and do not reflect a real shipment.</p>

      {help && (
        <Modal title="Contact support" onClose={() => setHelp(false)}>
          <p className="small-note">Order #{order.id}. This is a demo, so no message is actually sent.</p>
          <label className="field">How can we help?
            <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe the issue with your order" />
          </label>
          <div className="modal-actions">
            <button className="btn-line" onClick={() => setHelp(false)}>Cancel</button>
            <button className="btn-solid" disabled={!note.trim()} onClick={() => { setHelp(false); setNote(''); toast('Support request sent (demo)'); }}>Send</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
