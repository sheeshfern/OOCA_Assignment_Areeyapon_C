import { useApp } from '../AppContext';
import { BackBtn } from '../components/bits';
import { Screen } from '../components/Screen';
import { Ph } from '../lib/text';
import { moocaFor, type Vent as V } from '../state';

// After the four answers, Mooca (in the pose of the feeling they picked) asks one more thing:
// is there anything you want to get off your chest? Yes opens a short friendly chat; otherwise the summary.
export function Vent() {
  const { s, L, dispatch, go } = useApp();
  const pick = (v: V) => { dispatch({ type: 'vent', vent: v }); go(v === 'yes' ? 'talk' : 'after'); };
  return (
    <Screen className="vent">
      <div className="top"><BackBtn /></div>
      <div className="vent-stage">
        <span className="vent-glow" aria-hidden="true" />
        <img className="vent-mo float" src={moocaFor(s)} alt="" />
      </div>
      <div className="vent-say talks">
        <h1 tabIndex={-1}><Ph text={L.ventQ} /></h1>
        <p><Ph text={L.ventSub} /></p>
      </div>
      <div className="grow" />
      <div className="actions vent-opts">
        <button className="primary" data-act="vent-yes" onClick={() => pick('yes')}>{L.ventYes}</button>
        <button className="soft-btn vent-no" data-act="vent-no" onClick={() => pick('no')}>{L.ventNo}</button>
      </div>
    </Screen>
  );
}
