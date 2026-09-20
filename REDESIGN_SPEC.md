# Vercel Redesign Specification
We need to redesign the KUKPS Talai Web app to look exactly like Vercel's style.

## Global Rules
- **Typography**: The project is using `Noto Sans Thai` (loopless). Use standard sans-serif classes (`font-sans`).
- **Language**: Use Thai language everywhere (English transliteration is fine where appropriate).
- **Style**: Pure Vercel Style. High contrast minimalism. Black, white, and subtle grays (e.g. `gray-50`, `gray-100`, `gray-200`, `gray-900`). Minimal borders (1px solid `gray-200`). White backgrounds. Black primary buttons, white secondary buttons with thin gray borders. No green/emerald, replace all `emerald-*`, `slate-*`, `rose-*`, etc., with monochrome equivalents (e.g., `black`, `gray-900`, `gray-600`, `gray-100`, `gray-50`).
- **Icons**: Lucide-react icons are fine, keep them minimalist (black/gray).

## 1. Home Page (`app/routes/page.tsx`)
- Redesign the landing page to be a clean, minimalist Vercel-like page.
- Remove all green (`emerald-*`) colors.
- Use sharp, simple grid layouts with thin gray borders.

## 2. Auth Pages (`app/routes/auth/layout.tsx`, `app/routes/auth/page.tsx`, `app/routes/auth/reset_password/page.tsx`)
- Center the form in the middle of the screen.
- Just a small white card with a 1px gray border and subtle shadow on a `gray-50` background.
- No navigation bars, no large icons. Just the title, inputs, and standard black/white buttons.

## 3. Dashboard Layout & Components (`app/routes/admin/dashboard/page.tsx` and components inside `app/routes/admin/dashboard/components/`)
- Redesign `page.tsx` to have a clean, white background, no green. Tabs should be simple black text with a 2px black bottom border for the active tab, and gray text for inactive tabs.
- Redesign metric cards to have simple thin gray borders, black text.
- Redesign all components (`cars.component.tsx`, `routes.component.tsx`, `user.component.tsx`, `admin-invite.component.tsx`) to match the monochrome Vercel table style (white table, 1px gray borders, simple padding, clean text).

## 4. Custom Dialog Context (`app/components/providers/DialogProvider.tsx`)
- Create a global `DialogProvider` using standard React Context and simple fixed Tailwind overlays (e.g. `fixed inset-0 bg-black/40 flex items-center justify-center`).
- Provide an `alert({ title, description, confirmText })` and `confirm({ title, description, confirmText, cancelText, onConfirm })` API.
- Use a standard Dialog layout: A white box centered in the screen, `max-w-md w-full`, thin gray border, subtle shadow.
- Replace any usage of SweetAlert2 (`Swal.fire`) in the dashboard components with this new `useDialog` hook.
- Do not use `sweetalert2` anymore. Remove it from imports.

## 5. Loading State
- ALREADY COMPLETED (Done in `app/components/ui/Loading.tsx`).

## 6. Modals in Dashboard
- Ensure Modals for editing cars and routes in `cars.component.tsx` and `routes.component.tsx` use the Standard Dialog pattern (center of the screen, clean white box, thin gray border, black buttons for save, white buttons for cancel).
- Remove the slide-in drawer or any green colored headers.
