import { useEffect } from 'react';
import { useApp } from '../AppContext';
import { Dots, OocaLink } from '../components/bits';
import { ChatInvite } from '../components/ChatInvite';
import { GoogleBtn } from '../components/LoginSheet';
import { TodayCard } from '../components/ResultExtras';
import { Screen } from '../components/Screen';
import { logCheckin } from '../lib/checkins';
import { NEUTRAL } from '../data/content';
import { closing, needOf, ownWords } from '../data/story';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { loc, Ph, stampOf } from '../lib/text';
import { ctxSay, posesFor, readingFor, resultData } from '../state';

export function Result() {
  const { s, L, dispatch, openLogin, saveCard } = useApp();
  const r = resultData(s);
  const two = r.picks.length > 1;
  const poses = posesFor(s);
  const name = r.picks.map(p => loc(p, s.lang).w).join(L.and);
  const { neutral, good } = r;
  const [talkLead, talkRest] = L.talk[r.lv] ?? ['', ''];
  // the moment this card was made stays fixed while you write the note or come back to it
  const at = s.at!;
  const [day, time] = stampOf(at, s.lang);
  // signed in, the card goes into today's jar (kept on this device); signing in on this screen saves it right then
  const words = s.picks.map(p => p.w).join('|');
  useEffect(() => {
    if (s.user) logCheckin({ at, tone: s.picks[0]?.tone.id ?? null, words: s.picks.map(p => p.w), lv: r.lv, ctx: s.ctx, ctx2: s.ctx2, dur: s.dur, heavy: { before: s.before, after: s.after } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at, words, r.lv, s.ctx, s.ctx2, s.dur, s.user, s.before, s.after]);
  const read = readingFor(s);
  const main = loc(r.main, s.lang);
  const delta = s.before && s.after ? s.before - s.after : null;
  const quote = ownWords(s.chat, s.lang);
  const need = neutral ? null : needOf(s.picks[0]?.w, s.lang);
  const closingLines = closing({ word: name, ctxSay: ctxSay(s), short: read.short, vent: s.vent, heavy: r.lv > 0 }, s.lang);

  const talk = good ? null : (
    <div className={`talk${r.lv === 1 ? ' quiet' : ''}`}>
      <div className="talk-row">
        {r.lv >= 2 && <img className="talk-doc" src={IMG.doctor} alt="" />}
        <p>{talkLead && <><b><Ph text={talkLead} /></b>{' '}</>}<Ph text={talkRest} /></p>
      </div>
      <OocaLink />
    </div>
  );

  return (
    <Screen className="result">
      <div className="top">
        <span className="res-title">{L.resTitle}</span>
      </div>
      <div className="card main">
        <div className="card-head">
          <span className="post-wrap" aria-hidden="true">{ico.post}</span>
          <p className="stamp">{ico.cal}<time dateTime={new Date(at).toISOString()}><span className="nw">{day}</span> <span className="nw">· {time}</span></time></p>
          <div className="talks who">
            <Dots />
            <span className="lb">{neutral ? L.nowLb : L.feelLb}</span>
            <h1 className={`name${two || neutral ? ' two' : ''}`} tabIndex={-1}><span className="mark">{name}</span></h1>
          </div>
          <span className={`mooca${poses.length > 1 ? ' pair' : ''}`}>
            {poses.map(src => <img key={src} className="float" src={src} alt="" />)}
            {good && [0, 1, 2].map(i => <i key={i} className="spark" aria-hidden="true">✦</i>)}
          </span>
          <div className="say-card talks">
            <Dots />
            <span className="lb">{neutral ? L.okLb : L.causeLb}</span>
            <p>
              {neutral ? <Ph text={loc(NEUTRAL, s.lang).m} /> : (
                <>{r.ctx && <><b><Ph text={r.ctx} /></b>{' '}</>}<Ph text={r.cause ?? ''} /></>
              )}
            </p>
            {!neutral && r.since && <span className="since"><Ph text={r.since} /></span>}
            {/* Mooca's closing words live in the same bubble: how today feels, the venting, one small thing to try */}
            <div className="say-more">
              {/* 1) did it help: the heaviness at the start vs now */}
              {delta !== null && (
                <p className={`delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : 'same'}`}>
                  <span className="delta-n" aria-hidden="true">{s.before} → {s.after}</span>
                  <span><Ph text={delta > 0 ? L.deltaLighter(delta) : delta === 0 ? L.deltaSame : L.deltaHeavier} /></span>
                </p>
              )}
              {/* 2) their own words, so it's clear Mooca heard them */}
              {quote && <blockquote className="quote"><span>{L.quoteLb}</span>“{quote}”</blockquote>}
              {/* 3) something new: the need behind the feeling */}
              {need && <p className="need-line">{L.needLine(main.w, need)}</p>}
              {closingLines[2] && <p><Ph text={closingLines[2]} /></p>}
              {main.a && <p className="closing-try"><b>{L.sumTry}</b> <Ph text={main.a} /></p>}
            </div>
          </div>
        </div>
      </div>
      {r.lv >= 2 && talk}
      {s.user ? <TodayCard /> : (
        <div className="gate">
          <b className="gate-title"><Ph text={L.gateTitle} /></b>
          <ul>{L.gateList.map(x => <li key={x}>{ico.ok}<span><Ph text={x} /></span></li>)}</ul>
          <button className="chat-card" data-act="chat" onClick={() => openLogin('chat')}>
            <img src={IMG.calm} alt="" />
            <span><b><Ph text={L.gateChat} /></b><small><Ph text={L.chatCtaSub} /></small></span>
            {ico.lock}
          </button>
          <GoogleBtn onClick={() => openLogin()} />
        </div>
      )}
      {r.lv < 2 && talk}
      <div className="grow" />
      <div className="duo">
        <button className="soft-btn" data-act="save" onClick={e => saveCard(e.currentTarget)}>{ico.save}{L.save}</button>
        <button className="soft-btn" data-act="restart" onClick={() => dispatch({ type: 'restart' })}>{ico.refresh}{L.restart}</button>
      </div>
      <p className="fine"><Ph text={L.resFine} /></p>
      <ChatInvite />
    </Screen>
  );
}
