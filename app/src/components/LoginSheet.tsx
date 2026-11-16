import { useApp } from '../AppContext';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { useDialog } from './useDialog';

// A mock of "Sign in with Google" for the prototype: one sample account, nothing leaves the device.
// Signing in only unlocks the 30-day shelf; the check-in works the same without it.
export function LoginSheet({ open, why, onClose, onPick }: { open: boolean; why: string; onClose: () => void; onPick: () => void }) {
  const { L } = useApp();
  const dialog = useDialog(open, onClose);
  return (
    <dialog id="login" {...dialog} className="note-dlg login-dlg" aria-labelledby="login-title">
      <div className="note-wrap login-wrap">
        <div className="note-top"><button className="icon-btn" aria-label={L.jarClose} onClick={onClose}>{ico.close}</button></div>
        <div className="paper login-paper">
          <img className="login-mo" src={IMG.hug} alt="" />
          <h2 id="login-title">{L.signIn}</h2>
          <p>{why}</p>
          <div className="g-chooser">
            <p className="g-head">{ico.google}<span>{L.signInPick}</span></p>
            <p className="g-to">{L.signInTo}</p>
            <button className="g-acct" data-act="pick-account" onClick={onPick}>
              <span className="avatar sm" aria-hidden="true">{L.demoName.slice(0, 1)}</span>
              <span><b>{L.demoName}</b><small>demo.user@example.com</small></span>
            </button>
          </div>
          <p className="login-mock">{ico.lock}<span>{L.signInMock}</span></p>
        </div>
      </div>
    </dialog>
  );
}

/** the "Sign in with Google" button that opens the sheet */
export function GoogleBtn({ onClick }: { onClick: () => void }) {
  const { L } = useApp();
  return <button className="g-btn" data-act="login" onClick={onClick}>{ico.google}<span>{L.signInGoogle}</span></button>;
}
