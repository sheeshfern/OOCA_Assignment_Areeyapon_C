import { useRef, type CSSProperties } from 'react';
import { useReplayOn, useStay } from './Screen';
import { Ph } from '../lib/text';

// step 4 scene: a calendar whose ticked days follow the answer, and a big bubble that says it back
const DUR_DAYS: Record<string, number> = { today: 1, days: 3, week: 7, long: 14, unsure: 0 };

function DurCal({ n }: { n: number }) {
  // a new answer ticks the days in again, one after another
  const ref = useRef<SVGSVGElement>(null);
  useReplayOn(ref, 'reflow', n);
  return (
    <svg ref={ref} className="dur-cal" viewBox="0 0 200 130" aria-hidden="true">
      <rect x="8" y="18" width="184" height="106" rx="16" fill="#fff" stroke="#80E2D9" strokeWidth="4" />
      <path d="M8 34a16 16 0 0 1 16-16h152a16 16 0 0 1 16 16v10H8z" fill="#26CDBE" />
      {[50, 94, 138].map(x => <rect key={x} x={x} y="6" width="12" height="26" rx="6" fill="#00A28B" stroke="#fff" strokeWidth="3" />)}
      {Array.from({ length: 14 }, (_, i) => {
        const x = 20 + (i % 7) * 24, y = 56 + Math.floor(i / 7) * 28, on = i < n;
        return (
          on
            ? <g key={i} className="on" style={{ '--k': i } as CSSProperties}>
                <rect x={x} y={y} width="20" height="22" rx="5" fill="#F0BF4D" />
                <path d={`M${x + 5} ${y + 11}l4 4l7-8`} stroke="#355956" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            : <rect key={i} x={x} y={y} width="20" height="22" rx="5" fill="#F1F1F1" />
        );
      })}
    </svg>
  );
}

export function DurScene({ art, label, say, pick, id }: { art: string; label?: string; say?: string | null; pick: string; id: string | null }) {
  const stay = useStay();
  return (
    <div className="dur-scene" aria-hidden="true">
      <span className="mooca dur-mooca"><img src={art} alt="" /></span>
      <DurCal n={DUR_DAYS[id ?? ''] ?? 0} />
      <div key={id ?? 'none'} className={`dur-read${label ? '' : ' empty'}${stay ? ' swap' : ''}`}><b><Ph text={label ?? pick} /></b>{say && <span><Ph text={say} /></span>}</div>
    </div>
  );
}
