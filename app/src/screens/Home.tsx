import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useApp } from '../AppContext';
import { Dots } from '../components/bits';
import { LangSwitch } from '../components/LangSwitch';
import { Screen } from '../components/Screen';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { burst, calm } from '../lib/motion';

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

  const start = (e: MouseEvent<HTMLButtonElement>) => {
    burst(e.currentTarget, e, document.getElementById('app')!, () => go('tone'));
  };

  return (
    <Screen className="home">
      <div className="top" style={{ justifyContent: 'space-between' }}>
        <img className="brand" src={IMG.logo} width={123} height={24} alt="mindfull" />
        <LangSwitch />
      </div>
      <div className="hero">
        <div className="halo" />
        <div className="say talks" aria-hidden="true" ref={sayRef}>
          {/* a fresh pair of dots + line for every new greeting */}
          <Dots key={`d${hello}`} />
          <span key={`t${hello}`}>{L.hello[hello]}</span>
        </div>
        <span className="mooca"><img className="float" src={IMG.phone} alt={L.phoneAlt} /></span>
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
