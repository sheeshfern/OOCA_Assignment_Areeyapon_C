// Under the result postcard: one minute to feel a little better, and how today compares with the last check-in.
import { useApp } from '../AppContext';
import { CONTEXTS, EXERCISES, NEUTRAL, TONES } from '../data/content';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import type { Copy } from '../data/ui';
import type { Lang } from '../data/types';
import { lastDays, readLog, type Checkin } from '../lib/checkins';
import { useEffect, useRef, useState } from 'react';
import { calm } from '../lib/motion';
import { Jar } from './Jar';
import { loc, Ph } from '../lib/text';
import { exFor, posesFor, wordsOf } from '../state';

export function TryBlock() {
  const { s, L, openEx } = useApp();
  const id = exFor(s), T = EXERCISES[id][s.lang];
  const helped = !s.exRate && (readLog() ?? []).some(e => e.at !== s.at && e.ex === id && e.after === 'better');
  const img = id === 'kind' ? IMG.hug : id === 'savor' ? posesFor(s)[0] : IMG.calm;
  return (
    <div className="try">
      <span className="lb">{L.exLb}</span>
      <div className="try-row">
        <span className="try-orb" aria-hidden="true"><img src={img} alt="" /></span>
        <div><b><Ph text={T.t} /></b><small><Ph text={T.sub} /></small></div>
      </div>
      {s.exRate ? <p className="try-done">{ico.ok}{L.exDone(s.exRate)}</p> : helped ? <p className="try-done">{ico.ok}{L.exHelped}</p> : null}
      <button className="timer try-go" data-act="exercise" aria-haspopup="dialog" onClick={openEx}>{ico.play}<span>{s.exRate ? L.exAgain : L.exGo}</span></button>
    </div>
  );
}

// a dot per check-in in its tone colour; grey when the feeling had no name yet
const DOT_GREY = '#B5C3C1';
const dotColor = (e: Pick<Checkin, 'tone'>) => TONES.find(t => t.id === e.tone)?.zone ?? DOT_GREY;
const allWords = () => TONES.flatMap(wordsOf);

function agoText(then: number, now: number, L: Copy) {
  if ((now - then) / 60000 < 60) return L.ago.now;
  const d0 = new Date(then); d0.setHours(0, 0, 0, 0);
  const d1 = new Date(now); d1.setHours(0, 0, 0, 0);
  const days = Math.round((+d1 - +d0) / 864e5);
  return days <= 0 ? L.ago.today : days === 1 ? L.ago.yday : L.ago.days(days);
}
const wordsText = (e: Checkin, lang: Lang, L: Copy) =>
  e.words?.length ? e.words.map(w => { const x = allWords().find(y => y.w === w); return x ? loc(x, lang).w : w; }).join(L.and) : loc(NEUTRAL, lang).w;

export function TrendBlock({ lv }: { lv: number }) {
  const { s, L } = useApp();
  const log = readLog();
  if (!log || !s.at) return null;
  const past = log.filter(e => e.at !== s.at);
  // this card, from the answers on screen (it is logged after the first paint)
  const now: Checkin = { at: s.at, tone: s.picks[0]?.tone.id ?? null, words: s.picks.map(p => p.w), lv, ctx: s.ctx, ctx2: s.ctx2, dur: s.dur };
  const prev = past[past.length - 1];
  const last = [...past.slice(-6), now];
  let body;
  if (!prev) body = <p><Ph text={L.trendFirst} /></p>;
  else {
    const T = L.trendSay, same = !!s.picks.length && prev.words?.[0] === s.picks[0].w;
    const say = same ? (lv === 0 ? T.sameGood : T.sameHeavy) : lv < prev.lv ? T.lighter : lv > prev.lv ? T.heavier : T.other;
    // a pattern worth noticing: the same source behind most of the recent heavy days
    const recent = [...past.slice(-4), now];
    const c = CONTEXTS.find(x => x.id === s.ctx);
    const n = recent.filter(e => e.lv > 0 && (e.ctx === s.ctx || e.ctx2 === s.ctx)).length;
    const pattern = lv > 0 && c && c.id !== 'unsure' && recent.length >= 3 && n >= 3
      ? L.trendPattern(n, recent.length, s.lang === 'en' ? loc(c, s.lang).label.toLowerCase() : c.say ?? '') : null;
    body = <>
      <p>{L.trendPrev(agoText(prev.at, s.at, L), wordsText(prev, s.lang, L))}</p>
      <p className="trend-say"><Ph text={say} /></p>
      {pattern && <p className="trend-pattern"><Ph text={pattern} /></p>}
    </>;
  }
  return (
    <div className="trend">
      <div className="trend-head">
        <span className="lb">{L.trendLb}</span>
        <ol className="trend-dots" aria-label={L.trendAria(last.length)}>
          {last.map(e => <li key={e.at} className={e === now ? 'now' : undefined} style={{ ['--c' as string]: dotColor(e) }} />)}
        </ol>
      </div>
      {body}
      <p className="trend-private">{ico.lock}<span>{L.trendPrivate}</span></p>
    </div>
  );
}


/** Signed in: one compact card under the result. The last 7 days as little jars (today's just filled),
 *  a line on last time, and the way into the chat. Everything else lives on the shelf. */
// set when someone signs in from the result's popup: the card they come back to shows where to keep talking
let focusNext = false;
const TH_DAY = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'], EN_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const focusToday = () => { focusNext = true; };

export function TodayCard() {
  const { s, L, go } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [hi] = useState(() => { const f = focusNext; focusNext = false; return f; });
  useEffect(() => {
    if (!hi) return;
    const t = window.setTimeout(() => ref.current?.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'center' }), 250);
    return () => clearTimeout(t);
  }, [hi]);
  const [now] = useState(() => Date.now());
  const week = lastDays(7, now);
  const prev = (readLog() ?? []).filter(e => e.at !== s.at).pop();
  return (
    <div ref={ref} className={`today-card${hi ? ' hello' : ''}`}>
      <div className="today-head">
        <span className="today-ok">{ico.ok}</span>
        <b><Ph text={L.jarSaved} /></b>
        <button className="today-link" data-act="shelf" onClick={() => go('shelf')}>{L.seeShelf}{ico.arrow}</button>
      </div>
      <button className="today-week" data-act="shelf" onClick={() => go('shelf')} aria-label={L.seeShelf}>
        {week.map(({ date, e, today }) => (
          <span key={+date} className={`today-day${today ? ' is-today' : ''}`}>
            <span className={`jar${e || today ? ' full' : ''}${today ? ' today' : ''}`}
              style={{ ['--c' as string]: (today ? s.picks[0]?.tone.zone : TONES.find(t => t.id === e?.tone)?.zone) ?? DOT_GREY }}><Jar /></span>
            <small>{today ? L.todayShort : (s.lang === 'th' ? TH_DAY : EN_DAY)[date.getDay()]}</small>
          </span>
        ))}
      </button>
      {prev && <p className="today-line">{L.trendPrev(agoText(prev.at, s.at ?? now, L), wordsText(prev, s.lang, L))}</p>}
      <button className="primary today-chat" data-act="chat" onClick={() => go('chat')}>{ico.chat}<span>{L.gateChat}</span></button>
    </div>
  );
}
