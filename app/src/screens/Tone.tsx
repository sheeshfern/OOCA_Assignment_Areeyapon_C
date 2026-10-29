import type { CSSProperties } from 'react';
import { useApp } from '../AppContext';
import { Guide, TopBar } from '../components/bits';
import { Screen } from '../components/Screen';
import { TONES } from '../data/content';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { replay } from '../lib/motion';
import { loc, Ph } from '../lib/text';

export function Tone() {
  const { s, L, dispatch } = useApp();
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
              onClick={e => { replay(e.currentTarget, 'just'); dispatch({ type: 'tone', id: x.id }); }}>
              <span className="art" style={{ '--tbg': x.bg, '--tz': x.zone } as CSSProperties}>
                <img src={x.img} alt="" /><i className="ck">{ico.checkW}</i>
              </span>
              <b><Ph text={lx.label} /></b><small><Ph text={lx.eg} /></small>
            </button>
          );
        })}
      </div>
      <button className="text-btn" data-act="all" onClick={() => dispatch({ type: 'all' })}>{L.seeAll}</button>
      <div className="grow" />
      <div className="actions">
        <button className="primary" data-act="toWords" disabled={!t} onClick={() => dispatch({ type: 'toWords' })}>{L.next}</button>
      </div>
    </Screen>
  );
}
