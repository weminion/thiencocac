# Thiên Cơ Các — Kế hoạch triển khai

## Stack
- **Framework**: Next.js 16 + React 19 + TypeScript (App Router)
- **Styling**: Tailwind v4 (config bằng `@theme` trong `globals.css`)
- **Database**: Supabase (PostgreSQL free tier)
- **Auth**: Supabase Auth
- **ORM**: Prisma
- **Hosting**: Vercel (free tier)

---

## Phase 1 — Khởi tạo project ✅
- [x] Tạo Next.js project (TypeScript, Tailwind, App Router)
- [x] `app/globals.css` — design tokens: 10 màu, 3 font, 12 animation, keyframes, `.stars`, `.smoke-puff`
- [x] `app/layout.tsx` — Google Fonts: Cormorant Garamond, Be Vietnam Pro, Ma Shan Zheng
- [x] `app/page.tsx` — placeholder test

---

## Phase 2 — Shared utilities & types ✅
- [x] `types/cong-duc.ts` — RitualState, CongDucState, CongDucLogEntry, UnlockedFeatures
- [x] `lib/audio.ts` — port `playBell()` từ `cong-duc.jsx`
- [x] `lib/ngu-hanh.ts` — port `ngu-hanh.js` sang TypeScript
- [x] `lib/lunar.ts` — helper check ngày Rằm/Mùng 1 âm lịch

---

## Phase 3 — Database & Server Actions ✅
- [x] Cài Prisma + kết nối Supabase (`prisma`, `@prisma/client`, `pg`, `@prisma/adapter-pg`)
- [x] `prisma/schema.prisma` — models: CongDuc, DailyRitual, CongDucLog
- [x] `lib/prisma.ts` — singleton PrismaClient với pg adapter
- [x] `app/actions/cong-duc.ts`:
  - `checkIn()`
  - `completeRitual(kind, reward, label)` — idempotent per (userId, date, kind)
  - `spendCongDuc(featureKey)`
  - `getCongDucState(userId)`
  - `earnCongDuc(userId, amount, action)`

---

## Phase 4 — Landing Page (`/`) ✅
Port từ `Landing Page (Tailwind).html` + `tailwind-components.jsx`

- [x] `app/components/landing/LandingShell.tsx` — Client, quản lý authOpen state
- [x] `app/components/landing/Nav.tsx` — sticky, backdrop-blur
- [x] `app/components/landing/Hero.tsx` — stars bg, Can Chi orbit xoay 80s
- [x] `app/components/landing/Services.tsx` — 6 dịch vụ grid
- [x] `app/components/landing/MiniTool.tsx` — Client, tra mệnh nhanh
- [x] `app/components/landing/BaguaRing.tsx` — SVG vòng Bát Quái
- [x] `app/components/landing/Blog.tsx` — 4 bài mẫu
- [x] `app/components/landing/Footer.tsx`
- [x] `app/components/landing/AuthModal.tsx` — tabs login/signup
- [x] `app/page.tsx` — compose tất cả sections

---

## Phase 5 — Dashboard Shell
- [ ] `app/dashboard/layout.tsx` — sidebar + main content area
- [ ] `app/dashboard/components/Sidebar.tsx` — nav items + widget
- [ ] `app/dashboard/components/CongDucSidebarWidget.tsx` — hoa sen nhỏ + balance

---

## Phase 6 — Công Đức Page (`/dashboard/cong-duc`)
Port từ `cong-duc-ui.jsx` + `cong-duc-section.jsx`

- [ ] `app/dashboard/cong-duc/page.tsx` — RSC, fetch getCongDucState()
- [ ] `app/dashboard/cong-duc/components/LotusStreak.tsx` — SVG 8 cánh, streaks 0–7
- [ ] `app/dashboard/cong-duc/components/CongDucHero.tsx` — stats + vòng Can Chi xoay
- [ ] `app/dashboard/cong-duc/components/DailyRituals.tsx` — 4 ritual cards
- [ ] `app/dashboard/cong-duc/components/RitualCard.tsx` — card + 2 góc ấn triện
- [ ] `app/dashboard/cong-duc/components/IncenseRitual.tsx` — Client, modal 3 phases + khói
- [ ] `app/dashboard/cong-duc/components/MeditationTimer.tsx` — Client, modal timer SVG
- [ ] `app/dashboard/cong-duc/components/ShopGrid.tsx` — 5 feature unlock cards
- [ ] `app/dashboard/cong-duc/components/CongDucLog.tsx` — danh sách gần đây
- [ ] `app/dashboard/cong-duc/components/CungDuong.tsx` — donation section + modal

---

## Phase 7 — Auth & Routing
- [ ] Setup Supabase Auth
- [ ] Middleware bảo vệ `/dashboard/*`
- [ ] Flow: Landing → AuthModal → `/dashboard`
- [ ] Sau login thành công → redirect `/dashboard`

---

## Phase 8 — Keep-alive cron (chống Supabase pause)
- [ ] `app/api/cron/keep-alive/route.ts` — ping DB mỗi ngày
- [ ] `vercel.json` — cron schedule `0 8 * * *`

---

## Checklist trước khi deploy
- [ ] Hoa sen nở đúng N cánh khi streak = 0..7
- [ ] Ritual idempotent: không earn 2 lần/ngày
- [ ] Ăn chay chỉ active vào 15 và 1 âm lịch
- [ ] Streak reset về 0 nếu bỏ 1 ngày
- [ ] Modal incense không cho đóng khi đang burning
- [ ] Web Audio bell phát được trên iOS Safari
- [ ] Balance không bao giờ âm (server check)
- [ ] `prefers-reduced-motion` tắt khói + vòng xoay
- [ ] State load từ server khi login máy khác
