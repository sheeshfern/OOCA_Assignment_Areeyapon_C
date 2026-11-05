// Small shared pieces: typing dots, the step bar, Mooca's speech bubble and the bottom action of each question
import type { ReactNode } from 'react';
import { useApp } from '../AppContext';
import { ico } from '../data/icons';
import { OOCA_URL } from '../data/images';
import { useStay } from './Screen';

/** typing dots shown before Mooca's words */
export const Dots = () => (
  <span className="dots" aria-hidden="true"><i /><i /><i /></span>
);

export function BackBtn() {
  const { L, dispatch } = useApp();
  return <button className="icon-btn" data-act="back" aria-label={L.back} onClick={() => dispatch({ type: 'back' })}>{ico.back}</button>;
}

/** the link out to ooca */
export function OocaLink({ ghost = false }: { ghost?: boolean }) {
  const { L } = useApp();
  return <a className={`cta${ghost ? ' ghost' : ''}`} href={OOCA_URL} target="_blank" rel="noopener"><span>{L.cta}</span>{ico.arrow}</a>;
}

/** the main button at the foot of a question; stays off until the question is answered */
export function NextBar({ act, label, disabled, onClick }: { act: string; label: ReactNode; disabled: boolean; onClick: () => void }) {
  return (
    <>
      <div className="grow" />
      <div className="actions">
        <button className="primary" data-act={act} disabled={disabled} onClick={onClick}>{label}</button>
      </div>
    </>
  );
}

/** back, "ข้อ n/4" centred, then the segmented progress bar */
export function TopBar({ step }: { step: number }) {
  const { L } = useApp();
  return (
    <>
      <div className="top">
        <BackBtn />
        <span className="step-count">{L.step(step)}</span>
        <span className="top-gap" aria-hidden="true" />
      </div>
      <div className="progress" aria-hidden="true">
        {[1, 2, 3, 4].map(i => <span key={i} className={`${i <= step ? 'on' : ''}${i === step ? ' now' : ''}`} />)}
      </div>
    </>
  );
}

interface GuideProps {
  img: string;
  q: ReactNode;
  sub: ReactNode;
  /** changes whenever the sub line's wording changes, so a new line eases in */
  subKey: string;
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
        {tags}
        <h1 tabIndex={-1}>{q}</h1>
        <p data-swap="sub" key={subKey} className={stay ? 'swap' : undefined}>{sub}</p>
      </div>
    </div>
  );
}
