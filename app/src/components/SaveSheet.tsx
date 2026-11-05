import { useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { ico } from '../data/icons';
import { useDialog } from './useDialog';
import { canShareFile, saveCardFile, touchDevice, type CardImage } from '../lib/cardImage';

// "เก็บการ์ดไว้" opens this sheet with the card image first. On phones the button opens the share sheet
// (which has "Save Image") and the image itself can be pressed and held; elsewhere the button downloads the PNG.
export function SaveSheet({ card, onClose, onSaved }: { card: CardImage | null; onClose: () => void; onSaved: () => void }) {
  const { L } = useApp();
  const dialog = useDialog(!!card, onClose), go = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (card) go.current?.focus({ preventScroll: true }); }, [card]);

  const save = async () => {
    if (!card) return;
    const how = await saveCardFile(card.file);
    if (how === 'cancelled') return;
    onClose();
    // the share sheet confirms on its own, so only a download gets a toast
    if (how === 'downloaded') onSaved();
  };

  const touch = card ? touchDevice() : false;
  return (
    <dialog id="save" {...dialog} className="note-dlg save-dlg" aria-label={L.saveTitle}>
      <div className="note-wrap save-wrap">
        <div className="note-top">
          <button className="icon-btn" data-save="close" aria-label={L.saveClose} onClick={onClose}>{ico.close}</button>
        </div>
        {card && <img className="save-img" src={card.url} alt={L.cardAlt} />}
        <p className="note-private save-tip">
          {touch ? <span>{L.saveHint}</span> : <>{ico.lock}<span>{L.savePrivate}</span></>}
        </p>
        <button ref={go} className="primary save-go" data-save="go" onClick={save}>
          {ico.save}<span>{card && canShareFile(card.file) ? L.saveShare : L.saveDownload}</span>
        </button>
      </div>
    </dialog>
  );
}
