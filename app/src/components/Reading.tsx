// The long reading under the result postcard: what you feel, what's happening inside, where it comes from,
// what the time says, and what to try. Built from the answers, so a shelf jar can show the same reading later.
import { useApp } from '../AppContext';
import { readingFor } from '../state';
import { Ph } from '../lib/text';
import type { Reading as R } from '../data/story';

export function ReadingView({ r, compact = false }: { r: R; compact?: boolean }) {
  const { L } = useApp();
  return (
    <div className={`reading${compact ? ' compact' : ''}`}>
      {!compact && <section><h3>{L.readFeel}</h3><p><Ph text={r.feel} /></p></section>}
      <section><h3>{L.readInside}</h3><p><Ph text={r.inside} /></p></section>
      <section><h3>{L.readSource}</h3><p><Ph text={r.source} /></p></section>
      {r.time && <section><h3>{L.readTime}</h3><p><Ph text={r.time} /></p></section>}
      <section><h3>{L.readCare}</h3><ul>{r.care.map(c => <li key={c}><Ph text={c} /></li>)}</ul></section>
    </div>
  );
}

export function ReadingCard() {
  const { s, L } = useApp();
  return (
    <div className="read-card">
      <span className="lb">{L.readLb}</span>
      <ReadingView r={readingFor(s)} />
    </div>
  );
}
