import { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import { ico } from '../data/icons';
import { chime, replay } from '../lib/motion';
import { NOTE_MAX, Ph } from '../lib/text';

// The 30-second note. The timer is a gentle guide: when it ends the clock rings once,
// but the note stays open so nobody is cut off mid-sentence.
export function NoteDialog({ open, prompt, onClose }: { open: boolean; prompt: string; onClose: () => void }) {
  const { s, L, dispatch } = useApp();
  const dlg = useRef<HTMLDialogElement>(null), text = useRef<HTMLTextAreaElement>(null), clock = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(30000);
  const [timeUp, setTimeUp] = useState(false);
  // typing reached NOTE_MAX characters
  const [limitHit, setLimitHit] = useState(false);
  const chars = s.note.length;

  useEffect(() => {
    const d = dlg.current!;
    if (!open) { if (d.open) d.close(); return; }
    if (!d.open) d.showModal();
    text.current?.focus({ preventScroll: true });
    clock.current?.classList.remove('ringing');
    setLimitHit(false);
    // once a note has been written and closed, later opens are plain editing: no clock, no countdown
    if (s.noteDone) return;
    // already rang on an earlier open: show the finished clock, no sound
    if (s.noteUp) { setTimeUp(true); setLeft(0); return; }
    setTimeUp(false);
    // only ever one countdown, and it stops itself the moment it rings, so the ding plays exactly once
    const end = performance.now() + 30000;
    const tick = () => {
      const ms = Math.max(0, end - performance.now());
      setLeft(ms);
      if (ms <= 0) {
        clearInterval(id);
        setTimeUp(true);
        dispatch({ type: 'noteUp' });
        replay(clock.current, 'ringing');
        chime();
      }
    };
    const id = window.setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
    // the countdown restarts only when the note opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <dialog id="note" ref={dlg} className="note-dlg" aria-labelledby="note-q"
      onCancel={e => { e.preventDefault(); onClose(); }}
      onClick={e => { if (e.target === dlg.current) onClose(); /* a tap on the dimmed backdrop */ }}>
      <div className="note-wrap">
        <div className="note-top">
          <button className="icon-btn" data-note="close" aria-label={L.noteClose} onClick={onClose}>{ico.close}</button>
        </div>
        <div className={`paper${s.noteDone ? ' editing' : timeUp ? ' timeup' : ''}`}>
          <div className="note-head">
            <div>
              <span className="note-lb">{s.noteDone ? L.noteEditLb : L.writeLb}</span>
              <p id="note-q" className="note-q"><Ph text={prompt} /></p>
            </div>
            <div className="clock" aria-hidden="true" ref={clock}>
              <svg viewBox="0 0 64 64" fill="none">
                <g className="bell">
                  <path d="M9 17a9 9 0 0 1 13-9" stroke="#009688" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M55 17a9 9 0 0 0-13-9" stroke="#009688" strokeWidth="3.5" strokeLinecap="round" />
                </g>
                <path d="M19 55l-4 5M45 55l4 5" stroke="#009688" strokeWidth="3" strokeLinecap="round" />
                <circle cx="32" cy="36" r="22" fill="#fff" />
                <circle className="track" cx="32" cy="36" r="22" strokeWidth="5" />
                <circle className="prog" cx="32" cy="36" r="22" strokeWidth="5" strokeLinecap="round" pathLength={100} strokeDasharray="100"
                  style={{ strokeDashoffset: timeUp ? 100 : 100 - left / 300 }} transform="rotate(-90 32 36)" />
              </svg>
              <b className="sec" style={timeUp ? { fontSize: 12 } : undefined}>{timeUp ? L.timeUp : Math.ceil(left / 1000)}</b>
            </div>
          </div>
          <textarea id="note-text" ref={text} className="note-text" aria-labelledby="note-q" aria-describedby="note-count" rows={5}
            placeholder={L.placeholder} value={s.note} maxLength={NOTE_MAX}
            onChange={e => { setLimitHit(e.target.value.length >= NOTE_MAX); dispatch({ type: 'note', text: e.target.value }); }} />
          <div className="note-foot">
            <p className="note-status" role="status" aria-live="polite">{limitHit ? L.noteFull : timeUp && !s.noteDone ? L.timeUpMsg : ''}</p>
            <span id="note-count" className={`note-count${chars >= NOTE_MAX ? ' full' : ''}`}>{L.noteCount(chars, NOTE_MAX)}</span>
          </div>
        </div>
        <p className="note-private">{ico.lock}<span>{L.notePrivate}</span></p>
        <button className="primary" data-note="done" onClick={onClose}>{L.done}</button>
      </div>
    </dialog>
  );
}
