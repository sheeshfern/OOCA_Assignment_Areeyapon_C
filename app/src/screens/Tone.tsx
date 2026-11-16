import { useRef, useState, type CSSProperties } from 'react';
import { useApp } from '../AppContext';
import { Guide, TopBar } from '../components/bits';
import { Room } from '../components/Room';
import { Screen } from '../components/Screen';
import { TONES } from '../data/content';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { ROOMS } from '../data/story';
import { calm } from '../lib/motion';
import { Ph } from '../lib/text';

// Step 1 as a story: four rooms, each with the weather of one mood. Picking one lifts it,
// then the room grows to fill the screen and the next questions happen inside it.
export function Tone() {
  const { s, L, dispatch } = useApp();
  // first tap selects a room (its button appears), the button inside the room goes in
  const [sel, setSel] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const grid = useRef<HTMLDivElement>(null);

  const select = (id: string) => { if (picked || sel === id) return; setSel(id); dispatch({ type: 'tone', id }); };
  const pick = (id: string) => {
    if (picked) return;
    setPicked(id);
    const done = () => dispatch({ type: 'toWords' });
    if (calm()) return void window.setTimeout(done, 300);
    // the picked tile lifts, then a copy of the room grows from the tile to the whole frame
    window.setTimeout(() => {
      const tile = grid.current?.querySelector<HTMLElement>(`[data-id="${id}"] .room-stack`);
      const app = document.getElementById('app');
      if (!tile || !app) return done();
      const a = tile.getBoundingClientRect(), b = app.getBoundingClientRect();
      const top = Math.max(b.top, 0), bottom = Math.min(b.bottom, innerHeight);
      const fly = tile.querySelector('.room')!.cloneNode(true) as HTMLElement;
      fly.classList.add('room-fly');
      Object.assign(fly.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
      document.body.appendChild(fly);
      const grow = fly.animate([
        { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, borderRadius: '16px' },
        { left: `${b.left}px`, top: `${top}px`, width: `${b.width}px`, height: `${bottom - top}px`, borderRadius: getComputedStyle(app).borderRadius },
      ], { duration: 650, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' });
      grow.onfinish = () => {
        done();
        fly.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, delay: 120, fill: 'forwards' }).onfinish = () => fly.remove();
      };
    }, 280);
  };

  const t = s.tone && sel ? s.tone : null;
  return (
    <Screen className="rooms-step">
      <TopBar step={1} />
      <Guide img={IMG.calm} q={L.q1} sub={t ? L.roomPick(ROOMS[t.id].name[s.lang]) : L.q1sub} subKey={t ? t.id : 'none'} />
      <div className="room-grid" role="group" aria-label={L.tonesAria} ref={grid}>
        {TONES.map(x => (
          <div key={x.id} className={`room-tile${sel === x.id ? ' sel' : ''}${picked === x.id ? ' on' : ''}${picked && picked !== x.id ? ' off' : ''}`} data-id={x.id}
            style={{ '--zone': x.zone, '--zone-ink': x.ink, '--zone-solid': x.solid } as CSSProperties}>
            <button className="room-pick" data-act="tone" data-id={x.id} aria-pressed={sel === x.id} onClick={() => select(x.id)}>
              <span className="room-stack">
                <Room tone={x} uid="-c" />
              </span>
              <b><Ph text={ROOMS[x.id].name[s.lang]} /></b>
              <small><Ph text={ROOMS[x.id].scene[s.lang]} /></small>
            </button>
            {sel === x.id && <button className="room-go" data-act="room-go" onClick={() => pick(x.id)}>{L.roomGo}{ico.arrow}</button>}
          </div>
        ))}
      </div>
    </Screen>
  );
}
