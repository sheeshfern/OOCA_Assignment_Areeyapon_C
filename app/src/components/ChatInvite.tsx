import { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { calm } from '../lib/motion';
import { Ph } from '../lib/text';
import { useDialog } from './useDialog';

// shown once per card: a card dismissed stays dismissed when they come back to the result
const shown = new Set<number>();

// Every path (vented, not yet, nothing today): a moment after the card lands, Mooca pops up and invites a chat.
// Signed out, the button signs in and comes back to this card (now saved), where the chat button waits;
// signed in, it opens the chat straight away.
export function ChatInvite() {
  const { s, L, go, openLogin } = useApp();
  const [open, setOpen] = useState(false);
  const want = !!s.vent && !!s.at && !shown.has(s.at);
  useEffect(() => {
    if (!want) return;
    const t = window.setTimeout(() => { shown.add(s.at!); setOpen(true); }, calm() ? 900 : 2400);
    return () => clearTimeout(t);
  }, [want, s.at]);
  const close = () => setOpen(false);
  const dialog = useDialog(open, close);
  const chat = () => { close(); if (s.user) go('chat'); else openLogin('result'); };
  const line = s.vent === 'no' ? L.inviteNo : s.vent === 'yes' ? L.inviteYes : L.inviteLater;
  return (
    <dialog {...dialog} className="note-dlg invite-dlg" aria-labelledby="invite-title" style={s.picks[0] ? { ['--zone' as string]: s.picks[0].tone.zone } : undefined}>
      {open && (
        <div className="invite">
          <button className="icon-btn invite-x" aria-label={L.inviteLaterBtn} onClick={close}>{ico.close}</button>
          <div className="invite-hero" aria-hidden="true">
            <span className="invite-ring" /><span className="invite-ring r2" />
            <img className="invite-mo" src={IMG.calm} alt="" />
            <i className="invite-tw t1">✦</i><i className="invite-tw t2">✦</i><i className="invite-tw t3">✦</i>
          </div>
          <div className="invite-say">
            <span className="dots"><i /><i /><i /></span>
            <p><Ph text={line} /></p>
          </div>
          <h2 id="invite-title"><Ph text={L.inviteTitle} /></h2>
          <ul className="invite-perks">
            {L.invitePerks.map(p => <li key={p}>{ico.ok}<span><Ph text={p} /></span></li>)}
          </ul>
          <button className="primary invite-go" data-act="invite-chat" onClick={chat}>
            {s.user ? ico.chat : ico.google}<span>{s.user ? L.inviteGoIn : L.inviteGo}</span>
          </button>
          <button className="text-btn" data-act="invite-later" onClick={close}>{L.inviteLaterBtn}</button>
        </div>
      )}
    </dialog>
  );
}
