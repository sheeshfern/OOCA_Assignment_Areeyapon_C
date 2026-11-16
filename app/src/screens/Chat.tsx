import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApp } from '../AppContext';
import { OocaLink } from '../components/bits';
import { Screen } from '../components/Screen';
import { CONTEXTS } from '../data/content';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { chipText, endTurn, onChip, onPhoto, onText, opening, resumeTurn, ventOpening, type ChatCtx, type ChipId, type Msg, type Turn } from '../data/story';
import { shrinkPhoto } from '../lib/photo';
import { loc } from '../lib/text';
import { moocaFor, resultData } from '../state';

let nextId = 1;
const withIds = (t: Turn): Msg[] => t.msgs.map(m => ({ ...m, id: nextId++ }));

// Chat with Mooca about today's card. Replies come from a small script (data/story.ts): risk words always
// get the hotline first, then the reply names what the message is about and asks one gentle question.
export function Chat() {
  const { s, L, dispatch, go, openEx } = useApp();
  // 'talk' is the venting step before the summary (no sign-in); 'chat' is the signed-in chat after it
  const vent = s.screen === 'talk';
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [sent, setSent] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const r = resultData(s);
  // Mooca offered the summary, or they said that's enough
  const finished = s.chat.some(m => m.kind === 'wrap') || s.chat.some(m => m.from === 'me' && m.text === chipText('done', s.lang));
  const c = CONTEXTS.find(x => x.id === s.ctx);
  const ctx: ChatCtx = {
    lang: s.lang,
    tone: s.picks[0]?.tone.id ?? 'none',
    word: loc(r.main, s.lang).w,
    ctxSay: c && c.id !== 'unsure' ? loc(c, s.lang).say ?? null : null,
    lv: r.lv,
    vent,
    ctxId: s.ctx,
    history: s.chat,
  };

  // Mooca opens the chat once per card
  useEffect(() => {
    if (!s.chat.length) { const t = vent ? ventOpening(ctx) : opening(ctx); dispatch({ type: 'chat', msgs: withIds(t), chips: t.chips }); }
    else if (!vent && !s.chat.some(m => m.kind === 'resume') && !s.chat.some(m => m.kind === 'end')) { const t = resumeTurn(ctx); dispatch({ type: 'chat', msgs: withIds(t), chips: t.chips }); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const el = list.current; if (el) el.scrollTop = el.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
  }, [s.chat.length, typing]);

  // the suggestion chips only help someone get started: once they have said anything in this chat (typed or
  // tapped), or while they are typing, it is a normal conversation and the chips stay out of the way
  const from = vent ? 0 : Math.max(0, s.chat.findIndex(m => m.kind === 'resume'));
  const spoke = s.chat.slice(from).some(m => m.from === 'me');

  // venting: once Mooca has wrapped up, the input goes away and the summary opens by itself
  const done = vent && finished && !typing;
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => go('after'), 2200);
    return () => clearTimeout(t);
    // go is stable enough for a one-off timer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // Mooca "types" for a moment before each reply
  const reply = (mine: Msg | null, t: Turn) => {
    if (mine) dispatch({ type: 'chat', msgs: [mine], chips: [] });
    setTyping(true);
    window.setTimeout(() => { setTyping(false); dispatch({ type: 'chat', msgs: withIds(t), chips: t.chips }); }, 900);
  };
  const chip = (id: ChipId) => {
    if (typing) return;
    if (id === 'ex') openEx();
    reply({ id: nextId++, from: 'me', text: chipText(id, s.lang) }, onChip(id, ctx));
  };
  // after the last question: they can add a photo, and end the chat (Mooca says goodbye and points to ooca)
  const open = !vent && s.chat.some(m => m.kind === 'open');
  const ended = !vent && s.chat.some(m => m.kind === 'end');
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const photo = async (f: File | undefined) => {
    if (!f || typing) return;
    setBusy(true);
    try { const img = await shrinkPhoto(f); reply({ id: nextId++, from: 'me', text: '', img }, onPhoto(ctx)); }
    catch { /* not an image we can read: nothing is sent */ }
    finally { setBusy(false); if (file.current) file.current.value = ''; }
  };
  const end = () => { if (!typing) reply(null, endTurn(ctx)); };
  const send = (e: FormEvent) => {
    e.preventDefault();
    const v = text.trim(); if (!v || typing) return;
    setText('');
    reply({ id: nextId++, from: 'me', text: v }, onText(v, ctx, sent));
    setSent(n => n + 1);
  };

  return (
    <Screen className="chat">
      <div className="top">
        <button className="icon-btn" data-act="back" aria-label={L.chatBackCard} onClick={() => dispatch({ type: 'back' })}>{ico.back}</button>
        <span className="chat-head"><img src={moocaFor(s)} alt="" /><b>{vent ? L.ventTitle : L.chatTitle}</b></span>
        <span className="top-gap" aria-hidden="true" />
      </div>
      <p className="chat-note">{ico.lock}<span>{vent ? L.ventNote : L.chatNoteSaved}</span></p>
      <div className="chat-list" ref={list} role="log" aria-live="polite">
        {s.chat.map(m => (
          <div key={m.id} className={`msg ${m.from}${m.kind ? ` k-${m.kind}` : ''}`}>
            {m.from === 'mooca' && <img className="msg-mo" src={IMG.calm} alt="" />}
            <div className={`msg-body${m.img ? ' has-img' : ''}`}>
              {m.img && <img className="msg-img" src={m.img} alt={L.chatPhotoAlt} />}
              {m.text && <p>{m.text}</p>}
              {m.kind === 'safety' && <a className="cta call-cta" href="tel:1323">{ico.phone}<span>{L.call1323}</span></a>}
              {m.kind === 'ooca' && <OocaLink />}
            </div>
          </div>
        ))}
        {typing && <div className="msg mooca"><img className="msg-mo" src={IMG.calm} alt="" /><div className="msg-body typing" aria-label={L.chatTyping}><span className="dots"><i /><i /><i /></span></div></div>}
      </div>
      <div className="chat-foot">
        {vent && <button className={done ? 'primary to-sum-go' : 'text-btn to-sum'} data-act="to-summary" onClick={() => go('after')}>{done ? L.seeSummary : L.skipSummary}</button>}
        {!done && !spoke && s.chips.length > 0 && !typing && !text && (
          <div className="chips-start">
            <span className="chips-hint">{L.chipsHint}</span>
            <div className="chips">{s.chips.map(id => <button key={id} className="chip" onClick={() => chip(id)}>{chipText(id, s.lang)}</button>)}</div>
          </div>
        )}
        {open && !ended && !typing && <button className="text-btn end-chat" data-act="end-chat" onClick={end}>{L.chatEnd}</button>}
        {ended && !typing && (
          <div className="chat-ended">
            <button className="primary" data-act="shelf" onClick={() => go('shelf')}>{L.seeShelf}</button>
            <button className="soft-btn" data-act="back-card" onClick={() => dispatch({ type: 'back' })}>{L.chatBackCard}</button>
          </div>
        )}
        {!done && !ended && <form className="chat-form" onSubmit={send}>
          {open && <>
            <input ref={file} type="file" accept="image/*" hidden onChange={e => photo(e.target.files?.[0])} />
            <button type="button" className="photo-btn" data-act="photo" aria-label={L.chatPhoto} disabled={busy || typing} onClick={() => file.current?.click()}>{ico.image}</button>
          </>}
          <input value={text} onChange={e => setText(e.target.value)} placeholder={L.chatPlaceholder} aria-label={L.chatPlaceholder} maxLength={500} enterKeyHint="send" />
          <button className="send" type="submit" aria-label={L.chatSend} disabled={!text.trim() || typing}>{ico.send}</button>
        </form>}
      </div>
    </Screen>
  );
}
