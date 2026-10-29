import { useLayoutEffect, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import { Dots } from '../components/bits';
import { Screen } from '../components/Screen';
import { NEUTRAL } from '../data/content';
import { ico } from '../data/icons';
import { IMG, OOCA_URL } from '../data/images';
import { loc, Ph, stampOf } from '../lib/text';
import { moocaFor, resultData } from '../state';

export function Result() {
  const { s, L, dispatch, openNote, saveCard } = useApp();
  const r = resultData(s);
  const two = r.picks.length > 1;
  const name = r.picks.map(p => loc(p, s.lang).w).join(L.and);
  const neutral = r.main === NEUTRAL;
  const feelGood = r.lv === 0;
  const main = loc(r.main, s.lang);
  const [talkLead, talkRest] = L.talk[r.lv] ?? ['', ''];
  // the moment this card was made stays fixed while you write the note or come back to it
  const at = s.at ?? Date.now();
  const [day, time] = stampOf(at, s.lang);
  const note = s.note.trim();
  // the note shows up to 6 lines; "อ่านทั้งหมด" appears only when it is actually cut off
  const [snipOpen, setSnipOpen] = useState(false);
  const [snipCut, setSnipCut] = useState(false);
  const snip = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    const el = snip.current;
    setSnipCut(!!el && el.scrollHeight > el.clientHeight + 1);
  }, [note, snipOpen, s.lang]);

  const talk = feelGood ? null : (
    <div className={`talk${r.lv === 1 ? ' quiet' : ''}`}>
      <p>{talkLead && <><b style={{ fontWeight: 600 }}><Ph text={talkLead} /></b>{' '}</>}<Ph text={talkRest} /></p>
      <a className={`cta${r.lv === 1 ? ' ghost' : ''}`} href={OOCA_URL} target="_blank" rel="noopener"><span>{L.cta}</span>{ico.arrow}</a>
    </div>
  );

  const action = (
    <div className="crow" style={r.lv === 3 ? { borderTop: 'none' } : undefined}>
      <span className="lb">{L.writeLb}</span><span><Ph text={main.a ?? ''} /></span>
      {note && <>
        <p ref={snip} id="note-snip" className={`note-snip${snipOpen ? ' open' : ''}`}>{note}</p>
        <button className="snip-more" data-act="snipMore" aria-controls="note-snip" aria-expanded={snipOpen}
          hidden={!snipOpen && !snipCut} onClick={() => setSnipOpen(o => !o)}>{snipOpen ? L.snipLess : L.snipMore}</button>
      </>}
      <button className={`timer${s.noteUp ? ' done' : ''}`} data-act="timer" aria-haspopup="dialog" onClick={openNote}>
        {note ? <span>{L.openNote}</span> : <>{ico.pen}<span>{s.noteUp ? L.keepWriting : L.writeBtn}</span></>}
      </button>
    </div>
  );

  return (
    <Screen className="result">
      <div className="top" style={{ justifyContent: 'space-between' }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-2)' }}>{L.resTitle}</span>
        <button className="icon-btn" data-act="restart" aria-label={L.closeRestart} onClick={() => dispatch({ type: 'restart' })}>{ico.close}</button>
      </div>
      <div className="card main">
        <div className="card-head">
          <p className="stamp">{ico.cal}<time dateTime={new Date(at).toISOString()}><span className="nw">{day}</span> <span className="nw">· {time}</span></time></p>
          <div className="talks who">
            <Dots />
            <span className="lb">{neutral ? L.nowLb : L.feelLb}</span>
            <h1 className={`name${two || neutral ? ' two' : ''}`} tabIndex={-1}><span className="mark">{name}</span></h1>
          </div>
          <span className="mooca">
            <img className="float" src={moocaFor(s, feelGood ? IMG.happy : IMG.thanks)} alt="" />
            {feelGood && [0, 1, 2].map(i => <i key={i} className="spark" aria-hidden="true">✦</i>)}
          </span>
          <div className="say-card talks">
            <Dots />
            <span className="lb">{neutral ? L.okLb : L.causeLb}</span>
            <p>
              {neutral ? <Ph text={loc(NEUTRAL, s.lang).m} /> : (
                <>{r.ctx && <><b style={{ fontWeight: 600 }}><Ph text={r.ctx} /></b>{' '}</>}<Ph text={r.cause || main.m} /></>
              )}
            </p>
            {!neutral && r.since && <span className="since"><Ph text={r.since} /></span>}
          </div>
        </div>
        {r.lv === 3 ? null : action}
      </div>
      {r.lv === 3 ? <>{talk}<div className="card" style={{ paddingTop: 4 }}>{action}</div></> : talk}
      <div className="grow" />
      <div className="duo">
        <button className="soft-btn" data-act="save" onClick={e => saveCard(e.currentTarget)}>{ico.save}{L.save}</button>
        <button className="soft-btn" data-act="restart" onClick={() => dispatch({ type: 'restart' })}>{ico.refresh}{L.restart}</button>
      </div>
      <p className="fine" style={{ color: 'var(--text-2)', fontSize: 13 }}><Ph text={L.resFine} /></p>
    </Screen>
  );
}
