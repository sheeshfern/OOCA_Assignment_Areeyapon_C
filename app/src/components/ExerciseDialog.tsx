import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import { EXERCISES, exSteps } from '../data/content';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import type { Rate } from '../data/ui';
import { chime } from '../lib/motion';
import { Ph } from '../lib/text';
import { exFor, posesFor } from '../state';
import { useDialog } from './useDialog';

const RATES: Rate[] = ['better', 'same', 'worse'];

// The one-minute exercise. Steps run on timeouts; the orb grows on the in-breath and shrinks on the
// out-breath (a slow pulse for the other two). It ends with one question, "how do you feel now".
export function ExerciseDialog({ open, onClose, onRate }: { open: boolean; onClose: () => void; onRate: (r: Rate) => void }) {
  const { s, L } = useApp();
  const dialog = useDialog(open, onClose);
  const id = exFor(s), T = EXERCISES[id][s.lang];
  const img = id === 'kind' ? IMG.hug : id === 'savor' ? posesFor(s)[0] : IMG.calm;
  const [phase, setPhase] = useState<[string, number]>(['out', 0]);
  const [line, setLine] = useState('');
  const [lineKey, setLineKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [asking, setAsking] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null), firstRate = useRef<HTMLButtonElement>(null);
  const total = useRef(60000);

  useEffect(() => {
    if (!open) return;
    const steps = exSteps(id, s.lang);
    total.current = steps.reduce((n, x) => n + x[1], 0) * 1000;
    setPhase(['out', 0]); setLine(''); setProgress(0); setAsking(false);
    closeBtn.current?.focus({ preventScroll: true });
    let i = 0, to = 0, raf = 0, live = true;
    const t0 = performance.now();
    const tick = window.setInterval(() => setProgress(Math.min(1, (performance.now() - t0) / total.current)), 250);
    const next = () => {
      if (!live) return;
      if (i >= steps.length) {
        clearInterval(tick); setProgress(1); setAsking(true); chime();
        return;
      }
      const [ph, sec, text] = steps[i++];
      setPhase([ph, sec]);
      setLine(prev => { if (prev !== text) setLineKey(k => k + 1); return text; });
      to = window.setTimeout(next, sec * 1000);
    };
    // two frames at the small size first, so the first in-breath has somewhere to grow from
    raf = requestAnimationFrame(() => { raf = requestAnimationFrame(next); });
    return () => { live = false; clearTimeout(to); clearInterval(tick); cancelAnimationFrame(raf); };
    // the run restarts only when the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => { if (asking) firstRate.current?.focus({ preventScroll: true }); }, [asking]);

  // the dialog sits outside .app, so it borrows the card's tone colour
  const zone = s.picks[0]?.tone.zone;
  const left = Math.ceil((total.current * (1 - progress)) / 1000);
  return (
    <dialog id="ex" {...dialog} className="note-dlg ex-dlg" aria-labelledby="ex-title" style={zone ? { ['--zone' as string]: zone } : undefined}>
      {open && (
        <div className="note-wrap ex-wrap">
          <div className="note-top"><button ref={closeBtn} className="icon-btn" data-ex="close" aria-label={L.exClose} onClick={onClose}>{ico.close}</button></div>
          <div className={`paper ex-paper${asking ? ' asking' : ''}`}>
            <span className="note-lb">{L.exLb}</span>
            <h2 id="ex-title" className="ex-title"><Ph text={T.t} /></h2>
            <div className="ex-stage" aria-hidden="true">
              <span className="ex-orb" data-phase={phase[0]} style={{ ['--d' as string]: `${phase[1]}s` }}><img src={img} alt="" /></span>
            </div>
            <p key={lineKey} className={`ex-step${lineKey > 1 ? ' swap' : ''}`} aria-live="polite">{line && <Ph text={line} />}</p>
            <div className="ex-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
            <p className="ex-left">{asking ? '' : L.exLeft(left)}</p>
            <div className="ex-ask" hidden={!asking}>
              <p className="ex-q">{L.exAsk}</p>
              <div className="ex-rate">
                {RATES.map((k, i) => <button key={k} ref={i === 0 ? firstRate : undefined} className="soft-btn" data-ex-rate={k} onClick={() => onRate(k)}>{L.exRate[k]}</button>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
