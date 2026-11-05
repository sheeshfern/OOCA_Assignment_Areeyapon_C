import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useApp } from '../AppContext';
import { Dots } from '../components/bits';
import { LangSwitch } from '../components/LangSwitch';
import { Screen } from '../components/Screen';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { TONES } from '../data/content';
import { startEyes } from '../lib/eyes';
import { burst, calm } from '../lib/motion';
import { loc } from '../lib/text';

export function Home() {
  const { s, L, go } = useApp();
  // the home bubble keeps chatting: a new line every few seconds, typed out each time
  const [hello, setHello] = useState(0);
  const sayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setHello(0);
    if (calm()) return;
    let n = 0, t: number;
    const next = () => {
      t = window.setTimeout(() => {
        n = (n + 1) % L.hello.length;
        sayRef.current?.style.setProperty('--talk', '.7s');
        setHello(n);
        next();
      }, n === 0 ? 5000 : 4000);
    };
    next();
    return () => clearTimeout(t);
  }, [s.lang, L.hello.length]);

  useEffect(() => startEyes(), []);

  const start = (e: MouseEvent<HTMLButtonElement>) => {
    burst(e.currentTarget, e, document.getElementById('app')!, () => go('tone'));
  };

  return (
    <Screen className="home">
      <div className="top">
        <img className="brand" src={IMG.logo} width={123} height={24} alt="mindfull" />
        <LangSwitch />
      </div>
      <div className="hero">
        {/* the four moods float around Mooca; decorative, the real choice is step 1 */}
        {TONES.map((t, i) => (
          <span key={t.id} className={`orb o${i + 1}`} aria-hidden="true" style={{ '--c': t.zone } as CSSProperties}><i />{loc(t, s.lang).label.split(' ')[0]}</span>
        ))}
        <span className="tw t1" aria-hidden="true">✦</span><span className="tw t2" aria-hidden="true">✦</span>
        <div className="say talks" aria-hidden="true" ref={sayRef}>
          {/* a fresh pair of dots + line for every new greeting */}
          <Dots key={`d${hello}`} />
          <span key={`t${hello}`}>{L.hello[hello]}</span>
        </div>
        <span className="mooca"><span className="mo float"><img src={IMG.phone} alt={L.phoneAlt} /><i className="eye l" aria-hidden="true" /><i className="eye r" aria-hidden="true" /></span></span>
        <span className="zone">{ico.shield}{L.zone}</span>
      </div>
      <p className="badge">{ico.ok}{L.noSignup}</p>
      <h1 tabIndex={-1}>{L.homeTitle}</h1>
      <p className="sub">{L.homeSub}</p>
      <div className="grow" />
      <div className="actions">
        <button className="primary start" data-act="start" onClick={start}>{L.start}{ico.arrow}</button>
        <p className="fine">{L.homeFine}</p>
      </div>
    </Screen>
  );
}
