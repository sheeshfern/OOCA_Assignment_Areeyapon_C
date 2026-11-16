import { focusToday } from './components/ResultExtras';
import { useEffect, useReducer, useRef, useState, type MouseEvent, type ReactElement } from 'react';
import { AppContext, type AppApi } from './AppContext';
import { ExerciseDialog } from './components/ExerciseDialog';
import { LoginSheet } from './components/LoginSheet';
import { Room } from './components/Room';
import { Toast, useToast } from './components/Toast';
import { CONTEXTS, DURATIONS, TONES } from './data/content';
import { ctxArt, durArt, IMG, WORD_POSE } from './data/images';
import { UI } from './data/ui';
import { SaveSheet } from './components/SaveSheet';
import { makeCardImage, type CardImage } from './lib/cardImage';
import { dropCheckin, logCheckin, patchCheckin, seedDemo } from './lib/checkins';
import { demoCheckins } from './data/story';
import { replay } from './lib/motion';
import { Chat } from './screens/Chat';
import { Ctx } from './screens/Ctx';
import { Eyes } from './screens/Eyes';
import { Shelf } from './screens/Shelf';
import { Vent } from './screens/Vent';
import { After } from './screens/After';
import { Dur } from './screens/Dur';
import { Home } from './screens/Home';
import { Result } from './screens/Result';
import { Safety } from './screens/Safety';
import { Tone } from './screens/Tone';
import { Words } from './screens/Words';
import { exFor, initialState, reducer, resultData, wordsOf, zoneVars, type Action, type Screen } from './state';
import type { Rate } from './data/ui';

const SCREENS: Record<Screen, () => ReactElement> = { home: Home, eyes: Eyes, tone: Tone, words: Words, ctx: Ctx, dur: Dur, result: Result, safety: Safety, chat: Chat, shelf: Shelf, vent: Vent, talk: Chat, after: After };

export default function App() {
  const [s, dispatch] = useReducer(reducer, undefined, initialState);
  const [exOpen, setExOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginThen, setLoginThen] = useState<Screen | undefined>();
  // the saved-card preview: set once the image is made, cleared when the sheet closes
  const [card, setCard] = useState<CardImage | null>(null);
  const { toast, show } = useToast();
  const L = UI[s.lang];

  // warm the image cache so Mooca never pops in late
  useEffect(() => { Object.values(IMG).forEach(src => { new Image().src = src; }); }, []);
  // ...and the poses this tone can lead to, so tapping a word changes Mooca at once
  useEffect(() => {
    const warm = (src?: string) => { if (src) new Image().src = src; };
    (s.showAll ? TONES : s.tone ? [s.tone] : []).forEach(t => wordsOf(t).forEach(w => warm(WORD_POSE[w.w])));
    if (s.tone) {
      CONTEXTS.forEach(c => warm(ctxArt(c.id, s.tone!.id)));
      DURATIONS.forEach(d => { warm(durArt(true, d.id)); warm(durArt(false, d.id)); });
    }
  }, [s.tone, s.showAll]);

  // page-level text that lives outside the screens
  useEffect(() => {
    document.documentElement.lang = s.lang;
    document.title = 'Assignment_AreeyaponC'; // the tab keeps the assignment name in both languages
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', L.desc);
    try { localStorage.setItem('ooca-lang', s.lang); } catch { /* private mode: the choice just isn't remembered */ }
  }, [s.lang, L]);

  const go = (screen: Screen) => dispatch({ type: 'go', screen, now: Date.now() });
  // the 30-second note left the result card when the chat took its place; kept as a no-op for the context
  const openNote = () => {};
  const openEx = () => setExOpen(true);
  const openLogin = (then?: Screen) => { setLoginThen(then); setLoginOpen(true); };
  // the mock account: remembered on this device; an empty shelf gets sample days so there is something to open
  const pickAccount = () => {
    const user = { name: L.demoName, email: 'demo.user@example.com' };
    // the mock sign-in lasts while this tab is open: a fresh visit starts signed out, so the signed-out story is what people see first
    try { sessionStorage.setItem('ooca-user', JSON.stringify(user)); localStorage.removeItem('ooca-user'); } catch { /* private mode: signed in for this visit only */ }
    seedDemo(demoCheckins(Date.now()));
    dispatch({ type: 'login', user });
    setLoginOpen(false);
    if (loginThen === 'result' && s.screen === 'result') { focusToday(); show(L.signedInBack); }
    else if (loginThen) dispatch({ type: 'go', screen: loginThen, now: Date.now() });
  };
  useEffect(() => { if (!s.user) try { sessionStorage.removeItem('ooca-user'); localStorage.removeItem('ooca-user'); } catch { /* nothing to forget */ } }, [s.user]);
  const rateEx = (k: Rate) => {
    if (s.at) patchCheckin(s.at, { ex: exFor(s), after: k });
    dispatch({ type: 'exRate', rate: k });
    setExOpen(false);
    show(L.exThanks[k]);
  };
  // going back to change the answers drops the card they left (restart keeps it: that card was finished)
  // signed in, the chat is saved with today's card (the vent chat from before signing in included)
  useEffect(() => {
    if (!s.user || !s.at) return;
    // the card itself first (signing in from the result jumps straight to the chat, before the result could save it)
    logCheckin({ at: s.at, tone: s.picks[0]?.tone.id ?? null, words: s.picks.map(p => p.w), lv: resultData(s).lv, ctx: s.ctx, ctx2: s.ctx2, dur: s.dur, heavy: { before: s.before, after: s.after } });
    if (s.chat.length) patchCheckin(s.at, { chat: s.chat.map(m => ({ from: m.from, text: m.text })) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.user, s.at, s.chat, s.before, s.after]);
  const lastAt = useRef<number | null>(null);
  useEffect(() => {
    if (lastAt.current && !s.at && s.screen !== 'home') dropCheckin(lastAt.current);
    lastAt.current = s.at;
  }, [s.at, s.screen]);
  // a choice reacts where it was tapped, then updates the answers
  const tap = (e: MouseEvent<HTMLElement>, action: Action) => { replay(e.currentTarget, 'just'); dispatch(action); };

  const saveCard = (btn: HTMLButtonElement) => {
    replay(btn.querySelector('svg'), 'drop');
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    const r = resultData(s);
    const card = { date: new Date(s.at ?? Date.now()).toISOString(), words: r.picks.map(p => p.w), ctx: s.ctx, ctx2: s.ctx2, dur: s.dur, note: s.note.trim() || undefined };
    try {
      const k = 'ooca-feeling-cards', list = JSON.parse(localStorage.getItem(k) || '[]');
      list.push(card);
      localStorage.setItem(k, JSON.stringify(list.slice(-30)));
    } catch { /* storage full or blocked: the image still saves */ }
    makeCardImage(s, L)
      .then(setCard)
      .catch(() => show(L.saveFail))
      .finally(() => { delete btn.dataset.busy; });
  };

  const api: AppApi = { s, dispatch, L, go, tap, openNote, openEx, openLogin, saveCard };

  // hooks for the layout and copy-fit checks in tools/ (dev builds only)
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    (window as unknown as { __ooca: unknown }).__ooca = { s, dispatch, go, openNote };
  }, [s]); // eslint-disable-line react-hooks/exhaustive-deps

  const Current = SCREENS[s.screen];
  return (
    <AppContext.Provider value={api}>
      <main className="app" id="app" aria-live="polite" style={zoneVars(s)}>
        {/* inside the room they chose: the room stays behind the next three questions */}
        {s.tone && !s.showAll && (s.screen === 'words' || s.screen === 'ctx' || s.screen === 'dur') && <div className="room-bg" aria-hidden="true"><Room tone={s.tone} uid="-bg" /></div>}
        {/* a new key per step: each step mounts fresh and plays its entrance */}
        <Current key={s.screen} />
      </main>
      <Toast toast={toast} />
      <LoginSheet open={loginOpen} why={loginThen === 'chat' ? L.gateWhyChat : loginThen === 'result' ? L.gateWhyCard : L.signInWhy} onClose={() => setLoginOpen(false)} onPick={pickAccount} />
      <ExerciseDialog open={exOpen} onClose={() => setExOpen(false)} onRate={rateEx} />
      <SaveSheet card={card} onClose={() => setCard(null)} onSaved={() => show(L.saved)} />
    </AppContext.Provider>
  );
}
