import type { CSSProperties } from 'react';
import { useApp } from '../AppContext';
import { Guide, NextBar, TopBar } from '../components/bits';
import { Screen, useStay } from '../components/Screen';
import { TONES } from '../data/content';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { loc, Ph } from '../lib/text';
import { CI_TINT } from '../state';

export function Tone() {
  const { s, L, dispatch, tap } = useApp();
  const t = s.tone;
  return (
    <Screen>
      <TopBar step={1} />
      <Guide img={t ? t.img : IMG.calm} q={L.q1} sub={t ? loc(t, s.lang).reply : L.q1sub} subKey={t ? t.id : 'none'} />
      <div className="tones" role="group" aria-label={L.tonesAria}>
        {TONES.map(x => {
          const lx = loc(x, s.lang);
          return (
            <button key={x.id} className="tone" data-act="tone" data-id={x.id} aria-pressed={t?.id === x.id}
              style={{ '--zone': x.zone, '--zone-ink': x.ink, '--zone-solid': x.solid } as CSSProperties}
              onClick={e => tap(e, { type: 'tone', id: x.id })}>
              <span className="art" style={{ '--tbg': CI_TINT[x.id][1], '--tz': x.zone } as CSSProperties}>
                <img src={x.img} alt="" /><i className="ck">{ico.checkW}</i>
              </span>
              <b><Ph text={lx.label} /></b><small><Ph text={lx.eg} /></small>
            </button>
          );
        })}
        <Hub text={t ? loc(t, s.lang).label : null} empty={L.pickOne} id={t?.id ?? 'none'} />
      </div>
      <button className="text-btn" data-act="all" onClick={() => dispatch({ type: 'all' })}>{L.seeAll}</button>
      <NextBar act="toWords" label={L.next} disabled={!t} onClick={() => dispatch({ type: 'toWords' })} />
    </Screen>
  );
}

// the circle in the middle names the pick; a new pick re-pops it
function Hub({ text, empty, id }: { text: string | null; empty: string; id: string }) {
  const stay = useStay();
  return (
    <div key={id} className={`hub${text ? '' : ' empty'}${stay ? ' swap' : ''}`} aria-hidden="true">
      <span><Ph text={text ?? empty} /></span>
    </div>
  );
}
