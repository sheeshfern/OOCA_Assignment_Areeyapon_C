import { useState } from 'react';
import { useApp } from '../AppContext';
import { ico } from '../data/icons';

// A gentle daily nudge, chosen by the person (never on by default). Prototype: the time is remembered,
// but no notification is sent yet.
const KEY = 'ooca-remind';
const saved = () => { try { return localStorage.getItem(KEY); } catch { return null; } };

export function Remind() {
  const { L } = useApp();
  const [time, setTime] = useState<string | null>(saved);
  const [editing, setEditing] = useState(false);
  const choose = (t: string | null) => {
    const v = t ?? 'off';
    setTime(v); setEditing(false);
    try { localStorage.setItem(KEY, v); } catch { /* not remembered */ }
  };
  if (time === 'off' && !editing) return null;
  if (time && time !== 'off' && !editing) {
    return (
      <div className="remind set">
        <p>{ico.ok}<span>{L.remindSet(time)}</span></p>
        <small>{L.remindMock} · <button className="text-btn" onClick={() => setEditing(true)}>{L.remindChange}</button></small>
      </div>
    );
  }
  return (
    <div className="remind">
      <b>{L.remindTitle}</b>
      <div className="chips">
        {L.remindTimes.map(([t, lb]) => <button key={t} className="chip" aria-pressed={time === t} onClick={() => choose(t)}>{lb} {t}</button>)}
        <button className="chip quiet" onClick={() => choose(null)}>{L.remindNo}</button>
      </div>
      <small>{L.remindMock}</small>
    </div>
  );
}
