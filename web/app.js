/* ---------- assets ---------- */
const art = name => `assets/mooca/${name}.svg`; // drawn by tools/mooca/build.mjs
const IMG = {
  phone: art('home-sofa'),      // home hero: on the sofa with a notepad, the CI art as drawn
  calm: art('listen'),          // before a feeling is picked: says hi, ready to listen
  happy: art('tone-yellow'),    // bright: arms up in the balloon
  relax: art('tone-green'),     // calm: leaning back on a sunny hill
  anxious: art('tone-orange'),  // uneasy: worried under the umbrella in the rain
  sad: art('tone-blue'),        // heavy: slumped on the moon
  thanks: art('feel-neutral'),  // "can't say yet": a few feelings with no name yet
  hug: art('hug'),              // safety: holds a small cloud close
  doctor: art('doctor'),        // beside the offer to talk to a psychologist
  write: art('write'),          // the 30-second note: writing along
  written: art('written'),      // the note's time is up: shows the page
  logo: 'assets/mindfull-logo.svg'
};
// one pose per feeling word, keyed by the Thai word. The two risk words go to the safety screen, so they have none.
const WORD_POSE = {
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
const ctxArt = (ctx, tone) => art(`ctx-${ctx}-${tone}`);                     // step 3: the scene, with the face of the tone they picked
const durArt = (good, dur) => art(`dur-${good ? 'good' : 'heavy'}-${dur}`);  // step 4: Mooca beside the calendar
const DUR_IDS = ['today', 'days', 'week', 'long', 'unsure'];
// Mooca for the current answers: the word they picked leads, then the tone
const wordArt = p => WORD_POSE[p.w] ?? p.tone.img;
const moocaFor = (fallback) => S.picks.length ? wordArt(S.picks[0]) : S.tone ? S.tone.img : fallback;
const moodTone = () => S.picks[0]?.tone ?? S.tone ?? TONES[3];
const posesFor = () => S.picks.length ? S.picks.map(wordArt) : [IMG.thanks];
const OOCA_URL = 'https://www.ooca.co/';
// ooca wordmark (from ooca-logo-white.svg), cropped to the letters and drawn in currentColor so it follows each button's text colour
const OOCA_LOGO = '<svg class="ooca-logo" viewBox="28 125 2486 769" role="img" aria-label="ooca" fill="currentColor"><path d="M367,221.94c-186.8,0-338.23,150.38-338.23,335.88s151.43,335.89,338.23,335.89,338.24-150.38,338.24-335.89-151.43-335.88-338.24-335.88ZM367,704.66c-81.65,0-147.86-65.74-147.86-146.83s66.2-146.83,147.86-146.83,147.86,65.74,147.86,146.83-66.2,146.83-147.86,146.83Z"/><path d="M1063.81,221.94c-186.8,0-338.24,150.38-338.24,335.88s151.44,335.89,338.24,335.89,338.24-150.38,338.24-335.89-151.43-335.88-338.24-335.88ZM1063.81,704.66c-81.66,0-147.85-65.74-147.85-146.83s66.19-146.83,147.85-146.83,147.85,65.74,147.85,146.83-66.2,146.83-147.85,146.83Z"/><path d="M1786,604.93c-9.91,2.08-20.17,3.19-30.69,3.19-81.66,0-147.86-65.74-147.86-146.83s66.2-146.83,147.86-146.83c34.44,0,66.1,11.72,91.23,31.34,35.27-53.74,83.52-98.31,140.31-129.32-60.51-56.47-141.95-91.08-231.54-91.08-186.81,0-338.24,150.38-338.24,335.89s151.43,335.88,338.24,335.88c34.72,0,68.21-5.2,99.73-14.84-36.63-51.37-61.05-111.91-69.04-177.4Z"/><path d="M2175.14,221.94c-186.81,0-338.24,150.38-338.24,335.88s151.43,335.89,338.24,335.89c51.96,0,101.18-11.67,145.17-32.47v32.54h193.07v-335.96c0-185.5-151.43-335.88-338.24-335.88ZM2175.14,704.66c-81.66,0-147.86-65.74-147.86-146.83s66.2-146.83,147.86-146.83,147.85,65.74,147.85,146.83-66.2,146.83-147.85,146.83Z"/></svg>';
Object.values(IMG).forEach(src => { new Image().src = src; });

/* ---------- content ---------- */
// level: 0 = feel-good, 1 = light, 2 = medium, 3 = professional first. risk → safety screen
const TONES = [
  { id:'yellow', label:'สดใส มีแรง', eg:'เช่น ตื่นเต้น ภูมิใจ มีหวัง', zone:'#E9A400', solid:'#A35F00', bg:'#F8E4B3', ink:'#9A5B00', line:'#F4D280', img:IMG.happy, reply:'ดีใจด้วยนะ ไปต่อกัน',
    words:[
      {w:'ตื่นเต้น', m:'ใจเต้นแรง เพราะรอสิ่งที่อยากให้เกิด', c:'มีเรื่องใหม่ที่คุณตั้งตารอ', a:'เขียนถึงสิ่งที่รออยู่ ว่าอยากให้ออกมาแบบไหน', lv:0},
      {w:'ภูมิใจ', m:'รู้สึกดีกับสิ่งที่ตัวเองทำได้', c:'คุณเพิ่งทำบางอย่างได้ด้วยตัวเอง', a:'เขียนสิ่งที่ทำได้วันนี้ และทำได้เพราะอะไร', lv:0},
      {w:'มีหวัง', m:'เชื่อว่าสิ่งดีๆ กำลังจะมา', c:'คุณเริ่มเห็นทางไปต่อ', a:'เขียน 1 ก้าวเล็กๆ ที่จะทำต่อพรุ่งนี้', lv:0},
      {w:'สนุก', m:'ได้อยู่กับสิ่งตรงหน้าเต็มที่ จนลืมเวลา', c:'คุณได้ทำสิ่งที่ชอบ', a:'เขียนว่าอะไรทำให้สนุก ไว้กลับมาอ่านวันที่เหนื่อย', lv:0},
      {w:'อิ่มใจ', m:'รู้สึกเต็มอิ่ม กับสิ่งที่ได้รับ', c:'มีใครหรืออะไรบางอย่างดีกับคุณ', a:'เขียนขอบคุณคนที่ทำให้อิ่มใจ จะส่งหรือไม่ก็ได้', lv:0},
      {w:'มั่นใจ', m:'เชื่อว่าตัวเองรับมือได้', c:'คุณเตรียมตัวมาดี', a:'เขียนว่าอะไรทำให้มั่นใจ ไว้อ่านวันที่ใจแผ่ว', lv:0}
    ],
    more:[
      {w:'โล่งใจ', m:'เรื่องที่ค้างอยู่ คลี่คลายแล้ว', c:'เรื่องที่กังวลผ่านไปแล้ว', a:'เขียนว่าเรื่องไหนผ่านไปแล้ว และคุณผ่านมาได้ยังไง', lv:0},
      {w:'กระตือรือร้น', m:'อยากลงมือทำทันที', c:'คุณมีเป้าหมายที่ชัด', a:'เขียนสิ่งแรกที่จะลงมือทำ ตอนที่ไฟยังแรง', lv:0}
    ]},
  { id:'green', label:'สงบ สบายใจ', eg:'เช่น ผ่อนคลาย พอใจ อุ่นใจ', zone:'#6DC849', solid:'#2F7A12', bg:'#DCF3D1', ink:'#2F6B16', line:'#C5ECB3', img:IMG.relax, reply:'ดีจังเลย ไปต่อกัน',
    words:[
      {w:'ผ่อนคลาย', m:'ร่างกายและใจ ไม่ต้องรีบ', c:'คุณได้พักอย่างที่ต้องการ', a:'เขียนว่าตอนนี้ ร่างกายสบายตรงไหนบ้าง', lv:0},
      {w:'พอใจ', m:'สิ่งที่มีอยู่ ก็ดีพอแล้ว', c:'หลายอย่างเป็นไปตามที่หวัง', a:'เขียน 1 อย่างเล็กๆ ที่ทำให้วันนี้ดีพอ', lv:0},
      {w:'อุ่นใจ', m:'รู้สึกว่ามีคนอยู่ข้างๆ', c:'มีคนที่คุณไว้ใจอยู่ใกล้', a:'เขียนถึงคนที่ทำให้อุ่นใจ อยากบอกอะไรเขา', lv:0},
      {w:'สบายใจ', m:'ไม่มีอะไรค้างคาใจ', c:'เรื่องที่ห่วงคลี่คลายแล้ว', a:'เขียนไว้ว่าวันนี้ อะไรทำให้ใจสบาย', lv:0},
      {w:'ปลอดภัย', m:'ไม่ต้องคอยระวังตัว', c:'คุณอยู่กับคนหรือที่ที่ไว้ใจได้', a:'เขียนว่าที่ไหนหรือใคร ทำให้รู้สึกปลอดภัย', lv:0},
      {w:'ซาบซึ้ง', m:'ใจอ่อนลง เพราะความดีของใครบางคน', c:'มีคนทำสิ่งดีๆ ให้คุณ', a:'เขียนเล่าช่วงเวลานั้น ให้ละเอียดที่สุด', lv:0}
    ],
    more:[
      {w:'เบาสบาย', m:'ใจโล่ง ไม่มีอะไรถ่วง', c:'คุณวางบางอย่างลงได้แล้ว', a:'เขียนว่าวางอะไรลงได้ ใจถึงเบาแบบนี้', lv:0},
      {w:'มีสมาธิ', m:'จดจ่อกับสิ่งตรงหน้าได้ดี', c:'คุณอยู่ในจังหวะที่ใช่', a:'เขียนว่าอะไรช่วยให้มีสมาธิ จะได้ใช้อีก', lv:0}
    ]},
  { id:'orange', label:'ร้อนรน ไม่สบายใจ', eg:'เช่น กังวล หงุดหงิด กดดัน', zone:'#FF7233', solid:'#B9500F', bg:'#FFDDC9', ink:'#A04A12', line:'#FFC7A5', img:IMG.anxious, reply:'เข้าใจเลย ค่อยๆ ไปนะ',
    words:[
      {w:'กังวล', m:'ใจวิ่งไปคิดล่วงหน้า ถึงเรื่องที่ยังไม่เกิด', c:'มีเรื่องที่ยังไม่รู้ผล', a:'เขียนเรื่องที่กังวล แล้วดูว่าข้อไหนพอทำอะไรได้', lv:1},
      {w:'หงุดหงิด', m:'ใจขุ่นง่าย เรื่องเล็กๆ ก็กวนใจ', c:'มีบางอย่างขวางสิ่งที่คุณอยากทำ', a:'เขียนว่าอะไรกวนใจ และคุณต้องการอะไรตอนนี้', lv:1},
      {w:'กดดัน', m:'รู้สึกเหมือนต้องทำให้ได้ ห้ามพลาด', c:'ความคาดหวังมากกว่าเวลาหรือแรงที่มี', a:'เขียนเรื่องที่ค้างอยู่ แล้วเลือกมาเรื่องเดียวก่อน', lv:1},
      {w:'เครียด', m:'ร่างกายตึง ใจไม่ได้พัก', c:'หลายเรื่องเข้ามาพร้อมกัน', a:'เขียนทุกเรื่องในหัวออกมา ไม่ต้องเรียง ไม่ต้องสวย', lv:2},
      {w:'โกรธ', m:'รู้สึกว่าถูกทำไม่ยุติธรรม', c:'มีคนหรือบางอย่างล้ำเส้นของคุณ', a:'เขียนว่าเกิดอะไรขึ้น และคุณอยากให้เป็นแบบไหน', lv:1},
      {w:'ตื่นตระหนก', m:'ใจเต้นแรง กลัวจนตั้งตัวไม่ทัน', c:'บางอย่างทำให้รู้สึกไม่ปลอดภัย', a:'ค่อยๆ เขียนสิ่งที่เห็นรอบตัว 5 อย่าง', lv:2}
    ],
    more:[
      {w:'อิจฉา', m:'อยากมีบ้าง เวลาเห็นสิ่งดีๆ ของคนอื่น', c:'เผลอเอาตัวเองไปเทียบกับคนอื่น', a:'เขียนว่าอยากมีอะไรแบบเขา และก้าวแรกคืออะไร', lv:1},
      {w:'ไม่มั่นใจตัวเอง', m:'ไม่แน่ใจว่าตัวเองดีพอ', c:'มีบางอย่างทำให้คุณสงสัยในตัวเอง', a:'เขียนถึงครั้งที่คุณผ่านเรื่องยากมาได้', lv:2},
      {w:'อับอาย', m:'อยากหลบจากสายตาคนอื่น', c:'กลัวว่าคนอื่นจะมองเราไม่ดี', a:'เขียนถึงตัวเอง แบบที่จะปลอบเพื่อนสนิท', lv:2}
    ]},
  { id:'blue', label:'หนักใจ หมดแรง', eg:'เช่น เหนื่อย เศร้า เหงา', zone:'#1F77DF', solid:'#1764D7', bg:'#E4EFFB', ink:'#0A47CA', line:'#C7DDF7', img:IMG.sad, reply:'ขอบคุณที่บอกนะ',
    words:[
      {w:'เหนื่อยล้า', m:'แรงกายแรงใจ เหลือน้อย', c:'คุณใช้แรงมาต่อเนื่อง ยังไม่ได้พักจริงๆ', a:'เขียนว่าวันนี้เหนื่อยกับอะไร แล้วพักก่อนนะ', lv:1},
      {w:'หมดไฟ', m:'ไม่มีแรงใจ ทำสิ่งที่เคยทำ', c:'คุณให้แรงออกไป มากกว่าที่ได้เติมกลับ', a:'เขียน 1 อย่างที่ดูดพลัง กับ 1 อย่างที่เติมพลัง', lv:2},
      {w:'เศร้า', m:'ใจหนัก เพราะเสียบางอย่างไป', c:'มีสิ่งสำคัญหายไป หรือไม่เป็นอย่างที่หวัง', a:'เศร้าได้นะ เขียนสิ่งที่อยู่ในใจ ไม่ต้องรีบหาย', lv:2},
      {w:'เหงา', m:'อยากมีใครสักคนที่เข้าใจ', c:'คุณรู้สึกห่างจากคนรอบตัว', a:'เขียนข้อความถึงคนที่คิดถึง จะส่งหรือไม่ก็ได้', lv:1},
      {w:'ท้อ', m:'อยากหยุด เพราะทำแล้วไม่เห็นผล', c:'คุณพยายามมานาน แต่ยังไม่ได้อย่างที่หวัง', a:'เขียนก้าวที่เล็กที่สุด ที่ทำได้วันนี้', lv:1},
      {w:'เบื่อ', m:'ทุกอย่างดูจืด ไม่อยากทำอะไร', c:'สิ่งที่ทำซ้ำๆ ไม่ได้เติมใจแล้ว', a:'เขียน 1 อย่างเล็กๆ ที่อยากลองทำต่างไปวันนี้', lv:1}
    ],
    more:[
      {w:'ผิดหวัง', m:'สิ่งที่เกิด ไม่เป็นอย่างที่หวัง', c:'สิ่งที่ตั้งใจไว้ ไม่เป็นไปตามคาด', a:'เขียนว่าหวังอะไรไว้ คุณพยายามเต็มที่แล้วนะ', lv:1},
      {w:'ว่างเปล่า', m:'ข้างในเงียบ ไม่รู้สึกอะไร', c:'ใจอาจเหนื่อย จนพักการรู้สึกไว้ก่อน', a:'เขียนอะไรก็ได้ที่อยู่ในหัว แค่คำเดียวก็พอ', lv:2},
      {w:'รู้สึกผิด', m:'ใจโทษตัวเอง ว่าทำให้บางอย่างแย่ลง', c:'คุณใส่ใจคนอื่น และสิ่งที่ทำมาก', a:'เขียนว่าเกิดอะไรขึ้น และอยากแก้ตรงไหน', lv:2},
      {w:'สิ้นหวัง', m:'มองไม่เห็นทางที่จะดีขึ้น', risk:true},
      {w:'เหนื่อยจนไม่อยากไปต่อ', m:'หมดแรงจนไม่อยากมีชีวิตอยู่ต่อ', risk:true}
    ]}
];
const CONTEXTS = [
  {id:'work', label:'งานหรือการเรียน', say:'เรื่องงานหรือการเรียน'},
  {id:'people', label:'คนรอบตัว', say:'เรื่องคนรอบตัว'},
  {id:'self', label:'ตัวเอง', say:'เรื่องของตัวเอง'},
  {id:'body', label:'สุขภาพร่างกาย', say:'เรื่องสุขภาพร่างกาย'},
  {id:'money', label:'การเงิน', say:'เรื่องการเงิน'},
  {id:'unsure', label:'ไม่แน่ใจ', say:null}
];
// step 3 stickers: one drawn scene per source (white sticker edge and shadow come from CSS)
const DURATIONS = [
  {id:'today', label:'เพิ่งเป็นวันนี้', say:'เพิ่งเริ่มเป็นวันนี้', floor:0},
  {id:'days', label:'2–3 วัน', say:'เป็นมา 2–3 วันแล้ว', floor:0},
  {id:'week', label:'ราว 1–2 สัปดาห์', say:'เป็นมาราว 1–2 สัปดาห์แล้ว', floor:2},
  {id:'long', label:'นานกว่า 2 สัปดาห์', say:'เป็นมานานกว่า 2 สัปดาห์แล้ว', floor:3},
  {id:'unsure', label:'ไม่แน่ใจ', say:null, floor:0}
];
// when every picked word is a good feeling, ข้อ 4 asks how long the good feeling has stayed instead of screening a problem
const DURATIONS_GOOD = [
  {id:'today', label:'เพิ่งรู้สึกวันนี้', say:'เพิ่งรู้สึกดีแบบนี้วันนี้', floor:0},
  {id:'days', label:'2–3 วันแล้ว', say:'รู้สึกดีแบบนี้มา 2–3 วันแล้ว', floor:0},
  {id:'week', label:'ทั้งสัปดาห์เลย', say:'รู้สึกดีแบบนี้มาทั้งสัปดาห์', floor:0},
  {id:'long', label:'มาสักพักแล้ว', say:'รู้สึกดีแบบนี้มาสักพักแล้ว', floor:0},
  {id:'unsure', label:'ไม่แน่ใจ', say:null, floor:0}
];
const feelsGood = () => S.picks.length > 0 && S.picks.every(p => p.lv === 0);
const durList = () => feelsGood() ? DURATIONS_GOOD : DURATIONS;
const NEUTRAL = {w:'ยังบอกไม่ถูก', m:'บางความรู้สึกต้องใช้เวลา กว่าจะเรียกชื่อได้', c:'', a:'เขียนอะไรก็ได้ที่อยู่ในใจ ยังไม่ต้องตั้งชื่อ', lv:1};

/* ---------- English ---------- */
// same voice as the Thai: a friend talking, short lines, no blame. Keyed by the Thai word / option id and merged in as `en`
const EN = {
  tones: {
    yellow:{label:'Bright and lively', eg:'like excited, proud, hopeful', reply:'So glad! Let’s go on'},
    green:{label:'Calm and at ease', eg:'like relaxed, content, comforted', reply:'Lovely. Let’s go on'},
    orange:{label:'Tense and uneasy', eg:'like worried, irritated, pressured', reply:'I hear you. No rush'},
    blue:{label:'Heavy and drained', eg:'like tired, sad, lonely', reply:'Thanks for telling me'}
  },
  words: {
    'ตื่นเต้น':{w:'Excited', m:'your heart races as you wait for something you want', c:'Something new is coming that you’re looking forward to.', a:'Write about what’s coming and how you hope it goes'},
    'ภูมิใจ':{w:'Proud', m:'feeling good about something you managed to do', c:'You just pulled something off on your own.', a:'Write what you did today and what made it work'},
    'มีหวัง':{w:'Hopeful', m:'believing good things are on the way', c:'You’re starting to see a way forward.', a:'Write 1 small step you’ll take tomorrow'},
    'สนุก':{w:'Having fun', m:'so into the moment you lose track of time', c:'You got to do something you love.', a:'Write what made it fun, to reread on a tiring day'},
    'อิ่มใจ':{w:'Fulfilled', m:'full and warm from what you’ve been given', c:'Someone or something has been good to you.', a:'Write a thank-you to them, and send it only if you want'},
    'มั่นใจ':{w:'Confident', m:'trusting that you can handle it', c:'You came well prepared.', a:'Write what makes you confident, for shaky days'},
    'โล่งใจ':{w:'Relieved', m:'something that was hanging over you is settled', c:'The thing you were worried about is behind you.', a:'Write what you got through and how you did it'},
    'กระตือรือร้น':{w:'Eager', m:'wanting to get started right away', c:'You have a clear goal.', a:'Write your first step while you’re fired up'},
    'ผ่อนคลาย':{w:'Relaxed', m:'your body and mind don’t need to rush', c:'You got the rest you needed.', a:'Write where your body feels at ease right now'},
    'พอใจ':{w:'Content', m:'what you have feels like enough', c:'Things went the way you hoped.', a:'Write 1 small thing that made today good enough'},
    'อุ่นใจ':{w:'Comforted', m:'feeling that someone is by your side', c:'Someone you trust is close by.', a:'Write to someone who comforts you'},
    'สบายใจ':{w:'At ease', m:'nothing is weighing on your mind', c:'What you were worried about has worked out.', a:'Write what put your mind at ease today'},
    'ปลอดภัย':{w:'Safe', m:'no need to stay on guard', c:'You’re with people or in a place you trust.', a:'Write where or who makes you feel safe'},
    'ซาบซึ้ง':{w:'Touched', m:'your heart softens because of someone’s kindness', c:'Someone did something kind for you.', a:'Write about that moment in as much detail as you can'},
    'เบาสบาย':{w:'Carefree', m:'your mind feels clear, with nothing holding you down', c:'You’ve set something down.', a:'Write what you let go of to feel this light'},
    'มีสมาธิ':{w:'Focused', m:'able to stay with what’s in front of you', c:'You’ve found the right rhythm.', a:'Write what helps you focus, so you can use it again'},
    'กังวล':{w:'Worried', m:'your mind races ahead to things that haven’t happened yet', c:'You’re waiting to see how something turns out.', a:'Write your worries. Which can you act on?'},
    'หงุดหงิด':{w:'Irritated', m:'easily annoyed, even small things get to you', c:'Something is getting in the way of what you want to do.', a:'Write what’s bugging you and what you need'},
    'กดดัน':{w:'Pressured', m:'feeling you have to get it right, with no room for mistakes', c:'Expectations are bigger than your time or energy.', a:'Write what’s piling up, then pick just one to start'},
    'เครียด':{w:'Stressed', m:'your body is tense and your mind gets no rest', c:'A lot is hitting you at once.', a:'Write out everything on your mind, messy is fine'},
    'โกรธ':{w:'Angry', m:'feeling you’ve been treated unfairly', c:'Someone or something crossed your line.', a:'Write what happened and what you need'},
    'ตื่นตระหนก':{w:'Panicked', m:'your heart pounds and fear hits before you can steady yourself', c:'Something made you feel unsafe.', a:'Slowly write 5 things you can see around you'},
    'อิจฉา':{w:'Envious', m:'wishing you had the good things you see others have', c:'You caught yourself comparing with someone else.', a:'Write what you wish you had, and a first step'},
    'ไม่มั่นใจตัวเอง':{w:'Insecure', m:'not sure you’re good enough', c:'Something made you doubt yourself.', a:'Write about a time you got through something hard'},
    'อับอาย':{w:'Ashamed', m:'wanting to hide from other people’s eyes', c:'You’re afraid others will think badly of you.', a:'Write to yourself like you’d comfort a friend'},
    'เหนื่อยล้า':{w:'Worn out', m:'little energy left in your body or mind', c:'You’ve kept going without real rest.', a:'Write what wore you out today, then rest a little'},
    'หมดไฟ':{w:'Burned out', m:'no drive left for things you used to do', c:'You’ve been giving more than you get back.', a:'Write 1 thing that drains you, 1 that fuels you'},
    'เศร้า':{w:'Sad', m:'a heavy heart because you’ve lost something', c:'Something important is gone, or didn’t turn out as you hoped.', a:'It’s okay to be sad. Write what’s on your heart'},
    'เหงา':{w:'Lonely', m:'wishing for someone who understands you', c:'You feel far from the people around you.', a:'Write to someone you miss, and send it only if you want'},
    'ท้อ':{w:'Discouraged', m:'wanting to stop because you can’t see results', c:'You’ve tried for a long time and aren’t there yet.', a:'Write the smallest step you can take today'},
    'เบื่อ':{w:'Bored', m:'everything feels flat and nothing appeals', c:'The same routine isn’t filling you up anymore.', a:'Write 1 small thing you’d like to do differently today'},
    'ผิดหวัง':{w:'Let down', m:'things didn’t turn out how you hoped', c:'What you aimed for didn’t go as planned.', a:'Write what you hoped for. You did your best'},
    'ว่างเปล่า':{w:'Empty', m:'quiet inside, like you don’t feel much', c:'Your heart may be tired and taking a break from feeling.', a:'Write anything in your head, even just one word'},
    'รู้สึกผิด':{w:'Guilty', m:'blaming yourself for making something worse', c:'You care a lot about other people and what you do.', a:'Write what happened and what you can fix'},
    'สิ้นหวัง':{w:'Hopeless', m:'can’t see any way things will get better'},
    'เหนื่อยจนไม่อยากไปต่อ':{w:'Too tired to go on', m:'so worn out you don’t want to keep living'}
  },
  neutral:{w:'Hard to name yet', m:'Some feelings take time before you can name them.', a:'Write anything on your mind, no need to name it yet'},
  ctx: {
    work:{label:'Work or study', say:'Work or study.'}, people:{label:'People around me', say:'People around you.'},
    self:{label:'Myself', say:'Something personal.'}, body:{label:'Physical health', say:'Your health.'},
    money:{label:'Money', say:'Money.'}, unsure:{label:'Not sure'}
  },
  dur: {
    today:{label:'Just today', say:'Started today'}, days:{label:'2–3 days', say:'It’s been 2–3 days'},
    week:{label:'About 1–2 weeks', say:'About 1–2 weeks now'}, long:{label:'Over 2 weeks', say:'More than 2 weeks now'}, unsure:{label:'Not sure'}
  },
  durGood: {
    today:{label:'Just today', say:'Feeling this good since today'}, days:{label:'2–3 days now', say:'Feeling this good for 2–3 days'},
    week:{label:'All week', say:'Feeling this good all week'}, long:{label:'A while now', say:'Feeling this good for a while'}, unsure:{label:'Not sure'}
  }
};
TONES.forEach(t => { t.en = EN.tones[t.id]; [...t.words, ...t.more].forEach(x => x.en = EN.words[x.w]); });
CONTEXTS.forEach(c => c.en = EN.ctx[c.id]);
DURATIONS.forEach(d => d.en = EN.dur[d.id]);
DURATIONS_GOOD.forEach(d => d.en = EN.durGood[d.id]);
NEUTRAL.en = EN.neutral;

// interface lines; functions take the bit that changes
const UI = {
  th: {
    title:'ตั้งชื่อความรู้สึก · ooca', desc:'ใช้ 2 นาที ตอบ 4 ข้อสั้นๆ ได้ชื่อความรู้สึกตอนนี้ และวิธีดูแลใจ',
    noSignup:'ไม่ต้องสมัคร', pickOne:'ความรู้สึก ตอนนี้', zone:'พื้นที่ปลอดภัย', hello:['สวัสดี วันนี้ใจเป็นยังไงบ้าง', 'ใช้แค่ 2 นาทีเอง', 'พร้อมเมื่อไหร่ กดเริ่มได้เลย'],
    phoneAlt:'mooca ก้อนเมฆนั่งเล่นบนโซฟา', homeTitle:'2 นาที ตั้งชื่อให้<br><span class="hl">ความรู้สึกตอนนี้</span>',
    homeSub:'ตอบ 4 ข้อสั้นๆ ได้ชื่อความรู้สึก และวิธีดูแลใจ', start:'เริ่มเช็กใจ',
    homeFine:'ถ้ารู้สึกไม่ไหว <a href="tel:1323">โทร 1323</a> ได้ตลอด 24 ชม.',
    back:'ย้อนกลับ', step:n => `ข้อ ${n}/4`, next:'ถัดไป',
    q1:'ตอนนี้ใจเป็นแบบไหน', q1sub:'เลือกที่ใกล้สุด ไม่ต้องเป๊ะ', tonesAria:'โทนความรู้สึก', seeAll:'เลือกไม่ถูก ขอดูทุกคำ',
    q2:'คำไหนตรงกับใจที่สุด', q2sub:['เลือกได้ <span class="nw">1–2 คำ</span>', 'เลือกเพิ่มได้อีก <span class="nw">1 คำ</span>', 'ครบแล้ว กดถัดไปได้เลย'],
    wordsAria:'คำความรู้สึก', meaning:(w, m) => `<b>${w}</b> คือ${m}`, meaningEmpty:'แตะคำเพื่อดูความหมาย', neutralBtn:'ยังบอกไม่ถูก',
    q3:'เรื่องไหนทำให้ใจรู้สึกแบบ\u2060นี้มากที่สุด', q3sub:'เลือกเรื่องที่ใกล้ที่สุดได้เลย', q3done:unsure => `${unsure?'ไม่เป็นไร':'เข้าใจแล้ว'} เหลืออีกข้อ`,
    qGood:'<span class="nw">รู้สึกดีแบบนี้</span><wbr><span class="nw">มานานแค่ไหนแล้ว</span>', qHeavy:'เป็นมานานแค่ไหนแล้ว', durAria:'นานแค่ไหน',
    durSub:'ตอบคร่าวๆ ก็พอ', durPick:'แตะจุดด้านล่างได้เลย', durDoneGood:id => `${{week:'เยี่ยมเลย',long:'ดีใจด้วยนะ',unsure:'ไม่เป็นไร'}[id]||'ดีจัง'} ไปดูการ์ดกัน`,
    durDoneHeavy:id => `${{long:'ขอบคุณนะ',unsure:'ไม่เป็นไร'}[id]||'ได้เลย'} ไปดูการ์ดกัน`, seeCard:'ดูการ์ดของฉัน',
    resTitle:'ความรู้สึกของคุณวันนี้', closeRestart:'ปิดและเริ่มใหม่', feelLb:'ตอนนี้คุณอาจกำลังรู้สึก', nowLb:'ตอนนี้',
    causeLb:'อาจมาจาก', okLb:'ไม่เป็นไรเลย', and:' และ ',
    talk:{1:['', 'ถ้ารู้สึกแบบนี้บ่อยขึ้น คุยกับนักจิตวิทยาได้เสมอ'], 2:['คุยได้เลย ไม่ต้องรอให้หนัก', 'ได้เล่าให้คนที่เข้าใจฟัง ช่วยให้ใจเบาลงได้'], 3:['เป็นมาสักพักแล้ว ลองคุยกับนักจิตวิทยาดูนะ', 'คุณไม่ต้องรับมือเรื่องนี้คนเดียว']},
    cta:`คุยกับนักจิตวิทยา<span class="nw">บน ${OOCA_LOGO}</span>`, writeLb:'ลองเขียนดู · 30 วินาที', openNote:'เปิดโน้ตของฉัน', keepWriting:'เขียนต่อ', writeBtn:'เริ่มเขียน 30 วินาที',
    save:'เก็บการ์ดไว้', restart:'เริ่มใหม่', resFine:'ผลนี้ไม่ใช่การวินิจฉัยทางการแพทย์ · กลับมาเช็กใจได้ทุกเมื่อ',
    hugAlt:'mooca กอดก้อนเมฆน้อยไว้อย่างอ่อนโยน', safeTitle:'ขอบคุณที่บอกให้รู้นะ', safeMsg:'ความรู้สึกนี้หนักมาก และคุณไม่ต้องแบกไว้คนเดียว ตอนนี้มีคนพร้อมฟังคุณอยู่',
    call:'โทรสายด่วนสุขภาพจิต <span class="nw">1323</span>', callSmall:'ฟรี ตลอด 24 ชั่วโมง',
    safeFine:'ถ้าคุณหรือคนใกล้ตัวกำลังอยู่ในอันตราย <a href="tel:1669">โทร 1669</a> ทันที', rePick:'กลับไปเลือกคำใหม่',
    noteClose:'ปิดโน้ต', notePrivate:'โน้ตนี้อยู่ในเครื่องคุณเท่านั้น ไม่ถูกส่งไปไหน', done:'เสร็จแล้ว', placeholder:'เริ่มเขียนได้เลย ไม่ต้องสวย',
    noteEditLb:'โน้ตของคุณ · แก้ได้ตลอด', noteCount:(n, max) => `${n}/${max} ตัวอักษร`, noteFull:'เต็มแล้ว', snipMore:'อ่านทั้งหมด', snipLess:'ย่อโน้ต', timeUp:'ครบ', timeUpMsg:'ครบแล้ว เขียนต่อให้จบได้นะ', saved:'บันทึกรูปการ์ดแล้ว', saveFail:'บันทึกรูปไม่ได้ ลองแคปหน้าจอเก็บไว้แทน',
    saveTitle:'เก็บการ์ดไว้ในเครื่อง', saveShare:'บันทึกรูปลงเครื่อง', saveDownload:'ดาวน์โหลดรูปการ์ด', saveClose:'ปิด',
    saveHint:'หรือกดค้างที่รูป แล้วเลือกบันทึกรูปภาพ', savePrivate:'รูปนี้สร้างในเครื่องคุณ ไม่ถูกส่งไปไหน', cardAlt:'การ์ดความรู้สึกของคุณ'
  },
  en: {
    title:'Name your feeling · ooca', desc:'Take 2 minutes and 4 quick questions to name how you feel and find a way to care for it.',
    noSignup:'No sign-up', pickOne:'How I feel now', zone:'Safe zone', hello:['Hi! How’s your heart?', 'Only takes 2 minutes', 'Ready when you are'],
    phoneAlt:'Mooca the cloud relaxing on a sofa', homeTitle:'2 minutes to name<br><span class="hl">how you feel now</span>',
    homeSub:'4 quick questions to name it and care for it', start:'Start check-in',
    homeFine:'If it’s too much, <a href="tel:1323">call 1323</a> day or night',
    back:'Back', step:n => `${n} of 4`, next:'Next',
    q1:'How do you feel?', q1sub:'No need to be exact', tonesAria:'Feeling tones', seeAll:'Not sure? See every word',
    q2:'Which word fits?', q2sub:['Pick <span class="nw">1 or 2</span> words', 'You can add <span class="nw">1 more</span>', 'All set. Tap Next'],
    wordsAria:'Feeling words', meaning:(w, m) => `<b>${w}</b>: ${m}`, meaningEmpty:'Tap a word to see what it means', neutralBtn:'I can’t name it yet',
    q3:'What makes you feel this most?', q3sub:'Pick the closest one', q3done:unsure => unsure ? 'Okay. One more left' : 'Got it. One more left',
    qGood:'<span class="nw">How long has</span><wbr><span class="nw">it felt this good?</span>', qHeavy:'How long so far?', durAria:'How long', durPick:'Tap a point below',
    durSub:'A rough guess is fine', durDoneGood:id => `${{week:'Great!',long:'So glad!',unsure:'Okay.'}[id]||'Nice!'} Card’s ready`,
    durDoneHeavy:id => `${{long:'Thanks.',unsure:'Okay.'}[id]||'Got it.'} Card’s ready`, seeCard:'See my card',
    resTitle:'Your feelings today', closeRestart:'Close and start over', feelLb:'You might be feeling', nowLb:'Right now',
    causeLb:'It might come from', okLb:'That’s okay', and:' and ',
    talk:{1:['', 'If this keeps coming back, you can always talk to a psychologist.'], 2:['You don’t have to wait until it’s heavy.', 'Talking to someone who understands can help you feel lighter.'], 3:['It’s been a while. Try talking to a psychologist.', 'You don’t have to handle this alone.']},
    cta:`Talk to a psychologist <span class="nw">on ${OOCA_LOGO}</span>`, writeLb:'Try writing · 30 seconds', openNote:'Open my note', keepWriting:'Keep writing', writeBtn:'Write for 30 seconds',
    save:'Save card', restart:'Start over', resFine:'This isn’t a medical diagnosis · Check in again any time',
    hugAlt:'Mooca gently holding a small cloud close', safeTitle:'Thank you for telling me', safeMsg:'This feeling is really heavy, and you don’t have to carry it alone. Someone is ready to listen right now.',
    call:'Call the mental health hotline <span class="nw">1323</span>', callSmall:'Free, 24 hours a day',
    safeFine:'If you or someone near you is in danger, <a href="tel:1669">call 1669</a> now', rePick:'Choose a different word',
    noteClose:'Close note', notePrivate:'This note stays on your device and isn’t sent anywhere', done:'Done', placeholder:'Just start. Messy is fine.',
    noteEditLb:'Your note · edit any time', noteCount:(n, max) => `${n}/${max} characters`, noteFull:'Limit reached', snipMore:'Read all', snipLess:'Show less', timeUp:'Done', timeUpMsg:'Time’s up. Feel free to finish your thought.', saved:'Card image saved', saveFail:'Couldn’t save the image. Try a screenshot instead.',
    saveTitle:'Save your card', saveShare:'Save image', saveDownload:'Download card image', saveClose:'Close',
    saveHint:'Or press and hold the image to save it', savePrivate:'Made on your device. Nothing is sent anywhere.', cardAlt:'Your feeling card'
  }
};
const L = k => UI[S.lang][k];
// the same item in the page's language (Thai is the base text)
const loc = x => S.lang === 'en' && x && x.en ? {...x, ...x.en} : x;
const savedLang = () => { try { return localStorage.getItem('ooca-lang') === 'en' ? 'en' : 'th'; } catch(_) { return 'th'; } };

/* ---------- state ---------- */
const S = { screen:'home', tone:null, picks:[], showAll:false, ctx:null, dur:null, history:[], dir:'fwd', note:'', noteUp:false, noteDone:false, snipOpen:false, lang:savedLang(), at:null };
const app = document.getElementById('app');
const allWords = () => TONES.flatMap(t => [...t.words, ...t.more].map(x => ({...x, tone:t})));

function go(screen){ S.history.push(S.screen); S.screen = screen; S.dir = 'fwd'; render(); }
// going back to choose a feeling starts the answers over: nothing from the last try carries into the next card
function freshAnswers(){ Object.assign(S,{picks:[],ctx:null,dur:null,note:'',noteUp:false,noteDone:false,snipOpen:false,at:null}); }
function back(){ S.screen = S.history.pop() || 'home'; if (['words','tone','home'].includes(S.screen)) freshAnswers(); if (S.screen==='tone'||S.screen==='home'){ S.tone=null; S.showAll=false; } S.dir = 'back'; render(); }
function restart(){ Object.assign(S,{screen:'home',tone:null,picks:[],showAll:false,ctx:null,dur:null,history:[],dir:'back',note:'',noteUp:false,noteDone:false,snipOpen:false,at:null}); render(); }

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// numbers stay with the next word ("2 สัปดาห์")
const ph = s => esc(s).replace(/(\d[\d–]*) /g, '$1 ').split(' ').map(w => `<span class="ph">${w}</span>`).join(' ');
// when a card was made, in the page's language: ["พฤหัสบดี 29 ต.ค. 2569", "14:32 น."] / ["Thu, Oct 29, 2026", "2:32 PM"]
// (Thai drops the "วัน…ที่" wrapper around the weekday so the longest day still fits one line at 320px)
const stampOf = t => { const d = new Date(t), en = S.lang === 'en', loc = en ? 'en-US' : 'th-TH';
  const day = en ? d.toLocaleDateString(loc, {weekday:'short', month:'short', day:'numeric', year:'numeric'})
    : new Intl.DateTimeFormat(loc, {weekday:'long', day:'numeric', month:'short', year:'numeric'}).formatToParts(d)
        .filter(p => p.type !== 'literal').map(p => p.type === 'weekday' ? p.value.replace(/^วัน/, '') : p.value).join(' ');
  return [day, d.toLocaleTimeString(loc, {hour:'numeric', minute:'2-digit'}) + (en ? '' : ' น.')]; };
const ico = {
  back:'<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6l6 6"/></svg>',
  close:'<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>',
  check:'<svg class="ck" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>',
  checkW:'<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>',
  arrow:'<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6l-6 6"/></svg>',
  pen:'<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
  play:'<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16l13 -8z"/></svg>',
  refresh:'<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>',
  cal:'<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M16 3v4M8 3v4M4 11h16"/></svg>',
  save:'<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4v12"/></svg>',
  phone:'<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/></svg>',
  lock:'<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  shield:'<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.6-3 8.3-7 10c-4-1.7-7-5.4-7-10V6z"/><path d="M9 12l2.2 2.2L15.2 10"/></svg>',
  ok:'<svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#E0F8F6"/><path d="M4.8 8.2l2.1 2.1l4.3-4.4" fill="none" stroke="#3F6866" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
// round flags for the language switch: Thailand, and the centre of the Union Jack for English
const FLAG = {
  th:'<svg viewBox="0 0 18 18"><rect width="18" height="18" fill="#A51931"/><rect y="3" width="18" height="12" fill="#F4F5F8"/><rect y="6" width="18" height="6" fill="#2D2A4A"/></svg>',
  en:'<svg viewBox="15 0 30 30"><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" stroke-width="2.4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>'
};
const DOTS = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
// back, "ข้อ n/4" centred, then the segmented progress bar
function topBar(step){
  const bars = [1,2,3,4].map(i => `<span class="${i<=step?'on':''}${i===step?' now':''}"></span>`).join('');
  return `<div class="top"><button class="icon-btn" data-act="back" aria-label="${L('back')}">${ico.back}</button>
  <span class="step-count">${L('step')(step)}</span><span class="top-gap" aria-hidden="true"></span></div>
  <div class="progress" aria-hidden="true">${bars}</div>`;
}
// page-level text that lives outside the rendered screens
function applyLang(){
  document.documentElement.lang = S.lang;
  document.title = 'Assignment_AreeyaponC'; // the tab keeps the assignment name in both languages
  document.querySelector('meta[name="description"]').content = L('desc');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = L(el.dataset.i18n); });
  document.querySelector('[data-note="close"]').setAttribute('aria-label', L('noteClose'));
}
function setLang(lang){
  S.lang = lang;
  try { localStorage.setItem('ooca-lang', lang); } catch(_) {}
  // same-screen render: no entrance replay, focus stays on the switch, only the words ease in
  applyLang(); render();
  app.querySelector('.screen').classList.add('relang');
  if (S.screen === 'home') greet(0);
}
function guide(img, q, sub, tags='', cls=''){
  return `<div class="guide"><span class="mooca"><img class="float" src="${img}" alt=""></span><div class="bubble talks ${cls}">${tags}<h1 tabindex="-1">${q}</h1>${sub?`<p data-swap="sub">${sub}</p>`:''}</div></div>`;
}
const CI_TINT = {yellow:['#FCF4E0','#F8E4B3'], green:['#F1FAED','#DCF3D1'], orange:['#FFF2E9','#FFDDC9'], blue:['#E4EFFB','#C7DDF7'], none:['#E0F8F6','#B3EDE8']};
function setZone(t){
  app.style.setProperty('--zone', t ? t.zone : '#1F77DF');
  app.style.setProperty('--zone-solid', t ? t.solid : '#1764D7');
  app.style.setProperty('--zone-ink', t ? t.ink : '#0A47CA');
  app.style.setProperty('--zone-line', t ? t.line : '#C7DDF7');
  app.style.setProperty('--bg', t ? t.bg : '#E4EFFB');
  // page tints straight from the CI ramps: the 50 step for the page, the 100 step for cards on it
  const ci = CI_TINT[t ? t.id : 'none'];
  app.style.setProperty('--page', ci[0]); app.style.setProperty('--page-2', ci[1]);
}
function toast(msg){
  const el = document.getElementById('toast'); el.textContent = msg; el.hidden = false;
  void el.offsetWidth; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => { el.classList.remove('show'); toast.t = setTimeout(() => el.hidden = true, 300); }, 2400);
}

/* ---------- screens ---------- */
const V = {};
V.home = () => { setZone(null); app.style.setProperty('--bg','#F6F6F6'); return `
<section class="screen home">
  <div class="top"><img class="brand" src="${IMG.logo}" width="123" height="24" alt="mindfull">
    <div class="lang-sw" role="group" aria-label="ภาษา / Language" data-on="${S.lang}"><span class="thumb" aria-hidden="true"></span>
      ${['th','en'].map(l => `<button data-act="lang" data-id="${l}" lang="${l}" aria-pressed="${S.lang===l}"><span class="flag" aria-hidden="true">${FLAG[l]}</span>${l==='th'?'ไทย':'EN'}</button>`).join('')}
    </div></div>
  <div class="hero">${TONES.map((t,i) => `<span class="orb o${i+1}" aria-hidden="true" style="--c:${t.zone}"><i></i>${loc(t).label.split(' ')[0]}</span>`).join('')}<span class="tw t1" aria-hidden="true">✦</span><span class="tw t2" aria-hidden="true">✦</span><div class="say talks" aria-hidden="true">${DOTS}<span>${L('hello')[0]}</span></div><span class="mooca"><span class="mo float"><img src="${IMG.phone}" alt="${L('phoneAlt')}"><i class="eye l" aria-hidden="true"></i><i class="eye r" aria-hidden="true"></i></span></span><span class="zone">${ico.shield}${L('zone')}</span></div>
  <p class="badge">${ico.ok}${L('noSignup')}</p>
  <h1 tabindex="-1">${L('homeTitle')}</h1>
  <p class="sub">${L('homeSub')}</p>
  <div class="grow"></div>
  <div class="actions">
    <button class="primary start" data-act="start">${L('start')}${ico.arrow}</button>
    <p class="fine">${L('homeFine')}</p>
  </div>
</section>`; };

V.tone = () => { const t = S.tone; setZone(t); return `
<section class="screen">
  ${topBar(1)}
  ${guide(t ? t.img : IMG.calm, L('q1'), t ? loc(t).reply : L('q1sub'))}
  <div class="tones" role="group" aria-label="${L('tonesAria')}">
  ${TONES.map(x => `<button class="tone" data-act="tone" data-id="${x.id}" aria-pressed="${t&&t.id===x.id}" style="--zone:${x.zone};--zone-ink:${x.ink};--zone-solid:${x.solid}">
     <span class="art" style="--tbg:${CI_TINT[x.id][1]};--tz:${x.zone}"><img src="${x.img}" alt=""><i class="ck">${ico.checkW}</i></span>
     <b>${ph(loc(x).label)}</b><small>${ph(loc(x).eg)}</small></button>`).join('')}
  <div class="hub${t?'':' empty'}" aria-hidden="true" data-swap="hub"><span>${t ? ph(loc(t).label) : ph(L('pickOne'))}</span></div>
  </div>
  <button class="text-btn" data-act="all">${L('seeAll')}</button>
  <div class="grow"></div>
  <div class="actions"><button class="primary" data-act="toWords" ${t?'':'disabled'}>${L('next')}</button></div>
</section>`; };

// word clouds: one drawn cloud behind each word, and the word's visible length (Thai vowel and tone marks take no width) so long words shrink to fit
const CLOUD = '<svg class="cl" viewBox="8 8 106 80" preserveAspectRatio="none" aria-hidden="true"><path d="M28 84A16 16 0 0 1 14 60A18 18 0 0 1 32 36A22 22 0 0 1 64 22A20 20 0 0 1 98 36A16 16 0 0 1 108 66A16 16 0 0 1 94 84Z"/></svg>';
const visLen = w => w.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, '').length;
const fitN = w => { const n = visLen(w); return n > 12 ? Math.ceil(n / 1.8) : Math.max(n, 4); };
V.words = () => {
  const t = S.tone;
  setZone(S.showAll ? null : t);
  const list = S.showAll ? null : [...t.words, ...t.more];
  const btn = x => { const on = S.picks.some(p => p.w===x.w); const full = !on && S.picks.length>=2;
    const w = loc(x).w;
    return `<button class="word" data-act="word" data-w="${esc(x.w)}" aria-pressed="${on}" ${full?'disabled':''} style="--n:${fitN(w)};--ws:${visLen(w) > 12 ? 'normal' : 'nowrap'}${S.showAll?`;--zone:${x.tone.zone};--zone-line:${x.tone.line};--zone-solid:${x.tone.solid}`:''}">${CLOUD}<span>${esc(w)}</span></button>`; };
  const grid = S.showAll
    ? TONES.map(tt => `<p class="group-label">${loc(tt).label}</p><div class="words">${[...tt.words,...tt.more].map(x=>btn({...x,tone:tt})).join('')}</div>`).join('')
    : `<div class="words" role="group" aria-label="${L('wordsAria')}">${list.map(btn).join('')}</div>`;
  const sub = L('q2sub')[S.picks.length];
  const latest = S.picks[S.picks.length - 1]; // Mooca becomes the word just tapped
  return `
<section class="screen">
  ${topBar(2)}
  ${guide(latest ? wordArt(latest) : t && !S.showAll ? t.img : IMG.calm, L('q2'), sub)}
  ${grid}
  <div class="meaning ${S.picks.length?'':'empty'}" data-swap="meaning">${S.picks.length?S.picks.map(p=>`<p>${L('meaning')(esc(loc(p).w), esc(loc(p).m))}</p>`).join(''):L('meaningEmpty')}</div>
  <button class="text-btn" data-act="neutral">${L('neutralBtn')}</button>
  <div class="grow"></div>
  <div class="actions"><button class="primary" data-act="toCtx" ${S.picks.length?'':'disabled'}>${L('next')}</button></div>
</section>`; };

const tagsFor = (extra=[]) => `<div class="tags">${S.picks.map(p=>`<span class="tag">${esc(loc(p).w)}</span>`).join('')}${extra.map(e=>`<span class="tag soft">${esc(e)}</span>`).join('')}</div>`;

V.ctx = () => { setZone(S.tone); return `
<section class="screen">
  ${topBar(3)}
  ${guide(moocaFor(IMG.calm), L('q3'), !S.ctx ? L('q3sub') : L('q3done')(S.ctx==='unsure'), tagsFor())}
  <div class="opts" role="group" aria-label="${L('q3')}">
  ${CONTEXTS.map(c => `<button class="opt with-ic" data-act="ctx" data-id="${c.id}" aria-pressed="${S.ctx===c.id}"><span class="oi"><img src="${ctxArt(c.id, moodTone().id)}" alt=""></span><span class="ol">${loc(c).label}</span>${ico.check}</button>`).join('')}
  </div>
  <div class="grow"></div>
  <div class="actions">
    <button class="primary" data-act="toDur" ${S.ctx?'':'disabled'}>${L('next')}</button>
  </div>
</section>`; };

// step 4 scene: a calendar whose ticked days follow the answer, and a big bubble that says it back
const DUR_STEPS = ['today', 'days', 'week', 'long'];
const DUR_DAYS = {today:1, days:3, week:7, long:14, unsure:0};
function durCal(n){
  let cells = '';
  for (let i = 0; i < 14; i++){
    const x = 20 + (i % 7) * 24, y = 56 + Math.floor(i / 7) * 28, on = i < n;
    cells += on ? `<g class="on" style="--k:${i}"><rect x="${x}" y="${y}" width="20" height="22" rx="5" fill="#F0BF4D"/><path d="M${x+5} ${y+11}l4 4l7-8" stroke="#355956" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : `<rect x="${x}" y="${y}" width="20" height="22" rx="5" fill="#F1F1F1"/>`;
  }
  return `<svg class="dur-cal" viewBox="0 0 200 130" aria-hidden="true" data-swap="cal" data-key="${n}"><rect x="8" y="18" width="184" height="106" rx="16" fill="#fff" stroke="#80E2D9" stroke-width="4"/><path d="M8 34a16 16 0 0 1 16-16h152a16 16 0 0 1 16 16v10H8z" fill="#26CDBE"/>${[50,94,138].map(x => `<rect x="${x}" y="6" width="12" height="26" rx="6" fill="#00A28B" stroke="#fff" stroke-width="3"/>`).join('')}${cells}</svg>`;
}
function durScene(){
  const d = durList().find(x => x.id === S.dur);
  const big = d ? loc(d).label : L('durPick');
  return `<div class="dur-scene" aria-hidden="true"><span class="mooca dur-mooca"><img src="${durArt(feelsGood(), S.dur ?? 'unsure')}" alt=""></span>${durCal(DUR_DAYS[S.dur] || 0)}<div class="dur-read${d ? '' : ' empty'}" data-swap="dread"><b>${ph(big)}</b>${d && loc(d).say ? `<span>${ph(loc(d).say)}</span>` : ''}</div></div>`;
}
V.dur = () => { setZone(S.tone); const c = CONTEXTS.find(x=>x.id===S.ctx); const good = feelsGood(); return `
<section class="screen">
  ${topBar(4)}
  ${good
    // the longer question takes the tag row's place, so the bubble keeps the shared height
    ? guide(moocaFor(IMG.calm), L('qGood'), !S.dur ? L('durSub') : L('durDoneGood')(S.dur), '', 'q-wrap')
    : guide(moocaFor(IMG.calm), L('qHeavy'), !S.dur ? L('durSub') : L('durDoneHeavy')(S.dur), tagsFor(c&&c.id!=='unsure'?[loc(c).label]:[]))}
  ${durScene()}
  <div class="opts steps" role="group" aria-label="${L('durAria')}" data-swap="steps" data-key="${S.dur || ''}" style="--p:${Math.max(0, DUR_STEPS.indexOf(S.dur))}">
  ${durList().filter(d => d.id !== 'unsure').map(d => `<button class="opt step" data-act="dur" data-id="${d.id}" aria-pressed="${S.dur===d.id}"><i class="dot">${ico.check}</i><span>${ph(loc(d).label)}</span></button>`).join('')}
  </div>
  <button class="text-btn step-un" data-act="dur" data-id="unsure" aria-pressed="${S.dur==='unsure'}">${loc(durList().find(d => d.id === 'unsure')).label}</button>
  <div class="grow"></div>
  <div class="actions">
    <button class="primary" data-act="toResult" ${S.dur?'':'disabled'}>${L('seeCard')}</button>
  </div>
</section>`; };

function resultData(){
  const picks = S.picks.length ? S.picks : [NEUTRAL];
  const main = picks[0];
  const c = CONTEXTS.find(x=>x.id===S.ctx); const d = durList().find(x=>x.id===S.dur);
  let lv = Math.max(...picks.map(p=>p.lv));
  if (lv > 0 && d) lv = Math.max(lv, d.floor); // duration sets the minimum level
  return { picks, main, lv, ctx: c&&loc(c).say, cause: loc(main).c, since: d&&loc(d).say };
}

V.result = () => {
  setZone(S.picks.length ? (S.picks[0].tone || S.tone) : null);
  const r = resultData();
  const two = r.picks.length > 1;
  const name = r.picks.map(p=>esc(loc(p).w)).join(L('and'));
  const neutral = r.main === NEUTRAL;
  const feelGood = r.lv === 0;
  const [talkLead, talkRest] = L('talk')[r.lv] || ['', ''];
  const talkCopy = `${talkLead ? `<b>${ph(talkLead)}</b> ` : ''}${ph(talkRest)}`;
  const poses = posesFor();
  const talk = feelGood ? '' : `
  <div class="talk ${r.lv===1?'quiet':''}">
    <div class="talk-row">${r.lv>=2?`<img class="talk-doc" src="${IMG.doctor}" alt="">`:''}<p>${talkCopy}</p></div>
    <a class="cta" href="${OOCA_URL}" target="_blank" rel="noopener"><span>${L('cta')}</span>${ico.arrow}</a>
  </div>`;
  const action = `<div class="crow"><span class="lb">${L('writeLb')}</span><span>${ph(loc(r.main).a)}</span>
     ${S.note.trim() ? `<p class="note-snip${S.snipOpen?' open':''}" id="note-snip">${esc(S.note.trim())}</p><button class="snip-more" data-act="snipMore" aria-controls="note-snip" aria-expanded="${!!S.snipOpen}" hidden>${L(S.snipOpen?'snipLess':'snipMore')}</button>` : ''}
     <button class="timer${S.noteUp?' done':''}" data-act="timer" aria-haspopup="dialog">${S.note.trim() ? `<span>${L('openNote')}</span>` : `${ico.pen}<span>${S.noteUp?L('keepWriting'):L('writeBtn')}</span>`}</button></div>`;
  const parts = r.lv===3
    ? talk + `<div class="card">${action}</div>`
    : '';
  // the moment this card was made stays fixed while you write the note or come back to it
  if (!S.at) S.at = Date.now();
  const [day, time] = stampOf(S.at);
  return `
<section class="screen result">
  <div class="top"><span class="res-title">${L('resTitle')}</span>
    <button class="icon-btn" data-act="restart" aria-label="${L('closeRestart')}">${ico.close}</button></div>
  <div class="card main">
    <div class="card-head">
      <span class="post-wrap" aria-hidden="true"><svg class="post" viewBox="0 0 96 78" aria-hidden="true"><g fill="none" stroke="#7FD6CC" stroke-width="2.5" stroke-linecap="round"><circle cx="24" cy="38" r="17"/><circle cx="24" cy="38" r="11" stroke-dasharray="3 4"/><path d="M6 30q8-5 16 0t16 0t16 0M6 38q8-5 16 0t16 0t16 0M6 46q8-5 16 0t16 0t16 0"/></g><g transform="rotate(6 66 38)"><rect x="40" y="6" width="52" height="64" rx="3" fill="#fff"/><rect x="42.5" y="8.5" width="47" height="59" rx="2" fill="none" stroke="#E6DFD2" stroke-width="2" stroke-dasharray="2 3"/><rect x="47" y="13" width="38" height="50" rx="2" fill="#BDEDE6"/><circle cx="70" cy="30" r="8" fill="#FFD45C"/><path d="M70 17v4M70 39v4M57 30h4M79 30h4M61 21l3 3M79 21l-3 3" stroke="#FFC23D" stroke-width="2" stroke-linecap="round"/><path d="M50 58a7 7 0 0 1 3-13a9 9 0 0 1 17 2a6 6 0 0 1 1 11z" fill="#fff"/></g></svg></span>
      <p class="stamp">${ico.cal}<time datetime="${new Date(S.at).toISOString()}"><span class="nw">${day}</span> <span class="nw">· ${time}</span></time></p>
      <div class="talks who">${DOTS}<span class="lb">${neutral?L('nowLb'):L('feelLb')}</span><h1 class="name ${two||neutral?'two':''}" tabindex="-1"><span class="mark">${name}</span></h1></div>
      <span class="mooca${poses.length > 1 ? ' pair' : ''}">${poses.map(src => `<img class="float" src="${src}" alt="">`).join('')}${feelGood?'<i class="spark" aria-hidden="true">✦</i>'.repeat(3):''}</span>
      <div class="say-card talks">${DOTS}<span class="lb">${neutral?L('okLb'):L('causeLb')}</span><p>${neutral?ph(loc(NEUTRAL).m):`${r.ctx?`<b>${ph(r.ctx)}</b> `:''}${ph(r.cause || loc(r.main).m)}`}</p>${!neutral&&r.since?`<span class="since">${ph(r.since)}</span>`:''}</div>
    </div>
    ${r.lv===3 ? '' : action}
  </div>
  ${r.lv===3 ? parts : talk}
  <div class="grow"></div>
  <div class="duo">
    <button class="soft-btn" data-act="save">${ico.save}${L('save')}</button>
    <button class="soft-btn" data-act="restart">${ico.refresh}${L('restart')}</button>
  </div>
  <p class="fine">${ph(L('resFine'))}</p>
</section>`; };

V.safety = () => { app.style.setProperty('--bg','#E0F8F6'); return `
<section class="screen safety">
  <div class="top"><button class="icon-btn" data-act="back" aria-label="${L('back')}">${ico.back}</button></div>
  <div class="hug"><img src="${IMG.hug}" alt="${L('hugAlt')}"></div>
  <h1 tabindex="-1">${L('safeTitle')}</h1>
  <p class="msg">${ph(L('safeMsg'))}</p>
  <a class="call" href="tel:1323"><span class="ic">${ico.phone}</span><span><b>${L('call')}</b><small>${L('callSmall')}</small></span></a>
  <a class="cta ghost" href="${OOCA_URL}" target="_blank" rel="noopener"><span>${L('cta')}</span>${ico.arrow}</a>
  <p class="fine">${L('safeFine')}</p>
  <div class="grow"></div>
  <button class="text-btn" data-act="rePick">${L('rePick')}</button>
</section>`; };

/* ---------- render + events ---------- */
let timerId = null, loopId = null, lastHit = null;
let shown = null;

// ---- 30-second note ----
// the timer is a gentle guide: when it ends the clock rings, but the note stays open so nobody is cut off mid-sentence
const noteDlg = document.getElementById('note'), noteText = document.getElementById('note-text'), notePaper = noteDlg.querySelector('.paper');
const noteClock = noteDlg.querySelector('.clock'), noteSec = noteClock.querySelector('.sec'), noteProg = noteClock.querySelector('.prog'), noteStatus = noteDlg.querySelector('.note-status');
let noteTimer = null;
function chime(){
  // a single soft "ding" — one bell strike that fades out, never a repeating alarm
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)(), t = ac.currentTime;
    [[1318.5,.07],[2637,.018]].forEach(([f,v]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type='sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t+.005); g.gain.exponentialRampToValueAtTime(.0001, t+.9);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t+.95); });
    setTimeout(() => ac.close(), 1300);
  } catch(_) {}
  if (navigator.vibrate) navigator.vibrate(60);
}
function noteTimeUp(sound){
  S.noteUp = true; clearInterval(noteTimer); noteTimer = null;
  noteSec.textContent = L('timeUp'); noteSec.style.fontSize = '12px'; noteProg.style.strokeDashoffset = 100;
  notePaper.classList.add('timeup');
  document.getElementById('note-mooca').src = IMG.written;
  noteStatus.textContent = L('timeUpMsg');
  if (sound) { noteClock.classList.remove('ringing'); void noteClock.offsetWidth; noteClock.classList.add('ringing'); chime(); }
}
function openNote(prompt){
  clearInterval(noteTimer); noteTimer = null;
  noteDlg.querySelector('.note-q').innerHTML = ph(prompt);
  noteText.placeholder = L('placeholder');
  noteText.value = S.note;
  noteCount(S.note.length);
  notePaper.classList.remove('timeup'); noteClock.classList.remove('ringing'); noteStatus.textContent = ''; noteSec.style.fontSize = '';
  // once a note has been written and closed, later opens are plain editing: no clock, no countdown
  notePaper.classList.toggle('editing', S.noteDone);
  document.getElementById('note-mooca').src = S.noteDone ? IMG.written : IMG.write;
  noteDlg.querySelector('.note-lb').textContent = L(S.noteDone ? 'noteEditLb' : 'writeLb');
  noteDlg.showModal();
  noteText.focus({preventScroll:true});
  if (S.noteDone) return;
  if (S.noteUp) { noteTimeUp(false); return; }
  // only ever one countdown, and it stops itself the moment it rings, so the ding plays exactly once
  clearInterval(noteTimer);
  const end = performance.now() + 30000;
  const id = setInterval(() => tick(), 250);
  const tick = () => { if (noteTimer !== id) return clearInterval(id);
    const left = Math.max(0, end - performance.now());
    noteSec.textContent = Math.ceil(left / 1000); noteProg.style.strokeDashoffset = 100 - left / 300;
    if (left <= 0) { clearInterval(id); noteTimeUp(true); } };
  noteTimer = id; tick();
}
function closeNote(){
  clearInterval(noteTimer); noteTimer = null;
  S.note = noteText.value; if (noteDlg.open) noteDlg.close();
  if (S.note.trim()) S.noteDone = true;
  if (S.screen === 'result') render();
}
noteDlg.addEventListener('click', e => {
  const b = e.target.closest('[data-note]');
  if (b) closeNote(); else if (e.target === noteDlg) closeNote(); // a tap on the dimmed backdrop
});
noteDlg.addEventListener('cancel', e => { e.preventDefault(); closeNote(); });
// the note stops at NOTE_MAX characters (the textarea's maxlength also covers pasting)
const NOTE_MAX = 250;
noteText.maxLength = NOTE_MAX;
function noteCount(n){
  const c = document.getElementById('note-count');
  c.textContent = L('noteCount')(n, NOTE_MAX); c.classList.toggle('full', n >= NOTE_MAX);
}
noteText.addEventListener('input', () => {
  const full = noteText.value.length >= NOTE_MAX;
  if (full) noteStatus.textContent = L('noteFull');
  else if (noteStatus.textContent === L('noteFull')) noteStatus.textContent = notePaper.classList.contains('timeup') ? L('timeUpMsg') : '';
  S.note = noteText.value; noteCount(noteText.value.length);
});
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const keyOf = el => el && el.dataset && el.dataset.act ? `[data-act="${el.dataset.act}"]` + (el.dataset.id ? `[data-id="${el.dataset.id}"]` : el.dataset.w ? `[data-w="${CSS.escape(el.dataset.w)}"]` : '') : null;
// Mooca's eyes follow a finger or the mouse, and glance about on their own when nobody is pointing
let eyeAt = 0;
function look(x, y){
  const mo = document.querySelector('.hero .mo'); if (!mo) return;
  const r = mo.getBoundingClientRect();
  let dx = (x - (r.left + r.width * .55)) / 220, dy = (y - (r.top + r.height * .34)) / 220;
  const m = Math.hypot(dx, dy); if (m > 1){ dx /= m; dy /= m; }
  mo.style.setProperty('--ex', dx.toFixed(2)); mo.style.setProperty('--ey', dy.toFixed(2));
}
addEventListener('pointermove', e => { eyeAt = performance.now(); look(e.clientX, e.clientY); }, {passive:true});
addEventListener('pointerdown', e => { eyeAt = performance.now(); look(e.clientX, e.clientY); }, {passive:true});
setInterval(() => {
  if (calm.matches || performance.now() - eyeAt < 3200) return;
  const mo = document.querySelector('.hero .mo'); if (!mo) return;
  const c = Math.random() < .35, a = Math.random() * 6.28;
  mo.style.setProperty('--ex', c ? 0 : Math.cos(a).toFixed(2)); mo.style.setProperty('--ey', c ? 0 : (Math.sin(a) * .7).toFixed(2));
}, 2600);
// idle loops follow the clock, so an image moved into a re-rendered screen doesn't jump back to frame 0
function syncFloat(){
  const t = performance.now();
  app.querySelectorAll('.float').forEach(el => { const d = parseFloat(getComputedStyle(el).animationDuration) * 1000 || 4000; el.style.animationDelay = `-${Math.round(t % d)}ms`; });
  document.documentElement.style.setProperty('--clock', `-${Math.round(t % 5500)}ms`); // the word clouds' 5.5s float
}
// choices rise in one after another once Mooca has spoken
function stagger(){
  app.querySelectorAll('.screen > :not(.top,.progress,.guide,.hero,.grow,.tones,.words,.opts,.card.main), .tone, .word, .opt')
    .forEach((el, i) => { el.classList.add('rise'); el.style.setProperty('--i', Math.min(i, 12)); });
}
// home bubble keeps chatting
function greet(n){
  if (calm.matches) return;
  loopId = setTimeout(() => {
    const say = app.querySelector('.say'); if (!say) return;
    const hello = L('hello'); n = (n + 1) % hello.length;
    say.style.setProperty('--talk', '.7s');
    say.innerHTML = `${DOTS}<span>${hello[n]}</span>`;
    greet(n);
  }, n === 0 ? 5000 : 4000);
}
// show "อ่านทั้งหมด" only when the card's note is actually cut off (or already opened)
function fitSnip(){
  const s = app.querySelector('.note-snip'), b = app.querySelector('.snip-more');
  if (s && b) b.hidden = !s.classList.contains('open') && s.scrollHeight <= s.clientHeight + 1;
}
const warmed = new Set();
const warm = src => { if (src && !warmed.has(src)) { warmed.add(src); new Image().src = src; } };
// the poses this tone can lead to, so tapping a word changes Mooca at once
function warmArt(){
  (S.showAll ? TONES : S.tone ? [S.tone] : []).forEach(t => [...t.words, ...t.more].forEach(x => warm(WORD_POSE[x.w])));
  if (S.tone) { CONTEXTS.forEach(c => warm(ctxArt(c.id, S.tone.id))); DUR_IDS.forEach(d => { warm(durArt(true, d)); warm(durArt(false, d)); }); }
}
function render(){
  clearInterval(timerId); clearTimeout(loopId);
  warmArt();
  const same = shown === S.screen; shown = S.screen;
  if (!same){
    app.innerHTML = V[S.screen]();
    app.querySelector('.screen').classList.add(S.dir);
    stagger(); syncFloat(); lastHit = null;
    if (S.screen === 'home') greet(0);
    const h = app.querySelector('h1'); if (h && S.history.length) h.focus({preventScroll:true});
    window.scrollTo(0,0); app.scrollTop = 0;
    fitSnip();
    return;
  }
  // same screen (a selection changed): no entrance, keep scroll, images and focus; only what changed reacts
  const y = window.scrollY, ay = app.scrollTop;
  const key = keyOf(document.activeElement), hit = keyOf(lastHit); lastHit = null;
  const sig = e => e.dataset.key ?? e.textContent;
  const before = new Map([...app.querySelectorAll('[data-swap]')].map(e => [e.dataset.swap, sig(e)]));
  const wasOff = !!app.querySelector('.actions .primary:disabled');
  const oldImgs = [...app.querySelectorAll('img')];
  app.innerHTML = V[S.screen]();
  app.querySelector('.screen').classList.add('stay');
  app.querySelectorAll('img').forEach(n => { const i = oldImgs.findIndex(o => o.getAttribute('src') === n.getAttribute('src') && o.className === n.className); if (i >= 0) n.replaceWith(oldImgs.splice(i,1)[0]); });
  app.querySelectorAll('[data-swap]').forEach(e => {
    const was = before.get(e.dataset.swap); if (was === undefined || was === sig(e)) return;
    if (e.dataset.key === undefined) e.classList.add('swap');
    else { e.classList.add('reflow'); [...e.children].forEach((c, i) => c.style.setProperty('--i', i)); }
  });
  const j = hit && app.querySelector(hit); if (j) j.classList.add('just');
  const m = app.querySelector('.guide .mooca'); if (m) m.classList.add('hop');
  const dm = app.querySelector('.dur-mooca'); if (dm) dm.classList.add('hop');
  const p = app.querySelector('.actions .primary'); if (wasOff && p && !p.disabled) p.classList.add('ready');
  syncFloat();
  const f = key && app.querySelector(key); if (f) f.focus({preventScroll:true});
  window.scrollTo(0,y); app.scrollTop = ay;
  fitSnip();
}

// the start button grows into a circle that fills the app frame (not the whole page), then the next screen shows through
function burst(btn, e, next){
  if (calm.matches) return next();
  if (btn.dataset.busy) return; btn.dataset.busy = '1';
  const a = app.getBoundingClientRect(), r = btn.getBoundingClientRect();
  const left = Math.max(a.left, 0), top = Math.max(a.top, 0);
  const w = Math.min(a.right, innerWidth) - left, h = Math.min(a.bottom, innerHeight) - top;
  const x = (e.clientX || r.left + r.width/2) - left, y = (e.clientY || r.top + r.height/2) - top;
  const R = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
  const clip = document.createElement('div'); clip.className = 'burst-clip';
  clip.style.cssText = `left:${left}px;top:${top}px;width:${w}px;height:${h}px;border-radius:${getComputedStyle(app).borderRadius}`;
  const c = document.createElement('div'); c.className = 'burst';
  c.style.cssText = `left:${x-R}px;top:${y-R}px;width:${2*R}px;height:${2*R}px`;
  clip.appendChild(c); document.body.appendChild(clip);
  c.addEventListener('animationend', () => { next(); clip.classList.add('out'); setTimeout(() => clip.remove(), 400); }, {once:true});
}

// ---- save the card as an image ----
// the card is drawn onto a canvas (not a DOM screenshot), so the keepsake looks the same on every device
const CARD_FONT = '"Gotham Rounded Latin", Prompt, sans-serif';
const cardFont = (weight, size) => `${weight} ${size}px ${CARD_FONT}`;
const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
const mixHex = (a, b, p) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const x = h(a), y = h(b); return `rgb(${x.map((v, i) => Math.round(v * p + y[i] * (1 - p))).join(',')})`; };
function roundRect(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// styled runs [{t, f, c}] → lines no wider than w. Like ph() on screen, lines break at the spaces between
// Thai phrases; only a phrase wider than the whole line is split, and then between words (Intl.Segmenter)
function wrapRuns(m, runs, w){
  const seg = window.Intl && Intl.Segmenter ? new Intl.Segmenter(S.lang, {granularity:'word'}) : null;
  const chars = seg ? new Intl.Segmenter(S.lang, {granularity:'grapheme'}) : null;
  const lines = [[]]; let x = 0;
  const add = (t, r) => { m.font = r.f; const tw = m.measureText(t).width;
    if (!t.trim()) { if (lines[lines.length - 1].length) { lines[lines.length - 1].push({t, f: r.f, c: r.c, w: tw}); x += tw; } return; }
    if (x + tw > w && x > 0) { lines.push([]); x = 0; }
    if (tw > w && t.length > 1) {
      // split between words; a "word" with no break inside (e.g. 250 letters typed without spaces) splits by letter.
      // Only recurse when the pieces really got smaller, or it would loop until the stack overflows.
      let parts = seg ? [...seg.segment(t)].map(p => p.segment) : [];
      if (parts.length < 2) parts = chars ? [...chars.segment(t)].map(p => p.segment) : [...t];
      if (parts.length > 1) { parts.forEach(p => add(p, r)); return; }
    }
    lines[lines.length - 1].push({t, f: r.f, c: r.c, w: tw}); x += tw; };
  for (const r of runs) r.t.split(/( +)/).filter(Boolean).forEach(t => add(t, r));
  return lines.map(l => { while (l.length && !l[l.length - 1].t.trim()) l.pop(); return {runs: l, w: l.reduce((a, r) => a + r.w, 0)}; }).filter(l => l.runs.length);
}
// lays the card out once (measuring), returning its size and a draw(ctx) that paints it at 1x units
async function buildCardImage(withImages){
  const r = resultData(), neutral = r.main === NEUTRAL, good = r.lv === 0;
  const Z = (S.picks.length && (S.picks[0].tone || S.tone)) || {zone:'#1F77DF', ink:'#0A47CA', bg:'#E4EFFB'};
  const TEXT = '#355956', TEXT2 = '#3F6866';
  // fonts are a nice-to-have: Gotham is local() only, so on phones it is missing and load() rejects.
  // A missing font falls back to Prompt; never let it (or a load that never answers) block the card.
  await Promise.race([
    Promise.allSettled([400, 500, 600].map(w => document.fonts.load(cardFont(w, 20), 'กขA1'))),
    new Promise(ok => setTimeout(ok, 2000)),
  ]);
  const [logo, ...moocas] = withImages ? await Promise.all([IMG.logo, ...posesFor()].map(s => loadImg(s).catch(() => null))) : [null];
  const m = document.createElement('canvas').getContext('2d');
  const W = 540, P = 28, IP = 30, X = P + IP, IW = W - 2 * (P + IP);
  // header row (the mindfull logo) sits above the card
  const headY = P, cardTop = P + 24 + 18;
  const ops = []; let y = cardTop + IP;
  const lines = (runs, w = IW) => wrapRuns(m, runs, w);
  // queue lines of text at the current y, centred or left, then move y past them
  const put = (ls, x, lh, align = 'left', w = IW) => {
    ls.forEach((l, i) => { let xx = align === 'center' ? x + (w - l.w) / 2 : x; const yy = y + lh / 2 + i * lh;
      l.runs.forEach(rn => { const at = xx; ops.push(c => { c.font = rn.f; c.fillStyle = rn.c; c.fillText(rn.t, at, yy); }); xx += rn.w; }); });
    y += ls.length * lh;
  };
  // date chip
  const [day, time] = stampOf(S.at || Date.now()), when = `${day} · ${time}`;
  m.font = cardFont(500, 15); const chipW = m.measureText(when).width + 50, chipX = (W - chipW) / 2, chipY = y;
  ops.push(c => { c.fillStyle = '#E0F8F6'; roundRect(c, chipX, chipY, chipW, 34, 17); c.fill();
    c.strokeStyle = '#00A28B'; c.lineWidth = 1.6; roundRect(c, chipX + 15, chipY + 10, 15, 15, 3); c.stroke();
    c.beginPath(); c.moveTo(chipX + 15, chipY + 15.5); c.lineTo(chipX + 30, chipY + 15.5); c.moveTo(chipX + 19, chipY + 8); c.lineTo(chipX + 19, chipY + 12); c.moveTo(chipX + 26, chipY + 8); c.lineTo(chipX + 26, chipY + 12); c.stroke();
    c.font = cardFont(500, 15); c.fillStyle = TEXT; c.fillText(when, chipX + 38, chipY + 18); });
  y += 34 + 20;
  // the feeling, highlighted like on screen
  put(lines([{t: neutral ? L('nowLb') : L('feelLb'), f: cardFont(600, 15), c: Z.ink}]), X, 22, 'center');
  y += 2;
  const big = r.picks.length > 1 || neutral ? 36 : 46, nlh = Math.round(big * 1.3);
  const nls = lines([{t: r.picks.map(p => loc(p).w).join(L('and')), f: cardFont(600, big), c: Z.ink}]);
  nls.forEach((l, i) => { const hx = X + (IW - l.w) / 2 - 6, hy = y + i * nlh + nlh * 0.56; ops.push(c => { c.fillStyle = Z.bg; roundRect(c, hx, hy, l.w + 12, big * 0.42, 4); c.fill(); }); });
  put(nls, X, nlh, 'center');
  // Mooca in the middle
  y += 10;
  const shown = moocas.filter(Boolean);
  if (shown.length) {
    // one Mooca per picked word, overlapping a little when there are two
    const bh = 176, size = shown.length > 1 ? 156 : bh, step = size - 18, from = (W - (size + step * (shown.length - 1))) / 2;
    shown.forEach((im, i) => { const mx = from + step * i, my = y + bh - size; ops.push(c => c.drawImage(im, mx, my, size, size)); });
    if (good) [[-132, 18, 20], [124, 34, 15], [-118, 146, 13]].forEach(([dx, dy, sz]) => { const sy = y + dy; ops.push(c => { c.font = `${sz}px sans-serif`; c.fillStyle = Z.zone; c.fillText('✦', W / 2 + dx, sy); }); });
    y += bh; }
  // what Mooca says, in a bubble pointing up at it
  y += 16;
  const bubTop = y, bp = 20, bubFill = mixHex(Z.bg, '#FFFFFF', .7), bubAt = ops.length;
  y += bp;
  put(lines([{t: neutral ? L('okLb') : L('causeLb'), f: cardFont(600, 14), c: Z.ink}], IW - 2 * bp), X + bp, 22, 'left', IW - 2 * bp);
  y += 2;
  const body = neutral ? [{t: loc(NEUTRAL).m, f: cardFont(400, 18), c: TEXT}]
    : [...(r.ctx ? [{t: `${r.ctx} `, f: cardFont(600, 18), c: TEXT}] : []), {t: r.cause || loc(r.main).m, f: cardFont(400, 18), c: TEXT}];
  put(lines(body, IW - 2 * bp), X + bp, 30, 'left', IW - 2 * bp);
  if (!neutral && r.since) { y += 2; put(lines([{t: r.since, f: cardFont(400, 16), c: TEXT2}], IW - 2 * bp), X + bp, 26, 'left', IW - 2 * bp); }
  y += bp;
  const bubH = y - bubTop;
  ops.splice(bubAt, 0, c => { c.fillStyle = bubFill; c.save(); c.translate(W / 2, bubTop); c.rotate(Math.PI / 4); roundRect(c, -10, -10, 20, 20, 3); c.fill(); c.restore(); roundRect(c, X, bubTop, IW, bubH, 22); c.fill(); });
  // the 30-second writing prompt, and the note if one was written
  y += 26; const divY = y; ops.push(c => { c.fillStyle = '#D7E7E2'; c.fillRect(X, divY, IW, 1); }); y += 22;
  put(lines([{t: L('writeLb'), f: cardFont(600, 14), c: Z.ink}]), X, 22);
  y += 2;
  put(lines([{t: loc(r.main).a, f: cardFont(400, 18), c: TEXT}]), X, 30);
  const note = S.note.trim();
  if (note) { y += 12; const nTop = y, np = 16, noteAt = ops.length; y += np;
    const nls2 = note.split('\n').flatMap(p => p.trim() ? lines([{t: p, f: cardFont(400, 17), c: TEXT}], IW - 2 * np) : [{runs: [], w: 0}]).slice(0, 10);
    put(nls2, X + np, 28, 'left', IW - 2 * np); y += np;
    const nH = y - nTop; ops.splice(noteAt, 0, c => { c.fillStyle = '#E0F8F6'; roundRect(c, X, nTop, IW, nH, 14); c.fill(); }); }
  y += IP;
  const cardH = y - cardTop;
  y += P;
  const H = Math.ceil(y);
  return { W, H, draw(c){
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, Z.bg); g.addColorStop(1, mixHex(Z.bg, '#FFFFFF', .35)); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.textBaseline = 'middle';
    if (logo) c.drawImage(logo, P + 4, headY, 24 * logo.naturalWidth / logo.naturalHeight, 24);
    c.save(); c.shadowColor = 'rgba(31,119,223,.12)'; c.shadowBlur = 28; c.shadowOffsetY = 8; c.fillStyle = '#FFFFFF'; roundRect(c, P, cardTop, W - 2 * P, cardH, 28); c.fill(); c.restore();
    ops.forEach(op => op(c));
  } };
}
async function cardCanvas(){
  for (const withImages of [true, false]) {
    const card = await buildCardImage(withImages), cv = document.createElement('canvas'), c = cv.getContext('2d');
    cv.width = card.W * 2; cv.height = card.H * 2; c.scale(2, 2); card.draw(c);
    // images opened straight from disk (file://) taint the canvas; then the card is redrawn without them
    try { cv.toDataURL('image/png', 0); return cv; } catch (e) { if (!withImages) throw e; }
  }
}
// download on desktop; on phones open the share sheet so "Save image" puts it in the photo library
// "เก็บการ์ดไว้" opens a sheet that shows the card image first. On phones the button opens the share sheet
// (which has "Save Image") and the image itself can be pressed and held; elsewhere the button downloads the PNG.
// The file is made before the sheet opens, so the share call runs straight from a tap, as iOS requires.
const saveDlg = document.getElementById('save'), saveGo = saveDlg.querySelector('[data-save="go"]'), saveTip = saveDlg.querySelector('.save-tip');
let saveFile = null;
const touchDevice = () => matchMedia('(pointer:coarse)').matches;
const canShareFile = f => touchDevice() && !!navigator.canShare && navigator.canShare({files: [f]});
async function openSave(){
  const cv = await cardCanvas();
  const blob = await new Promise((ok, no) => cv.toBlob(b => b ? ok(b) : no(new Error('no image')), 'image/png'));
  const d = new Date(S.at || Date.now()), two = n => String(n).padStart(2, '0');
  const name = `mooca-card-${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}-${two(d.getHours())}${two(d.getMinutes())}.png`;
  saveFile = new File([blob], name, {type: 'image/png'});
  // a data: URL (not blob:) so press-and-hold "Save image" works in every phone browser
  const img = saveDlg.querySelector('.save-img') || saveTip.insertAdjacentElement('beforebegin', Object.assign(document.createElement('img'), {className: 'save-img'}));
  img.src = cv.toDataURL('image/png'); img.alt = L('cardAlt');
  saveDlg.setAttribute('aria-label', L('saveTitle'));
  const x = saveDlg.querySelector('[data-save="close"]'); x.innerHTML = ico.close; x.setAttribute('aria-label', L('saveClose'));
  saveGo.innerHTML = `${ico.save}<span>${L(canShareFile(saveFile) ? 'saveShare' : 'saveDownload')}</span>`;
  saveTip.innerHTML = touchDevice() ? `<span>${L('saveHint')}</span>` : `${ico.lock}<span>${L('savePrivate')}</span>`;
  saveDlg.showModal();
  saveGo.focus({preventScroll:true});
}
function closeSave(){
  if (saveDlg.open) saveDlg.close();
  saveDlg.querySelector('.save-img')?.remove(); saveFile = null;
}
async function saveNow(){
  const f = saveFile; if (!f) return;
  if (canShareFile(f)) {
    // the share sheet confirms on its own, so no toast here
    try { await navigator.share({files: [f]}); closeSave(); return; }
    catch (e) { if (e.name === 'AbortError') return; } // a refused share falls through to a plain download
  }
  const a = Object.assign(document.createElement('a'), {href: URL.createObjectURL(f), download: f.name});
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  closeSave(); toast(L('saved'));
}
saveDlg.addEventListener('click', e => {
  const b = e.target.closest('[data-save]');
  if (b) b.dataset.save === 'go' ? saveNow() : closeSave();
  else if (e.target === saveDlg) closeSave(); // a tap on the dimmed backdrop
});
saveDlg.addEventListener('cancel', e => { e.preventDefault(); closeSave(); });
app.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act, id = b.dataset.id; lastHit = b;
  switch(act){
    case 'start': burst(b, e, () => go('tone')); break;
    case 'lang': {
      if (id === S.lang) break;
      // slide the thumb first, then swap the words once it lands
      const sw = b.closest('.lang-sw'); sw.dataset.on = id;
      sw.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      setTimeout(() => setLang(id), calm.matches ? 0 : 260);
      break;
    }
    case 'back': back(); break;
    case 'restart': restart(); break;
    case 'tone': S.tone = TONES.find(t=>t.id===id); S.showAll=false; S.picks=[]; render(); break;
    case 'all': S.showAll = true; S.picks=[]; go('words'); break;
    case 'toWords': S.showAll=false; go('words'); break;
    case 'word': {
      const w = b.dataset.w;
      const found = allWords().find(x=>x.w===w);
      if (found.risk){ S.picks=[found]; go('safety'); return; }
      const i = S.picks.findIndex(p=>p.w===w);
      if (i>=0) S.picks.splice(i,1); else if (S.picks.length<2) S.picks.push(found);
      if (!S.tone) S.tone = found.tone;
      render(); break;
    }
    case 'neutral': S.picks=[]; S.ctx=null; S.dur=null; go('result'); break;
    case 'toCtx': go('ctx'); break;
    case 'ctx': S.ctx = id; render(); break;
    case 'toDur': go('dur'); break;
    case 'dur': S.dur = id; render(); break;
    case 'toResult': go('result'); break;
    case 'rePick': freshAnswers(); S.screen='words'; S.history=['home','tone']; S.dir='back'; if(!S.tone) S.tone=TONES[3]; render(); break;
    case 'timer': openNote(loc(resultData().main).a); break;
    case 'snipMore': S.snipOpen = !S.snipOpen; render(); break;
    case 'save': {
      const ic = b.querySelector('svg'); ic.classList.remove('drop'); void ic.getBoundingClientRect(); ic.classList.add('drop');
      if (b.dataset.busy) break; b.dataset.busy = '1';
      const r = resultData();
      const card = { date:new Date(S.at || Date.now()).toISOString(), words:r.picks.map(p=>p.w), ctx:S.ctx, dur:S.dur, note:S.note.trim() || undefined };
      try { const k='ooca-feeling-cards'; const list = JSON.parse(localStorage.getItem(k)||'[]'); list.push(card); localStorage.setItem(k, JSON.stringify(list.slice(-30))); } catch(_) {}
      openSave().catch(() => toast(L('saveFail'))).finally(() => { delete b.dataset.busy; });
      break;
    }
  }
});
applyLang();
render();
