import { useApp } from '../AppContext';
import { Guide, TopBar } from '../components/bits';
import { Screen } from '../components/Screen';
import { Tags } from '../components/Tags';
import { CONTEXTS } from '../data/content';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { replay } from '../lib/motion';
import { loc } from '../lib/text';
import { durList, feelsGood, moocaFor } from '../state';

export function Dur() {
  const { s, L, dispatch } = useApp();
  const c = CONTEXTS.find(x => x.id === s.ctx);
  const good = feelsGood(s);
  return (
    <Screen>
      <TopBar step={4} />
      {good
        // the longer question takes the tag row's place, so the bubble keeps the shared height
        ? <Guide img={moocaFor(s, IMG.calm)} q={L.qGood} sub={!s.dur ? L.durSub : L.durDoneGood(s.dur)} subKey={s.dur ?? 'none'} cls="q-wrap" />
        : <Guide img={moocaFor(s, IMG.calm)} q={L.qHeavy} sub={!s.dur ? L.durSub : L.durDoneHeavy(s.dur)} subKey={s.dur ?? 'none'}
            tags={<Tags extra={c && c.id !== 'unsure' ? [loc(c, s.lang).label] : []} />} />}
      <div className="opts" role="group" aria-label={L.durAria}>
        {durList(s).map(d => (
          <button key={d.id} className="opt" data-act="dur" data-id={d.id} aria-pressed={s.dur === d.id}
            onClick={e => { replay(e.currentTarget, 'just'); dispatch({ type: 'dur', id: d.id }); }}>
            {loc(d, s.lang).label}{ico.check}
          </button>
        ))}
      </div>
      <div className="grow" />
      <div className="actions">
        <button className="primary" data-act="toResult" disabled={!s.dur} onClick={() => dispatch({ type: 'go', screen: 'result', now: Date.now() })}>{L.seeCard}</button>
        <button className="text-btn" data-act="skipDur" onClick={() => dispatch({ type: 'skipDur', now: Date.now() })}>{L.skip}</button>
      </div>
    </Screen>
  );
}
