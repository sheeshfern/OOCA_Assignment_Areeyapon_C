import { useApp } from '../AppContext';

/** "how heavy is your heart", 1 (light) to 5 (very heavy): five numbered steps on one track, in the CI
 *  turquoise. `was` marks the start answer on the second ask. */
export function Scale({ value, was, onPick }: { value: number | null; was?: number | null; onPick: (n: number) => void }) {
  const { L } = useApp();
  return (
    <div className="scale" role="group" aria-label={L.scaleAria}>
      <div className="scale-row">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} className={`stone${value === n ? ' on' : ''}${was === n ? ' was-on' : ''}`} data-act="scale" data-n={n}
            aria-pressed={value === n} aria-label={`${n} ${L.scaleWords[n - 1]}`} onClick={() => onPick(n)}>
            {was === n && <span className="was">{L.scaleWas}</span>}
            <i>{n}</i>
          </button>
        ))}
      </div>
      <div className="scale-ends" aria-hidden="true">
        <span>{L.scaleWords[0]}</span>
        <b>{value ? L.scaleWords[value - 1] : ''}</b>
        <span>{L.scaleWords[4]}</span>
      </div>
    </div>
  );
}
