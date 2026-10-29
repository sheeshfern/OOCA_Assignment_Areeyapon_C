// Small shared pieces: typing dots, the step bar, and Mooca's speech bubble on the question screens
import type { ReactNode } from 'react';
import { useApp } from '../AppContext';
import { ico } from '../data/icons';
import { useStay } from './Screen';

/** typing dots shown before Mooca's words */
export const Dots = () => (
  <span className="dots" aria-hidden="true"><i /><i /><i /></span>
);

export function TopBar({ step }: { step: number }) {
  const { L, dispatch } = useApp();
  return (
    <div className="top">
      <button className="icon-btn" data-act="back" aria-label={L.back} onClick={() => dispatch({ type: 'back' })}>{ico.back}</button>
      <div className="progress" aria-hidden="true">
        {[1, 2, 3, 4].map(i => <span key={i} className={`${i <= step ? 'on' : ''}${i === step ? ' now' : ''}`} />)}
      </div>
      <span className="step-count">{L.step(step)}</span>
    </div>
  );
}

interface GuideProps {
  img: string;
  q: ReactNode;
  sub?: ReactNode;
  /** changes whenever the sub line's wording changes, so a new line eases in */
  subKey?: string;
  tags?: ReactNode;
  cls?: string;
}

// every question screen shares one guide height and each bubble line stays on one line,
// so the choices start at the same spot on every step and never move when Mooca replies
export function Guide({ img, q, sub, subKey, tags, cls = '' }: GuideProps) {
  const stay = useStay();
  return (
    <div className="guide">
      <span className="mooca"><img className="float" src={img} alt="" /></span>
      <div className={`bubble talks ${cls}`.trim()}>
        <Dots />
        {tags}
        <h1 tabIndex={-1}>{q}</h1>
        {sub && <p data-swap="sub" key={subKey} className={stay ? 'swap' : undefined}>{sub}</p>}
      </div>
    </div>
  );
}
