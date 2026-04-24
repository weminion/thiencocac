# Thien Co Cac — Implementation Plan

## Stack
- **Framework**: Next.js 16 + React 19 + TypeScript (App Router)
- **Styling**: Tailwind v4 (`@theme` in `globals.css`)
- **Database**: Supabase (PostgreSQL free tier)
- **Auth**: Supabase Auth
- **ORM**: Prisma
- **Hosting**: Vercel (free tier)

---

## Phase 1 — Project Setup ✅
- [x] Create Next.js project (TypeScript, Tailwind, App Router)
- [x] `src/app/globals.css` — design tokens: 10 colors, 3 fonts, 12 animations, keyframes, `.stars`, `.smoke-puff`
- [x] `src/app/layout.tsx` — Google Fonts: Cormorant Garamond, Be Vietnam Pro, Ma Shan Zheng
- [x] `src/app/page.tsx` — placeholder

---

## Phase 2 — Shared Utilities & Types ✅
- [x] `src/types/cong-duc.ts` — RitualState, CongDucState, CongDucLogEntry, UnlockedFeatures
- [x] `src/lib/audio.ts` — `playBell()` Web Audio API
- [x] `src/lib/ngu-hanh.ts` — Ngu Hanh lookup (TypeScript port)
- [x] `src/lib/lunar.ts` — lunar calendar helpers (full moon / new moon check)

---

## Phase 3 — Database & Server Actions ✅
- [x] Install Prisma + connect Supabase (`prisma`, `@prisma/client`, `pg`, `@prisma/adapter-pg`)
- [x] `prisma/schema.prisma` — models: Point, DailyRitual, PointLog
- [x] `src/lib/prisma.ts` — PrismaClient singleton with pg adapter
- [x] `src/app/actions/cong-duc.ts`:
  - `checkIn()`
  - `completeRitual(kind, reward, label)` — idempotent per (userId, date, kind)
  - `spendCongDuc(featureKey)`
  - `getCongDucState(userId)`
  - `earnCongDuc(userId, amount, action)`

---

## Phase 4 — Landing Page (`/`) ✅
Ported from `Landing Page (Tailwind).html` + `tailwind-components.jsx`

- [x] `src/app/components/landing/LandingShell.tsx` — Client, manages auth modal state
- [x] `src/app/components/landing/Nav.tsx` — sticky nav, backdrop-blur, mobile menu
- [x] `src/app/components/landing/Hero.tsx` — stars bg, Can Chi orbit (80s rotation)
- [x] `src/app/components/landing/Services.tsx` — 6 services grid
- [x] `src/app/components/landing/MiniTool.tsx` — Client, quick destiny lookup
- [x] `src/app/components/landing/BaguaRing.tsx` — rotating Bagua SVG ring
- [x] `src/app/components/landing/Blog.tsx` — 4 sample posts
- [x] `src/app/components/landing/Footer.tsx`
- [x] `src/app/components/landing/AuthModal.tsx` — login/signup tabs
- [x] `src/app/page.tsx` — compose all sections

---

## Phase 5 — Dashboard Shell
- [ ] `src/app/dashboard/layout.tsx` — sidebar + main content area
- [ ] `src/app/dashboard/components/Sidebar.tsx` — nav items + merit widget
- [ ] `src/app/dashboard/components/MeritSidebarWidget.tsx` — small lotus + balance

---

## Phase 6 — Merit Page (`/dashboard/merit`)
Ported from `cong-duc-ui.jsx` + `cong-duc-section.jsx`

- [ ] `src/app/dashboard/merit/page.tsx` — RSC, fetch getCongDucState()
- [ ] `src/app/dashboard/merit/components/LotusStreak.tsx` — SVG 8 petals, streaks 0–7
- [ ] `src/app/dashboard/merit/components/MeritHero.tsx` — stats + rotating Can Chi ring
- [ ] `src/app/dashboard/merit/components/DailyRituals.tsx` — 4 ritual cards
- [ ] `src/app/dashboard/merit/components/RitualCard.tsx` — card + 2 seal corners
- [ ] `src/app/dashboard/merit/components/IncenseRitual.tsx` — Client, 3-phase modal + smoke
- [ ] `src/app/dashboard/merit/components/MeditationTimer.tsx` — Client, SVG timer modal
- [ ] `src/app/dashboard/merit/components/ShopGrid.tsx` — 5 feature unlock cards
- [ ] `src/app/dashboard/merit/components/MeritLog.tsx` — recent activity list
- [ ] `src/app/dashboard/merit/components/Offering.tsx` — donation section + modal

---

## Phase 7 — Auth & Routing
- [ ] Setup Supabase Auth
- [ ] Middleware to protect `/dashboard/*`
- [ ] Flow: Landing → AuthModal → `/dashboard`
- [ ] After login → redirect to `/dashboard`

---

## Phase 8 — Keep-alive Cron (prevent Supabase pause)
- [ ] `src/app/api/cron/keep-alive/route.ts` — ping DB daily
- [ ] `vercel.json` — cron schedule `0 8 * * *`

---

## Pre-deploy Checklist
- [ ] Lotus opens correct N petals when streak = 0..7
- [ ] Ritual idempotent: cannot earn twice per day
- [ ] Fasting only active on lunar 15th and 1st
- [ ] Streak resets to 0 if a day is missed
- [ ] Incense modal cannot be closed while burning
- [ ] Web Audio bell works on iOS Safari
- [ ] Balance never goes negative (server-side check)
- [ ] `prefers-reduced-motion` disables smoke + rotation
- [ ] State loads from server when logging in on another device
