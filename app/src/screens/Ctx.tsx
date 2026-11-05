import { useApp } from '../AppContext';
import { Guide, NextBar, TopBar } from '../components/bits';
import { Screen } from '../components/Screen';
import { Tags } from '../components/Tags';
import { CONTEXTS } from '../data/content';
import { ico } from '../data/icons';
import { ctxArt } from '../data/images';
import { loc } from '../lib/text';
import { moocaFor, moodTone } from '../state';

export function Ctx() {
  const { s, L, go, tap } = useApp();
  return (
    <Screen>
      <TopBar step={3} />
      <Guide img={moocaFor(s)} q={L.q3} sub={!s.ctx ? L.q3sub : L.q3done(s.ctx === 'unsure')} subKey={!s.ctx ? 'none' : s.ctx === 'unsure' ? 'unsure' : 'picked'} tags={<Tags />} />
      <div className="opts" role="group" aria-label={L.q3}>
        {CONTEXTS.map(c => (
          <button key={c.id} className="opt with-ic" data-act="ctx" data-id={c.id} aria-pressed={s.ctx === c.id}
            onClick={e => tap(e, { type: 'ctx', id: c.id })}>
            <span className="oi"><img src={ctxArt(c.id, moodTone(s).id)} alt="" /></span><span className="ol">{loc(c, s.lang).label}</span>{ico.check}
          </button>
        ))}
      </div>
      <NextBar act="toDur" label={L.next} disabled={!s.ctx} onClick={() => go('dur')} />
    </Screen>
  );
}
