// The story layer: the four rooms, the long reading on the result card, Mooca's scripted chat,
// and the demo days the mock sign-in puts on the shelf. Same voice as the rest: a friend talking, no blame.
import { CONTEXTS, DURATIONS, DURATIONS_GOOD, EXERCISES, EX_TONE, NEUTRAL, TONES } from './content';
import type { Lang, Tone, Word } from './types';
import { loc } from '../lib/text';
import { moocaReply, moodOf } from './mooca';

type T2 = { th: string; en: string };
const pick = (x: T2, lang: Lang) => x[lang];

/* ---------- step 1: the rooms ---------- */
// each room is a tone; the picture is drawn by <Room>
export const ROOMS: Record<Tone['id'], { name: T2; scene: T2 }> = {
  yellow: {
    name: { th: 'ห้องแดดส่อง', en: 'The sunlit room' },
    scene: { th: 'หน้าต่างเปิดกว้าง แดดอุ่นๆ ส่องเต็มห้อง อยากลุกไปทำอะไรสักอย่าง', en: 'Windows wide open, warm sun everywhere. You feel like doing something.' },
  },
  green: {
    name: { th: 'ห้องริมสวน', en: 'The garden room' },
    scene: { th: 'ลมเย็นพัดผ่าน ใบไม้ไหวเบาๆ ทุกอย่างค่อยๆ ช้าลง', en: 'A cool breeze, leaves swaying softly. Everything slows down.' },
  },
  orange: {
    name: { th: 'ห้องที่พายุมา', en: 'The stormy room' },
    scene: { th: 'ลมตีหน้าต่างไม่หยุด เสียงดังจนนั่งนิ่งๆ ไม่ได้', en: 'Wind keeps rattling the window. It’s too loud to sit still.' },
  },
  blue: {
    name: { th: 'ห้องฝนตกตอนกลางคืน', en: 'The rainy night room' },
    scene: { th: 'ไฟสลัว ฝนพรำอยู่นอกหน้าต่าง อยากขดตัวอยู่เฉยๆ', en: 'Dim light, rain outside the window. You just want to curl up.' },
  },
};

/* ---------- the reading on the result card ---------- */
export interface Answers { tone: Tone['id'] | null; words: Word[]; ctx: string | null; dur: string | null; lv: number }

const INSIDE: Record<string, T2> = {
  yellow: { th: 'ตอนนี้พลังในตัวกำลังสูง ใจเปิดรับสิ่งใหม่ เป็นช่วงที่เหมาะกับการเริ่มต้น หรือลงมือทำเรื่องที่ค้างไว้', en: 'Your energy is high and your mind is open. It’s a good time to start something, or finish what’s been waiting.' },
  green: { th: 'ร่างกายกับใจอยู่ในจังหวะเดียวกัน ระบบประสาทได้พัก นี่คือช่วงที่ใจได้เติมพลังกลับคืนมา', en: 'Your body and mind are in step, and your nervous system is resting. This is when your heart refills.' },
  orange: { th: 'ใจกำลังตื่นตัวเพื่อปกป้องคุณ เหมือนสัญญาณเตือนที่ดังอยู่ ร่างกายเลยตึงและคิดเร็วกว่าปกติ ไม่ได้แปลว่าคุณอ่อนแอ แต่บอกว่ามีเรื่องที่คุณให้ความสำคัญ', en: 'Your mind is on alert to protect you, like an alarm that’s still ringing, so your body tenses and your thoughts race. It doesn’t mean you’re weak. It means something matters to you.' },
  blue: { th: 'พลังในตัวกำลังต่ำ ใจเลยอยากถอยมาพัก ความรู้สึกนี้ไม่ได้บอกว่าคุณไม่ดีพอ แต่บอกว่าคุณแบกอะไรมาเยอะแล้ว', en: 'Your energy is low, so your mind wants to step back and rest. It doesn’t say you’re not enough. It says you’ve been carrying a lot.' },
  none: { th: 'บางครั้งความรู้สึกยังปนกันจนเรียกชื่อไม่ได้ ไม่เป็นไรเลย แค่หยุดมาสังเกตตัวเองก็เป็นก้าวแรกแล้ว', en: 'Sometimes feelings are too tangled to name. That’s okay. Stopping to notice is already the first step.' },
};

const SOURCE: Record<string, { heavy: T2; good: T2 }> = {
  work: {
    heavy: { th: 'งานกับการเรียนกินเวลาส่วนใหญ่ของวัน ลองแยกดูว่าส่วนไหนอยู่ในมือคุณ และส่วนไหนไม่ใช่ แล้วเริ่มจากส่วนที่ทำได้ก่อน', en: 'Work and study take up most of the day. Try sorting what’s in your hands from what isn’t, and start with what you can do.' },
    good: { th: 'งานกำลังไปได้ดี ลองจำไว้ว่าอะไรทำให้เป็นแบบนี้ จะได้กลับมาใช้ในวันที่ยาก', en: 'Work is going well. Notice what made it work, so you can use it again on hard days.' },
  },
  people: {
    heavy: { th: 'ความสัมพันธ์มีผลกับใจมาก เพราะเราอยากรู้สึกว่าเป็นส่วนหนึ่ง ลองถามตัวเองว่าคุณต้องการอะไรจากคนนั้น', en: 'Relationships weigh a lot because we want to belong. Ask yourself what you need from that person.' },
    good: { th: 'คนรอบตัวกำลังเติมใจให้คุณ ลองบอกเขาสักคำว่ามันมีความหมาย', en: 'The people around you are filling you up. Consider telling them it means something.' },
  },
  self: {
    heavy: { th: 'เวลาเรื่องอยู่ข้างในตัวเอง เรามักใจร้ายกับตัวเองมากกว่าที่ใจร้ายกับคนอื่น ลองพูดกับตัวเองแบบที่จะพูดกับเพื่อน', en: 'When it’s about ourselves, we’re often harsher than we’d ever be with others. Try talking to yourself like a friend.' },
    good: { th: 'คุณกำลังดีกับตัวเอง นี่คือสิ่งที่ควรเก็บไว้', en: 'You’re being good to yourself. That’s worth keeping.' },
  },
  body: {
    heavy: { th: 'ร่างกายกับใจเชื่อมกัน เวลาร่างกายไม่ไหว ใจก็ไหวยากตามไปด้วย การพักไม่ใช่การขี้เกียจ', en: 'Body and mind are linked. When your body is struggling, your mind struggles too. Resting isn’t being lazy.' },
    good: { th: 'ร่างกายพร้อม ใจก็เบาตาม ดูแลแบบนี้ต่อไปนะ', en: 'Your body feels ready, and your mind follows. Keep caring for it like this.' },
  },
  money: {
    heavy: { th: 'เรื่องเงินทำให้รู้สึกไม่มั่นคง เพราะผูกกับความปลอดภัยในชีวิต ลองเขียนตัวเลขออกมาให้เห็น ความกลัวมักใหญ่กว่าตัวเลขจริง', en: 'Money worries feel big because they’re tied to safety. Try writing the numbers down. The fear is often bigger than the numbers.' },
    good: { th: 'เรื่องเงินลงตัว ใจเลยมีที่ว่างให้เรื่องอื่น', en: 'Money feels settled, so there’s room in your mind for other things.' },
  },
  unsure: {
    heavy: { th: 'ยังไม่รู้ว่ามาจากไหนก็ไม่เป็นไร บางความรู้สึกสะสมมาจากหลายเรื่องเล็กๆ', en: 'Not knowing where it comes from is okay. Some feelings build up from many small things.' },
    good: { th: 'ไม่ต้องรู้ที่มาก็ได้ แค่รู้สึกดีก็พอแล้ว', en: 'You don’t need to know why. Feeling good is enough.' },
  },
};

const TIME: Record<string, { heavy: T2; good: T2 }> = {
  today: {
    heavy: { th: 'เพิ่งเกิดวันนี้ มักเป็นปฏิกิริยาต่อเรื่องเฉพาะหน้า ให้เวลาตัวเองสักคืน แล้วดูอีกทีพรุ่งนี้', en: 'It started today, so it’s likely a reaction to something recent. Give it a night and check again tomorrow.' },
    good: { th: 'เพิ่งรู้สึกวันนี้ เก็บช่วงเวลานี้ไว้ให้ดีนะ', en: 'It started today. Hold on to this moment.' },
  },
  days: {
    heavy: { th: 'อยู่มา 2–3 วันแล้ว ใจอาจกำลังย่อยเรื่องนี้อยู่ ลองสังเกตว่ามันเบาลงหรือหนักขึ้น', en: 'It’s been 2–3 days. Your mind may still be working through it. Notice if it’s easing or growing.' },
    good: { th: 'รู้สึกดีมา 2–3 วันแล้ว ลองดูว่าช่วงนี้คุณทำอะไรต่างไป', en: 'You’ve felt good for 2–3 days. Notice what you’ve been doing differently.' },
  },
  week: {
    heavy: { th: 'อยู่มา 1–2 สัปดาห์ ลองสังเกตว่ามันกระทบการนอน การกิน หรือการทำงานไหม ถ้าใช่ การได้คุยกับใครสักคนจะช่วยได้มาก', en: 'It’s been 1–2 weeks. Notice whether it’s affecting your sleep, eating or work. If so, talking to someone can help a lot.' },
    good: { th: 'รู้สึกดีมาทั้งสัปดาห์ นี่คือจังหวะชีวิตที่ใช่สำหรับคุณ', en: 'A whole week of feeling good. This rhythm suits you.' },
  },
  long: {
    heavy: { th: 'นานกว่า 2 สัปดาห์แล้ว เป็นสัญญาณที่ควรได้รับการดูแลจากผู้เชี่ยวชาญ การคุยกับนักจิตวิทยาจะช่วยให้เห็นทางออกชัดขึ้น', en: 'It’s been over 2 weeks. That’s a sign it deserves care from a professional. A psychologist can help you see a way through.' },
    good: { th: 'รู้สึกดีมาสักพักแล้ว คุณกำลังดูแลตัวเองได้ดีมาก', en: 'You’ve felt good for a while. You’re taking good care of yourself.' },
  },
  unsure: {
    heavy: { th: 'ไม่แน่ใจว่านานแค่ไหนก็ไม่เป็นไร ลองกลับมาเช็กอีกในอีก 2–3 วัน จะเห็นภาพชัดขึ้น', en: 'Not sure how long? That’s fine. Check in again in 2–3 days and the picture gets clearer.' },
    good: { th: 'ไม่ต้องนับวันก็ได้ ขอให้อยู่นานๆ', en: 'No need to count the days. May it stay a while.' },
  },
};

const SHORT: Record<string, T2> = {
  yellow: { th: 'พลังกำลังดี เหมาะกับการเริ่มอะไรใหม่', en: 'Your energy is good. A nice time to start something.' },
  green: { th: 'ใจได้พัก กำลังเติมพลังกลับมา', en: 'Your mind is resting and refilling.' },
  orange: { th: 'ใจกำลังตื่นตัว เพราะมีเรื่องที่คุณให้ความสำคัญ', en: 'Your mind is on alert because something matters to you.' },
  blue: { th: 'พลังเหลือน้อย ใจอยากพักสักหน่อย', en: 'Your energy is low. Your mind wants a rest.' },
  none: { th: 'ยังเรียกชื่อไม่ได้ก็ไม่เป็นไร แค่สังเกตก็ดีแล้ว', en: 'Not being able to name it is okay. Noticing is enough.' },
};

export interface Reading { feel: string; inside: string; source: string; time: string | null; care: string[]; short: string }

/** the long reading: what you feel, what's happening inside, where it comes from, what the time says, and what to try */
export function reading(a: Answers, lang: Lang): Reading {
  const words = a.words.length ? a.words : [NEUTRAL];
  const good = a.lv === 0;
  const feel = words.map(w => { const x = loc(w, lang); return lang === 'en' ? `${x.w}: ${x.m}` : `${x.w} คือ${x.m}`; }).join(lang === 'en' ? '. ' : ' ส่วน');
  const main = loc(words[0], lang);
  const tone = a.words.length ? a.tone ?? 'none' : 'none';
  const ctxId = a.ctx ?? 'unsure';
  const side = good ? 'good' : 'heavy';
  const cause = main.c ? `${main.c} ` : '';
  const source = `${cause}${pick(SOURCE[ctxId]?.[side] ?? SOURCE.unsure[side], lang)}`;
  const time = a.dur ? pick(TIME[a.dur][side], lang) : null;
  const care = [main.a].filter(Boolean) as string[];
  if (!good && (a.dur === 'long' || a.lv >= 3)) care.push(lang === 'en' ? 'Talk to a psychologist on ooca. You don’t have to wait until it’s heavier.' : 'คุยกับนักจิตวิทยาบน ooca ไม่ต้องรอให้หนักกว่านี้');
  return { feel, inside: pick(INSIDE[tone], lang), source, time, care, short: pick(SHORT[tone], lang) };
}

/** the answers on a stored check-in, turned back into words and tones */
export function answersOf(e: { tone: string | null; words: string[]; ctx: string | null; dur: string | null; lv: number }): Answers {
  const all = TONES.flatMap(t => [...t.words, ...t.more]);
  return { tone: (e.tone as Tone['id']) ?? null, words: e.words.map(w => all.find(x => x.w === w)).filter(Boolean) as Word[], ctx: e.ctx, dur: e.dur, lv: e.lv };
}

/** "เรื่องงานหรือการเรียน · เพิ่งเป็นวันนี้" for a stored check-in */
export function contextLine(e: { ctx: string | null; ctx2?: string | null; dur: string | null; lv: number }, lang: Lang) {
  const cs = [e.ctx, e.ctx2].map(id => CONTEXTS.find(x => x.id === id)).filter(c => c && c.id !== 'unsure').map(c => loc(c!, lang).label);
  const d = (e.lv === 0 ? DURATIONS_GOOD : DURATIONS).find(x => x.id === e.dur);
  return [...cs, d && d.id !== 'unsure' ? loc(d, lang).label : null].filter(Boolean).join(' · ');
}

/* ---------- Mooca's chat (scripted) ---------- */
export type ChipId = 'tell' | 'stuck' | 'cope' | 'listen' | 'more' | 'ex' | 'done';
export interface Msg { id: number; from: 'mooca' | 'me'; text: string; kind?: 'safety' | 'ooca' | 'ex' | 'resume' | 'wrap' }

const CHIP: Record<ChipId, T2> = {
  tell: { th: 'เล่าให้ฟังหน่อย', en: 'Let me tell you' },
  stuck: { th: 'ไม่รู้จะเริ่มยังไง', en: 'I don’t know where to start' },
  cope: { th: 'อยากได้วิธีรับมือ', en: 'How can I cope?' },
  listen: { th: 'แค่อยากมีคนฟัง', en: 'I just want someone to listen' },
  more: { th: 'เล่าต่อ', en: 'Tell you more' },
  ex: { th: 'ลองทำ 1 นาที', en: 'Try the 1-minute exercise' },
  done: { th: 'พอแค่นี้ก่อน', en: 'That’s enough for now' },
};
export const chipText = (id: ChipId, lang: Lang) => pick(CHIP[id], lang);

// words that mean someone may not be safe: the chat stops and points to the hotline
const RISK = /ตาย|ฆ่าตัว|ไม่อยากอยู่|ไม่อยากมีชีวิต|จบชีวิต|ทำร้ายตัวเอง|กรีด|อยากหายไป|suicid|kill myself|end (my|it all)|want to die|hurt myself|self.?harm|don.?t want to (live|be here)/i;
export const isRisk = (text: string) => RISK.test(text);

const COPE: Record<string, T2> = {
  orange: { th: 'ลองแบบนี้ดูนะ\n• หายใจออกให้ยาวกว่าหายใจเข้า ร่างกายจะค่อยๆ ผ่อนลง\n• เขียนเรื่องที่กังวลออกมา แล้ววงข้อที่ทำอะไรได้\n• เลือกทำแค่เรื่องเดียวก่อน', en: 'Try this:\n• Breathe out longer than you breathe in. Your body will start to settle.\n• Write your worries down and circle the ones you can act on.\n• Pick just one thing to do first.' },
  blue: { th: 'ลองแบบนี้ดูนะ\n• พักก่อน ไม่ต้องรีบหาย\n• ทำสิ่งเล็กที่สุดที่ดูแลร่างกาย เช่น ดื่มน้ำ หรืออาบน้ำอุ่น\n• ส่งข้อความหาใครสักคนที่ไว้ใจ', en: 'Try this:\n• Rest first. No need to rush feeling better.\n• Do the smallest thing for your body, like water or a warm shower.\n• Message someone you trust.' },
  yellow: { th: 'เก็บพลังนี้ไว้ใช้นะ\n• ลงมือทำเรื่องที่ค้างไว้สักเรื่อง\n• จดว่าอะไรทำให้วันนี้ดี\n• แบ่งความรู้สึกดีให้คนรอบตัว', en: 'Use this energy:\n• Start one thing you’ve put off.\n• Write down what made today good.\n• Share the good mood with someone.' },
  green: { th: 'อยู่กับความสงบนี้ให้นานขึ้นนะ\n• ปิดแจ้งเตือนสักพัก\n• สังเกตว่าร่างกายตรงไหนสบาย\n• จำช่วงเวลานี้ไว้ใช้ในวันที่ยาก', en: 'Stay with this calm:\n• Turn off notifications for a bit.\n• Notice where your body feels at ease.\n• Remember this moment for harder days.' },
  none: { th: 'ลองแบบนี้ดูนะ\n• หายใจช้าๆ สักนาที\n• เขียนอะไรก็ได้ที่อยู่ในหัว ไม่ต้องตั้งชื่อ\n• กลับมาเช็กใจอีกทีพรุ่งนี้', en: 'Try this:\n• Breathe slowly for a minute.\n• Write whatever is on your mind, no name needed.\n• Check in again tomorrow.' },
};

export interface ChatCtx { lang: Lang; tone: string; word: string; ctxSay: string | null; lv: number; vent?: boolean; ctxId?: string | null; history?: { from: string; text: string }[] }
export interface Turn { msgs: Omit<Msg, 'id'>[]; chips: ChipId[] }

export function opening(c: ChatCtx): Turn {
  const light = moodOf(c.tone, c.lv) === 'light';
  const th = `วันนี้คุณรู้สึก${c.word}${c.ctxSay ? ` ${c.ctxSay}` : ''} ${light ? 'มีเรื่องดีๆ อะไรบ้าง เล่าให้ Mooca ฟังหน่อย' : 'อยากเล่าให้ Mooca ฟังไหมว่าเกิดอะไรขึ้น'}`;
  const en = `Today you felt ${c.word.toLowerCase()}${c.ctxSay ? `, around ${c.ctxSay.replace(/\.$/, '').toLowerCase()}` : ''}. ${light ? 'What good things happened? Tell me.' : 'Want to tell me what happened?'}`;
  return { msgs: [{ from: 'mooca', text: c.lang === 'en' ? en : th }], chips: ['tell', 'stuck', 'cope', 'listen'] };
}

/** venting before the summary: they already said yes, so Mooca just opens the door */
export function ventOpening(c: ChatCtx): Turn {
  const light = moodOf(c.tone, c.lv) === 'light';
  const th = `${light ? 'ได้เลย เล่ามาได้เต็มที่ เรื่องดีๆ ก็อยากฟังนะ' : 'ได้เลย เล่ามาได้เต็มที่ ไม่ต้องเรียบเรียง'}${c.ctxSay ? ` วันนี้${c.ctxSay}เป็นยังไงบ้าง` : ' วันนี้เกิดอะไรขึ้นบ้าง'}`;
  const en = `${light ? 'Go ahead, I’d love to hear the good stuff too.' : 'Go ahead, let it all out. No need to tidy it up.'} ${c.ctxSay ? `How did ${c.ctxSay.replace(/\.$/, '').toLowerCase()} go today?` : 'What happened today?'}`;
  return { msgs: [{ from: 'mooca', text: c.lang === 'en' ? en : th }], chips: ['stuck', 'listen'] };
}

/** coming back to the chat after signing in */
export const resumeMsg = (lang: Lang): Omit<Msg, 'id'> => ({ from: 'mooca', kind: 'resume', text: lang === 'en' ? 'I’m here. We can keep talking, and this chat is saved in today’s jar.' : 'Mooca อยู่ตรงนี้นะ คุยต่อกันได้เลย บทสนทนานี้บันทึกไว้ในโหลของวันนี้แล้ว' });

/** Mooca's closing words on the result: what today was, and how the venting went */
export function closing(a: { word: string; ctxSay: string | null; short: string; vent: 'yes' | 'later' | 'no' | null; heavy: boolean }, lang: Lang): string[] {
  const en = lang === 'en';
  const first = en ? `Today you felt ${a.word.toLowerCase()}${a.ctxSay ? `, around ${a.ctxSay.replace(/\.$/, '').toLowerCase()}` : ''}.` : `วันนี้คุณรู้สึก${a.word}${a.ctxSay ? ` ${a.ctxSay}` : ''}`;
  const vent = a.vent === 'yes' ? (en ? 'Thank you for telling me. Saying it out loud really can make it lighter.' : 'ขอบคุณที่ระบายให้ฟังนะ การได้พูดออกมาช่วยให้ใจเบาลงได้จริงๆ')
    : a.vent === 'later' ? (en ? 'Whenever you want to talk, I’m right here.' : 'อยากระบายเมื่อไหร่ Mooca อยู่ตรงนี้เสมอนะ')
    : a.vent === 'no' ? (a.heavy ? (en ? 'No need to explain. Noticing it is already enough.' : 'ไม่ต้องเล่าก็ได้นะ แค่รู้ตัวก็ดีมากแล้ว') : (en ? 'So glad nothing is weighing on you today.' : 'ดีใจที่วันนี้ไม่มีอะไรค้างในใจนะ'))
    : null;
  return [first, a.short, vent].filter(Boolean) as string[];
}

export function onChip(id: ChipId, c: ChatCtx): Turn {
  const L = c.lang;
  switch (id) {
    case 'tell': case 'more':
      return { msgs: [{ from: 'mooca', text: L === 'en' ? 'Go ahead, long or short. I’m listening.' : 'เล่ามาได้เลยนะ ยาวหรือสั้นก็ได้ Mooca ฟังอยู่' }], chips: [] };
    case 'stuck':
      return { msgs: [{ from: 'mooca', text: L === 'en' ? `That’s okay. Start with the moment today you felt most ${c.word.toLowerCase()}. Where were you?` : `ไม่เป็นไรเลย ลองเริ่มจากช่วงที่รู้สึก${c.word}มากที่สุดวันนี้ ตอนนั้นคุณอยู่ที่ไหน` }], chips: [] };
    case 'cope':
      return { msgs: [{ from: 'mooca', text: pick(COPE[c.tone] ?? COPE.none, L) }], chips: ['more', 'done'] };
    case 'listen':
      return { msgs: [{ from: 'mooca', text: L === 'en' ? 'Of course. I’m right here. You don’t need to fix anything. Sometimes just saying it makes it lighter.' : 'ได้เลย Mooca อยู่ตรงนี้ ไม่ต้องหาทางแก้ก็ได้ บางวันแค่ได้พูดออกมาก็เบาลงแล้ว' }], chips: [] };
    case 'ex':
      return { msgs: [{ from: 'mooca', text: L === 'en' ? 'Let’s do it together. One minute.' : 'มาลองด้วยกันนะ แค่ 1 นาที', kind: 'ex' }], chips: ['more', 'done'] };
    case 'done':
      return { msgs: [{ from: 'mooca', text: L === 'en' ? 'Thank you for sharing today. You did well. Come back and talk any time.' : 'ขอบคุณที่เล่าให้ฟังนะ วันนี้คุณทำดีแล้ว กลับมาคุยกันได้ทุกเมื่อ' }], chips: [] };
  }
}

/** a typed message: safety first, then name what it's about, then one gentle question */
export function onText(text: string, c: ChatCtx, n: number): Turn {
  const L = c.lang;
  if (isRisk(text)) {
    return {
      msgs: [{ from: 'mooca', kind: 'safety', text: L === 'en'
        ? 'Thank you for telling me. This sounds really heavy, and you don’t have to carry it alone. Please talk to someone right now: the mental health hotline 1323 is free, 24 hours a day.'
        : 'ขอบคุณที่บอก Mooca นะ เรื่องนี้หนักมาก และคุณไม่ต้องแบกไว้คนเดียว อยากให้คุยกับคนที่ช่วยได้ตอนนี้เลย โทรสายด่วนสุขภาพจิต 1323 ฟรี ตลอด 24 ชั่วโมง' }],
      chips: [],
    };
  }
  // what Mooca heard (the feeling, the topic) and one question about it; see data/mooca.ts
  const mood = moodOf(c.tone, c.lv);
  const r = moocaReply(text, { lang: L, mood, word: c.word, n, topicHint: c.ctxId, history: c.history });
  const msgs: Omit<Msg, 'id'>[] = [{ from: 'mooca', text: r.say }];
  if (r.ask) msgs.push({ from: 'mooca', text: r.ask });
  // venting before the summary: after the second message Mooca thanks them and offers the summary
  // (no new question: they answered Mooca's question, so Mooca acknowledges it, wraps up and heads to the summary)
  if (c.vent && n === 1) {
    return {
      msgs: [{ from: 'mooca', text: r.say }, { from: 'mooca', kind: 'wrap', text: L === 'en' ? 'Thank you for telling me all this. I’ve got it. Let me sum up today for you.' : 'ขอบคุณที่เล่าให้ฟังนะ Mooca เข้าใจแล้ว เดี๋ยวสรุปวันนี้ให้นะ' }],
      chips: [],
    };
  }
  // after a few turns on a heavy day, offer a real person
  if (n === 2 && c.lv >= 1 && mood === 'heavy') msgs.push({ from: 'mooca', kind: 'ooca', text: L === 'en' ? 'If you’d like to talk this through with a real person, a psychologist on ooca is ready to listen.' : 'ถ้าอยากคุยเรื่องนี้กับคนจริงๆ นักจิตวิทยาบน ooca พร้อมฟังคุณเสมอนะ' });
  return { msgs, chips: n >= 1 ? ['cope', 'more', 'done'] : [] };
}

/* ---------- demo days for the mock sign-in ---------- */
// a believable month: mostly work stress with some calm days, so the shelf has something to show
const DEMO: [number, Tone['id'], string, string, string, number][] = [
  [28, 'green', 'ผ่อนคลาย', 'self', 'today', 0], [26, 'orange', 'กังวล', 'work', 'today', 1], [25, 'orange', 'กดดัน', 'work', 'days', 1],
  [23, 'yellow', 'ภูมิใจ', 'work', 'today', 0], [21, 'blue', 'เหนื่อยล้า', 'work', 'days', 1], [19, 'green', 'อุ่นใจ', 'people', 'today', 0],
  [17, 'orange', 'เครียด', 'work', 'week', 2], [15, 'blue', 'เหงา', 'people', 'days', 1], [13, 'yellow', 'สนุก', 'people', 'today', 0],
  [11, 'orange', 'หงุดหงิด', 'body', 'today', 1], [9, 'green', 'พอใจ', 'self', 'days', 0], [6, 'blue', 'หมดไฟ', 'work', 'week', 2],
  [4, 'orange', 'กังวล', 'money', 'days', 1], [2, 'green', 'สบายใจ', 'people', 'today', 0], [1, 'yellow', 'มีหวัง', 'self', 'today', 0],
];
export function demoCheckins(now: number) {
  return DEMO.map(([daysAgo, tone, w, ctx, dur, lv]) => {
    const d = new Date(now - daysAgo * 864e5); d.setHours(19 + (daysAgo % 3), (daysAgo * 7) % 60, 0, 0);
    const ex = EX_TONE[tone];
    // sample heaviness: a step or two lighter by the end on most days
    const before = lv === 0 ? 2 : 3 + Math.min(lv, 2), after = Math.max(1, before - (daysAgo % 3 === 0 ? 0 : daysAgo % 2 ? 1 : 2));
    return { at: +d, tone, words: [w], lv, ctx, dur, demo: true, heavy: { before, after }, ...(daysAgo % 2 ? { ex, after: 'better' as const } : {}) };
  });
}

export const exerciseName = (id: keyof typeof EXERCISES, lang: Lang) => EXERCISES[id][lang].t;

/* ---------- the need behind the feeling (Nonviolent Communication: feelings point at needs) ---------- */
// one short need per word, so the card says something new: not only what you feel, but what you may need
const NEED: Record<string, T2> = {
  'ตื่นเต้น': { th: 'สิ่งใหม่ที่มีความหมาย', en: 'something new that matters' },
  'ภูมิใจ': { th: 'การได้เห็นคุณค่าของตัวเอง', en: 'seeing your own worth' },
  'มีหวัง': { th: 'ทิศทางที่ชัดเจน', en: 'a clear direction' },
  'สนุก': { th: 'การได้เล่นและปล่อยตัว', en: 'play and letting go' },
  'อิ่มใจ': { th: 'การได้รับความใส่ใจ', en: 'being cared for' },
  'มั่นใจ': { th: 'ความรู้สึกว่าตัวเองทำได้', en: 'knowing you can do it' },
  'โล่งใจ': { th: 'ความปลอดภัย', en: 'safety' },
  'กระตือรือร้น': { th: 'การได้ลงมือสร้างอะไรสักอย่าง', en: 'making something happen' },
  'ผ่อนคลาย': { th: 'การพัก', en: 'rest' },
  'พอใจ': { th: 'ความลงตัว', en: 'balance' },
  'อุ่นใจ': { th: 'การมีใครสักคนอยู่ข้างๆ', en: 'someone by your side' },
  'สบายใจ': { th: 'ความสงบ', en: 'peace' },
  'ปลอดภัย': { th: 'ความมั่นคง', en: 'stability' },
  'ซาบซึ้ง': { th: 'การได้เชื่อมโยงกับคนอื่น', en: 'connection' },
  'เบาสบาย': { th: 'อิสระ', en: 'freedom' },
  'มีสมาธิ': { th: 'ความชัดเจน', en: 'clarity' },
  'กังวล': { th: 'ความแน่นอน', en: 'certainty' },
  'หงุดหงิด': { th: 'ความราบรื่น และขอบเขตที่คนอื่นเคารพ', en: 'ease, and boundaries others respect' },
  'กดดัน': { th: 'คนช่วยแบ่งเบา และความคาดหวังที่พอดี', en: 'support, and expectations that fit' },
  'เครียด': { th: 'พื้นที่ให้หายใจ', en: 'room to breathe' },
  'โกรธ': { th: 'ความยุติธรรม และการถูกเคารพ', en: 'fairness and respect' },
  'ตื่นตระหนก': { th: 'ความปลอดภัย ณ ตอนนี้', en: 'safety, right now' },
  'อิจฉา': { th: 'การได้เติบโตในแบบของตัวเอง', en: 'growing in your own way' },
  'ไม่มั่นใจตัวเอง': { th: 'การยอมรับในตัวเอง', en: 'accepting yourself' },
  'อับอาย': { th: 'การเป็นที่ยอมรับ', en: 'belonging' },
  'เหนื่อยล้า': { th: 'การพักจริงๆ', en: 'real rest' },
  'หมดไฟ': { th: 'ความหมาย และการได้เติมพลัง', en: 'meaning, and time to refill' },
  'เศร้า': { th: 'ความเข้าใจ และเวลาให้ใจ', en: 'understanding, and time to heal' },
  'เหงา': { th: 'การได้เชื่อมโยงกับใครสักคน', en: 'connection with someone' },
  'ท้อ': { th: 'การเห็นว่าตัวเองก้าวหน้า', en: 'seeing your progress' },
  'เบื่อ': { th: 'ความท้าทายใหม่', en: 'a new challenge' },
  'ผิดหวัง': { th: 'การยอมรับว่าคุณพยายามเต็มที่แล้ว', en: 'knowing your effort counted' },
  'ว่างเปล่า': { th: 'ความหมาย', en: 'meaning' },
  'รู้สึกผิด': { th: 'การได้แก้ไข และให้อภัยตัวเอง', en: 'making it right, and forgiving yourself' },
};
/** "Behind feeling worried there's often a need for certainty" — null for "can't name it yet" */
export function needOf(word: string | undefined, lang: Lang): string | null {
  const n = word ? NEED[word] : undefined;
  return n ? pick(n, lang) : null;
}

/** the words they typed while venting (not the quick-reply chips), longest first */
export function ownWords(chat: { from: string; text: string }[], lang: Lang): string | null {
  const chips = (Object.keys(CHIP) as ChipId[]).map(id => chipText(id, lang));
  // skip keyboard mashing ("ๆไกๆไกๆ"): a real sentence uses more than a handful of different letters
  const real = (t: string) => new Set([...t.replace(/\s/g, '')]).size >= 6;
  const mine = chat.filter(m => m.from === 'me' && !chips.includes(m.text) && !isRisk(m.text)).map(m => m.text.trim()).filter(real);
  if (!mine.length) return null;
  const best = mine.reduce((a, b) => (b.length > a.length ? b : a));
  return best.length > 90 ? `${best.slice(0, 88)}…` : best;
}
