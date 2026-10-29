import { useApp } from '../AppContext';
import { loc } from '../lib/text';

/** the picked words (and the topic, once chosen) as chips above Mooca's question */
export function Tags({ extra = [] }: { extra?: string[] }) {
  const { s } = useApp();
  return (
    <div className="tags">
      {s.picks.map(p => <span key={p.w} className="tag">{loc(p, s.lang).w}</span>)}
      {extra.map(e => <span key={e} className="tag soft">{e}</span>)}
    </div>
  );
}
