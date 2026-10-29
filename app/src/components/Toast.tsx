import { useCallback, useEffect, useRef, useState } from 'react';

/** A short status line that slides up for 2.4 s. `show(msg)` replaces whatever is showing. */
export function useToast() {
  const [toast, setToast] = useState<{ msg: string; seq: number } | null>(null);
  const show = useCallback((msg: string) => setToast(t => ({ msg, seq: (t?.seq ?? 0) + 1 })), []);
  return { toast, show };
}

export function Toast({ toast }: { toast: { msg: string; seq: number } | null }) {
  const el = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setHidden(false);
    // let it render unhidden first so the slide-in transition has a start point
    const raf = requestAnimationFrame(() => { void el.current?.offsetWidth; setOn(true); });
    let t = window.setTimeout(() => { setOn(false); t = window.setTimeout(() => setHidden(true), 300); }, 2400);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [toast]);

  return <div ref={el} className={`toast${on ? ' show' : ''}`} role="status" hidden={hidden}>{toast?.msg}</div>;
}
