import { useMemo, useState, type CSSProperties } from 'react';
import { useApp } from '../AppContext';
import { Jar } from '../components/Jar';
import { ReadingView } from '../components/Reading';
import { Screen } from '../components/Screen';
import { useDialog } from '../components/useDialog';
import { EXERCISES, NEUTRAL, TONES } from '../data/content';
import { ico } from '../data/icons';
import { IMG, WORD_POSE } from '../data/images';
import { answersOf, contextLine, reading } from '../data/story';
import { clearDemo, dayKey, readLog, type Checkin } from '../lib/checkins';
import { loc, stampOf } from '../lib/text';

const DAYS = 30;
const toneOf = (id: string | null) => TONES.find(t => t.id === id);

// The profile: a shelf of 30 glass jars, one per day, oldest first. A jar holds that day's last card in its
// tone colour; an empty jar is a day without a check-in. Tap a filled jar to open the card's reading.
export function Shelf() {
  const { s, L, dispatch } = useApp();
  const [ver, setVer] = useState(0);
  const [open, setOpen] = useState<Checkin | null>(null);
  const log = useMemo(() => readLog() ?? [], [ver]); // eslint-disable-line react-hooks/exhaustive-deps
  const [now] = useState(() => Date.now());
  const days = useMemo(() => {
    const byDay = new Map<string, Checkin>();
    log.forEach(e => byDay.set(dayKey(e.at), e)); // the log is oldest first, so the day keeps its last card
    return Array.from({ length: DAYS }, (_, i) => {
      const d = new Date(now); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - (DAYS - 1 - i));
      return { date: d, e: byDay.get(dayKey(+d)) ?? null, today: i === DAYS - 1 };
    });
  }, [log, now]);
  const filled = days.filter(d => d.e);
  // the mix of feelings across the days with a card: one bar, one legend, and the most frequent one in words
  const mix = TONES.map(t => ({ t, n: filled.filter(d => d.e!.tone === t.id).length }));
  const pct = mix.map(x => (filled.length ? Math.round((x.n / filled.length) * 100) : 0));
  const top = mix.reduce((a, b) => (b.n > a.n ? b : a), mix[0]);
  const short = (t: (typeof TONES)[number]) => loc(t, s.lang).label.split(' ')[0];
  const hasDemo = log.some(e => e.demo);
  const PER_ROW = 6;

  return (
    <Screen className="shelf">
      <div className="top">
        <button className="icon-btn" data-act="back" aria-label={L.back} onClick={() => dispatch({ type: 'back' })}>{ico.back}</button>
        <span className="me">
          <span className="avatar sm" aria-hidden="true">{s.user?.name.slice(0, 1)}</span>
          <span><b>{s.user?.name}</b><small>{s.user?.email}</small></span>
        </span>
        <button className="text-btn" data-act="logout" onClick={() => dispatch({ type: 'logout' })}>{L.signOut}</button>
      </div>
      <h1 tabIndex={-1}>{L.shelfTitle}</h1>
      <div className="mix-card">
        <div className="mix-head">
          <b className="mix-n">{filled.length}<small>{L.mixOf}</small></b>
          {top.n > 0 && <span className="mix-top" style={{ '--c': top.t.zone } as CSSProperties}>{L.mixTop(short(top.t), pct[mix.indexOf(top)])}</span>}
        </div>
        <div className="mix-bar" role="img" aria-label={mix.filter(x => x.n).map(x => `${short(x.t)} ${pct[mix.indexOf(x)]}%`).join(', ') || L.shelfEmpty}>
          {mix.map(x => x.n > 0 && <span key={x.t.id} style={{ flexGrow: x.n, '--c': x.t.zone } as CSSProperties} />)}
        </div>
        <ul className="mix-legend">
          {mix.map((x, i) => <li key={x.t.id} style={{ '--c': x.t.zone } as CSSProperties}><i />{short(x.t)}<b>{pct[i]}%</b></li>)}
        </ul>
      </div>
      <div className="shelves compact">
        {Array.from({ length: DAYS / PER_ROW }, (_, row) => (
          <div className="shelf-row" key={row}>
            {days.slice(row * PER_ROW, row * PER_ROW + PER_ROW).map(({ date, e, today }) => {
              const t = e ? toneOf(e.tone) : null;
              const label = `${stampOf(+date, s.lang)[0]}${e ? `: ${e.words.length ? e.words.map(w => loc(TONES.flatMap(x => [...x.words, ...x.more]).find(x => x.w === w) ?? NEUTRAL, s.lang).w).join(L.and) : loc(NEUTRAL, s.lang).w}` : ''}`;
              return (
                <button key={+date} className={`jar${e ? ' full' : ''}${today ? ' today' : ''}`} disabled={!e} aria-label={label}
                  style={{ '--c': t?.zone ?? '#B5C3C1' } as CSSProperties} onClick={() => e && setOpen(e)}>
                  <Jar />
                  {e && <img className="jar-mo" src={(e.words[0] && WORD_POSE[e.words[0]]) || t?.img || IMG.thanks} alt="" />}
                  <small>{today ? L.today : date.getDate()}</small>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {hasDemo && <p className="demo-note">{L.shelfDemo} <button className="text-btn" onClick={() => { clearDemo(); setVer(v => v + 1); }}>{L.shelfClearDemo}</button></p>}
      <JarSheet e={open} onClose={() => setOpen(null)} />
    </Screen>
  );
}

function JarSheet({ e, onClose }: { e: Checkin | null; onClose: () => void }) {
  const { s, L } = useApp();
  const dialog = useDialog(!!e, onClose);
  const a = e ? answersOf(e) : null;
  const t = e ? toneOf(e.tone) : null;
  const names = a ? (a.words.length ? a.words : [NEUTRAL]).map(w => loc(w, s.lang).w).join(L.and) : '';
  const [day, time] = e ? stampOf(e.at, s.lang) : ['', ''];
  return (
    <dialog {...dialog} className="note-dlg jar-dlg" aria-labelledby="jar-title" style={t ? { '--zone': t.zone, '--zone-ink': t.ink } as CSSProperties : undefined}>
      {e && a && (
        <div className="note-wrap">
          <div className="note-top"><button className="icon-btn" aria-label={L.jarClose} onClick={onClose}>{ico.close}</button></div>
          <div className="paper jar-paper">
            <p className="stamp">{ico.cal}<span>{day} · {time}</span></p>
            <img className="jar-pose" src={(e.words[0] && WORD_POSE[e.words[0]]) || t?.img || IMG.thanks} alt="" />
            <h2 id="jar-title" className="name"><span className="mark">{names}</span></h2>
            {contextLine(e, s.lang) && <p className="jar-ctx">{contextLine(e, s.lang)}</p>}
            {e.heavy?.before && e.heavy.after && <p className="jar-heavy"><span className="delta-n">{e.heavy.before} → {e.heavy.after}</span>{L.jarScale(e.heavy.before, e.heavy.after)}</p>}
            {e.ex && e.after && <p className="try-done">{ico.ok}{L.jarEx(EXERCISES[e.ex as keyof typeof EXERCISES][s.lang].t, L.exRate[e.after])}</p>}
            <ReadingView r={reading(a, s.lang)} compact />
            {e.chat && e.chat.length > 0 && (
              <details className="jar-chat">
                <summary>{L.chatLog(e.chat.length)}</summary>
                {e.chat.map((m, i) => <p key={i} className={`jc ${m.from}`}>{m.text}</p>)}
              </details>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
