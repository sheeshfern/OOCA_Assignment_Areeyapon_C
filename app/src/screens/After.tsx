import { useApp } from '../AppContext';
import { BackBtn } from '../components/bits';
import { Scale } from '../components/Scale';
import { Screen } from '../components/Screen';
import { Ph } from '../lib/text';
import { moocaFor } from '../state';

// Before the card: the same "how heavy" question as at the start, with the start answer marked,
// so the card can show what changed.
export function After() {
  const { s, L, dispatch, go } = useApp();
  const pick = (n: number) => { dispatch({ type: 'after', n }); window.setTimeout(() => go('result'), 380); };
  return (
    <Screen className="vent after">
      <div className="top"><BackBtn /></div>
      <div className="vent-stage">
        <span className="vent-glow" aria-hidden="true" />
        <img className="vent-mo float" src={moocaFor(s)} alt="" />
      </div>
      <div className="vent-say talks">
        <h1 tabIndex={-1}><Ph text={L.afterQ} /></h1>
        <p><Ph text={L.afterSub} /></p>
      </div>
      <Scale value={s.after} was={s.before} onPick={pick} />
      <div className="grow" />
    </Screen>
  );
}
