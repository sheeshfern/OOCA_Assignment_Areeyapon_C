// Every finished card is logged on this device (no sign-up, nothing sent anywhere),
// so the next card can say how today compares. Reads return null when storage is blocked.
import type { Rate } from '../data/ui';

export interface Checkin {
  at: number;
  tone: string | null;
  words: string[];
  lv: number;
  ctx: string | null;
  ctx2?: string | null;
  dur: string | null;
  /** the one-minute exercise done on this card, and how it felt after */
  ex?: string;
  after?: Rate;
  /** sample days added by the mock sign-in */
  demo?: boolean;
  /** how heavy the heart felt, 1–5, at the start and before the card */
  heavy?: { before: number | null; after: number | null };
  /** the chat with Mooca, kept once signed in */
  chat?: { from: 'mooca' | 'me'; text: string; img?: string }[];
}

const KEY = 'ooca-checkins', MAX = 60;

export function readLog(): Checkin[] | null {
  try {
    const l = JSON.parse(localStorage.getItem(KEY) || '[]');
    // oldest first, whatever order they were written in
    return Array.isArray(l) ? l.filter((e: Checkin) => e && typeof e.at === 'number').sort((x: Checkin, y: Checkin) => x.at - y.at) : [];
  } catch { return null; }
}
function writeLog(l: Checkin[]) {
  try { localStorage.setItem(KEY, JSON.stringify(l.slice(-MAX))); } catch { /* storage full or blocked */ }
}
/** adds this card, or updates it when the answers changed after going back a step */
export function logCheckin(e: Omit<Checkin, 'ex' | 'after'>) {
  const l = readLog(); if (!l) return;
  const i = l.findIndex(x => x.at === e.at);
  if (i >= 0) l[i] = { ...l[i], ...e }; else l.push(e);
  writeLog(l);
}
export function patchCheckin(at: number, fields: Partial<Checkin>) {
  const l = readLog(); if (!l) return;
  const e = l.find(x => x.at === at);
  if (e) { Object.assign(e, fields); writeLog(l); }
}
/** going back to change the answers drops the card they left, so it isn't counted twice */
export function dropCheckin(at: number) {
  const l = readLog(); if (l) writeLog(l.filter(e => e.at !== at));
}

/** the mock sign-in fills an empty shelf with sample days, so there is something to open */
export function seedDemo(entries: Checkin[]) {
  const l = readLog(); if (!l || l.some(e => e.demo)) return;
  writeLog([...entries, ...l]);
}
export function clearDemo() {
  const l = readLog(); if (l) writeLog(l.filter(e => !e.demo));
}

/** one key per calendar day */
export const dayKey = (t: number) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
/** the last check-in of each of the last `n` days, oldest first (null for a day without one) */
export function lastDays(n: number, now: number): { date: Date; e: Checkin | null; today: boolean }[] {
  const byDay = new Map<string, Checkin>();
  (readLog() ?? []).forEach(e => byDay.set(dayKey(e.at), e));
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - (n - 1 - i));
    return { date: d, e: byDay.get(dayKey(+d)) ?? null, today: i === n - 1 };
  });
}
