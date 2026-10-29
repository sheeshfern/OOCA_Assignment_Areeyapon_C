import type { CSSProperties } from 'react';
import { useApp } from '../AppContext';
import { Guide, TopBar } from '../components/bits';
import { Screen, useStay } from '../components/Screen';
import { TONES } from '../data/content';
import { IMG } from '../data/images';
import type { PickedWord } from '../data/types';
import { replay } from '../lib/motion';
import { loc } from '../lib/text';

export function Words() {
  const { s, L, dispatch } = useApp();
  const t = s.tone;
  const list: PickedWord[] = s.showAll || !t ? [] : [...t.words, ...t.more].map(x => ({ ...x, tone: t }));

  const chip = (x: PickedWord) => {
    const on = s.picks.some(p => p.w === x.w), full = !on && s.picks.length >= 2;
    return (
      <button key={x.w} className="word" data-act="word" data-w={x.w} aria-pressed={on} disabled={full}
        style={s.showAll ? ({ '--zone': x.tone.zone, '--zone-line': x.tone.line, '--zone-solid': x.tone.solid } as CSSProperties) : undefined}
        onClick={e => { replay(e.currentTarget, 'just'); dispatch({ type: 'word', w: x.w }); }}>
        {on ? '✓ ' : ''}{loc(x, s.lang).w}
      </button>
    );
  };

  return (
    <Screen>
      <TopBar step={2} />
      <Guide img={t ? t.img : IMG.calm} q={L.q2} sub={L.q2sub[s.picks.length]} subKey={String(s.picks.length)} />
      {s.showAll
        ? TONES.map(tt => [
            <p key={`l${tt.id}`} className="group-label">{loc(tt, s.lang).label}</p>,
            <div key={`g${tt.id}`} className="words">{[...tt.words, ...tt.more].map(x => chip({ ...x, tone: tt }))}</div>,
          ])
        : <div className="words" role="group" aria-label={L.wordsAria}>{list.map(chip)}</div>}
      <Meaning />
      <button className="text-btn" data-act="neutral" onClick={() => dispatch({ type: 'neutral', now: Date.now() })}>{L.neutralBtn}</button>
      <div className="grow" />
      <div className="actions">
        <button className="primary" data-act="toCtx" disabled={!s.picks.length} onClick={() => dispatch({ type: 'go', screen: 'ctx', now: Date.now() })}>{L.next}</button>
      </div>
    </Screen>
  );
}

// what each picked word means; it grows only when a second word is picked
function Meaning() {
  const { s, L } = useApp();
  const stay = useStay();
  const sig = s.picks.map(p => p.w).join('|') + s.lang;
  return (
    <div key={sig} data-swap="meaning" className={`meaning${s.picks.length ? '' : ' empty'}${stay ? ' swap' : ''}`}>
      {s.picks.length ? s.picks.map(p => { const lp = loc(p, s.lang); return <p key={p.w}>{L.meaning(lp.w, lp.m)}</p>; }) : L.meaningEmpty}
    </div>
  );
}
