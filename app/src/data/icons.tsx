// Line icons (Tabler-style, currentColor), the round language flags and the ooca wordmark
import type { ReactElement } from 'react';

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const ico = {
  back: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" {...line}><path d="M15 6l-6 6l6 6" /></svg>,
  close: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" {...line}><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>,
  check: <svg className="ck" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" {...line} strokeWidth={2.5}><path d="M5 12l5 5l10 -10" /></svg>,
  checkW: <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" {...line} stroke="#fff" strokeWidth={2.5}><path d="M5 12l5 5l10 -10" /></svg>,
  arrow: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" {...line}><path d="M9 6l6 6l-6 6" /></svg>,
  pen: <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" {...line}><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>,
  refresh: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" {...line}><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>,
  cal: <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" {...line}><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M16 3v4M8 3v4M4 11h16" /></svg>,
  save: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" {...line}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4v12" /></svg>,
  phone: <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" {...line} stroke="#fff"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>,
  lock: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" {...line}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  ok: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8" fill="#DBF0EE" />
      <path d="M4.8 8.2l2.1 2.1l4.3-4.4" fill="none" stroke="#00796B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
} satisfies Record<string, ReactElement>;

// round flags for the language switch: Thailand, and the centre of the Union Jack for English
export const FLAG = {
  th: (
    <svg viewBox="0 0 18 18">
      <rect width="18" height="18" fill="#A51931" /><rect y="3" width="18" height="12" fill="#F4F5F8" /><rect y="6" width="18" height="6" fill="#2D2A4A" />
    </svg>
  ),
  en: (
    <svg viewBox="15 0 30 30">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" /><path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth="2.4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" /><path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
};

// ooca wordmark (from ooca-logo-white.svg), cropped to the letters and drawn in currentColor so it follows each button's text colour
export const OocaLogo = () => (
  <svg className="ooca-logo" viewBox="28 125 2486 769" role="img" aria-label="ooca" fill="currentColor">
    <path d="M367,221.94c-186.8,0-338.23,150.38-338.23,335.88s151.43,335.89,338.23,335.89,338.24-150.38,338.24-335.89-151.43-335.88-338.24-335.88ZM367,704.66c-81.65,0-147.86-65.74-147.86-146.83s66.2-146.83,147.86-146.83,147.86,65.74,147.86,146.83-66.2,146.83-147.86,146.83Z" />
    <path d="M1063.81,221.94c-186.8,0-338.24,150.38-338.24,335.88s151.44,335.89,338.24,335.89,338.24-150.38,338.24-335.89-151.43-335.88-338.24-335.88ZM1063.81,704.66c-81.66,0-147.85-65.74-147.85-146.83s66.19-146.83,147.85-146.83,147.85,65.74,147.85,146.83-66.2,146.83-147.85,146.83Z" />
    <path d="M1786,604.93c-9.91,2.08-20.17,3.19-30.69,3.19-81.66,0-147.86-65.74-147.86-146.83s66.2-146.83,147.86-146.83c34.44,0,66.1,11.72,91.23,31.34,35.27-53.74,83.52-98.31,140.31-129.32-60.51-56.47-141.95-91.08-231.54-91.08-186.81,0-338.24,150.38-338.24,335.89s151.43,335.88,338.24,335.88c34.72,0,68.21-5.2,99.73-14.84-36.63-51.37-61.05-111.91-69.04-177.4Z" />
    <path d="M2175.14,221.94c-186.81,0-338.24,150.38-338.24,335.88s151.43,335.89,338.24,335.89c51.96,0,101.18-11.67,145.17-32.47v32.54h193.07v-335.96c0-185.5-151.43-335.88-338.24-335.88ZM2175.14,704.66c-81.66,0-147.86-65.74-147.86-146.83s66.2-146.83,147.86-146.83,147.85,65.74,147.85,146.83-66.2,146.83-147.85,146.83Z" />
  </svg>
);
