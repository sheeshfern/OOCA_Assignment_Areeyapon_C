import { useApp } from '../AppContext';
import { BackBtn, OocaLink } from '../components/bits';
import { Screen } from '../components/Screen';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { Ph } from '../lib/text';

// a risk word skips steps 3–4 and lands here: say it plainly, and give real ways to reach someone now
export function Safety() {
  const { L, dispatch } = useApp();
  return (
    <Screen className="safety">
      <div className="top"><BackBtn /></div>
      <div className="hug"><img src={IMG.hug} alt={L.hugAlt} /></div>
      <h1 tabIndex={-1}>{L.safeTitle}</h1>
      <p className="msg"><Ph text={L.safeMsg} /></p>
      <a className="call" href="tel:1323">
        <span className="ic">{ico.phone}</span>
        <span><b>{L.call}</b><small>{L.callSmall}</small></span>
      </a>
      <OocaLink ghost />
      <p className="fine">{L.safeFine}</p>
      <div className="grow" />
      <button className="text-btn" data-act="rePick" onClick={() => dispatch({ type: 'rePick' })}>{L.rePick}</button>
    </Screen>
  );
}
