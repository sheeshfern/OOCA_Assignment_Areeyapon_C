import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useApp } from '../AppContext';
import { Guide, NextBar, TopBar } from '../components/bits';
import { DurScene } from '../components/DurScene';
import { Screen, useReplayOn } from '../components/Screen';
import { Tags } from '../components/Tags';
import { CONTEXTS } from '../data/content';
import { ico } from '../data/icons';
import { durArt } from '../data/images';
import { loc, Ph } from '../lib/text';
import { durList, feelsGood, moocaFor } from '../state';

export function Dur() {
  const { s, L, go, tap } = useApp();
  const c = CONTEXTS.find(x => x.id === s.ctx);
  const good = feelsGood(s);
  const list = durList(s);
  const steps = list.filter(d => d.id !== 'unsure');
  const picked = list.find(d => d.id === s.dur);
  const pickedCopy = picked && loc(picked, s.lang);
  const unsure = list.find(d => d.id === 'unsure');
  const answered = !s.dur ? L.durSub : good ? L.durDoneGood(s.dur) : L.durDoneHeavy(s.dur);
  return (
    <Screen>
      <TopBar step={4} />
      {/* the longer "good" question takes the tag row's place, so the bubble keeps the shared height */}
      <Guide img={moocaFor(s)} q={good ? L.qGood : L.qHeavy} sub={answered} subKey={s.dur ?? 'none'} cls={good ? 'q-wrap' : ''}
        tags={good ? undefined : <Tags extra={c && c.id !== 'unsure' ? [loc(c, s.lang).label] : []} />} />
      <DurScene art={durArt(good, s.dur ?? 'unsure')} label={pickedCopy?.label} say={pickedCopy?.say} pick={L.durPick} id={s.dur} />
      <Steps p={Math.max(0, steps.findIndex(d => d.id === s.dur))} label={L.durAria} id={s.dur}>
        {steps.map(d => (
          <button key={d.id} className="opt step" data-act="dur" data-id={d.id} aria-pressed={s.dur === d.id}
            onClick={e => tap(e, { type: 'dur', id: d.id })}>
            <i className="dot">{ico.check}</i><span><Ph text={loc(d, s.lang).label} /></span>
          </button>
        ))}
      </Steps>
      <button className="text-btn step-un" data-act="dur" data-id="unsure" aria-pressed={s.dur === 'unsure'}
        onClick={e => tap(e, { type: 'dur', id: 'unsure' })}>
        {unsure && loc(unsure, s.lang).label}
      </button>
      <NextBar act="toResult" label={L.seeCard} disabled={!s.dur} onClick={() => go('result')} />
    </Screen>
  );
}

// four dots on one line; the line fills again up to a newly picked dot
function Steps({ p, label, id, children }: { p: number; label: string; id: string | null; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReplayOn(ref, 'reflow', id);
  return <div ref={ref} className="opts steps" role="group" aria-label={label} style={{ '--p': p } as CSSProperties}>{children}</div>;
}
