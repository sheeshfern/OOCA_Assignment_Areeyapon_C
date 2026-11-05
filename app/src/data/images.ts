// Mooca art and brand art (served from public/assets). The art is drawn by tools/mooca/build.mjs.
const art = (name: string) => `assets/mooca/${name}.svg`;

export const IMG = {
  phone: art('home-sofa'), // home hero: on the sofa with a notepad, the CI art as drawn
  calm: art('listen'), // before a feeling is picked: says hi, ready to listen
  happy: art('tone-yellow'), // bright: arms up in the balloon
  relax: art('tone-green'), // calm: leaning back on a sunny hill
  anxious: art('tone-orange'), // uneasy: worried under the umbrella in the rain
  sad: art('tone-blue'), // heavy: slumped on the moon
  thanks: art('feel-neutral'), // "can't say yet": a few feelings with no name yet
  hug: art('hug'), // safety: holds a small cloud close
  doctor: art('doctor'), // beside the offer to talk to a psychologist
  write: art('write'), // the 30-second note: writing along
  written: art('written'), // the note's time is up: shows the page
  logo: 'assets/mindfull-logo.svg',
} as const;

/** one pose per feeling word, keyed by the Thai word. The two risk words go to the safety screen, so they have none. */
export const WORD_POSE: Record<string, string> = {
  'ตื่นเต้น': art('feel-excited'),
  'ภูมิใจ': art('feel-proud'),
  'มีหวัง': art('feel-hopeful'),
  'สนุก': art('feel-fun'),
  'อิ่มใจ': art('feel-fulfilled'),
  'มั่นใจ': art('feel-confident'),
  'โล่งใจ': art('feel-relieved'),
  'กระตือรือร้น': art('feel-eager'),
  'ผ่อนคลาย': art('feel-relaxed'),
  'พอใจ': art('feel-content'),
  'อุ่นใจ': art('feel-comforted'),
  'สบายใจ': art('feel-at-ease'),
  'ปลอดภัย': art('feel-safe'),
  'ซาบซึ้ง': art('feel-touched'),
  'เบาสบาย': art('feel-carefree'),
  'มีสมาธิ': art('feel-focused'),
  'กังวล': art('feel-worried'),
  'หงุดหงิด': art('feel-irritated'),
  'กดดัน': art('feel-pressured'),
  'เครียด': art('feel-stressed'),
  'โกรธ': art('feel-angry'),
  'ตื่นตระหนก': art('feel-panicked'),
  'อิจฉา': art('feel-envious'),
  'ไม่มั่นใจตัวเอง': art('feel-insecure'),
  'อับอาย': art('feel-ashamed'),
  'เหนื่อยล้า': art('feel-worn-out'),
  'หมดไฟ': art('feel-burned-out'),
  'เศร้า': art('feel-sad'),
  'เหงา': art('feel-lonely'),
  'ท้อ': art('feel-discouraged'),
  'เบื่อ': art('feel-bored'),
  'ผิดหวัง': art('feel-let-down'),
  'ว่างเปล่า': art('feel-empty'),
  'รู้สึกผิด': art('feel-guilty'),
};

/** step 3: the scene for where it comes from, with the face of the tone they picked */
export const ctxArt = (ctx: string, tone: string) => art(`ctx-${ctx}-${tone}`);

/** step 4: Mooca beside the calendar */
export const durArt = (good: boolean, dur: string) => art(`dur-${good ? 'good' : 'heavy'}-${dur}`);

export const OOCA_URL = 'https://www.ooca.co/';
