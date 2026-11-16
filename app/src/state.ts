import { CONTEXTS, DURATIONS, DURATIONS_GOOD, EX_TONE, NEUTRAL, TONES, type ExerciseId } from './data/content';
import type { Rate } from './data/ui';
import { reading, type ChipId, type Msg, type Reading } from './data/story';
import { IMG, WORD_POSE } from './data/images';
import type { Duration, Lang, PickedWord, Tone, Word } from './data/types';
import { loc } from './lib/text';

export type Screen = 'home' | 'eyes' | 'tone' | 'words' | 'ctx' | 'dur' | 'vent' | 'talk' | 'after' | 'result' | 'safety' | 'chat' | 'shelf';

/** the answer to "anything you want to get off your chest?" */
export type Vent = 'yes' | 'later' | 'no';

/** the mock Google account: nothing real is signed in, it only unlocks the shelf */
export interface User { name: string; email: string }

export interface State {
  screen: Screen;
  tone: Tone | null;
  picks: PickedWord[];
  showAll: boolean;
  /** where it comes from: up to two, the first one picked leads */
  ctx: string | null;
  ctx2: string | null;
  dur: string | null;
  history: Screen[];
  dir: 'fwd' | 'back';
  note: string;
  noteUp: boolean;
  /** a note was written and closed once: later opens are plain editing, no timer */
  noteDone: boolean;
  lang: Lang;
  /** when the result card was made; fixed until restart */
  at: number | null;
  /** how the one-minute exercise felt, once it was done on this card */
  exRate: Rate | null;
  user: User | null;
  /** the chat with Mooca about this card */
  chat: Msg[];
  chips: ChipId[];
  vent: Vent | null;
  /** how heavy the heart feels, 1 (light) to 5 (very heavy): at the start and again before the card */
  before: number | null;
  after: number | null;
}

export type Action =
  | { type: 'go'; screen: Screen; now: number }
  | { type: 'back' }
  | { type: 'restart' }
  | { type: 'tone'; id: string }
  | { type: 'all' }
  | { type: 'toWords' }
  | { type: 'word'; w: string }
  | { type: 'neutral'; now: number }
  | { type: 'ctx'; id: string | null }
  | { type: 'dur'; id: string | null }
  | { type: 'rePick' }
  | { type: 'note'; text: string }
  | { type: 'noteUp' }
  | { type: 'noteDone' }
  | { type: 'lang'; lang: Lang }
  | { type: 'exRate'; rate: Rate }
  | { type: 'login'; user: User }
  | { type: 'logout' }
  | { type: 'chat'; msgs: Msg[]; chips: ChipId[] }
  | { type: 'vent'; vent: Vent }
  | { type: 'before'; n: number }
  | { type: 'after'; n: number };

const savedUser = (): User | null => {
  try { localStorage.removeItem('ooca-user'); } catch { /* old builds remembered the account for good */ }
  try { const u = JSON.parse(sessionStorage.getItem('ooca-user') || 'null'); return u && u.email ? u : null; } catch { return null; }
};

const savedLang = (): Lang => {
  try { return localStorage.getItem('ooca-lang') === 'en' ? 'en' : 'th'; } catch { return 'th'; }
};

export const initialState = (): State => ({
  screen: 'home', tone: null, picks: [], showAll: false, ctx: null, ctx2: null, dur: null, history: [], dir: 'fwd',
  note: '', noteUp: false, noteDone: false, lang: savedLang(), at: null, exRate: null, user: savedUser(), chat: [], chips: [], vent: null, before: null, after: null,
});

/** every word of one tone, carrying its tone with it */
export const wordsOf = (t: Tone): PickedWord[] => [...t.words, ...t.more].map(x => ({ ...x, tone: t }));
const allWords = (): PickedWord[] => TONES.flatMap(wordsOf);
/** the most words one card can name */
export const MAX_PICKS = 2;

function go(s: State, screen: Screen, now = 0): State {
  // the close-your-eyes pause isn't a step to go back to: back from the rooms lands on home
  return { ...s, history: [...s.history, s.screen === 'eyes' ? 'home' : s.screen], screen, dir: 'fwd', at: screen === 'result' ? s.at ?? now : s.at };
}

// page tints straight from the CI ramps: the 50 step for the page, the 100 step for cards on it
export const CI_TINT: Record<string, [string, string]> = { yellow: ['#FCF4E0', '#F8E4B3'], green: ['#F1FAED', '#DCF3D1'], orange: ['#FFF2E9', '#FFDDC9'], blue: ['#E4EFFB', '#C7DDF7'], none: ['#E0F8F6', '#B3EDE8'] };

// going back to choose a feeling starts the answers over: nothing from the last try carries into the next card
const FRESH = { picks: [], ctx: null, ctx2: null, dur: null, note: '', noteUp: false, noteDone: false, at: null, exRate: null, chat: [] as Msg[], chips: [] as ChipId[], vent: null, after: null };

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'go': return go(s, a.screen, a.now);
    case 'back': {
      const history = s.history.slice(0, -1);
      const screen = s.history[s.history.length - 1] ?? 'home';
      const again = screen === 'words' || screen === 'tone' || screen === 'home';
      return { ...s, ...(again ? FRESH : {}), ...(screen === 'tone' || screen === 'home' ? { tone: null, showAll: false } : {}), screen, history, dir: 'back' };
    }
    case 'restart':
      return { ...s, ...FRESH, before: null, screen: 'home', tone: null, showAll: false, history: [], dir: 'back' };
    case 'tone': return { ...s, tone: TONES.find(t => t.id === a.id) ?? null, showAll: false, picks: [] };
    case 'all': return go({ ...s, showAll: true, picks: [] }, 'words');
    case 'toWords': return go({ ...s, showAll: false }, 'words');
    case 'word': {
      const found = allWords().find(x => x.w === a.w);
      if (!found) return s;
      if (found.risk) return go({ ...s, picks: [found] }, 'safety');
      const on = s.picks.some(p => p.w === a.w);
      const picks = on ? s.picks.filter(p => p.w !== a.w) : s.picks.length < MAX_PICKS ? [...s.picks, found] : s.picks;
      return { ...s, picks, tone: s.tone ?? found.tone };
    }
    case 'neutral': return go({ ...s, picks: [], ctx: null, ctx2: null, dur: null }, 'vent', a.now);
    case 'ctx': {
      // 1–2 sources; "not sure" stands alone; tapping a picked one takes it off (the second moves up)
      const id = a.id;
      if (!id) return { ...s, ctx: null, ctx2: null };
      if (id === 'unsure') return { ...s, ctx: s.ctx === 'unsure' ? null : 'unsure', ctx2: null };
      if (id === s.ctx) return { ...s, ctx: s.ctx2, ctx2: null };
      if (id === s.ctx2) return { ...s, ctx2: null };
      if (!s.ctx || s.ctx === 'unsure') return { ...s, ctx: id, ctx2: null };
      if (!s.ctx2) return { ...s, ctx2: id };
      return s;
    }
    case 'dur': return { ...s, dur: a.id };
    case 'rePick': return { ...s, ...FRESH, screen: 'words', history: ['home', 'tone'], dir: 'back', tone: s.tone ?? TONES[3] };
    case 'note': return { ...s, note: a.text };
    case 'noteUp': return { ...s, noteUp: true };
    case 'noteDone': return { ...s, noteDone: true };
    case 'lang': return { ...s, lang: a.lang };
    case 'exRate': return { ...s, exRate: a.rate };
    case 'login': return { ...s, user: a.user };
    case 'logout': return { ...s, user: null, screen: s.screen === 'shelf' ? 'home' : s.screen, history: s.screen === 'shelf' ? [] : s.history };
    case 'chat': return { ...s, chat: [...s.chat, ...a.msgs], chips: a.chips };
    case 'vent': return { ...s, vent: a.vent };
    case 'before': return { ...s, before: a.n };
    case 'after': return { ...s, after: a.n };
  }
}

/* ---------- derived ---------- */
export const feelsGood = (s: State) => s.picks.length > 0 && s.picks.every(p => p.lv === 0);
export const durList = (s: State): Duration[] => (feelsGood(s) ? DURATIONS_GOOD : DURATIONS);

// Mooca for the current answers: the word they picked leads, then the tone
export const wordArt = (p: PickedWord) => WORD_POSE[p.w] ?? p.tone.img;
export const moocaFor = (s: State) =>
  s.picks.length ? wordArt(s.picks[0]) : s.tone ? s.tone.img : IMG.calm;
/** the tone behind the first word, which sets Mooca's face on steps 3 and 4 */
export const moodTone = (s: State): Tone => s.picks[0]?.tone ?? s.tone ?? TONES[3];
/** the one-minute exercise for this card: picked by the first word's tone, breathing when nothing was named */
export const exFor = (s: State): ExerciseId => (s.picks.length ? EX_TONE[s.picks[0].tone.id] : 'breathe');
/** the result card shows one Mooca per picked word; no word picked means "can't say yet" */
export const posesFor = (s: State): string[] => (s.picks.length ? s.picks.map(wordArt) : [IMG.thanks]);

interface ResultData {
  picks: Word[];
  main: Word;
  /** nothing picked: the "can't say yet" card */
  neutral: boolean;
  /** every picked word feels good */
  good: boolean;
  lv: number;
  ctx: string | null;
  cause: string | undefined;
  since: string | null;
}

export function resultData(s: State): ResultData {
  const picks: Word[] = s.picks.length ? s.picks : [NEUTRAL];
  const main = picks[0];
  const d = durList(s).find(x => x.id === s.dur);
  let lv = Math.max(...picks.map(p => p.lv ?? 0));
  if (lv > 0 && d) lv = Math.max(lv, d.floor); // duration sets the minimum level
  return {
    picks, main, lv,
    neutral: main === NEUTRAL,
    good: lv === 0,
    ctx: ctxSay(s),
    cause: loc(main, s.lang).c,
    since: d ? loc(d, s.lang).say ?? null : null,
  };
}

/** The tone colours the app frame wears on this screen (CSS custom properties on .app). */
export function zoneVars(s: State): Record<string, string> {
  // safety keeps the words screen's colours (it opens straight from a word), like the original
  const t = (s.screen === 'words' || s.screen === 'safety') && s.showAll ? null
    : s.screen === 'result' || s.screen === 'chat' || s.screen === 'vent' || s.screen === 'talk' || s.screen === 'after' ? (s.picks[0]?.tone ?? s.tone)
    : s.screen === 'home' || s.screen === 'eyes' || s.screen === 'shelf' ? null : s.tone;
  const z = t ?? TONES[3];
  const [page, page2] = CI_TINT[t ? t.id : 'none'];
  const vars: Record<string, string> = { '--zone': z.zone, '--zone-solid': z.solid, '--zone-ink': z.ink, '--zone-line': z.line, '--bg': z.bg, '--page': page, '--page-2': page2 };
  if (s.screen === 'home' || s.screen === 'shelf') vars['--bg'] = '#F6F6F6';
  if (s.screen === 'eyes') vars['--bg'] = '#FFFFFF';
  if (s.screen === 'safety') vars['--bg'] = CI_TINT.none[0];
  return vars;
}

/** the long reading for the card on screen */
export function readingFor(s: State): Reading {
  const r = resultData(s);
  return reading({ tone: s.picks[0]?.tone.id ?? null, words: s.picks, ctx: s.ctx, dur: s.dur, lv: r.lv }, s.lang);
}

/** "เรื่องงานหรือการเรียน และเรื่องคนรอบตัว": the chosen sources in words (null for none / not sure) */
export function ctxSay(s: State): string | null {
  const says = [s.ctx, s.ctx2].map(id => CONTEXTS.find(x => x.id === id)).filter(c => c && c.id !== 'unsure').map(c => loc(c!, s.lang).say).filter(Boolean) as string[];
  if (!says.length) return null;
  if (s.lang === 'en') return says.map((t, i) => (i ? t.charAt(0).toLowerCase() + t.slice(1) : t.replace(/\.$/, ''))).join(' and ');
  return says.join(' และ');
}
/** the chosen source ids, without "not sure" */
export const ctxIds = (s: State) => [s.ctx, s.ctx2].filter(id => id && id !== 'unsure') as string[];
