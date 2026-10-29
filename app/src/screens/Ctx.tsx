import { useApp } from '../AppContext';
import { Guide, TopBar } from '../components/bits';
import { Screen } from '../components/Screen';
import { Tags } from '../components/Tags';
import { CONTEXTS } from '../data/content';
import { CTX_ICON } from '../data/ctxIcons';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { replay } from '../lib/motion';
import { loc } from '../lib/text';
import { moocaFor } from '../state';

export function Ctx() {
  const { s, L, dispatch } = useApp();
  return (
    <Screen>
      <TopBar step={3} />
      <Guide img={moocaFor(s, IMG.calm)} q={L.q3} sub={!s.ctx ? L.q3sub : L.q3done(s.ctx === 'unsure')} subKey={!s.ctx ? 'none' : s.ctx === 'unsure' ? 'unsure' : 'picked'} tags={<Tags />} />
      <div className="opts" role="group" aria-label={L.q3}>
        {CONTEXTS.map(c => (
          <button key={c.id} className="opt with-ic" data-act="ctx" data-id={c.id} aria-pressed={s.ctx === c.id}
            onClick={e => { replay(e.currentTarget, 'just'); dispatch({ type: 'ctx', id: c.id }); }}>
            <span className="oi">{CTX_ICON[c.id]}</span><span className="ol">{loc(c, s.lang).label}</span>{ico.check}
          </button>
        ))}
      </div>
      <div className="grow" />
      <div className="actions">
        <button className="primary" data-act="toDur" disabled={!s.ctx} onClick={() => dispatch({ type: 'go', screen: 'dur', now: Date.now() })}>{L.next}</button>
        <button className="text-btn" data-act="skipCtx" onClick={() => dispatch({ type: 'skipCtx' })}>{L.skip}</button>
      </div>
    </Screen>
  );
}
