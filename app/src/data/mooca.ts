// How Mooca answers a typed message (scripted, no AI service). The aim is a reply that sounds like it heard
// *this* message: it names the feeling it caught, fits the kind of day (a good day is not treated as stress),
// handles the short answers people actually type ("not sure", "ok", "what do I do", "thanks"), and asks a
// question about the topic instead of a generic one. `n` (how many messages they've sent) and a small hash of
// the text pick between variants so two turns in a row don't read the same.
import type { Lang } from './types';

type T2 = { th: string; en: string };
export type Mood = 'heavy' | 'light';
export interface Reply { say: string; ask: string | null; end?: boolean; onlyAsk?: boolean; felt?: boolean }

const hash = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const choose = <X,>(xs: X[], n: number, text: string) => xs[(n + hash(text)) % xs.length];
const lower = (s: string) => s.toLowerCase();

/* ---- feelings Mooca can hear in a message ---- */
const EMO: { re: RegExp; th: string; en: string; mood: Mood }[] = [
  { re: /เหนื่อย|ล้า|หมดแรง|ไม่มีแรง|หมดไฟ|tired|exhausted|drained|burn(ed|t)? ?out/i, th: 'เหนื่อย', en: 'worn out', mood: 'heavy' },
  { re: /เครียด|กดดัน|stress|pressure/i, th: 'เครียด', en: 'stressed', mood: 'heavy' },
  { re: /กังวล|กลัว|ห่วง|ใจไม่ดี|worr|anxious|scared|afraid|nervous/i, th: 'กังวล', en: 'worried', mood: 'heavy' },
  { re: /เศร้า|เสียใจ|ร้องไห้|น้อยใจ|sad|cry|cried|hurt/i, th: 'เสียใจ', en: 'hurt', mood: 'heavy' },
  { re: /โกรธ|หงุดหงิด|โมโห|รำคาญ|ไม่พอใจ|angry|mad|annoyed|frustrat|irritat/i, th: 'หงุดหงิด', en: 'frustrated', mood: 'heavy' },
  { re: /เหงา|โดดเดี่ยว|ไม่มีใคร|ตัวคนเดียว|lonely|alone/i, th: 'เหงา', en: 'lonely', mood: 'heavy' },
  { re: /เบื่อ|ว่างเปล่า|ไม่อยากทำอะไร|bored|empty|numb/i, th: 'เบื่อ', en: 'flat', mood: 'heavy' },
  { re: /ผิดหวัง|disappoint|let down/i, th: 'ผิดหวัง', en: 'disappointed', mood: 'heavy' },
  { re: /ดีใจ|มีความสุข|แฮปปี้|happy|glad|joy/i, th: 'มีความสุข', en: 'happy', mood: 'light' },
  { re: /สนุก|ตื่นเต้น|fun|excit/i, th: 'ตื่นเต้น', en: 'excited', mood: 'light' },
  { re: /ภูมิใจ|ทำได้|สำเร็จ|ผ่านแล้ว|proud|did it|made it|passed/i, th: 'ภูมิใจ', en: 'proud', mood: 'light' },
  { re: /โล่ง|สบายใจ|ผ่อนคลาย|ชิล|relie|relax|calm|at ease/i, th: 'โล่งใจ', en: 'relieved', mood: 'light' },
  { re: /ขอบคุณ|ซึ้ง|อบอุ่น|grateful|thankful|warm/i, th: 'อบอุ่นใจ', en: 'grateful', mood: 'light' },
];

/* ---- what the message is about: a line that shows Mooca gets it, and a question about that topic ---- */
type Topic = { id: string; re: RegExp; heavy: T2[]; light: T2[]; askHeavy: T2[]; askLight: T2[]; tip: T2 };
const TOPICS: Topic[] = [
  { id: 'work', re: /งาน|หัวหน้า|เจ้านาย|ลูกค้า|ประชุม|เดดไลน์|ออฟฟิศ|โปรเจ|deadline|work|boss|job|client|meeting|office|project/i,
    heavy: [{ th: 'งานที่ถาโถมแบบนี้ กินแรงทั้งกายทั้งใจจริงๆ', en: 'Work piling up like that takes it out of both body and mind.' },
      { th: 'ฟังดูเหมือนคุณต้องแบกความคาดหวังไว้เยอะเลย', en: 'It sounds like you’re carrying a lot of expectations.' },
      { th: 'เรื่องงานที่ค้างอยู่ในหัว ทำให้พักได้ไม่สุดเลยนะ', en: 'Work that stays in your head makes it hard to really rest.' }],
    light: [{ th: 'ดีจังที่งานวันนี้ไปได้สวย', en: 'Love that work went well today.' },
      { th: 'ความพยายามของคุณออกผลแล้วนะ', en: 'Your effort is paying off.' }],
    askHeavy: [{ th: 'ตอนนี้งานไหนที่หนักใจที่สุด', en: 'Which part of work feels heaviest right now?' },
      { th: 'มีใครในที่ทำงานที่พอคุยเรื่องนี้ด้วยได้บ้างไหม', en: 'Is there anyone at work you can talk to about this?' },
      { th: 'ถ้าตัดออกได้หนึ่งอย่าง คุณอยากตัดอะไรออกก่อน', en: 'If you could drop one thing, what would go first?' }],
    askLight: [{ th: 'ส่วนไหนของวันนี้ที่คุณภูมิใจที่สุด', en: 'Which part of today are you proudest of?' },
      { th: 'อะไรที่ทำให้งานวันนี้ลื่นไหลขนาดนี้', en: 'What made work flow so well today?' }],
    tip: { th: 'ลองเขียนงานทั้งหมดที่อยู่ในหัวออกมาก่อน แล้ววงแค่เรื่องเดียวที่ต้องทำวันนี้ ที่เหลือพรุ่งนี้ค่อยว่ากัน', en: 'Try writing every task in your head down, then circle just one for today. The rest can wait.' } },
  { id: 'study', re: /เรียน|สอบ|อาจารย์|การบ้าน|รายงาน|เกรด|มหาลัย|study|exam|test|class|homework|grade|school|uni/i,
    heavy: [{ th: 'ช่วงเรียนช่วงสอบ ความกดดันมันมาจากทุกทางเลย', en: 'Exams and classes press in from every side.' },
      { th: 'เหมือนคุณพยายามเต็มที่แล้ว แต่ใจยังไม่วางเลยนะ', en: 'It sounds like you’re giving it everything, and your mind still won’t settle.' }],
    light: [{ th: 'เก่งมากเลย ความตั้งใจของคุณมันเห็นผลแล้ว', en: 'Well done. Your hard work is showing.' }],
    askHeavy: [{ th: 'ตอนนี้วิชาไหนหรือเรื่องไหนที่ค้างใจที่สุด', en: 'Which subject or task is weighing on you most?' },
      { th: 'ช่วงนี้ได้นอนพอบ้างไหม', en: 'Have you been sleeping enough lately?' }],
    askLight: [{ th: 'คุณจะให้รางวัลตัวเองยังไงดีวันนี้', en: 'How will you treat yourself today?' }],
    tip: { th: 'ลองแบ่งอ่านเป็นรอบละ 25 นาที แล้วพัก 5 นาที ใจจะไม่ล้าเร็ว และรู้สึกว่าคืบหน้าทีละนิด', en: 'Try 25-minute study blocks with 5-minute breaks. It keeps you from burning out and you can see progress.' } },
  { id: 'people', re: /แฟน|เพื่อน|ครอบครัว|พ่อ|แม่|พี่|น้อง|ลูก|ทะเลาะ|เลิก|คนรอบตัว|สามี|ภรรยา|friend|family|partner|boyfriend|girlfriend|mom|dad|parent|fight|broke up/i,
    heavy: [{ th: 'เรื่องกับคนที่เราใส่ใจ มันกระทบใจลึกกว่าเรื่องอื่น เพราะเขาสำคัญกับเรา', en: 'Things with people we care about cut deeper, because they matter to us.' },
      { th: 'ฟังดูเหมือนคุณอยากให้เขาเข้าใจคุณมากกว่านี้', en: 'It sounds like you wish they understood you more.' }],
    light: [{ th: 'มีคนดีๆ อยู่รอบตัวนี่มันอุ่นใจจริงๆ', en: 'Having good people around really warms the heart.' }],
    askHeavy: [{ th: 'ตอนนั้นคุณอยากให้เขาพูดหรือทำอะไร', en: 'What did you wish they’d said or done?' },
      { th: 'เรื่องนี้คุณได้บอกความรู้สึกกับเขาไปบ้างหรือยัง', en: 'Have you been able to tell them how you feel?' }],
    askLight: [{ th: 'เขาทำอะไรที่ทำให้คุณรู้สึกแบบนี้', en: 'What did they do that made you feel this way?' }],
    tip: { th: 'ลองเริ่มประโยคด้วย "เรารู้สึก..." แทน "เธอทำ..." คนฟังจะเปิดใจฟังง่ายขึ้น และคุณได้พูดสิ่งที่อยู่ในใจจริงๆ', en: 'Try starting with "I feel..." instead of "You did...". People listen more openly, and you get to say what’s really inside.' } },
  { id: 'money', re: /เงิน|หนี้|ค่าใช้จ่าย|เงินเดือน|ผ่อนบ้าน|ผ่อนรถ|ค่าผ่อน|ผ่อนจ่าย|ค่าเช่า|ค่าบิล|money|debt|rent|bills|salary|loan/i,
    heavy: [{ th: 'เรื่องเงินทำให้ใจไม่มั่นคงได้ง่าย เพราะมันผูกกับความปลอดภัยของชีวิต', en: 'Money worries shake your sense of safety.' },
      { th: 'ความกังวลเรื่องเงินมักวนอยู่ในหัว แม้ตอนจะนอน', en: 'Money worries tend to loop, even at bedtime.' }],
    light: [{ th: 'ดีใจด้วยนะ เรื่องเงินที่คลี่คลายช่วยให้หายใจได้เต็มปอดขึ้นเยอะ', en: 'So glad. When money eases up, you can finally breathe.' }],
    askHeavy: [{ th: 'ตอนนี้ก้อนไหนที่ทำให้กังวลที่สุด', en: 'Which part worries you most right now?' }],
    askLight: [{ th: 'มีแผนจะใช้หรือเก็บยังไงต่อ', en: 'Any plans for what comes next?' }],
    tip: { th: 'ลองเขียนตัวเลขออกมาให้เห็นทั้งหมดบนกระดาษ ความกังวลที่อยู่ในหัวมักดูใหญ่กว่าตัวเลขจริง แล้วค่อยเลือกจัดการทีละก้อน', en: 'Try writing all the numbers down on paper. Worries in your head often look bigger than the real figures. Then tackle one at a time.' } },
  { id: 'body', re: /นอนไม่หลับ|นอนน้อย|ไม่ได้นอน|อดนอน|นอนดึก|หลับไม่|ป่วย|ปวด|ไม่สบาย|ร่างกาย|หาหมอ|sleep|sick|pain|ill|headache|doctor/i,
    heavy: [{ th: 'เวลาร่างกายไม่ไหว ใจก็ไหวยากตามไปด้วยนะ', en: 'When your body is struggling, your mind struggles too.' },
      { th: 'ร่างกายที่ล้าทำให้ทุกอย่างหนักขึ้นเป็นเท่าตัว', en: 'A tired body makes everything twice as heavy.' }],
    light: [{ th: 'ดีจังที่ร่างกายได้พักเต็มที่', en: 'Glad your body got some real rest.' }],
    askHeavy: [{ th: 'วันนี้ได้พักหรือกินอะไรอุ่นๆ บ้างหรือยัง', en: 'Have you had a rest or something warm to eat today?' }],
    askLight: [{ th: 'อะไรที่ช่วยให้ร่างกายรู้สึกดีแบบนี้', en: 'What helped your body feel this good?' }],
    tip: { th: 'คืนนี้ลองวางมือถือก่อนนอนสัก 20 นาที หรี่ไฟ แล้วหายใจออกให้ยาวกว่าหายใจเข้า ร่างกายจะค่อยๆ เข้าโหมดพัก', en: 'Tonight, try putting your phone down 20 minutes before bed, dim the lights, and breathe out longer than you breathe in.' } },
  { id: 'self', re: /ตัวเอง|ไม่เก่ง|ไม่ดีพอ|ล้มเหลว|ผิดพลาด|พลาด|เปรียบเทียบ|myself|not good enough|failure|failed|mistake|compare/i,
    heavy: [{ th: 'ดูเหมือนคุณกำลังใจร้ายกับตัวเองอยู่นะ', en: 'It sounds like you’re being hard on yourself.' },
      { th: 'การพลาดไม่ได้ทำให้คุณมีค่าน้อยลงเลยนะ', en: 'Making a mistake doesn’t make you worth any less.' }],
    light: [{ th: 'ชอบที่คุณเห็นคุณค่าในตัวเองแบบนี้นะ', en: 'I love that you can see your own worth like this.' }],
    askHeavy: [{ th: 'ถ้าเพื่อนสนิทเล่าเรื่องนี้ให้ฟัง คุณจะบอกเขาว่าอะไร', en: 'If a close friend told you this, what would you tell them?' }],
    askLight: [{ th: 'อยากจำความรู้สึกนี้ไว้ยังไงดี', en: 'How do you want to remember this feeling?' }],
    tip: { th: 'ลองเขียนสิ่งที่ทำได้ดีวันนี้สัก 3 อย่าง เล็กแค่ไหนก็นับนะ สมองเราชอบจำแต่เรื่องที่พลาด เลยต้องช่วยมันจำเรื่องดีด้วย', en: 'Try writing three things you did well today, however small. Our brains hold on to mistakes, so help yours keep the good ones too.' } },
  { id: 'future', re: /อนาคต|ไม่แน่นอน|ตัดสินใจ|เลือกไม่ถูก|ย้าย|ลาออก|future|uncertain|decide|decision|quit|move/i,
    heavy: [{ th: 'ความไม่แน่นอนมันทำให้ใจลอยๆ ไม่มีที่ยึดเลยนะ', en: 'Not knowing what comes next leaves you with nothing to hold on to.' }],
    light: [{ th: 'ฟังดูเหมือนคุณกำลังจะได้เริ่มอะไรใหม่ๆ เลย', en: 'It sounds like something new is starting for you.' }],
    askHeavy: [{ th: 'ถ้าไม่ต้องกลัวผิด คุณอยากเลือกทางไหน', en: 'If you couldn’t get it wrong, which way would you choose?' }],
    askLight: [{ th: 'สิ่งที่ตั้งตารอที่สุดคืออะไร', en: 'What are you looking forward to most?' }],
    tip: { th: 'ลองแบ่งเป็นสองฝั่ง สิ่งที่เราควบคุมได้ กับที่ควบคุมไม่ได้ แล้วโฟกัสแค่ฝั่งแรก ใจจะนิ่งขึ้น', en: 'Try splitting it into what you can control and what you can’t, then focus only on the first. It steadies the mind.' } },
];

/* ---- general lines when no topic matches ---- */
const VALIDATE: Record<Mood, T2[]> = {
  heavy: [{ th: 'Mooca ฟังอยู่นะ ไม่ต้องรีบ', en: 'I’m listening. No rush.' },
    { th: 'เข้าใจเลย วันแบบนี้มันไม่ง่ายจริงๆ', en: 'I hear you. Days like this aren’t easy.' },
    { th: 'ขอบคุณที่ไว้ใจเล่าให้ฟังนะ', en: 'Thank you for trusting me with this.' },
    { th: 'อืม เข้าใจความรู้สึกนั้นเลย', en: 'Mm, I understand that feeling.' }],
  light: [{ th: 'ดีจังเลย ขอบคุณที่แบ่งเรื่องดีๆ ให้ฟังนะ', en: 'That’s lovely. Thanks for sharing something good with me.' },
    { th: 'ฟังแล้วอบอุ่นใจจัง', en: 'That sounds so warm.' },
    { th: 'วันแบบนี้น่าจดไว้เลยนะ', en: 'Days like this are worth writing down.' },
    { th: 'เรื่องเล็กๆ แบบนี้แหละ ที่ทำให้วันดีขึ้นได้จริงๆ', en: 'It’s little things like this that really make a day.' }],
};
const ASK: Record<Mood, T2[]> = {
  heavy: [{ th: 'ตอนนั้นร่างกายคุณรู้สึกยังไงบ้าง', en: 'How did it feel in your body at that moment?' },
    { th: 'ตรงไหนของเรื่องนี้ที่ค้างใจที่สุด', en: 'Which part of this is staying with you most?' },
    { th: 'มีอะไรเล็กๆ ที่จะช่วยให้คืนนี้เบาลงได้บ้างไหม', en: 'Is there one small thing that could make tonight lighter?' },
    { th: 'ตอนนี้อยากให้ใครสักคนช่วยอะไรไหม', en: 'Is there anything you wish someone could help with right now?' },
    { th: 'ถ้าวันนี้ใจดีกับตัวเองได้ข้อเดียว อยากทำอะไร', en: 'If you could be kind to yourself in one way today, what would it be?' }],
  light: [{ th: 'ช่วงไหนของวันนี้ที่ชอบที่สุด', en: 'Which moment today did you like best?' },
    { th: 'อยากเก็บความรู้สึกนี้ไว้ยังไงดี', en: 'How do you want to hold on to this feeling?' },
    { th: 'ตอนนั้นมีใครอยู่ด้วยไหม', en: 'Was anyone with you?' },
    { th: 'พรุ่งนี้อยากให้มีอะไรแบบนี้อีกไหม', en: 'Would you like more of this tomorrow?' }],
};
const EMO_LINE: Record<Mood, ((e: string) => T2)[]> = {
  heavy: [e => ({ th: `ฟังแล้วรู้สึกได้เลยว่าคุณ${e}มากนะ`, en: `I can really hear how ${e} you are.` }),
    e => ({ th: `${e}แบบนั้น มันกินแรงใจจริงๆ`, en: `Feeling ${e} like that really takes it out of you.` }),
    e => ({ th: `ไม่แปลกเลยที่จะ${e} ใครเจอแบบนี้ก็คงรู้สึกเหมือนกัน`, en: `It makes sense to feel ${e}. Anyone would.` })],
  light: [e => ({ th: `ดีใจด้วยนะที่วันนี้คุณ${e}`, en: `I’m so glad you’re feeling ${e} today.` }),
    e => ({ th: `ความรู้สึก${e}แบบนี้ เก็บไว้ดีๆ เลย`, en: `Hold on to feeling ${e} like this.` })],
};

const DUNNO = /^(ไม่รู้|ไม่แน่ใจ|ไม่รู้สิ|ไม่รู้เหมือนกัน|ก็ไม่รู้|งง|idk|i don.?t know|not sure|dunno)/i;
const OKAY = /^(โอเค|ok|okay|อืม+|อือ|ก็ดี|ก็โอเค|ครับ|ค่ะ|คับ|ใช่|ได้|yes|yeah|yep|sure|fine)[.!\s]*$/i;
const HELP = /ทำไงดี|ทำยังไงดี|ควรทำ|ทำไงต่อ|ช่วยหน่อย|แนะนำ|มีวิธี|ต้องทำไง|what should|how (do|can) i|help me|any tips|advice/i;
const THANKS = /^(ขอบคุณ|ขอบใจ|thank|thx|ty)/i;
const EASY: T2[] = [{ th: 'งั้นลองตอบง่ายๆ ตอนนี้ใจหนักหรือเบา ถ้าให้คะแนน 1 ถึง 5', en: 'Then something simpler: if your heart had a weight from 1 to 5 right now, what would it be?' },
  { th: 'งั้นเล่าแค่สิ่งแรกที่นึกออกเกี่ยวกับวันนี้ก็พอ', en: 'Then just tell me the first thing that comes to mind about today.' }];

/** the reply to one typed message (risk words are handled before this is called) */
export function moocaReply(text: string, ctx: { lang: Lang; mood: Mood; word: string; n: number; topicHint?: string | null; history?: { from: string; text: string }[]; feelingOnly?: boolean }): Reply {
  const L = ctx.lang, t = text.trim(), n = ctx.n;
  const pk = (x: T2) => x[L];
  const history = ctx.history ?? [];
  const asked = new Set(history.filter(m => m.from === 'mooca').map(m => m.text));
  // a question Mooca hasn't asked yet in this chat (falls back to the usual pick when all were used)
  const fresh = (xs: T2[]) => { const ok = xs.filter(x => !asked.has(pk(x))); return ok.length ? pk(choose(ok, n, t)) : null; };
  // once the hotline has come up in this chat, Mooca keeps it close instead of signing off cheerfully
  const unsafe = history.some(m => m.from === 'mooca' && m.text.includes('1323'));
  if (THANKS.test(t) && unsafe) return { say: L === 'en' ? 'Thank you for telling me. You don’t have to go through this alone.' : 'ขอบคุณที่บอก Mooca นะ คุณไม่ต้องผ่านเรื่องนี้คนเดียว', ask: L === 'en' ? 'If it gets heavy again, call 1323 any time, day or night. I’m here too.' : 'ถ้าใจหนักขึ้นมาอีก โทร 1323 ได้ตลอด 24 ชั่วโมงนะ Mooca ก็ยังอยู่ตรงนี้' };
  if (THANKS.test(t)) return { say: L === 'en' ? 'Thank you for letting me listen. You did well today.' : 'ขอบคุณที่ให้ Mooca ได้ฟังนะ วันนี้คุณทำดีแล้ว', ask: L === 'en' ? 'Anything else on your mind, or shall we rest here?' : 'ยังมีอะไรค้างใจอีกไหม หรือจะพักกันตรงนี้ก่อนก็ได้นะ', end: true };
  if (DUNNO.test(t) && t.length < 24) return { say: L === 'en' ? 'Not knowing is completely okay.' : 'ไม่รู้ก็ไม่เป็นไรเลยนะ บางทีความรู้สึกมันยังไม่มีชื่อ', ask: fresh(EASY) ?? (L === 'en' ? 'Tell me whatever comes to mind.' : 'เล่าอะไรก็ได้ที่นึกออกเลยนะ') };
  if (OKAY.test(t)) return { say: L === 'en' ? 'Mm, I’m here.' : 'อืม Mooca อยู่ตรงนี้นะ', ask: L === 'en' ? 'If there’s more on your mind, go on. Or we can just sit here a while.' : 'ถ้ายังมีอะไรอยากเล่า เล่าต่อได้เลย หรือจะนั่งเงียบๆ ด้วยกันสักพักก็ได้' };

  const emo = EMO.find(e => e.re.test(t));
  const mood: Mood = emo?.mood ?? ctx.mood;
  const here = TOPICS.find(x => x.re.test(lower(t)));
  // the thread: what they talked about earlier in this chat, or the source they picked on step 3
  const earlier = [...history].reverse().filter(m => m.from === 'me').map(m => TOPICS.find(x => x.re.test(lower(m.text)))).find(Boolean);
  const topic = here ?? earlier ?? TOPICS.find(x => x.id === ctx.topicHint);

  if (HELP.test(t)) {
    const tip = topic ? pk(topic.tip) : (L === 'en' ? 'Let’s start small: breathe out slowly three times, then pick just one thing you can do in the next ten minutes.' : 'เริ่มจากเล็กๆ ก่อนนะ หายใจออกยาวๆ สัก 3 ครั้ง แล้วเลือกแค่เรื่องเดียวที่ทำได้ใน 10 นาทีข้างหน้า');
    return { say: `${L === 'en' ? 'Here’s one idea. ' : 'ลองแบบนี้ดูไหม '}${tip}`, ask: L === 'en' ? 'Has anything helped you before in a moment like this?' : 'ที่ผ่านมามีอะไรที่เคยช่วยได้ในช่วงแบบนี้บ้างไหม' };
  }

  // "I wish they'd...": say their wish back in their own words; it is the need under the feeling
  const wish = L === 'th' ? t.match(/อยากให้(.{2,40}?)(?:[.!?\s]*$)/) : t.match(/\bI (?:wish|want) (?:they|he|she|someone|people)(.{2,60}?)[.!?\s]*$/i);
  if (wish && mood === 'heavy') return {
    say: L === 'en' ? `Wanting them${wish[1]} makes complete sense. That’s a real need.` : `อยากให้${wish[1].trim()} เป็นความต้องการที่สำคัญมากนะ Mooca เข้าใจเลย`,
    ask: L === 'en' ? 'If you could tell them straight, what would you say?' : 'ถ้าได้บอกเขาตรงๆ คุณอยากพูดว่าอะไร',
  };

  // say: the feeling it heard (or the topic line), opened with a thank-you when they wrote a lot
  const long = t.length > 70 ? (L === 'en' ? 'Thank you for telling me all of that. ' : 'ขอบคุณที่เล่าละเอียดขนาดนี้นะ ') : '';
  // never say the same line twice in one chat: pick one Mooca hasn't used yet, or say nothing extra
  const said = history.filter(m => m.from === 'mooca').map(m => m.text).join('\n');
  const unused = (xs: string[]) => { const ok = xs.filter(x => !said.includes(x)); return ok.length ? choose(ok, n, t) : null; };
  const emoLine = emo ? unused(EMO_LINE[mood].map(f => pk(f(emo[L])))) : null;
  const topicLine = here && !ctx.feelingOnly ? unused(here[mood].map(pk)) : null;
  const say = (long + ([emoLine, topicLine].filter(Boolean).join(' ') || (unused(VALIDATE[mood].map(pk)) ?? ''))).trim();
  // a question about their topic first; once those are used up, a general one for this kind of day
  const own = topic ? (mood === 'heavy' ? topic.askHeavy : topic.askLight).filter(x => !asked.has(pk(x))) : [];
  const ask = own.length ? pk(choose(own, n, t)) : fresh(ASK[mood]);
  // nothing new to say: just the question, as one bubble; nothing new to ask either: a quiet "go on"
  if (say) return { say, ask, felt: !!emoLine };
  if (ask) return { say: ask, ask: null, onlyAsk: true };
  const quiet: T2[] = mood === 'light'
    ? [{ th: 'อืม ฟังแล้วดีจัง เล่าต่อได้เลยนะ', en: 'Mm, that sounds nice. Go on.' }, { th: 'น่ารักจัง แล้วยังไงต่อ', en: 'Aw, lovely. Then what?' }, { th: 'Mooca ฟังอยู่นะ มีอะไรอีกไหม', en: 'I’m listening. Anything else?' }, { th: 'ชอบที่คุณเล่ามาเลย', en: 'I love hearing this.' }]
    : [{ th: 'อืม Mooca ฟังอยู่นะ เล่าต่อได้เลย', en: 'Mm, I’m listening. Go on.' }, { th: 'ค่อยๆ เล่าก็ได้ ไม่ต้องรีบ', en: 'Take your time. No rush.' }, { th: 'Mooca ยังอยู่ตรงนี้นะ', en: 'I’m still right here.' }, { th: 'เข้าใจนะ แล้วตอนนี้ใจเป็นยังไงบ้าง', en: 'I hear you. How’s your heart right now?' }];
  return { say: unused(quiet.map(pk)) ?? pk(quiet[n % quiet.length]), ask: null, onlyAsk: true };
}

/** the kind of day, from the room they picked (or how heavy the card read when no room) */
export const moodOf = (tone: string, lv: number): Mood => (tone === 'yellow' || tone === 'green' ? 'light' : tone === 'none' ? (lv > 0 ? 'heavy' : 'light') : 'heavy');
