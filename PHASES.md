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
- [x] `src/app/globals.css` — design tokens: 10 màu, 3 font, 12 animation, keyframes, `.stars`, `.smoke-puff`
- [x] `src/app/layout.tsx` — Google Fonts: Cormorant Garamond, Be Vietnam Pro, Ma Shan Zheng
- [x] `src/app/page.tsx` — placeholder test

---

## Phase 2 — Shared Utilities & Types ✅
- [x] `src/types/cong-duc.ts` — RitualState, CongDucState, CongDucLogEntry, UnlockedFeatures
- [x] `src/lib/audio.ts` — port `playBell()` Web Audio API
- [x] `src/lib/ngu-hanh.ts` — tra cứu Ngũ Hành (TypeScript)
- [x] `src/lib/lunar.ts` — helper check ngày Rằm/Mùng 1 âm lịch

---

## Phase 3 — Database & Server Actions ✅
- [x] Cài Prisma + kết nối Supabase (`prisma`, `@prisma/client`, `pg`, `@prisma/adapter-pg`)
- [x] `prisma/schema.prisma` — models: Point, DailyRitual, PointLog
- [x] `src/lib/prisma.ts` — singleton PrismaClient với pg adapter
- [x] `src/app/actions/cong-duc.ts`:
  - `checkIn()`
  - `completeRitual(kind, reward, label)` — idempotent per (userId, date, kind)
  - `spendCongDuc(featureKey)`
  - `getCongDucState(userId)`
  - `earnCongDuc(userId, amount, action)`

---

## Phase 4 — Landing Page (`/`) ✅
Port từ `Landing Page (Tailwind).html` + `tailwind-components.jsx`

- [x] `src/app/components/landing/LandingShell.tsx` — Client, quản lý auth modal state
- [x] `src/app/components/landing/Nav.tsx` — sticky nav, backdrop-blur, mobile menu
- [x] `src/app/components/landing/Hero.tsx` — stars bg, vòng Can Chi xoay 80s
- [x] `src/app/components/landing/Services.tsx` — 6 dịch vụ grid
- [x] `src/app/components/landing/MiniTool.tsx` — Client, tra mệnh nhanh
- [x] `src/app/components/landing/BaguaRing.tsx` — SVG vòng Bát Quái xoay
- [x] `src/app/components/landing/Blog.tsx` — 4 bài mẫu
- [x] `src/app/components/landing/Footer.tsx`
- [x] `src/app/components/landing/AuthModal.tsx` — tabs login/signup
- [x] `src/app/page.tsx` — compose tất cả sections

---

## Phase 5 — Dashboard Shell
- [ ] `src/app/dashboard/layout.tsx` — sidebar + main content area
- [ ] `src/app/dashboard/components/Sidebar.tsx` — nav items + merit widget
- [ ] `src/app/dashboard/components/MeritSidebarWidget.tsx` — hoa sen nhỏ + balance

---

## Phase 6 — Merit Page (`/dashboard/merit`)
Port từ `cong-duc-ui.jsx` + `cong-duc-section.jsx`

- [ ] `src/app/dashboard/merit/page.tsx` — RSC, fetch getCongDucState()
- [ ] `src/app/dashboard/merit/components/LotusStreak.tsx` — SVG 8 cánh, streaks 0–7
- [ ] `src/app/dashboard/merit/components/MeritHero.tsx` — stats + vòng Can Chi xoay
- [ ] `src/app/dashboard/merit/components/DailyRituals.tsx` — 4 ritual cards
- [ ] `src/app/dashboard/merit/components/RitualCard.tsx` — card + 2 góc ấn triện
- [ ] `src/app/dashboard/merit/components/IncenseRitual.tsx` — Client, modal 3 phases + khói
- [ ] `src/app/dashboard/merit/components/MeditationTimer.tsx` — Client, modal timer SVG
- [ ] `src/app/dashboard/merit/components/ShopGrid.tsx` — 5 feature unlock cards
- [ ] `src/app/dashboard/merit/components/MeritLog.tsx` — danh sách gần đây
- [ ] `src/app/dashboard/merit/components/Offering.tsx` — donation section + modal

---

## Phase 7 — Auth & Routing
- [ ] Setup Supabase Auth
- [ ] Middleware bảo vệ `/dashboard/*`
- [ ] Flow: Landing → AuthModal → `/dashboard`
- [ ] Sau login thành công → redirect `/dashboard`

---

## Phase 8 — Keep-alive Cron (chống Supabase pause)
- [ ] `src/app/api/cron/keep-alive/route.ts` — ping DB mỗi ngày
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
