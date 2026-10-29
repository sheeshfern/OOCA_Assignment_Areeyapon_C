# ตั้งชื่อความรู้สึก · ooca (React + TypeScript)

เวอร์ชัน React 19 + TypeScript ของแอปใน `../web/index.html` หน้าตา ข้อความ และการทำงานเหมือนเดิมทุกอย่าง ส่วน `web/` ยังเก็บไว้เป็นต้นฉบับ

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (หรือพอร์ตที่กำหนด)
npm run build      # type-check (strict) + build ลง dist/
npm run preview    # เปิดดู dist/
npm run lint       # oxlint
```

`dist/` ใช้ path แบบ relative (`base: './'`) อัปโหลดไว้ใต้ path ไหนของเว็บก็เปิดได้ (ต้องเปิดผ่าน server ไม่ใช่ดับเบิลคลิกไฟล์)

## Deploy

เว็บจริงอยู่ที่ https://ooca-assignment-areeyapon-c.vercel.app (Vercel project `ooca-assignment-areeyapon-c`) ตั้งค่า build ไว้ใน `vercel.json` แล้ว (Vite, `npm run build`, `dist`)

ขึ้นเวอร์ชันใหม่: รันในโฟลเดอร์นี้

```bash
npx vercel deploy --prod
```

## โครงสร้าง

| ไฟล์ | หน้าที่ |
|---|---|
| `src/App.tsx` | ถือ state ทั้งแอป (`useReducer`) สลับหน้า สีโซน โน้ต toast และปุ่มเก็บการ์ด |
| `src/state.ts` | `State`, `Action`, `reducer` และค่าที่คำนวณจาก state (`resultData`, `moocaFor`, `zoneVars`) |
| `src/AppContext.ts` | `useApp()` ให้ทุกหน้าอ่าน state, ข้อความ (`L`) และสั่งงานได้ |
| `src/screens/` | หน้า Home, Tone, Words, Ctx, Dur, Result, Safety |
| `src/components/` | `Screen` (entrance/stay motion), `NoteDialog` (โน้ต 30 วิ), `LangSwitch`, `Toast`, `Tags`, `Guide`/`TopBar` |
| `src/data/` | คำความรู้สึกทั้งหมด (`content.ts`), ข้อความ UI ไทย/อังกฤษ (`ui.tsx`), ไอคอน, รูป, type |
| `src/lib/text.tsx` | `<Ph>` ตัดบรรทัดภาษาไทยตามวลี, `loc()` เลือกภาษา, `stampOf()` วันที่บนการ์ด |
| `src/lib/motion.ts` | animation เล็กๆ ที่เติม class ให้ DOM โดยตรง (stagger, hop, burst, chime) |
| `src/lib/cardImage.ts` | วาดการ์ดลง canvas แล้วดาวน์โหลด (มือถือเปิด share sheet) |
| `src/styles.css` | CSS ชุดเดียวกับ `web/index.html` เพิ่มแค่ `#root{display:contents}` |

## Motion แบบเดิม

- เข้าหน้าใหม่: แต่ละหน้ามี `key` ของตัวเอง จึง mount ใหม่และเล่น entrance
- เปลี่ยนค่าในหน้าเดิม: `Screen` ใส่ `.stay` ข้อความที่เปลี่ยนจะ swap, Mooca กระโดด, ปุ่มหลักที่เพิ่งกดได้จะ pulse
- class ชั่วคราว (`rise`, `hop`, `just`, `ready`, `relang`, `drop`) ใส่ผ่าน `lib/motion.ts` เพราะ React ไม่ได้จัดการ class พวกนี้ re-render จึงไม่ลบทิ้ง

## ตรวจแล้วว่าเหมือน `web/`

กดผ่าน 5 เส้นทาง (ไทย/อังกฤษ, รู้สึกดี, หนัก + การเงิน, คำเสี่ยงไปหน้า Safety, ข้ามข้อ, ยังบอกไม่ถูก) ทั้งสองเวอร์ชัน แล้วเทียบทีละหน้า:

- ข้อความ รูป ปุ่มที่เลือก สีโซน title และโน้ต: ตรงกันทุกหน้า
- ตำแหน่งและขนาดของทุก element: ตรงกันทุกหน้า ที่ 320, 390 และ 1280×720 (4 เส้นทาง) และที่ 600×640, 667×375 (2 เส้นทาง)
- รูปการ์ดที่เซฟ (วันเวลาเดียวกัน มีโน้ต 2 บรรทัด): ไฟล์ PNG ตรงกันทุก byte
- ปุ่มเก็บการ์ด, toast, จับเวลาโน้ต 30 วิแล้วกริ่ง: ทำงานตามเดิม

ตอน dev แอปเปิด `window.__ooca` (state, dispatch, go, openNote) ไว้ให้สคริปต์ทดสอบใช้ build จริงไม่มี
