import { createContext, useContext, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useApp } from '../AppContext';
import { replay, stagger, syncFloat } from '../lib/motion';

/** true once the app state has changed since this screen opened (a pick, a language switch…) */
const StayContext = createContext(false);
export const useStay = () => useContext(StayContext);

/**
 * One step of the flow. A new screen plays its entrance (Mooca speaks, then the choices rise in).
 * After that, changes on the same screen get `.stay`: no entrance replay, only what changed reacts:
 * Mooca hops, a newly enabled main button pulses, and a language switch eases the new words in.
 */
export function Screen({ className = '', children }: { className?: string; children: ReactNode }) {
  const { s } = useApp();
  const ref = useRef<HTMLElement>(null);
  const opened = useRef(s);
  const stay = s !== opened.current;
  const wasOff = useRef<boolean | null>(null);
  const relang = useRef(s.relang);

  useLayoutEffect(() => {
    const el = ref.current!;
    stagger(el);
    syncFloat(el);
    if (s.history.length) el.querySelector('h1')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    const app = document.getElementById('app');
    if (app) app.scrollTop = 0;
    // entrance runs once per screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current!;
    const primary = el.querySelector<HTMLButtonElement>('.actions .primary');
    if (stay) {
      replay(el.querySelector('.guide .mooca'), 'hop');
      if (wasOff.current && primary && !primary.disabled) replay(primary, 'ready');
      syncFloat(el);
      if (s.relang !== relang.current) { relang.current = s.relang; replay(el, 'relang'); }
    }
    wasOff.current = primary ? primary.disabled : null;
  }, [s, stay]);

  return (
    <StayContext.Provider value={stay}>
      <section ref={ref} className={`screen ${className} ${s.dir}${stay ? ' stay' : ''}`.replace(/\s+/g, ' ').trim()}>
        {children}
      </section>
    </StayContext.Provider>
  );
}
