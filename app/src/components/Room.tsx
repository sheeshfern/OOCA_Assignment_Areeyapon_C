// The four rooms of step 1, drawn as small scenes: a wall, a window with a real view outside, a pair of
// tied-back curtains on a rod, and the floor. Mooca (the tone's art) sits in the room; the picture is
// decorative, the room's name is the label. Parts with an r-* class move once the room is picked.
import type { Tone } from '../data/types';

type Id = Tone['id'];
const WALL: Record<Id, [string, string]> = { yellow: ['#FFF6DD', '#FDE7B0'], green: ['#EEF8E8', '#D6EFC9'], orange: ['#FFEADF', '#F9CDB3'], blue: ['#2A4A7A', '#1C3560'] };
const SKY: Record<Id, [string, string]> = { yellow: ['#8FD0FF', '#DDF2FF'], green: ['#BFE8FF', '#ECFAF4'], orange: ['#5D6678', '#9AA3B3'], blue: ['#0B1838', '#203767'] };
// curtain: base, fold shade, highlight
const CURTAIN: Record<Id, [string, string, string]> = {
  yellow: ['#F6C46A', '#D99A3A', '#FFE3A6'],
  green: ['#9FD38B', '#6FAE5C', '#CDEDBE'],
  orange: ['#F28C5B', '#C9622F', '#FFB991'],
  blue: ['#4C6DA6', '#2F4C80', '#7192C8'],
};
const FLOOR: Record<Id, string> = { yellow: '#F5D08A', green: '#C7E6B6', orange: '#EDB89A', blue: '#16294D' };

// window glass: x 14–70, y 14–66
const WX = 14, WY = 14, WW = 56, WH = 52;

function View({ id }: { id: Id }) {
  if (id === 'yellow') return (<>
    <circle cx="54" cy="29" r="15" fill="#FFF0B8" opacity=".75" />
    <g className="r-rays" stroke="#FFC23D" strokeWidth="1.8" strokeLinecap="round"><path d="M54 15v4M54 39v4M40 29h4M64 29h4M44 19l2.8 2.8M64 19l-2.8 2.8M44 39l2.8-2.8M64 39l-2.8-2.8" /></g>
    <circle className="r-sun" cx="54" cy="29" r="7.5" fill="#FFD45C" />
    <g fill="#fff"><circle cx="24" cy="27" r="4" /><circle cx="29" cy="25" r="5" /><circle cx="34" cy="27.5" r="3.6" /><rect x="22" y="27" width="14" height="4" rx="2" /></g>
    <path d="M14 52q12-9 24-4t32-6v24H14z" fill="#B8E3A1" />
    <path d="M14 58q16-7 30-2t26-1v11H14z" fill="#8ACF74" />
    <g><rect x="27.3" y="49" width="1.6" height="6" fill="#8A6440" /><circle cx="28" cy="47" r="4.2" fill="#5DB84A" /><circle cx="26.6" cy="45.8" r="1.6" fill="#7CCB67" /></g>
  </>);
  if (id === 'green') return (<>
    <g fill="#fff" opacity=".9"><circle cx="50" cy="22" r="3.4" /><circle cx="54.5" cy="20.5" r="4.4" /><circle cx="59" cy="22.5" r="3" /><rect x="48" y="22" width="13" height="3.4" rx="1.7" /></g>
    <path d="M14 46q14-10 28-4t28-4v28H14z" fill="#A9DD90" />
    <path d="M14 54q18-8 32-2t24 0v14H14z" fill="#7FC86A" />
    <g className="r-tree"><rect x="30" y="40" width="2.4" height="13" rx="1" fill="#7A5A3A" /><circle cx="31.2" cy="36" r="8" fill="#4FAE3D" /><circle cx="27.6" cy="38.5" r="5" fill="#5DB84A" /><circle cx="34.6" cy="38.6" r="5" fill="#5DB84A" /><circle cx="29" cy="33.5" r="2.4" fill="#79C965" /></g>
    <g><circle cx="58" cy="50" r="4" fill="#5DB84A" /><circle cx="62.5" cy="51" r="3.4" fill="#4FAE3D" /></g>
    <g fill="#FFFFFF" opacity=".95"><path d="M17 58h50" stroke="#fff" strokeWidth="1.2" />{[19, 25, 31, 37, 43, 49, 55, 61, 67].map(x => <rect key={x} x={x - 1} y="55" width="2" height="9" rx="1" />)}</g>
    <g><circle cx="22" cy="63" r="1.3" fill="#FF9AB8" /><circle cx="40" cy="62.5" r="1.3" fill="#FFD45C" /><circle cx="52" cy="63.5" r="1.3" fill="#FF9AB8" /></g>
    <path className="r-breeze" d="M38 24q5-3 10 0t9 0" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".9" />
  </>);
  if (id === 'orange') return (<>
    <path d="M14 56q10-6 22-2t34-3v15H14z" fill="#6E7D6C" />
    <g><path d="M56 56q1-10 5-16" stroke="#4A5646" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M61 40q6 1 8 4q-4 2-9 0z" fill="#566652" /><path d="M59.5 45q5 0 7 3q-4 1.5-8-.5z" fill="#566652" /></g>
    <g className="r-cloud"><circle cx="24" cy="24" r="7" fill="#4C5566" /><circle cx="33" cy="20" r="8.5" fill="#566072" /><circle cx="43" cy="24" r="7" fill="#4C5566" /><rect x="18" y="24" width="32" height="7" rx="3.5" fill="#4C5566" /><circle cx="56" cy="22" r="5.5" fill="#5E6878" /><rect x="51" y="22" width="16" height="5" rx="2.5" fill="#5E6878" /></g>
    <path className="r-bolt" d="M36 30l-5 9h5l-4 10" stroke="#FFD45C" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <g className="r-rain" stroke="#D5DCE6" strokeWidth="1.2" strokeLinecap="round" opacity=".9"><path d="M20 34l-4 8M27 40l-4 8M46 34l-4 8M52 42l-4 8M60 32l-4 8M66 40l-4 8M24 50l-3 6M42 48l-3 6" /></g>
  </>);
  return (<>
    <g fill="#fff">{[[20, 20, .7], [30, 30, .5], [44, 18, .6], [64, 40, .5], [24, 40, .45], [40, 34, .4]].map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}</g>
    <circle className="r-moon" cx="56" cy="26" r="11" fill="#F4F1D0" opacity=".12" />
    <circle cx="56" cy="26" r="6.5" fill="#F4F1D0" /><circle cx="59" cy="24" r="5.6" fill={SKY.blue[0]} />
    <path d="M14 66V52h6v-6h7v9h5v-12h8v14h6v-8h7v6h5v-10h7v21z" fill="#0A1530" />
    <g fill="#FFD98A">{[[22, 49], [29, 52], [35, 46], [37, 50], [49, 52], [58, 52], [60, 48], [66, 50]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1.6" height="1.6" />)}</g>
    <g className="r-rain" stroke="#8FB2E8" strokeWidth="1" strokeLinecap="round" opacity=".75"><path d="M20 24l-2.4 6M30 36l-2.4 6M40 26l-2.4 6M50 40l-2.4 6M62 32l-2.4 6M24 50l-2.4 6M46 52l-2.4 6M66 18l-2.4 6" /></g>
  </>);
}

/** `key` keeps the svg ids apart when a room is drawn twice */
export function Room({ tone, uid = '' }: { tone: Tone; sketch?: boolean; uid?: string }) {
  const id = tone.id, [w1, w2] = WALL[id], [s1, s2] = SKY[id], [cb, cf, ch] = CURTAIN[id], night = id === 'blue', k = `${id}${uid}`;
  const frame = night ? '#0F1E3D' : '#FFFFFF', rod = night ? '#8C7A55' : '#A57A4E';
  // a gathered curtain hanging from the rod, tied back at y 40; `x` is its inner edge, `dir` 1 for the left one (grows leftward), -1 for the right
  const curtain = (x: number, dir: 1 | -1, cls = '') => {
    const o = (n: number) => x + dir * n;
    return (
      <g className={cls}>
        <path d={`M${o(0)} 11H${o(-14)}Q${o(-12)} 28 ${o(-9)} 40Q${o(-14)} 56 ${o(-16)} 76H${o(1)}Q${o(-1)} 56 ${o(-4)} 40Q${o(-1)} 26 ${o(0)} 11z`} fill={cb} />
        <path d={`M${o(-4)} 12Q${o(-5)} 28 ${o(-6)} 40Q${o(-6)} 58 ${o(-5)} 75M${o(-9)} 12Q${o(-9)} 28 ${o(-7.5)} 40Q${o(-10)} 58 ${o(-11)} 75`} stroke={cf} strokeWidth="1.6" fill="none" opacity=".55" strokeLinecap="round" />
        <path d={`M${o(-12)} 12Q${o(-10.5)} 28 ${o(-8.5)} 39`} stroke={ch} strokeWidth="1.4" fill="none" opacity=".9" strokeLinecap="round" />
        <rect x={Math.min(o(-10), o(-3))} y="38.6" width="7" height="3" rx="1.5" fill={cf} />
      </g>
    );
  };
  return (
    <span className={`room room-${id}`} aria-hidden="true">
      <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`wall-${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={w1} /><stop offset="1" stopColor={w2} /></linearGradient>
          <linearGradient id={`sky-${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s1} /><stop offset="1" stopColor={s2} /></linearGradient>
          <clipPath id={`win-${k}`}><rect x={WX} y={WY} width={WW} height={WH} rx="4" /></clipPath>
        </defs>
        <rect width="160" height="120" fill={`url(#wall-${k})`} />
        {/* the window, rod and curtains sit a little in from the corner so narrow tiles never crop them */}
        <g transform="translate(5 4)">
        {/* the view outside, then a soft sheen on the glass */}
        <g clipPath={`url(#win-${k})`}>
          <rect x={WX} y={WY} width={WW} height={WH} fill={`url(#sky-${k})`} />
          <View id={id} />
          <path d="M18 66L40 14h7L25 66zM30 66L52 14h3L33 66z" fill="#fff" opacity={night ? .05 : .16} />
        </g>
        <rect x={WX} y={WY} width={WW} height={WH} rx="4" fill="none" stroke={frame} strokeWidth="3.4" />
        <path d={`M${WX + WW / 2} ${WY}v${WH}M${WX} ${WY + WH / 2}h${WW}`} stroke={frame} strokeWidth="2.4" />
        <rect x={WX - 4} y={WY + WH} width={WW + 8} height="4.5" rx="2" fill={frame} />
        <rect x={WX - 4} y={WY + WH + 3.5} width={WW + 8} height="1.4" fill="#000" opacity=".08" />
        {/* the rod and the two curtains; in the storm the right one is blown into the room */}
        <path d="M4 11H82" stroke={rod} strokeWidth="2" strokeLinecap="round" />
        <circle cx="4" cy="11" r="2.2" fill={rod} /><circle cx="82" cy="11" r="2.2" fill={rod} />
        {curtain(20, 1)}
        {curtain(64, -1, id === 'orange' ? 'r-curtain' : '')}
        </g>
        {/* the floor */}
        <rect y="88" width="160" height="32" fill={FLOOR[id]} />
        <path d="M0 88h160" stroke={frame} strokeOpacity=".6" strokeWidth="2" />
        {id === 'yellow' && <path className="r-beam" d="M23 78L75 78L116 120H58z" fill="#FFF1B8" opacity=".5" />}
        {id === 'green' && <><rect x="128" y="70" width="14" height="18" rx="3" fill="#C98E5A" /><path className="r-plant" d="M135 70q-10-14-2-24q4 10 2 24q6-16 12-12q-4 10-12 12" fill="#5DB84A" /></>}
        {id === 'orange' && <g className="r-wind" stroke="#B9500F" strokeWidth="2" strokeLinecap="round" opacity=".5"><path d="M96 30h18M100 38h22M94 46h14" /></g>}
        {id === 'blue' && <><circle className="r-glow" cx="138" cy="60" r="16" fill="#FFD98A" opacity=".18" /><path d="M134 76h8l-2-10h-4z" fill="#C7B27A" /><path d="M130 56h16l-4 10h-8z" fill="#FFD98A" /></>}
      </svg>
      <img src={tone.img} alt="" />
    </span>
  );
}
