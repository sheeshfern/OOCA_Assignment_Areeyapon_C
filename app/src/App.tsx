import { useCallback, useEffect, useMemo, useReducer, useState, type ReactElement } from 'react';
import { AppContext, type AppApi } from './AppContext';
import { NoteDialog } from './components/NoteDialog';
import { Toast, useToast } from './components/Toast';
import { IMG } from './data/images';
import { UI } from './data/ui';
import { SaveSheet } from './components/SaveSheet';
import { makeCardImage, type CardImage } from './lib/cardImage';
import { replay } from './lib/motion';
import { loc } from './lib/text';
import { Ctx } from './screens/Ctx';
import { Dur } from './screens/Dur';
import { Home } from './screens/Home';
import { Result } from './screens/Result';
import { Safety } from './screens/Safety';
import { Tone } from './screens/Tone';
import { Words } from './screens/Words';
import { initialState, reducer, resultData, zoneVars, type Screen } from './state';

const SCREENS: Record<Screen, () => ReactElement> = { home: Home, tone: Tone, words: Words, ctx: Ctx, dur: Dur, result: Result, safety: Safety };

export default function App() {
  const [s, dispatch] = useReducer(reducer, undefined, initialState);
  const [noteOpen, setNoteOpen] = useState(false);
  // the saved-card preview: set once the image is made, cleared when the sheet closes
  const [card, setCard] = useState<CardImage | null>(null);
  const { toast, show } = useToast();
  const L = UI[s.lang];

  // warm the image cache so Mooca never pops in late
  useEffect(() => { Object.values(IMG).forEach(src => { new Image().src = src; }); }, []);

  // page-level text that lives outside the screens
  useEffect(() => {
    document.documentElement.lang = s.lang;
    document.title = 'Assignment_AreeyaponC'; // the tab keeps the assignment name in both languages; L.title still heads the saved card
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', L.desc);
    try { localStorage.setItem('ooca-lang', s.lang); } catch { /* private mode: the choice just isn't remembered */ }
  }, [s.lang, L]);

  const go = useCallback((screen: Screen) => dispatch({ type: 'go', screen, now: Date.now() }), []);
  const openNote = useCallback(() => setNoteOpen(true), []);
  const closeNote = () => {
    setNoteOpen(false);
    if (s.note.trim()) dispatch({ type: 'noteDone' });
  };

  const saveCard = useCallback((btn: HTMLButtonElement) => {
    replay(btn.querySelector('svg'), 'drop');
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    const r = resultData(s);
    const card = { date: new Date(s.at ?? Date.now()).toISOString(), words: r.picks.map(p => p.w), ctx: s.ctx, dur: s.dur, note: s.note.trim() || undefined };
    try {
      const k = 'ooca-feeling-cards', list = JSON.parse(localStorage.getItem(k) || '[]');
      list.push(card);
      localStorage.setItem(k, JSON.stringify(list.slice(-30)));
    } catch { /* storage full or blocked: the image still saves */ }
    makeCardImage(s, L)
      .then(setCard)
      .catch(() => show(L.saveFail))
      .finally(() => { delete btn.dataset.busy; });
  }, [s, L, show]);

  const api = useMemo<AppApi>(() => ({ s, dispatch, L, go, openNote, saveCard }), [s, L, go, openNote, saveCard]);

  // hooks for the layout and copy-fit checks in tools/ (dev builds only)
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    (window as unknown as { __ooca: unknown }).__ooca = { s, dispatch, go, openNote, closeNote: () => setNoteOpen(false) };
  }, [s, go, openNote]);

  const Current = SCREENS[s.screen];
  return (
    <AppContext.Provider value={api}>
      <main className="app" id="app" aria-live="polite" style={zoneVars(s)}>
        {/* a new key per step: each step mounts fresh and plays its entrance */}
        <Current key={s.screen} />
      </main>
      <Toast toast={toast} />
      <NoteDialog open={noteOpen} prompt={loc(resultData(s).main, s.lang).a ?? ''} onClose={closeNote} />
      <SaveSheet card={card} onClose={() => setCard(null)} onSaved={() => show(L.saved)} />
    </AppContext.Provider>
  );
}
