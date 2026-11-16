import { useApp } from '../AppContext';
import { Scale } from '../components/Scale';
import { Screen } from '../components/Screen';
import { ico } from '../data/icons';
import { IMG } from '../data/images';
import { stampOf } from '../lib/text';

// The white title card before the story: today's date, "let's write down how you feel today", and one tap
// on how heavy the heart feels right now. That first answer is what the card compares against at the end.
export function Eyes() {
  const { s, L, go, dispatch } = useApp();
  const [day] = stampOf(Date.now(), s.lang);
  const pick = (n: number) => { dispatch({ type: 'before', n }); window.setTimeout(() => go('tone'), 380); };
  return (
    <Screen className="eyes intro">
      <div className="top">
        <button className="icon-btn" data-act="back" aria-label={L.back} onClick={() => dispatch({ type: 'back' })}>{ico.back}</button>
      </div>
      <div className="intro-card">
        <span className="intro-date">{day}</span>
        <img className="intro-mo" src={IMG.write} alt="" />
        <h1 tabIndex={-1} className="intro-title">{L.introTitle}</h1>
        <span className="intro-sub">{L.introAsk}</span>
        <Scale value={s.before} onPick={pick} />
      </div>
    </Screen>
  );
}
