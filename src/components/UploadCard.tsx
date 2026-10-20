import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowUp, IconCheck, IconUploadCloud } from './Icons';
import { Modal } from './Modal';
import { useApp } from './AppContext';
import { SAMPLE_IMAGE, fileToDataUrl, saveScan, simulateScan } from '../lib/scans';

const STEPS = ['Detect', 'Identify', 'Get Solutions'];
const MAX_MB = 10;

export function UploadCard({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { toast } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(-1); // number of finished steps while scanning (-1 = not scanning)
  const [camera, setCamera] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const scanning = done >= 0;

  const run = (image: string, fileName: string, size: number, sample: boolean) => {
    setPreview(image);
    setName(fileName);
    setErr('');
    setDone(0);
    [1, 2, 3].forEach((n) => timers.current.push(window.setTimeout(() => setDone(n), n * 850)));
    timers.current.push(
      window.setTimeout(() => {
        saveScan(simulateScan(fileName, size, image, sample));
        navigate('/scan/results');
      }, 3 * 850 + 450),
    );
  };

  const onFile = async (file?: File | null) => {
    if (!file || scanning) return;
    if (!file.type.startsWith('image/')) return setErr('Please choose an image file (JPG, PNG or WebP).');
    if (file.size > MAX_MB * 1024 * 1024) return setErr(`This image is larger than ${MAX_MB} MB. Please choose a smaller one.`);
    try {
      const url = await fileToDataUrl(file);
      run(url, file.name, file.size, false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not open this image.');
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    onFile(e.dataTransfer.files?.[0]);
  };

  const choose = () => !scanning && fileRef.current?.click();

  return (
    <section className="scan-card card" id={id} aria-labelledby="scan-h">
      <h2 id="scan-h">AI Crop Disease Detection</h2>
      <p className="sub">Upload an image to detect diseases</p>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />

      <div className="scan-grid">
        <div className="scan-left">
          <div
            className={`drop${drag ? ' over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={choose}
          >
            <IconUploadCloud size={82} />
            <p>Drag and Drop the image</p>
            <button type="button" className="btn-choose" onClick={(e) => { e.stopPropagation(); choose(); }} disabled={scanning}>Choose Image</button>
          </div>
          <div className="scan-actions">
            <button type="button" className="btn-photo" onClick={() => setCamera(true)} disabled={scanning}>Take Photo</button>
            <button type="button" className="btn-upload" onClick={choose} disabled={scanning}><IconArrowUp size={20} /> Upload File</button>
          </div>
          {err && <p className="form-err" role="alert">{err}</p>}
        </div>

        <div className="scan-right">
          <button
            type="button"
            className="leaf-btn"
            onClick={() => !scanning && run(SAMPLE_IMAGE, 'sample-leaf.jpg', 0, true)}
            aria-label={preview ? 'Selected crop image' : 'Try the sample leaf image'}
            title={preview ? name : 'Click to try the sample leaf'}
            disabled={scanning}
          >
            <img src={preview ?? SAMPLE_IMAGE} alt={preview ? 'Your crop image preview' : 'Sample diseased leaf'} />
          </button>
          <ul className="steps" aria-live="polite">
            {STEPS.map((s, i) => {
              const state = !scanning ? 'idle' : i < done ? 'done' : i === done ? 'active' : 'wait';
              return (
                <li key={s} className={`st-${state}`}>
                  <span className="dot">{state === 'done' && <IconCheck size={16} />}</span>
                  <b>{s}</b>
                </li>
              );
            })}
          </ul>
          <p className="hint">{scanning ? `Analyzing ${name}...` : preview ? '' : 'Tip: click the sample leaf to try a demo scan.'}</p>
        </div>
      </div>

      {camera && (
        <CameraModal
          onClose={() => setCamera(false)}
          onFallback={() => { setCamera(false); toast('Camera not available. Please choose an image instead.'); fileRef.current?.click(); }}
          onCapture={(file) => { setCamera(false); onFile(file); }}
        />
      )}
    </section>
  );
}

function CameraModal({ onClose, onCapture, onFallback }: { onClose: () => void; onCapture: (f: File) => void; onFallback: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!navigator.mediaDevices?.getUserMedia) {
      onFallback();
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        if (!alive) return s.getTracks().forEach((t) => t.stop());
        stream.current = s;
        if (video.current) {
          video.current.srcObject = s;
          video.current.play().then(() => setReady(true)).catch(() => setReady(true));
        }
      })
      .catch(() => alive && onFallback());
    return () => {
      alive = false;
      stream.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snap = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d')!.drawImage(v, 0, 0);
    c.toBlob((b) => b && onCapture(new File([b], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' })), 'image/jpeg', 0.9);
  };

  return (
    <Modal title="Take a photo of the leaf" onClose={onClose}>
      <video ref={video} className="cam" playsInline muted />
      <div className="modal-actions">
        <button className="btn-line" onClick={onClose}>Cancel</button>
        <button className="btn-solid" onClick={snap} disabled={!ready}>Capture</button>
      </div>
    </Modal>
  );
}
