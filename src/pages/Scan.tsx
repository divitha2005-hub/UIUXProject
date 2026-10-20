import { Link } from 'react-router-dom';
import { UploadCard } from '../components/UploadCard';
import { getDisease } from '../data/diseases';
import { getScanHistory, saveScan } from '../lib/scans';
import { useNavigate } from 'react-router-dom';

export default function Scan() {
  const history = getScanHistory();
  const navigate = useNavigate();
  return (
    <div className="page-pad narrow-page">
      <h1 className="page-title">Scan Crop</h1>
      <p className="page-sub">Upload or take a photo of an affected leaf. We will analyze it and suggest remedies (demo).</p>
      <UploadCard />
      <h2 className="sec-title">Recent scans</h2>
      {history.length === 0 ? (
        <p className="muted">No scans yet. Try the sample leaf above, or upload your own photo.</p>
      ) : (
        <ul className="recent">
          {history.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => {
                  saveScan(s);
                  navigate('/scan/results');
                }}
              >
                <img src={s.image} alt="" />
                <span><b>{getDisease(s.diseaseId).name}</b><small>{new Date(s.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="muted"><Link to="/">Back to Home</Link></p>
    </div>
  );
}
