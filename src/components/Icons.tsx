import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 24, p: SVGProps<SVGSVGElement> = {}) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true, ...p });

export const IconSearch = ({ size = 34, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 34 34" stroke="#333" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="15" cy="14" r="9.5" />
    <path d="M22 21l8 8" />
  </svg>
);

export const IconPin = ({ size = 48, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 48 56">
    <path d="M24 2C13 2 4 9.5 4 20c0 10 14 25 18.2 33.2a2 2 0 0 0 3.6 0C30 45 44 30 44 20 44 9.5 35 2 24 2z" fill="#6b6b6b" />
    <circle cx="24" cy="20" r="8.5" fill="#fff" />
  </svg>
);

export const IconPinGreen = ({ size = 34, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 34 40">
    <path d="M17 2C9 2 3 7.5 3 15c0 7.5 10 18 13 23.5a1.2 1.2 0 0 0 2 0C21 33 31 22.500 31 15 31 7.500 25 2 17 2z" fill="#22b24c" />
    <circle cx="17" cy="15" r="5.5" fill="#fff" />
  </svg>
);

export const IconCloud = ({ size = 140, ...p }: P) => (
  <svg {...base(size, p)} height={(size * 104) / 140} viewBox="0 0 140 104">
    <g fill="#0088fe">
      <circle cx="70" cy="30" r="28" />
      <circle cx="34" cy="62" r="30" />
      <circle cx="104" cy="66" r="28" />
      <rect x="34" y="58" width="72" height="36" rx="18" />
      <circle cx="70" cy="62" r="34" />
    </g>
  </svg>
);

export const IconSun = ({ size = 76, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 76 76">
    <circle cx="38" cy="38" r="15" fill="#fccb0c" />
    <g stroke="#fccb0c" strokeWidth="4.5" strokeLinecap="round">
      <path d="M38 6v8M38 62v8M6 38h8M62 38h8M15.400 15.400l5.600 5.600M55 55l5.600 5.600M15.400 60.600L21 55M55 21l5.600-5.600" />
    </g>
  </svg>
);

export const IconUploadCloud = ({ size = 82, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 82 82" stroke="#2b2b2b" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 56H22a15 15 0 0 1-2-29.800A22 22 0 0 1 62.500 22 17 17 0 0 1 60 56h-4" />
    <path d="M41 72V40M30 50l11-11 11 11" />
  </svg>
);

export const IconArrowUp = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V5M6 11l6-6 6 6" /></svg>
);

export const IconBack = ({ size = 34, ...p }: P) => (
  <svg {...base(size, p)} stroke="#111" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12H4M10 5l-7 7 7 7" /></svg>
);

export const IconDownload = ({ size = 30, ...p }: P) => (
  <svg {...base(size, p)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13M6 11l6 6 6-6M4 21h16" /></svg>
);

export const IconWarn = ({ size = 22, color = '#111', ...p }: P & { color?: string }) => (
  <svg {...base(size, p)}>
    <path d="M12 3L2 21h20L12 3z" fill={color} />
    <path d="M12 9.500v6" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" />
    <circle cx="12" cy="18" r="1.300" fill="#fff" />
  </svg>
);

export const IconWarnRed = ({ size = 34, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 2.500L1.500 21h21L12 2.500z" fill="#ef3b3b" stroke="#ef3b3b" strokeWidth="1.500" strokeLinejoin="round" />
    <path d="M12 9v6" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" />
    <circle cx="12" cy="17.800" r="1.300" fill="#fff" />
  </svg>
);

export const IconCheck = ({ size = 28, ...p }: P) => (
  <svg {...base(size, p)} stroke="currentColor" strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.500l5 5L20 6.500" /></svg>
);

export const IconCheckBox = ({ size = 40, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 40 40" stroke="#fff" strokeWidth="2.400" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="30" height="30" rx="3" />
    <path d="M12 20.500l6 6L28 14" />
  </svg>
);

export const IconTruck = ({ size = 40, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 40 28" fill="#fff">
    <rect x="1" y="3" width="21" height="16" rx="2" />
    <path d="M23 8h8l7 7v6a2 2 0 0 1-2 2H23V8z" />
    <circle cx="10" cy="23" r="4" stroke="#5fd78f" strokeWidth="2" />
    <circle cx="30" cy="23" r="4" stroke="#5fd78f" strokeWidth="2" />
    <path d="M26 11h4l3.500 4H26z" fill="#5fd78f" />
  </svg>
);

export const IconTruckGreen = ({ size = 56, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 56 36">
    <rect x="1" y="3" width="30" height="21" rx="2" fill="#1c9a45" />
    <path d="M33 10h11l10 10v8a2 2 0 0 1-2 2H33V10z" fill="#1c9a45" />
    <path d="M37 14h6l5 6h-11z" fill="#d5f5de" />
    <circle cx="14" cy="30" r="5" fill="#2a2a2a" /><circle cx="44" cy="30" r="5" fill="#2a2a2a" />
    <circle cx="14" cy="30" r="2" fill="#ddd" /><circle cx="44" cy="30" r="2" fill="#ddd" />
  </svg>
);

export const IconStar = ({ size = 40, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 40 40"><path d="M20 2l5.400 12.200 13.300 1.300-10 8.900 2.900 13L20 30.600 8.400 37.400l2.900-13-10-8.900 13.300-1.300L20 2z" fill="#f9c80e" /></svg>
);

export const IconBulb = ({ size = 28, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 28 36">
    <path d="M14 1.500C7.500 1.500 3 6.500 3 12.500c0 4 2 6.500 4.200 8.600 1.200 1.200 1.800 2.200 1.800 3.900h10c0-1.700.6-2.700 1.800-3.900C23 19 25 16.500 25 12.500 25 6.500 20.500 1.500 14 1.500z" fill="#f9c80e" />
    <rect x="9" y="26.500" width="10" height="3" rx="1.500" fill="#b9a447" />
    <rect x="11" y="31" width="6" height="3" rx="1.500" fill="#b9a447" />
  </svg>
);

export const IconPhone = ({ size = 30, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 30 30" stroke="#333" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="15" cy="15" r="13" />
    <path d="M10.500 9.500l2.200-.5 1.600 3.300-1.600 1.300a8 8 0 0 0 3.800 3.800l1.300-1.600 3.300 1.600-.5 2.200a2.800 2.800 0 0 1-2.800 2.200A11.500 11.500 0 0 1 8.300 12.300 2.800 2.800 0 0 1 10.500 9.500z" />
  </svg>
);

export const IconCalendar = ({ size = 34, ...p }: P) => (
  <svg {...base(size, p)} stroke="#1c7a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.500" y="5" width="17" height="15.500" rx="2" /><path d="M3.500 10h17M8 3v4M16 3v4" />
    <path d="M8 14h2M12 14h2M16 14h.1M8 17h2M12 17h2" />
  </svg>
);

export const IconHeadset = ({ size = 48, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 48 48" stroke="#16a34a" strokeWidth="4.500" strokeLinecap="round">
    <path d="M8 30V24a16 16 0 0 1 32 0v6" /><rect x="5" y="26" width="7" height="13" rx="3" fill="#16a34a" /><rect x="36" y="26" width="7" height="13" rx="3" fill="#16a34a" />
  </svg>
);

export const IconHandshake = ({ size = 28, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 28 28" fill="#fff"><path d="M2 11l5-3 5 2 4-2 3 1 7 2v5l-3 1-6 5-3-2-2 1-5-3-4-1z" opacity=".95" /></svg>
);

export const IconBars = ({ size = 22, color = '#fff', ...p }: P & { color?: string }) => (
  <svg {...base(size, p)} viewBox="0 0 22 22" fill={color}><rect x="2" y="12" width="4" height="8" rx="1" /><rect x="9" y="7" width="4" height="13" rx="1" /><rect x="16" y="2" width="4" height="18" rx="1" /></svg>
);

export const IconLeaf = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 22 22"><path d="M3 18C3 9 9 3 19 3c0 9-5 15-13 15" fill="#4cc766" /><path d="M3 20c3-6 6-9 11-11" stroke="#fff" strokeWidth="1.400" strokeLinecap="round" /></svg>
);

export const IconPerson = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 18 18" fill="#b9b9b9"><circle cx="9" cy="6" r="3.600" /><path d="M2.500 16c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6z" /></svg>
);

export const IconMiniPin = ({ size = 14, ...p }: P) => (
  <svg {...base(size, p)} viewBox="0 0 14 14" fill="#b9b9b9"><path d="M7 .8C4.200.8 2 2.900 2 5.500c0 3 3.600 6.400 4.500 7.700.2.300.8.300 1 0C8.400 11.900 12 8.500 12 5.500 12 2.900 9.800.8 7 .8z" /><circle cx="7" cy="5.500" r="1.900" fill="#fff" /></svg>
);

export const IconHouse = ({ size = 30, ...p }: P) => (
  <svg {...base(size, p)} stroke="#444" strokeWidth="1.800" strokeLinejoin="round" strokeLinecap="round"><path d="M3 11l9-7 9 7v9H3z" /><path d="M9 20v-6h6v6" /></svg>
);

export const IconChevronDown = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)} stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l7 7 7-7" /></svg>
);
export const IconChevronLeft = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} stroke="#fff" strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
);
export const IconChevronRight = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} stroke="#fff" strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
);
export const IconMenu = ({ size = 28, ...p }: P) => (
  <svg {...base(size, p)} stroke="#222" strokeWidth="2.200" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const IconClose = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} stroke="#222" strokeWidth="2.200" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconArrowRight = ({ size = 16, ...p }: P) => (
  <svg {...base(size, p)} stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
);

/* Shortcut tiles on the home page */
export const ShortcutMarket = () => (
  <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#fbe68c" stroke="#d9b93f" strokeWidth="2" /><g fill="#f3a712"><rect x="17" y="30" width="7" height="12" /><rect x="27" y="23" width="7" height="19" /><rect x="37" y="15" width="7" height="27" /></g><path d="M16 27l10-8 8 5 10-9" stroke="#e0a21b" strokeWidth="2.200" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const ShortcutProduct = () => (
  <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#b9a8cc" stroke="#9985b3" strokeWidth="2" /><path d="M30 12c-6 6-7 14-2 21 2 3 4 3 4 3s2 0 4-3c5-7 4-15-6-21z" fill="#c07be0" /><path d="M30 36v14" stroke="#555" strokeWidth="2" strokeLinecap="round" /></svg>
);
export const ShortcutOrder = () => (
  <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#f67f7f" stroke="#e55a5a" strokeWidth="2" /><rect x="16" y="24" width="28" height="18" rx="3" fill="#e01b1b" /><path d="M24 24v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" stroke="#b30f0f" strokeWidth="2.400" fill="none" /><rect x="26" y="31" width="8" height="3" rx="1" fill="#f9bcbc" /></svg>
);
export const ShortcutAI = () => (
  <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#9fd2ff" stroke="#2f6fb2" strokeWidth="2.400" /><circle cx="30" cy="30" r="19" fill="#bfe0ff" stroke="#2f6fb2" strokeWidth="1.600" /><text x="30" y="37" textAnchor="middle" fontSize="20" fontWeight="800" fill="#111" fontFamily="Inter, sans-serif">AI</text></svg>
);
