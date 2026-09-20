# แผนการลงมือทำ (Execution Plan) — KUKPS Smart Talai UI Redesign

แผนนี้ถูกปรับปรุงจากการพูดคุย (Grill) เพื่อให้สอดคล้องกับ Vercel Style มากที่สุด โดยมีข้อสรุปที่เปลี่ยนแปลงจากแผนเดิมดังนี้:
1. **รองรับทั้ง Light และ Dark Mode**
2. **ใช้ Top Navigation Bar** สำหรับหน้า Admin (แทนที่จะใช้ Sidebar)
3. **ใช้ฟอนต์ Prompt** (Modern UI) แทน Sarabun
4. **คงรูปแบบ Sheet (Drawer)** ไว้สำหรับดูรายละเอียดรถและเส้นทางที่มีแผนที่

---

## 🛠️ Step 0: โครงสร้างพื้นฐาน (Infrastructure & Setup)
1. **Font & Colors:**
   - นำเข้าฟอนต์ `Prompt` จาก Google Fonts (แทน Noto Sans Thai / Sarabun)
   - ปรับแต่ง CSS Variables (`app/app.css`) ให้รองรับ Light/Dark mode ในสไตล์ Vercel (โทนดำ/ขาว/เทา, ขอบมน 6px)
2. **Shadcn UI (Tailwind v4):**
   - รันคำสั่ง `npx shadcn@latest init` (ถ้ายังไม่ได้ init) หรือปรับ config ให้ถูกต้องสำหรับ Vite + Tailwind v4
   - เพิ่ม Components ที่จำเป็น: 
     `npx shadcn@latest add button dialog sheet input label separator badge avatar scroll-area tooltip dropdown-menu skeleton card navigation-menu`
3. **Dark Mode Provider:**
   - ติดตั้ง/สร้าง `ThemeProvider` เพื่อจัดการสลับโหมด Light/Dark (รองรับการตั้งค่าตามระบบหรือเปลี่ยนเอง)

---

## 🏠 Step 1: หน้า Landing Page (`app/routes/page.tsx`)
1. **Layout & Navbar:** 
   - Navbar แบบ minimal: โลโก้ซ้าย, เมนู/ปุ่มสลับธีม/ปุ่ม Login ขวา
   - มี Border-bottom แบบจางๆ (`border-b border-border`)
2. **Hero Section:** 
   - ข้อความ Headline ขนาดใหญ่ (Geist/Inter style), Subtitle สีเทา (Muted)
   - ปุ่ม CTA 2 ปุ่ม (Primary สีทึบ/ขาวตามธีม, Secondary สีพื้น)
3. **Feature Grid:** 
   - แสดงฟีเจอร์ด้วย Shadcn `Card` ที่มีเส้นขอบจางๆ (`border`), ไม่มีเงาหนา (ใช้แค่ hover state บางๆ)
4. **Footer:**
   - ข้อความขนาดเล็ก (`text-sm text-muted-foreground`), จัดวางเรียบง่าย

---

## 🔒 Step 2: หน้า Authentication (`/auth/login`, `/auth/register`, `/auth/reset_password`)
1. **Layout (Vercel Auth Style):**
   - จัดวางฟอร์มไว้ตรงกลางหน้าจอ `max-w-sm` หรือ `max-w-md`
   - มี Logo ระบบอยู่ด้านบนสุดของกล่อง
2. **Form Elements:**
   - ใช้ Shadcn `Input` และ `Label`
   - เปลี่ยนปุ่ม Submit ให้เป็น Shadcn `Button` ที่มีการแสดงสถานะ Loading
   - ปรับ Link ต่างๆ ให้เป็นข้อความสีเทา แล้วขีดเส้นใต้ตอน hover
3. **Card Container:**
   - ใช้ Shadcn `Card` หุ้มฟอร์มทั้งหมด (มีขอบ `border`, padding กว้างๆ)

---

## 📊 Step 3: Admin Dashboard Layout (`app/routes/admin/*`)
1. **Top Navigation Bar (แทน Sidebar):**
   - แถบเมนูด้านบน ประกอบด้วย: 
     - ซ้าย: [Logo] KUKPS Talai / แถบเมนูย่อย (ภาพรวม, ผู้ใช้งาน, รถ, เส้นทาง)
     - ขวา: ปุ่มสลับธีม, ผู้ใช้งานปัจจุบัน (Shadcn `Avatar` & `DropdownMenu`)
   - ใช้ `NavigationMenu` ของ Shadcn ในการทำ Tabs
2. **Page Content:**
   - หน้าตาเนื้อหาแต่ละหน้าจำกัดความกว้าง (เช่น `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`)
   - Heading ของแต่ละหน้า (เช่น "ภาพรวมระบบ") ใช้ตัวอักษรหนาชัดเจน
3. **Stat Cards & Tables:**
   - ข้อมูลสถิติใช้ Shadcn `Card`
   - ตารางข้อมูลต่างๆ ปรับให้เป็นเส้นขอบบางๆ (Vercel tables)

---

## ⚠️ Step 4: Custom Alert & Confirm Modal (`DialogProvider`)
1. **ปรับปรุง `DialogProvider`:**
   - เปลี่ยนไปใช้ Shadcn `Dialog` (Modal)
2. **Vercel Style Confirmation:**
   - Layout: ไอคอนเตือน (ถ้ามี) + หัวข้อ, คำอธิบาย
   - ปุ่ม Action อยู่ด้านล่างขวา (ยกเลิก, ยืนยัน)
   - กรณีเป็นแอคชั่นอันตราย (ลบข้อมูล) ให้ปุ่มยืนยันเป็น `variant="destructive"` (สีแดง)

---

## ⏳ Step 5: Loading States & Skeletons
1. **Full Page Loading:**
   - ตอนเปลี่ยนหน้าหรือโหลดข้อมูลครั้งแรก ใช้ Spinner เรียบๆ กลางหน้าจอ
2. **Inline Loading:**
   - ใช้ Shadcn `Skeleton` สำหรับรอโหลดข้อมูล Card หรือ Table
3. **Button Loading:**
   - เพิ่ม Spinner ข้างใน `Button` เวลาทำการ Submit ฟอร์ม

---

## 🗺️ Step 6: Modals (รถ และ เส้นทาง)
1. **Car / Route Detail (`Sheet`):**
   - ใช้ Shadcn `Sheet` (Drawer สไลด์จากขวา)
   - Header: ชื่อรถ/เส้นทาง + สถานะ (Shadcn `Badge`)
   - Body: แสดงแผนที่และข้อมูลแบบ Scroll เต็มหน้าจอได้
2. **Car / Route Edit & Create (`Dialog`):**
   - แบบฟอร์มเพิ่ม/แก้ไขข้อมูล ให้เปิดเป็น Shadcn `Dialog` กลางหน้าจอ
   - ใช้ Input, Select ของ Shadcn ในการกรอกข้อมูล

---

*กรุณากดปุ่ม **Proceed** หากแผนการนี้ครบถ้วนและต้องการให้ระบบเริ่มดำเนินการแก้ไขโค้ดตาม Step 0 - 6 ทันที*
