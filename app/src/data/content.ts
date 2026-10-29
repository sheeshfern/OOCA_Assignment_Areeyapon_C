// Content for the check-in: feeling tones and words, topics, durations. Thai is the base text;
// `en` holds the English copy and loc() swaps it in. Generated from web/index.html, then kept by hand.
import { IMG } from './images';
import type { Tone, Option, Duration, Word } from './types';

// level: 0 = feel-good, 1 = light, 2 = medium, 3 = professional first. risk → safety screen
export const TONES: Tone[] = [
  { id: "yellow", label: "สดใส มีแรง", eg: "เช่น ตื่นเต้น ภูมิใจ มีหวัง", zone: "#F9A000", solid: "#A35F00", bg: "#F8E4B3", ink: "#9A5B00", line: "#F4D280", img: IMG.happy, reply: "ดีใจด้วยนะ ไปต่อกัน",
    en: { label: "Bright and lively", eg: "like excited, proud, hopeful", reply: "So glad! Let’s go on" },
    words: [
      { w: "ตื่นเต้น", m: "ใจเต้นแรง เพราะรอสิ่งที่อยากให้เกิด", c: "มีเรื่องใหม่ที่คุณตั้งตารอ", a: "เขียนถึงสิ่งที่รออยู่ ว่าอยากให้ออกมาแบบไหน", lv: 0,
        en: { w: "Excited", m: "your heart races as you wait for something you want", c: "Something new is coming that you’re looking forward to.", a: "Write about what’s coming and how you hope it goes" } },
      { w: "ภูมิใจ", m: "รู้สึกดีกับสิ่งที่ตัวเองทำได้", c: "คุณเพิ่งทำบางอย่างได้ด้วยตัวเอง", a: "เขียนสิ่งที่ทำได้วันนี้ และทำได้เพราะอะไร", lv: 0,
        en: { w: "Proud", m: "feeling good about something you managed to do", c: "You just pulled something off on your own.", a: "Write what you did today and what made it work" } },
      { w: "มีหวัง", m: "เชื่อว่าสิ่งดีๆ กำลังจะมา", c: "คุณเริ่มเห็นทางไปต่อ", a: "เขียน 1 ก้าวเล็กๆ ที่จะทำต่อพรุ่งนี้", lv: 0,
        en: { w: "Hopeful", m: "believing good things are on the way", c: "You’re starting to see a way forward.", a: "Write 1 small step you’ll take tomorrow" } },
      { w: "สนุก", m: "ได้อยู่กับสิ่งตรงหน้าเต็มที่ จนลืมเวลา", c: "คุณได้ทำสิ่งที่ชอบ", a: "เขียนว่าอะไรทำให้สนุก ไว้กลับมาอ่านวันที่เหนื่อย", lv: 0,
        en: { w: "Having fun", m: "so into the moment you lose track of time", c: "You got to do something you love.", a: "Write what made it fun, to reread on a tiring day" } },
      { w: "อิ่มใจ", m: "รู้สึกเต็มอิ่ม กับสิ่งที่ได้รับ", c: "มีใครหรืออะไรบางอย่างดีกับคุณ", a: "เขียนขอบคุณคนที่ทำให้อิ่มใจ จะส่งหรือไม่ก็ได้", lv: 0,
        en: { w: "Fulfilled", m: "full and warm from what you’ve been given", c: "Someone or something has been good to you.", a: "Write a thank-you to them, and send it only if you want" } },
      { w: "มั่นใจ", m: "เชื่อว่าตัวเองรับมือได้", c: "คุณเตรียมตัวมาดี", a: "เขียนว่าอะไรทำให้มั่นใจ ไว้อ่านวันที่ใจแผ่ว", lv: 0,
        en: { w: "Confident", m: "trusting that you can handle it", c: "You came well prepared.", a: "Write what makes you confident, for shaky days" } }
    ],
    more: [
      { w: "โล่งใจ", m: "เรื่องที่ค้างอยู่ คลี่คลายแล้ว", c: "เรื่องที่กังวลผ่านไปแล้ว", a: "เขียนว่าเรื่องไหนผ่านไปแล้ว และคุณผ่านมาได้ยังไง", lv: 0,
        en: { w: "Relieved", m: "something that was hanging over you is settled", c: "The thing you were worried about is behind you.", a: "Write what you got through and how you did it" } },
      { w: "กระตือรือร้น", m: "อยากลงมือทำทันที", c: "คุณมีเป้าหมายที่ชัด", a: "เขียนสิ่งแรกที่จะลงมือทำ ตอนที่ไฟยังแรง", lv: 0,
        en: { w: "Eager", m: "wanting to get started right away", c: "You have a clear goal.", a: "Write your first step while you’re fired up" } }
    ] },
  { id: "green", label: "สงบ สบายใจ", eg: "เช่น ผ่อนคลาย พอใจ อุ่นใจ", zone: "#6DC849", solid: "#2F7A12", bg: "#DCF3D1", ink: "#2F6B16", line: "#C5ECB3", img: IMG.hug, reply: "ดีจังเลย ไปต่อกัน",
    en: { label: "Calm and at ease", eg: "like relaxed, content, comforted", reply: "Lovely. Let’s go on" },
    words: [
      { w: "ผ่อนคลาย", m: "ร่างกายและใจ ไม่ต้องรีบ", c: "คุณได้พักอย่างที่ต้องการ", a: "เขียนว่าตอนนี้ ร่างกายสบายตรงไหนบ้าง", lv: 0,
        en: { w: "Relaxed", m: "your body and mind don’t need to rush", c: "You got the rest you needed.", a: "Write where your body feels at ease right now" } },
      { w: "พอใจ", m: "สิ่งที่มีอยู่ ก็ดีพอแล้ว", c: "หลายอย่างเป็นไปตามที่หวัง", a: "เขียน 1 อย่างเล็กๆ ที่ทำให้วันนี้ดีพอ", lv: 0,
        en: { w: "Content", m: "what you have feels like enough", c: "Things went the way you hoped.", a: "Write 1 small thing that made today good enough" } },
      { w: "อุ่นใจ", m: "รู้สึกว่ามีคนอยู่ข้างๆ", c: "มีคนที่คุณไว้ใจอยู่ใกล้", a: "เขียนถึงคนที่ทำให้อุ่นใจ อยากบอกอะไรเขา", lv: 0,
        en: { w: "Comforted", m: "feeling that someone is by your side", c: "Someone you trust is close by.", a: "Write to someone who comforts you" } },
      { w: "สบายใจ", m: "ไม่มีอะไรค้างคาใจ", c: "เรื่องที่ห่วงคลี่คลายแล้ว", a: "เขียนไว้ว่าวันนี้ อะไรทำให้ใจสบาย", lv: 0,
        en: { w: "At ease", m: "nothing is weighing on your mind", c: "What you were worried about has worked out.", a: "Write what put your mind at ease today" } },
      { w: "ปลอดภัย", m: "ไม่ต้องคอยระวังตัว", c: "คุณอยู่กับคนหรือที่ที่ไว้ใจได้", a: "เขียนว่าที่ไหนหรือใคร ทำให้รู้สึกปลอดภัย", lv: 0,
        en: { w: "Safe", m: "no need to stay on guard", c: "You’re with people or in a place you trust.", a: "Write where or who makes you feel safe" } },
      { w: "ซาบซึ้ง", m: "ใจอ่อนลง เพราะความดีของใครบางคน", c: "มีคนทำสิ่งดีๆ ให้คุณ", a: "เขียนเล่าช่วงเวลานั้น ให้ละเอียดที่สุด", lv: 0,
        en: { w: "Touched", m: "your heart softens because of someone’s kindness", c: "Someone did something kind for you.", a: "Write about that moment in as much detail as you can" } }
    ],
    more: [
      { w: "เบาสบาย", m: "ใจโล่ง ไม่มีอะไรถ่วง", c: "คุณวางบางอย่างลงได้แล้ว", a: "เขียนว่าวางอะไรลงได้ ใจถึงเบาแบบนี้", lv: 0,
        en: { w: "Carefree", m: "your mind feels clear, with nothing holding you down", c: "You’ve set something down.", a: "Write what you let go of to feel this light" } },
      { w: "มีสมาธิ", m: "จดจ่อกับสิ่งตรงหน้าได้ดี", c: "คุณอยู่ในจังหวะที่ใช่", a: "เขียนว่าอะไรช่วยให้มีสมาธิ จะได้ใช้อีก", lv: 0,
        en: { w: "Focused", m: "able to stay with what’s in front of you", c: "You’ve found the right rhythm.", a: "Write what helps you focus, so you can use it again" } }
    ] },
  { id: "orange", label: "ร้อนรน ไม่สบายใจ", eg: "เช่น กังวล หงุดหงิด กดดัน", zone: "#FF7233", solid: "#B9500F", bg: "#FFDDC9", ink: "#A04A12", line: "#FFC7A5", img: IMG.anxious, reply: "เข้าใจเลย ค่อยๆ ไปนะ",
    en: { label: "Tense and uneasy", eg: "like worried, irritated, pressured", reply: "I hear you. No rush" },
    words: [
      { w: "กังวล", m: "ใจวิ่งไปคิดล่วงหน้า ถึงเรื่องที่ยังไม่เกิด", c: "มีเรื่องที่ยังไม่รู้ผล", a: "เขียนเรื่องที่กังวล แล้วดูว่าข้อไหนพอทำอะไรได้", lv: 1,
        en: { w: "Worried", m: "your mind races ahead to things that haven’t happened yet", c: "You’re waiting to see how something turns out.", a: "Write your worries. Which can you act on?" } },
      { w: "หงุดหงิด", m: "ใจขุ่นง่าย เรื่องเล็กๆ ก็กวนใจ", c: "มีบางอย่างขวางสิ่งที่คุณอยากทำ", a: "เขียนว่าอะไรกวนใจ และคุณต้องการอะไรตอนนี้", lv: 1,
        en: { w: "Irritated", m: "easily annoyed, even small things get to you", c: "Something is getting in the way of what you want to do.", a: "Write what’s bugging you and what you need" } },
      { w: "กดดัน", m: "รู้สึกเหมือนต้องทำให้ได้ ห้ามพลาด", c: "ความคาดหวังมากกว่าเวลาหรือแรงที่มี", a: "เขียนเรื่องที่ค้างอยู่ แล้วเลือกมาเรื่องเดียวก่อน", lv: 1,
        en: { w: "Pressured", m: "feeling you have to get it right, with no room for mistakes", c: "Expectations are bigger than your time or energy.", a: "Write what’s piling up, then pick just one to start" } },
      { w: "เครียด", m: "ร่างกายตึง ใจไม่ได้พัก", c: "หลายเรื่องเข้ามาพร้อมกัน", a: "เขียนทุกเรื่องในหัวออกมา ไม่ต้องเรียง ไม่ต้องสวย", lv: 2,
        en: { w: "Stressed", m: "your body is tense and your mind gets no rest", c: "A lot is hitting you at once.", a: "Write out everything on your mind, messy is fine" } },
      { w: "โกรธ", m: "รู้สึกว่าถูกทำไม่ยุติธรรม", c: "มีคนหรือบางอย่างล้ำเส้นของคุณ", a: "เขียนว่าเกิดอะไรขึ้น และคุณอยากให้เป็นแบบไหน", lv: 1,
        en: { w: "Angry", m: "feeling you’ve been treated unfairly", c: "Someone or something crossed your line.", a: "Write what happened and what you need" } },
      { w: "ตื่นตระหนก", m: "ใจเต้นแรง กลัวจนตั้งตัวไม่ทัน", c: "บางอย่างทำให้รู้สึกไม่ปลอดภัย", a: "ค่อยๆ เขียนสิ่งที่เห็นรอบตัว 5 อย่าง", lv: 2,
        en: { w: "Panicked", m: "your heart pounds and fear hits before you can steady yourself", c: "Something made you feel unsafe.", a: "Slowly write 5 things you can see around you" } }
    ],
    more: [
      { w: "อิจฉา", m: "อยากมีบ้าง เวลาเห็นสิ่งดีๆ ของคนอื่น", c: "เผลอเอาตัวเองไปเทียบกับคนอื่น", a: "เขียนว่าอยากมีอะไรแบบเขา และก้าวแรกคืออะไร", lv: 1,
        en: { w: "Envious", m: "wishing you had the good things you see others have", c: "You caught yourself comparing with someone else.", a: "Write what you wish you had, and a first step" } },
      { w: "ไม่มั่นใจตัวเอง", m: "ไม่แน่ใจว่าตัวเองดีพอ", c: "มีบางอย่างทำให้คุณสงสัยในตัวเอง", a: "เขียนถึงครั้งที่คุณผ่านเรื่องยากมาได้", lv: 2,
        en: { w: "Insecure", m: "not sure you’re good enough", c: "Something made you doubt yourself.", a: "Write about a time you got through something hard" } },
      { w: "อับอาย", m: "อยากหลบจากสายตาคนอื่น", c: "กลัวว่าคนอื่นจะมองเราไม่ดี", a: "เขียนถึงตัวเอง แบบที่จะปลอบเพื่อนสนิท", lv: 2,
        en: { w: "Ashamed", m: "wanting to hide from other people’s eyes", c: "You’re afraid others will think badly of you.", a: "Write to yourself like you’d comfort a friend" } }
    ] },
  { id: "blue", label: "หนักใจ หมดแรง", eg: "เช่น เหนื่อย เศร้า เหงา", zone: "#1F77DF", solid: "#1A68C7", bg: "#E4EFFB", ink: "#0A47CA", line: "#C7DDF7", img: IMG.sad, reply: "ขอบคุณที่บอกนะ",
    en: { label: "Heavy and drained", eg: "like tired, sad, lonely", reply: "Thanks for telling me" },
    words: [
      { w: "เหนื่อยล้า", m: "แรงกายแรงใจ เหลือน้อย", c: "คุณใช้แรงมาต่อเนื่อง ยังไม่ได้พักจริงๆ", a: "เขียนว่าวันนี้เหนื่อยกับอะไร แล้วพักก่อนนะ", lv: 1,
        en: { w: "Worn out", m: "little energy left in your body or mind", c: "You’ve kept going without real rest.", a: "Write what wore you out today, then rest a little" } },
      { w: "หมดไฟ", m: "ไม่มีแรงใจ ทำสิ่งที่เคยทำ", c: "คุณให้แรงออกไป มากกว่าที่ได้เติมกลับ", a: "เขียน 1 อย่างที่ดูดพลัง กับ 1 อย่างที่เติมพลัง", lv: 2,
        en: { w: "Burned out", m: "no drive left for things you used to do", c: "You’ve been giving more than you get back.", a: "Write 1 thing that drains you, 1 that fuels you" } },
      { w: "เศร้า", m: "ใจหนัก เพราะเสียบางอย่างไป", c: "มีสิ่งสำคัญหายไป หรือไม่เป็นอย่างที่หวัง", a: "เศร้าได้นะ เขียนสิ่งที่อยู่ในใจ ไม่ต้องรีบหาย", lv: 2,
        en: { w: "Sad", m: "a heavy heart because you’ve lost something", c: "Something important is gone, or didn’t turn out as you hoped.", a: "It’s okay to be sad. Write what’s on your heart" } },
      { w: "เหงา", m: "อยากมีใครสักคนที่เข้าใจ", c: "คุณรู้สึกห่างจากคนรอบตัว", a: "เขียนข้อความถึงคนที่คิดถึง จะส่งหรือไม่ก็ได้", lv: 1,
        en: { w: "Lonely", m: "wishing for someone who understands you", c: "You feel far from the people around you.", a: "Write to someone you miss, and send it only if you want" } },
      { w: "ท้อ", m: "อยากหยุด เพราะทำแล้วไม่เห็นผล", c: "คุณพยายามมานาน แต่ยังไม่ได้อย่างที่หวัง", a: "เขียนก้าวที่เล็กที่สุด ที่ทำได้วันนี้", lv: 1,
        en: { w: "Discouraged", m: "wanting to stop because you can’t see results", c: "You’ve tried for a long time and aren’t there yet.", a: "Write the smallest step you can take today" } },
      { w: "เบื่อ", m: "ทุกอย่างดูจืด ไม่อยากทำอะไร", c: "สิ่งที่ทำซ้ำๆ ไม่ได้เติมใจแล้ว", a: "เขียน 1 อย่างเล็กๆ ที่อยากลองทำต่างไปวันนี้", lv: 1,
        en: { w: "Bored", m: "everything feels flat and nothing appeals", c: "The same routine isn’t filling you up anymore.", a: "Write 1 small thing you’d like to do differently today" } }
    ],
    more: [
      { w: "ผิดหวัง", m: "สิ่งที่เกิด ไม่เป็นอย่างที่หวัง", c: "สิ่งที่ตั้งใจไว้ ไม่เป็นไปตามคาด", a: "เขียนว่าหวังอะไรไว้ คุณพยายามเต็มที่แล้วนะ", lv: 1,
        en: { w: "Let down", m: "things didn’t turn out how you hoped", c: "What you aimed for didn’t go as planned.", a: "Write what you hoped for. You did your best" } },
      { w: "ว่างเปล่า", m: "ข้างในเงียบ ไม่รู้สึกอะไร", c: "ใจอาจเหนื่อย จนพักการรู้สึกไว้ก่อน", a: "เขียนอะไรก็ได้ที่อยู่ในหัว แค่คำเดียวก็พอ", lv: 2,
        en: { w: "Empty", m: "quiet inside, like you don’t feel much", c: "Your heart may be tired and taking a break from feeling.", a: "Write anything in your head, even just one word" } },
      { w: "รู้สึกผิด", m: "ใจโทษตัวเอง ว่าทำให้บางอย่างแย่ลง", c: "คุณใส่ใจคนอื่น และสิ่งที่ทำมาก", a: "เขียนว่าเกิดอะไรขึ้น และอยากแก้ตรงไหน", lv: 2,
        en: { w: "Guilty", m: "blaming yourself for making something worse", c: "You care a lot about other people and what you do.", a: "Write what happened and what you can fix" } },
      { w: "สิ้นหวัง", m: "มองไม่เห็นทางที่จะดีขึ้น", risk: true,
        en: { w: "Hopeless", m: "can’t see any way things will get better" } },
      { w: "เหนื่อยจนไม่อยากไปต่อ", m: "หมดแรงจนไม่อยากมีชีวิตอยู่ต่อ", risk: true,
        en: { w: "Too tired to go on", m: "so worn out you don’t want to keep living" } }
    ] }
];

export const CONTEXTS: Option[] = [
  { id: "work", label: "งานหรือการเรียน", say: "เรื่องงานหรือการเรียน", en: { label: "Work or study", say: "Work or study." } },
  { id: "people", label: "คนรอบตัว", say: "เรื่องคนรอบตัว", en: { label: "People around me", say: "People around you." } },
  { id: "self", label: "ตัวเอง", say: "เรื่องของตัวเอง", en: { label: "Myself", say: "Something personal." } },
  { id: "body", label: "สุขภาพร่างกาย", say: "เรื่องสุขภาพร่างกาย", en: { label: "Physical health", say: "Your health." } },
  { id: "money", label: "การเงิน", say: "เรื่องการเงิน", en: { label: "Money", say: "Money." } },
  { id: "unsure", label: "ไม่แน่ใจ", say: null, en: { label: "Not sure" } }
];

export const DURATIONS: Duration[] = [
  { id: "today", label: "เพิ่งเป็นวันนี้", say: "เพิ่งเริ่มเป็นวันนี้", floor: 0, en: { label: "Just today", say: "Started today" } },
  { id: "days", label: "2–3 วัน", say: "เป็นมา 2–3 วันแล้ว", floor: 0, en: { label: "2–3 days", say: "It’s been 2–3 days" } },
  { id: "week", label: "ราว 1–2 สัปดาห์", say: "เป็นมาราว 1–2 สัปดาห์แล้ว", floor: 2, en: { label: "About 1–2 weeks", say: "About 1–2 weeks now" } },
  { id: "long", label: "นานกว่า 2 สัปดาห์", say: "เป็นมานานกว่า 2 สัปดาห์แล้ว", floor: 3, en: { label: "Over 2 weeks", say: "More than 2 weeks now" } },
  { id: "unsure", label: "ไม่แน่ใจ", say: null, floor: 0, en: { label: "Not sure" } }
];

// when every picked word is a good feeling, ข้อ 4 asks how long the good feeling has stayed instead of screening a problem
export const DURATIONS_GOOD: Duration[] = [
  { id: "today", label: "เพิ่งรู้สึกวันนี้", say: "เพิ่งรู้สึกดีแบบนี้วันนี้", floor: 0, en: { label: "Just today", say: "Feeling this good since today" } },
  { id: "days", label: "2–3 วันแล้ว", say: "รู้สึกดีแบบนี้มา 2–3 วันแล้ว", floor: 0, en: { label: "2–3 days now", say: "Feeling this good for 2–3 days" } },
  { id: "week", label: "ทั้งสัปดาห์เลย", say: "รู้สึกดีแบบนี้มาทั้งสัปดาห์", floor: 0, en: { label: "All week", say: "Feeling this good all week" } },
  { id: "long", label: "มาสักพักแล้ว", say: "รู้สึกดีแบบนี้มาสักพักแล้ว", floor: 0, en: { label: "A while now", say: "Feeling this good for a while" } },
  { id: "unsure", label: "ไม่แน่ใจ", say: null, floor: 0, en: { label: "Not sure" } }
];

export const NEUTRAL: Word = { w: "ยังบอกไม่ถูก", m: "บางความรู้สึกต้องใช้เวลา กว่าจะเรียกชื่อได้", c: "", a: "เขียนอะไรก็ได้ที่อยู่ในใจ ยังไม่ต้องตั้งชื่อ", lv: 1, en: { w: "Hard to name yet", m: "Some feelings take time before you can name them.", a: "Write anything on your mind, no need to name it yet" } };
