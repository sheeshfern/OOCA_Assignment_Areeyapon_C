import type { CSSProperties } from 'react';
import { useApp } from '../AppContext';
import { Cloud, fitN, visLen } from '../components/Cloud';
import { Guide, NextBar, TopBar } from '../components/bits';
import { Screen, useStay } from '../components/Screen';
import { TONES } from '../data/content';
import { IMG } from '../data/images';
import type { PickedWord } from '../data/types';
import { loc } from '../lib/text';
import { MAX_PICKS, wordArt, wordsOf } from '../state';

export function Words() {
  const { s, L, dispatch, go, tap } = useApp();
  const t = s.tone;
  // Mooca becomes the word just tapped
  const latest = s.picks[s.picks.length - 1];
  const list = s.showAll || !t ? [] : wordsOf(t);

  const chip = (x: PickedWord) => {
    const on = s.picks.some(p => p.w === x.w), full = !on && s.picks.length >= MAX_PICKS;
    const w = loc(x, s.lang).w;
    return (
      <button key={x.w} className="word" data-act="word" data-w={x.w} aria-pressed={on} disabled={full}
        style={{ '--n': fitN(w), '--ws': visLen(w) > 12 ? 'normal' : 'nowrap', ...(s.showAll ? { '--zone': x.tone.zone, '--zone-line': x.tone.line, '--zone-solid': x.tone.solid, '--zone-ink': x.tone.ink } : {}) } as CSSProperties}
        onClick={e => tap(e, { type: 'word', w: x.w })}>
        <Cloud /><span>{w}</span>
      </button>
    );
  };

  return (
    <Screen>
      <TopBar step={2} />
      <Guide img={latest ? wordArt(latest) : t && !s.showAll ? t.img : IMG.calm} q={L.q2} sub={L.q2sub[s.picks.length]} subKey={String(s.picks.length)} />
      {s.showAll
        ? TONES.map(tt => [
            <p key={`l${tt.id}`} className="group-label">{loc(tt, s.lang).label}</p>,
            <div key={`g${tt.id}`} className="words">{wordsOf(tt).map(chip)}</div>,
          ])
        : <div className="words" role="group" aria-label={L.wordsAria}>{list.map(chip)}</div>}
      <Meaning />
      <button className="text-btn" data-act="neutral" onClick={() => dispatch({ type: 'neutral', now: Date.now() })}>{L.neutralBtn}</button>
      <NextBar act="toCtx" label={L.next} disabled={!s.picks.length} onClick={() => go('ctx')} />
    </Screen>
  );
}

// what each picked word means; it grows only when a second word is picked
function Meaning() {
  const { s, L } = useApp();
  const stay = useStay();
  const sig = s.picks.map(p => p.w).join('|') + s.lang;
  return (
    <div key={sig} className={`meaning${s.picks.length ? '' : ' empty'}${stay ? ' swap' : ''}`}>
      {s.picks.length ? s.picks.map(p => { const lp = loc(p, s.lang); return <p key={p.w}>{L.meaning(lp.w, lp.m)}</p>; }) : L.meaningEmpty}
    </div>
  );
}
