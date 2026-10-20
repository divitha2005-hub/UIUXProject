import { DISEASES, getDisease, severityLabel } from '../data/diseases';
import { KEYS, load, save } from './storage';

export interface Scan {
  id: string;
  fileName: string;
  image: string; // data URL (downsized) or asset path
  diseaseId: string;
  conf: { name: string; pct: number }[];
  score: number;
  createdAt: number;
  sample: boolean;
}

export const SAMPLE_IMAGE = '/assets/leaf.jpg';

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Simulated analysis. Deterministic for the same file, NOT a real prediction. */
export function simulateScan(fileName: string, size: number, image: string, sample: boolean): Scan {
  const sampleScan = sample;
  const h = hash(`${fileName}:${size}`);
  const main = sampleScan ? DISEASES[0] : DISEASES[h % DISEASES.length];
  const top = sampleScan ? 92 : 74 + (h % 22); // 74..95
  const rest = 100 - top;
  const others = DISEASES.filter((d) => d.id !== main.id && d.id !== 'healthy');
  const a = others[(h >>> 3) % others.length];
  const b = others.filter((d) => d.id !== a.id)[(h >>> 5) % (others.length - 1)];
  const second = sampleScan ? 5 : Math.max(1, Math.round(rest * 0.62));
  const conf = [
    { name: main.name, pct: top },
    { name: sampleScan ? 'Late Blight' : a.name, pct: second },
    { name: sampleScan ? 'Septoria Spot' : b.name, pct: rest - second },
  ];
  const score = sampleScan ? 6.8 : Math.round((main.baseScore + ((h % 9) - 4) / 10) * 10) / 10;
  return { id: `S${Date.now()}`, fileName, image, diseaseId: main.id, conf, score, createdAt: Date.now(), sample: sampleScan };
}

export function defaultScan(): Scan {
  return simulateScan('sample-leaf.jpg', 0, SAMPLE_IMAGE, true);
}

export const getLastScan = (): Scan => load<Scan | null>(KEYS.scan, null) ?? defaultScan();
export const getScanHistory = (): Scan[] => load<Scan[]>(KEYS.scanHistory, []);

export function saveScan(s: Scan) {
  save(KEYS.scan, s);
  save(KEYS.scanHistory, [s, ...getScanHistory().filter((x) => x.id !== s.id)].slice(0, 6));
}

export const scanSeverity = (s: Scan) => severityLabel(s.score);
export const scanDisease = (s: Scan) => getDisease(s.diseaseId);

/** Read a file and downsize it so it fits in localStorage. */
export function fileToDataUrl(file: File, max = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the image'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('This file is not a valid image'));
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export async function urlToDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error('read failed'));
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(blob);
  });
}
