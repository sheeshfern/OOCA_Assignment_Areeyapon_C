import { CONTEXTS, DURATIONS, DURATIONS_GOOD, NEUTRAL, TONES } from './data/content';
import { IMG } from './data/images';
import type { Duration, Lang, PickedWord, Tone, Word } from './data/types';
import { loc } from './lib/text';

export type Screen = 'home' | 'tone' | 'words' | 'ctx' | 'dur' | 'result' | 'safety';

export interface State {
  screen: Screen;
  tone: Tone | null;
  picks: PickedWord[];
  showAll: boolean;
  ctx: string | null;
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
  /** bumps on each language switch so the screen can ease the new words in */
  relang: number;
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
  | { type: 'skipCtx' }
  | { type: 'dur'; id: string | null }
  | { type: 'skipDur'; now: number }
  | { type: 'rePick' }
  | { type: 'note'; text: string }
  | { type: 'noteUp' }
  | { type: 'noteDone' }
  | { type: 'lang'; lang: Lang };

export const savedLang = (): Lang => {
  try { return localStorage.getItem('ooca-lang') === 'en' ? 'en' : 'th'; } catch { return 'th'; }
};

export const initialState = (): State => ({
  screen: 'home', tone: null, picks: [], showAll: false, ctx: null, dur: null, history: [], dir: 'fwd',
  note: '', noteUp: false, noteDone: false, lang: savedLang(), at: null, relang: 0,
});

export const allWords = (): PickedWord[] => TONES.flatMap(t => [...t.words, ...t.more].map(x => ({ ...x, tone: t })));

function go(s: State, screen: Screen, now = 0): State {
  return { ...s, history: [...s.history, s.screen], screen, dir: 'fwd', at: screen === 'result' ? s.at ?? now : s.at };
}

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'go': return go(s, a.screen, a.now);
    case 'back': {
      const history = s.history.slice(0, -1);
      return { ...s, picks: s.screen === 'safety' ? [] : s.picks, screen: s.history[s.history.length - 1] ?? 'home', history, dir: 'back' };
    }
    case 'restart':
      return { ...s, screen: 'home', tone: null, picks: [], showAll: false, ctx: null, dur: null, history: [], dir: 'back', note: '', noteUp: false, noteDone: false, at: null };
    case 'tone': return { ...s, tone: TONES.find(t => t.id === a.id) ?? null, showAll: false, picks: [] };
    case 'all': return go({ ...s, showAll: true, picks: [] }, 'words');
    case 'toWords': return go({ ...s, showAll: false }, 'words');
    case 'word': {
      const found = allWords().find(x => x.w === a.w);
      if (!found) return s;
      if (found.risk) return go({ ...s, picks: [found] }, 'safety');
      const on = s.picks.some(p => p.w === a.w);
      const picks = on ? s.picks.filter(p => p.w !== a.w) : s.picks.length < 2 ? [...s.picks, found] : s.picks;
      return { ...s, picks, tone: s.tone ?? found.tone };
    }
    case 'neutral': return go({ ...s, picks: [], ctx: null, dur: null }, 'result', a.now);
    case 'ctx': return { ...s, ctx: a.id };
    case 'skipCtx': return go({ ...s, ctx: null }, 'dur');
    case 'dur': return { ...s, dur: a.id };
    case 'skipDur': return go({ ...s, dur: null }, 'result', a.now);
    case 'rePick': return { ...s, picks: [], screen: 'words', history: ['home', 'tone'], dir: 'back', tone: s.tone ?? TONES[3] };
    case 'note': return { ...s, note: a.text };
    case 'noteUp': return { ...s, noteUp: true };
    case 'noteDone': return { ...s, noteDone: true };
    case 'lang': return { ...s, lang: a.lang, relang: s.relang + 1 };
  }
}

/* ---------- derived ---------- */
export const feelsGood = (s: State) => s.picks.length > 0 && s.picks.every(p => p.lv === 0);
export const durList = (s: State): Duration[] => (feelsGood(s) ? DURATIONS_GOOD : DURATIONS);

// Mooca for the current answers: the money topic gets the coin poses
export const moocaFor = (s: State, fallback: string) =>
  s.ctx === 'money' ? (s.tone && ['yellow', 'green'].includes(s.tone.id) ? IMG.coins : IMG.coinsWorried) : s.tone ? s.tone.img : fallback;

export interface ResultData {
  picks: Word[];
  main: Word;
  lv: number;
  ctx: string | null;
  cause: string | undefined;
  since: string | null;
}

export function resultData(s: State): ResultData {
  const picks: Word[] = s.picks.length ? s.picks : [NEUTRAL];
  const main = picks[0];
  const c = CONTEXTS.find(x => x.id === s.ctx), d = durList(s).find(x => x.id === s.dur);
  let lv = Math.max(...picks.map(p => p.lv ?? 0));
  if (lv > 0 && d) lv = Math.max(lv, d.floor); // duration sets the minimum level
  return {
    picks, main, lv,
    ctx: c ? loc(c, s.lang).say ?? null : null,
    cause: loc(main, s.lang).c,
    since: d ? loc(d, s.lang).say ?? null : null,
  };
}

/** The tone colours the app frame wears on this screen (CSS custom properties on .app). */
export function zoneVars(s: State): Record<string, string> {
  // safety keeps the words screen's colours (it opens straight from a word), like the original
  const t = (s.screen === 'words' || s.screen === 'safety') && s.showAll ? null
    : s.screen === 'result' ? (s.picks.length ? s.picks[0].tone ?? s.tone : null)
    : s.screen === 'home' ? null : s.tone;
  const vars: Record<string, string> = {
    '--zone': t ? t.zone : '#1F77DF', '--zone-solid': t ? t.solid : '#1A68C7', '--zone-ink': t ? t.ink : '#0A47CA',
    '--zone-line': t ? t.line : '#C7DDF7', '--bg': t ? t.bg : '#E4EFFB',
  };
  if (s.screen === 'home') vars['--bg'] = '#F6F6F6';
  if (s.screen === 'safety') vars['--bg'] = '#E0F8F6';
  return vars;
}
