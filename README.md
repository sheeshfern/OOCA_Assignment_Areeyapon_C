# OOCA Assignment · ตั้งชื่อความรู้สึก

The 2-Minute Mental Health Experience (ooca UX/UI Product Designer assignment) by Areeyapon C.

ตอบ 4 ข้อ ใช้เวลาไม่เกิน 2 นาที แล้วได้การ์ดที่บอกว่าตอนนี้คุณอาจกำลังรู้สึกอะไร มาจากอะไร และทำอะไรต่อได้ทันที รองรับภาษาไทยและอังกฤษ

**เว็บจริง:** https://ooca-assignment-areeyapon-c.vercel.app (เวอร์ชัน React ใน `app/`)

## ในนี้มีอะไร

| โฟลเดอร์ | อะไร |
|---|---|
| [`web/`](web/) | เวอร์ชัน HTML/CSS/JS ไฟล์เดียว ไม่ต้อง build เปิด `index.html` ได้เลย |
| [`app/`](app/) | เวอร์ชัน React 19 + TypeScript (Vite) หน้าตาและการทำงานเหมือน `web/` ทุกอย่าง |
| [`docs/`](docs/) | เหตุผลและแหล่งอ้างอิงของคำและข้อความในแอป |
| [`tools/`](tools/) | สคริปต์ตรวจ layout และความยาวข้อความทั้งสองภาษา (รันใน browser console) |

## Run

```bash
# web: static
npx serve web

# app: React
cd app && npm install && npm run dev
```

รายละเอียดอยู่ใน [web/README.md](web/README.md) และ [app/README.md](app/README.md)

> เว็บนี้ไม่ใช่การวินิจฉัย ถ้ารู้สึกไม่ปลอดภัย โทร 1323 (สายด่วนสุขภาพจิต) หรือ 1669
