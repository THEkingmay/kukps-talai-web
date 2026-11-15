# โครงสร้างโค้ด — "Component = HTML, Hook = Logic"

ไฟล์ component **ควรมีแค่ props + JSX** ส่วน logic ทั้งหมด (state, fetch, handler,
derived value) อยู่ใน custom hook หรือไฟล์ helper ที่แยกออกมา

## กติกา 5 ข้อ

1. **ห้ามเรียก API ในไฟล์ component**
   `components/**` ต้องไม่ import `~/actions/*`, `~/configs/axios`, `useDialog` หรือ
   `useAuth` (ยกเว้น provider เอง) — ถ้าต้องใช้ข้อมูล ให้รับเป็น props

2. **hook อยู่ที่ `hooks/` ของ route นั้น**
   ```
   app/routes/admin/cars/
     page.tsx                    ← composition only (~60-100 บรรทัด)
     $carId.tsx
     hooks/useCarsList.ts        ← state + fetch + handlers + derived
     hooks/useCarDetail.ts
     components/InfoCard.tsx     ← presentational
     components/CarOverviewTab.tsx
     components/CarDetailStates.tsx
   ```
   hook คืนค่าเป็น **object แบนชุดเดียว** (`{ data, isLoading, error, openModal, submit, ... }`)
   หน้าเพจเรียก hook ครั้งเดียวแล้วกระจายค่าให้ component

3. **component ย่อยรับ props เท่านั้น**
   default export + `interface XxxProps` ที่มี type ชัดเจน ไม่มี fetching ไม่มี dialog
   ถ้า markup เกิน ~25 บรรทัดและเป็นเรื่องแยก ให้แยกไฟล์

4. **helper บริสุทธิ์ไป `~/helper`**
   ตัวจัดรูปแบบวันที่/เวลา/ระยะเวลา (`formatDate`, `formatElapsed`, `formatDrivenTime`,
   `formatInitials`, ...) อยู่ที่ `app/helper/index.ts` เท่านั้น ห้ามประกาศในไฟล์ component
   (ก่อนหน้านี้ `formatElapsed` เคยอยู่ใน `shiftStatusCard.tsx` ทำให้ 3 หน้า import ข้าม component)

5. **hook กลางที่ใช้ซ้ำอยู่ที่ `app/hooks/`**
   | hook | ใช้ทำอะไร |
   | --- | --- |
   | `useNow(intervalMs, enabled)` | ticker สำหรับตัวนับเวลา (แทน `setInterval` ที่เขียนมือ) |
   | `useBodyScrollLock(locked)` | ล็อก scroll ตอนเปิด modal |
   | `useCopyToClipboard()` | คัดลอก + ไอคอนติ๊กถูกชั่วคราว |
   | `useActiveDrivers()` | รายชื่อคนขับที่กำลังขับ (top bar) |

## ข้อควรระวังเรื่อง dependency ของ hook

`fetchX` ที่ถูกเรียกใน `useEffect` ต้องมี identity นิ่ง ไม่อย่างนั้นจะ fetch ซ้ำไม่รู้จบ
จึงได้ memoize `alert` / `confirm` ใน `DialogProvider` ด้วย `useCallback` + `useMemo`
(เดิมสร้างฟังก์ชันใหม่ทุก render ทำให้ hook ที่ใส่ `alert` ใน dependency array กระตุ้น effect ซ้ำ
ทุกครั้งที่ dialog เปิด/ปิด)

## ไฟล์ที่แยกแล้ว (อ้างอิง)

| หน้า | hook | component |
| --- | --- | --- |
| `/admin/cars` | `cars/hooks/useCarsList.ts` | reuse ของเดิม |
| `/admin/cars/:carId` | `cars/hooks/useCarDetail.ts` | `cars/components/*` |
| `/admin/routes` | `routes/hooks/useRoutesList.ts` | `routes/components/*` |
| `/admin/routes/:routeId` | `routes/hooks/useRouteDetail.ts` | `routes/components/*` |
| `/admin/assignments` | `dashboard/hooks/useAssignmentDriver.ts` | `assignment-driver/AssignmentFilters.tsx` |
| `/admin/assignments/:driverId` | `assignments/hooks/useDriverAssignments.ts` | `assignments/components/*` |
| `/admin/users` | `dashboard/hooks/useUsers.ts` | reuse ของเดิม |
| `/admin/invites` | `dashboard/hooks/useAdminInvites.ts` | reuse ของเดิม |
| `/driver/dashboard` | `driver/dashboard/hooks/useDriverDashboard.ts` | `driver/dashboard/components/*` |
| MQTT credentials | `dashboard/hooks/useMqttCredentials.ts` | `cars/CredentialField.tsx` |
| route point editor | `dashboard/hooks/useRoutePointEditor.ts` | `routes/route-point/*` |
| `/auth`, `/auth/reset-password` | `auth/hooks/*` | `auth/components/*` |
