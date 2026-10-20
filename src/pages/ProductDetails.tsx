import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { IconBack, IconStar } from '../components/Icons';
import { TrendChart } from '../components/Charts';
import { Modal } from '../components/Modal';
import { ProductImage, QtyStepper, Tabs } from '../components/Bits';
import { useApp } from '../components/AppContext';
import { MONTHS, getProduct, productDescription, productReviews, productSpecs } from '../data/products';
import { createOrder, rupees } from '../lib/orders';
import { KEYS, load, save } from '../lib/storage';

const TABS = ['Overview', 'Specifications', 'Reviews'] as const;
type Tab = (typeof TABS)[number];

export function ProductIndex() {
  return <Navigate to={`/product/${load<string>(KEYS.lastProduct, 'tomato')}`} replace />;
}

export default function ProductDetails() {
  const { id } = useParams();
  const product = getProduct(id);
  const navigate = useNavigate();
  const { toast } = useApp();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('Overview');
  const [img, setImg] = useState(0);
  const [modal, setModal] = useState<'order' | 'contact' | null>(null);
  const [address, setAddress] = useState('Ramesh, Mysore, Karnataka');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (product) save(KEYS.lastProduct, product.id);
    setQty(1);
    setImg(0);
    setTab('Overview');
  }, [product]);

  if (!product) {
    return (
      <div className="page-pad">
        <button className="back" onClick={() => navigate('/market')}><IconBack size={34} /> Back to Marketplace</button>
        <p className="muted">We could not find that product.</p>
      </div>
    );
  }

  // Gallery: original thumbnails from the design for tomatoes, otherwise crops of the product photo.
  const gallery: { src?: string; style?: React.CSSProperties }[] =
    product.id === 'tomato'
      ? [{ src: '/assets/tomato-main.jpg' }, { src: '/assets/tomato-t1.jpg' }, { src: '/assets/tomato-t2.jpg' }, { src: '/assets/tomato-t3.jpg' }]
      : product.image
        ? [{ src: product.image }, { src: product.image, style: { objectPosition: 'left center', transform: 'scale(1.5)' } }, { src: product.image, style: { objectPosition: 'right center', transform: 'scale(1.5)' } }, { src: product.image, style: { objectPosition: 'center bottom', transform: 'scale(1.9)' } }]
        : [];
  const main = gallery[img];
  const thumbs = gallery.map((g, i) => ({ g, i })).filter((x) => x.i !== img).slice(0, 3);

  const similar = product.similar.map((s) => getProduct(s)!).filter(Boolean);
  const total = qty * product.price;

  const place = () => {
    const o = createOrder(product.id, qty, address.trim() || 'Ramesh, Mysore, Karnataka');
    if (!o) return;
    setModal(null);
    toast(`Order #${o.id} placed successfully`);
    navigate(`/orders/${o.id}`);
  };

  const rating = product.rating.toFixed(1);

  return (
    <div className="split product">
      <div className="split-main">
        <button className="back" onClick={() => navigate('/market')}><IconBack size={36} /> Back to Marketplace</button>

        <div className="prod-top">
          <div className="gallery">
            <div className="thumbs">
              {thumbs.map(({ g, i }) => (
                <button key={i} onClick={() => setImg(i)} aria-label={`Show photo ${i + 1}`}>
                  <img src={g.src} alt="" style={g.style} />
                </button>
              ))}
            </div>
            <div className="mainimg">
              {main ? <img src={main.src} alt={product.title} style={main.style} /> : <ProductImage product={product} />}
            </div>
          </div>

          <div className="prod-info">
            <h1>{product.title}</h1>
            <div className="rating"><IconStar size={38} /> <span>{rating}({product.reviews} reviews)</span></div>
            <div className="pprice">₹ {product.price}/Kg</div>
            <div className="ptags">
              {product.organic && <span className="t-org">100% Organic</span>}
              <span className="t-pest">Pesticide Free</span>
              <span className="t-local">Local Farm</span>
            </div>
            <div className="farmer-box">
              <b>Farmer Details</b>
              <div className="farmer-row">
                <span className="avatar sm" />
                <span className="fname">{product.farmer}<br />{product.location}</span>
                <button className="btn-contact" onClick={() => setModal('contact')}>Contact Farmer</button>
              </div>
            </div>
          </div>
        </div>

        <div className="features">
          <div>100% Natural</div>
          <div>Rich in Nutrients</div>
          <div>Pan India Delivery</div>
        </div>

        <div className="buy-row">
          <div className="qlabel">
            <b>Quantity</b>
            <small>Total: {rupees(total)}</small>
          </div>
          <QtyStepper value={qty} onChange={setQty} max={product.stock} />
          <button className="btn-place" onClick={() => setModal('order')}>Place order</button>
        </div>
        {qty >= product.stock && <p className="form-err">Only {product.stock} kg are available.</p>}

        <div className="ptabs card">
          <Tabs tabs={TABS} active={tab} onChange={setTab} className="tabs-3 green" />
          <div className="tab-body left">
            {tab === 'Overview' && productDescription(product).split('\n').map((t) => <p key={t}>{t}</p>)}
            {tab === 'Specifications' && (
              <table className="spec">
                <tbody>{productSpecs(product).map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody>
              </table>
            )}
            {tab === 'Reviews' && (
              <ul className="reviews">
                {productReviews(product).map((r) => (
                  <li key={r.who}><b>{r.who}</b> <span aria-label={`${r.stars} stars`}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span><p>{r.text}</p></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <aside className="split-side">
        <section className="card graph" aria-label="Graph analysis">
          <TrendChart values={product.history} labels={MONTHS} compact height={150} badge={`${product.trend >= 0 ? '+' : ''}${product.trend}%`} />
          <p className="gcap">Graph analysis</p>
        </section>

        <section className="card similar" aria-label="Similar crops">
          <h2>Similar Crops</h2>
          <ul>
            {similar.map((s) => (
              <li key={s.id}>
                <Link to={`/product/${s.id}`}>
                  <ProductImage product={s} small className="sim-img" />
                  <b>{s.name}</b>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <img className="sprout" src="/assets/sprout.jpg" alt="A young plant growing in soil" />
      </aside>

      {modal === 'order' && (
        <Modal title="Confirm your order" onClose={() => setModal(null)}>
          <div className="sum">
            <div><span>{product.title}</span><b>{qty} kg × ₹{product.price}</b></div>
            <div className="tot"><span>Total</span><b>{rupees(total)}</b></div>
          </div>
          <label className="field">Deliver to
            <input value={address} onChange={(e) => setAddress(e.target.value)} maxLength={120} />
          </label>
          <p className="small-note">Payment: Cash on delivery (demo). No real order or payment is made.</p>
          <div className="modal-actions">
            <button className="btn-line" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn-solid" onClick={place}>Confirm order</button>
          </div>
        </Modal>
      )}

      {modal === 'contact' && (
        <Modal title={`Contact ${product.farmer}`} onClose={() => setModal(null)}>
          <p className="small-note">{product.location}</p>
          <p><b>Phone:</b> <a href={`tel:${product.phone.replace(/\s/g, '')}`}>{product.phone}</a> <small className="muted">(sample number)</small></p>
          <label className="field">Message
            <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={`Hello ${product.farmer.split(' ')[0]}, is ${product.name.toLowerCase()} available for delivery this week?`} />
          </label>
          <div className="modal-actions">
            <button className="btn-line" onClick={() => setModal(null)}>Close</button>
            <button className="btn-solid" onClick={() => { setModal(null); setMsg(''); toast(`Message sent to ${product.farmer} (demo)`); }}>Send message</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
