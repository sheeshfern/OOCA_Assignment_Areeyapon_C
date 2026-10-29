import { useRef, useState } from 'react';
import { useApp } from '../AppContext';
import { FLAG } from '../data/icons';
import type { Lang } from '../data/types';
import { calm, replay } from '../lib/motion';

// language switch: both flags show and a white thumb slides to the active one; the words swap once it lands
export function LangSwitch() {
  const { s, dispatch } = useApp();
  const [pending, setPending] = useState<Lang | null>(null);
  const btns = useRef<Record<Lang, HTMLButtonElement | null>>({ th: null, en: null });
  const on = pending ?? s.lang;

  const pick = (lang: Lang) => {
    if (lang === on) return;
    setPending(lang);
    window.setTimeout(() => {
      dispatch({ type: 'lang', lang });
      setPending(null);
      requestAnimationFrame(() => replay(btns.current[lang], 'just'));
    }, calm() ? 0 : 260);
  };

  return (
    <div className="lang-sw" role="group" aria-label="ภาษา / Language" data-on={on}>
      <span className="thumb" aria-hidden="true" />
      {(['th', 'en'] as const).map(l => (
        <button key={l} ref={el => { btns.current[l] = el; }} data-act="lang" data-id={l} lang={l} aria-pressed={on === l} onClick={() => pick(l)}>
          <span className="flag" aria-hidden="true">{FLAG[l]}</span>{l === 'th' ? 'ไทย' : 'EN'}
        </button>
      ))}
    </div>
  );
}
