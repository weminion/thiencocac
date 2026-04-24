# Handoff: Công Đức (Merit Points) — Daily Retention System

## Overview
Tính năng **Công Đức (功德)** thêm vào dashboard Thiên Cơ Các để tăng daily retention. User tích lũy điểm "Công Đức" qua các nghi thức đạo học hàng ngày (điểm danh, đốt nhang, thiền, ăn chay) và dùng điểm để mở khóa các tính năng cao cấp (luận giải vận niên sâu, giờ cát hung chi tiết, ngày tốt sự kiện lớn, thêm lá số, voucher tư vấn 1-1).

Sản phẩm là dashboard phong thủy/tử vi tiếng Việt, tông **đạo học thuần túy** — tu tâm, tích đức, an nhiên. TUYỆT ĐỐI không dùng ngôn ngữ game-y ("điểm thưởng", "mua điểm", "XP"); thay bằng **"hồi hướng / cúng dường / viên mãn / công đức"**.

## About the Design Files
Các file trong bundle này là **design references được tạo bằng HTML + React + Tailwind CDN** — prototypes cho thấy visual và behavior mong muốn, KHÔNG phải production code để copy nguyên. Nhiệm vụ của bạn là **recreate các design này trong codebase Next.js thật** với App Router, TypeScript, Tailwind, và các pattern đã có sẵn trong project (shadcn/ui nếu có, hoặc component library của team).

## Target Stack
- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** — giữ nguyên design tokens ở dưới
- **React Server Components** cho data fetching ban đầu; Client Components cho tương tác (modal, timer, animation)
- **State persistence**: prototype dùng localStorage; production nên dùng database (Postgres/Prisma) + Server Actions
- **Audio**: Web Audio API (prototype có sẵn `playBell()`, port y nguyên sang client util)

## Fidelity
**High-fidelity (hifi)**. Colors, typography, spacing, animation timings, Chinese glyphs, và copy đều final. Recreate pixel-perfect. Chỉ thay đổi khi cần thiết để phù hợp với design system hiện có của codebase Next.js đích.

---

## Design Tokens

### Colors (Tailwind config — giữ nguyên)
```ts
// tailwind.config.ts
colors: {
  ink:   { DEFAULT: '#0a0806', 2: '#14100a', 3: '#1f1812' }, // nền đen 3 cấp
  gold:  { DEFAULT: '#d4a24b', bright: '#f4cf73', deep: '#8a6a2a' }, // vàng kim
  red:   { DEFAULT: '#a02828', deep: '#6a1818' }, // son (ít dùng)
  cream: { DEFAULT: '#f5ecd9', dim: '#c9bd9e' }, // chữ chính / chữ phụ
}
```

### Typography
```ts
fontFamily: {
  serif:  ['"Cormorant Garamond"', 'serif'],   // title, số liệu lớn
  sans:   ['"Be Vietnam Pro"', 'sans-serif'],  // body tiếng Việt
  brush:  ['"Ma Shan Zheng"', 'serif'],        // thư pháp Hán tự
}
```
Load qua `next/font/google` trong `app/layout.tsx`.

### Spacing / Radii
- **Border radius**: gần như luôn là `0` (square corners) hoặc `rounded-sm` (2px) cho ấn triện feel. Tránh `rounded-lg` trở lên.
- **Section padding**: `p-5 md:p-10` cho main, `p-6 md:p-8` cho card lớn, `p-4-5` cho card nhỏ

### Patterns đặc trưng (bắt buộc giữ)
1. **Góc ấn triện** — 4 `<span>` absolute ở 4 góc card quan trọng:
   ```tsx
   <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold"/>
   <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold"/>
   <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold"/>
   <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold"/>
   ```
2. **Title italic vàng gradient**:
   ```tsx
   <h2>Công Đức của <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">Minh</span></h2>
   ```
3. **Kicker**: `text-[11px] tracking-[0.25em] uppercase text-gold font-medium`
4. **Nút primary**: `bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold tracking-[0.2em] uppercase`
5. **Hán tự làm icon** — dùng `font-brush` thay vì emoji. Vd: 功 (công), 德 (đức), 香 (hương), 禪 (thiền), 齋 (trai/chay), 到 (đến/điểm danh), 願 (nguyện), 命 (mệnh).

---

## Data Model

```ts
// types/cong-duc.ts
export type RitualState = {
  checkin: boolean;
  incense: boolean;
  meditation: boolean;
  fasting: 'done' | 'skipped' | null; // chỉ active ngày Rằm (15) / Mùng 1 âm lịch
};

export type UnlockedFeatures = {
  extraChart: boolean;       // giá 150
  deepLuanGiai: boolean;     // giá 80
  detailedHours: boolean;    // giá 50
  weddingDate: boolean;      // giá 120
  consultVoucher: boolean;   // giá 200
};

export type CongDucLogEntry = {
  date: string;    // "DD/MM"
  action: string;
  amount: number;  // + earn, - spend
};

export type CongDucState = {
  balance: number;
  totalEarned: number;
  streak: number;           // chuỗi ngày liên tiếp hiện tại
  longestStreak: number;
  lastCheckIn: string | null; // "YYYY-MM-DD"
  rituals: RitualState;
  unlocked: UnlockedFeatures;
  log: CongDucLogEntry[];
};
```

### Server schema (Prisma suggestion)
```prisma
model CongDuc {
  userId         String   @id
  balance        Int      @default(0)
  totalEarned    Int      @default(0)
  streak         Int      @default(0)
  longestStreak  Int      @default(0)
  lastCheckIn    DateTime?
  unlocked       Json     // UnlockedFeatures
  updatedAt      DateTime @updatedAt
  logs           CongDucLog[]
  dailyRituals   DailyRitual[]
}

model DailyRitual {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime @db.Date  // ngày thực hiện
  checkin   Boolean  @default(false)
  incense   Boolean  @default(false)
  meditation Boolean @default(false)
  fasting   String?  // 'done' | 'skipped' | null
  @@unique([userId, date])
}

model CongDucLog {
  id       String   @id @default(cuid())
  userId   String
  action   String
  amount   Int
  createdAt DateTime @default(now())
}
```

### Server Actions cần làm
- `earnCongDuc(userId, amount, action)` — atomic update balance + totalEarned + log
- `spendCongDuc(userId, amount, featureKey)` — check balance ≥ amount, update, log, set unlocked[key] = true
- `completeRitual(userId, kind, reward, label)` — idempotent per (userId, today, kind); update DailyRitual + earn
- `checkIn(userId)` — idempotent per day; update streak (nếu yesterday ≥ 1 ritual: streak++; else: streak = 1); reward +10; bonus +50 nếu streak chạm mốc 7
- `getCongDucState(userId)` — tổng hợp state cho UI

**Idempotency**: Mỗi ritual chỉ được count 1 lần/ngày. Key: `(userId, date, ritualKind)`.

**Streak logic**:
- Streak tăng khi user hoàn thành ≥1 ritual trong ngày
- Streak reset về 0 nếu bỏ nguyên 1 ngày
- Mốc bonus: streak chạm 7 → +50 công đức, hoa sen "viên mãn" (tất cả 8 cánh nở + lớp trong)
- Hoa sen UI display `Math.min(streak, 7)`

**Fasting (ăn chay)**: chỉ khả dụng ngày Rằm (15) và Mùng 1 âm lịch. Cần lunar calendar helper (gợi ý dùng package `lunar-javascript` hoặc `chinese-lunar-calendar` — check trước trong codebase có sẵn không).

---

## Screens / Views

### 1. Sidebar Widget (luôn visible)
**File prototype**: `cong-duc-ui.jsx` — component `CongDucSidebarWidget`

- **Vị trí**: giữa sidebar, dưới nav items, trên block Hội viên
- **Kích thước**: full width sidebar (~216px), padding `p-3`
- **Background**: `bg-gradient-to-br from-ink-3 to-ink`, `border border-gold/30`, hover `border-gold/60`
- **Góc ấn triện nhỏ**: `w-2.5 h-2.5` ở top-left và bottom-right (chỉ 2 góc, không 4)
- **Layout**: flex ngang, `gap-3`:
  - Hoa sen SVG 40×40 (component `LotusStreak` thu nhỏ)
  - Text stack: kicker "Công Đức" (9px, tracking 0.22em), số balance (font-serif 18px, gradient vàng), "Chuỗi N ngày" (10px, cream-dim)
- **Behavior**: click → set active page = 'congduc' (router.push('/dashboard/cong-duc') trong Next.js)

### 2. Menu Item "Công Đức"
**Vị trí**: trong nav sidebar, giữa "Hôm nay" và "Vận niên"
- Icon Hán tự: 功 (font-brush, text-xl)
- Label: "Công Đức"
- Active state: gradient vàng trái sang phải + border-left vàng

### 3. Công Đức Page (main view)
**File prototype**: `cong-duc-section.jsx` — component `CongDucPage`
**Route gợi ý**: `/dashboard/cong-duc`

Layout (mobile → desktop):
```
[ Hero full-width                              ]
[ [ Rituals (4 cards 2x2 grid)  ][ Log        ]]
[ [ Shop (5 cards 2x2+1)        ][ Cúng dường]]
```
- Desktop: grid `1fr 360px`, gap `6-8`
- Mobile: single column

#### 3a. Hero — `CongDucHero`
- **Background**: `bg-gradient-to-br from-ink-2 via-ink-3 to-ink-2`, border `border-gold/30`
- **4 góc ấn triện** `w-6 h-6`
- **Background glyph** (decoration): 
  - "功德" text `font-brush text-[220px] text-gold/[0.04]` absolute `-right-8 -bottom-10`
  - "蓮" text `font-brush text-[80px] text-gold/[0.05]` absolute `-left-4 top-4`
- **Grid**: `md:grid-cols-[auto_1fr] gap-8 md:gap-12 p-6 md:p-10`
- **Left**: hoa sen 220px bao bởi vòng tròn xoay chậm:
  - Vòng border `border-gold/15 rounded-full`, `inset-[-20px]`
  - Animation: `rotate 120s linear infinite`
  - 4 chữ Can Chi trên vòng: 卯 (top), 酉 (bottom), 子 (left), 午 (right) — `font-brush text-xs text-gold/60`
- **Right**:
  - Kicker: "Thiện tâm · Tu dưỡng"
  - Title: "Công Đức của *{name}*" (name italic gradient vàng)
  - Quote: *"Tích thiện chi gia, tất hữu dư khánh" — mỗi ngày thêm một phần tâm an, hoa sen nở thêm một cánh.* (italic, cream-dim)
  - 3 stats ngang: **Số dư** (font-serif 40-48px gradient vàng + chữ 功), **Chuỗi hiện tại** (N ngày, có "Kỷ lục: M"), **Tổng đã tích**

#### 3b. Hoa sen (LotusStreak) — quan trọng nhất về visual
**File prototype**: `cong-duc-ui.jsx` — component `LotusStreak`

- SVG `viewBox="0 0 {size} {size}"`, props `{streak: 0-7, size: 40|220}`
- **2 vòng halo ngoài**: `border-gold/8` solid + `border-gold/15` dashed (stroke-dasharray 2 4)
- **8 cánh ngoài** (petalCount=8), bắt đầu từ trên (angle = -90°), mỗi cánh lệch 45°:
  - Ellipse `rx=0.075*size, ry=0.16*size`, cy offset `-0.22*size`
  - **Bloomed** (i < streak): fill `url(#petal-bloomed)` — linear gradient `#f4cf73 → #d4a24b → #8a6a2a`, opacity 1, stroke `#d4a24b/60`, có gân cánh (line)
  - **Active** (i === streak): thêm `filter: url(#petal-glow)` — feGaussianBlur stdDev 3 + feMerge
  - **Dormant** (i > streak): fill `#2a2018 → #14100a`, opacity 0.35
  - Transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1)`
- **8 cánh trong** (chỉ hiện khi `streak >= 4`), lệch 22.5°:
  - Nhỏ hơn: rx 0.05, ry 0.1, cy offset -0.12
  - Hiện dần: visible khi `i < streak - 3`
- **Tâm sen**: circle `r=0.07*size`, fill radialGradient vàng
- **5 hạt đài sen**: circle nhỏ quanh tâm, radius 0.035*size, hạt 0.012*size, fill `#8a6a2a`
- **Số streak ở giữa**: text-anchor middle, font-serif, fontSize 0.06*size, fill `#14100a`

Không cần animate rotate — việc nở cánh đã đủ.

#### 3c. Daily Rituals — `DailyRituals`
4 ritual cards trong grid `sm:grid-cols-2 gap-3-4`:

| glyph | title | subtitle | reward | trigger | disabled when |
|---|---|---|---|---|---|
| 到 | Điểm danh sáng sớm | Chạm một cái để khởi ngày mới an lành | 10 | instant (1 click) | đã làm hôm nay |
| 香 | Đốt nén hương | Thắp hương, tịnh tâm trong 8 giây | 15 | mở IncenseRitual modal | đã làm hôm nay |
| 禪 | Thiền niệm | Ngồi tĩnh lặng 5-15 phút trọn vẹn | 20 | mở MeditationTimer modal | đã làm hôm nay |
| 齋 | Ăn chay ngày Rằm, Mùng 1 | — | 25 | instant | không phải Rằm/Mùng 1 âm |

**RitualCard component** (`cong-duc-ui.jsx`):
- Background: `bg-gradient-to-br from-ink-2 to-ink-3`
- Border states: idle `border-gold/25`, hover `border-gold/60`, done `border-emerald-500/30 opacity-70`, disabled `border-gold/10 opacity-50`
- Góc ấn triện `w-3 h-3` (chỉ 2 góc top-left + bottom-right), opacity 50 → 100 on hover
- Icon box 56×56 với font-brush text-4xl
- Done state: icon đổi thành `✓`, màu emerald
- Bottom: `+N Công Đức` với chữ 功 vàng

**Streak bonus indicator** dưới 4 cards: row `border-gold/15 bg-ink-2/50 p-3-4`, hiển thị "Hoàn tất 7 ngày liên tiếp được +50 công đức", đếm `{streak}/7`.

#### 3d. Incense Ritual Modal — `IncenseRitual`
**File prototype**: `cong-duc-ui.jsx`

- Full-screen overlay `bg-ink/85 backdrop-blur-md z-[100]`
- Modal: `max-w-md`, `bg-gradient-to-b from-ink-2 to-ink-3 border-gold/40`, 4 góc ấn triện `w-5 h-5`
- **Phases**: `idle` → `burning` → `done`
- **Idle phase**:
  - Title: "Tịnh tâm, đốt nén hương" (italic vàng)
  - Chữ "香 · 敬"
  - Nhang static (chỉ thân, đế)
  - Quote nhỏ: *"Một nén hương thành tâm — một phần tâm an tĩnh. Hít sâu, buông nhẹ, và khởi ngày mới."*
  - Nút "Thắp hương"
- **Burning phase** (8000ms, dùng `requestAnimationFrame`):
  - Phát chuông `playBell()` ngay khi bắt đầu
  - Khói bay: 5 `<span>` absolute với delay 0s/0.3s/0.6s/0.9s/1.2s
    ```css
    .smoke-puff {
      width: 40px; height: 40px; border-radius: 50%;
      background: radial-gradient(circle, rgba(245,236,217,0.22), transparent);
      filter: blur(8px);
      animation: smokeRise 3.5s ease-in infinite;
    }
    @keyframes smokeRise {
      0%   { transform: translate(-50%, 0) scale(0.4); opacity: 0; }
      15%  { opacity: 0.8; }
      100% { transform: translate(calc(-50% + 30px), -220px) scale(2.2); opacity: 0; }
    }
    ```
  - Thân nhang co lại theo progress: `height: 200px * (1 - progress * 0.7)`
  - Đầu nhang có đốm cháy glow cam: `box-shadow: 0 0 14px 4px rgba(255,160,50,0.75)`, class `animate-pulse`
  - Status text đổi theo progress: `< 0.33` "Định tâm", `< 0.66` "Tịnh niệm", `else` "Hồi hướng"
  - Progress bar dưới: `bg-gradient-to-r from-gold-bright to-gold`
  - Không cho đóng modal khi đang burning
- **Done phase** (1800ms rồi auto-close):
  - Phát chuông lần 2 `playBell()`
  - Hiển thị "圓滿 / Viên mãn / +15 Công Đức" (animate-fade-up)
  - Gọi server action `completeRitual(userId, 'incense', 15, 'Đốt nhang buổi sáng')`

#### 3e. Meditation Timer Modal — `MeditationTimer`
- Overlay tương tự
- **Idle**: chọn 5/10/15 phút (pill buttons), nút "Bắt đầu"
- **Running**:
  - SVG circle progress 200×200 (quay -90°):
    - Background circle `stroke-gold/12`
    - Progress circle với `strokeDasharray=2πr`, `strokeDashoffset = 2πr * (1 - progress)`, gradient vàng
  - Countdown MM:SS ở giữa (font-serif 60px, tabular-nums)
  - "Thở sâu, buông lo" (tracking-widest uppercase)
  - Vòng thở breathe 6s scale(1→1.06) opacity(0.6→1)
- Phát chuông khi hoàn tất → gọi `completeRitual(userId, 'meditation', 20, 'Thiền niệm trọn vẹn')`

#### 3f. Shop Grid — `ShopGrid`
5 items (chi tiết ở Data Model). Grid `md:grid-cols-2 gap-3-4`.

Mỗi item card:
- `bg-ink-2 border-gold/20` (hoặc `border-emerald-500/30` nếu đã mở)
- Icon box 56×56 font-brush + Hán tự
- Title, desc (text-cream-dim 12.5px)
- Footer row: `功 {price}` + nút "Hồi hướng" (gradient vàng) / "Cần thêm N" (disabled) / "Sử dụng →" (nếu đã mở)

Khi click "Hồi hướng": gọi server action `spendCongDuc`, toast confirm nhẹ nhàng.

#### 3g. Log — `CongDucLog`
Sidebar cột phải:
- Header: kicker "Sổ công đức" + title "Những việc gần đây"
- `ul divide-y divide-gold/10`, max-height với overflow-y-auto
- Mỗi row: date (10 chars) + action + amount (`+N` vàng-bright hoặc `-N` đỏ nhạt)
- Fetch 15 entries mới nhất

#### 3h. Cúng dường (kín đáo)
Dưới log, trên border-top nhẹ. Chỉ là 1 button inline:
```
香  Cúng dường
    để nhận thêm công đức, hộ trì trang tri thức này  →
```
Click mở **CungDuongModal** với 3 tier:
- Tiểu 50,000đ → +300 công đức
- Trung 100,000đ → +650 công đức (popular — border-gold, bg-gold/5)
- Đại 200,000đ → +1,500 công đức

Footer note nhỏ: *"Cúng dường không thay thế nghi thức hàng ngày — công đức thật nhất vẫn đến từ tâm an và thiện hạnh."*

Tích hợp payment: dùng Stripe / VNPay / Momo tùy codebase. Sau payment success, server call `earnCongDuc(userId, tier.duc, 'Cúng dường {tier.label}')`.

---

## Interactions & Behavior

### Animations
| Element | Animation | Duration | Easing |
|---|---|---|---|
| Hoa sen cánh nở | opacity + transform | 0.8s | cubic-bezier(0.4, 0, 0.2, 1) |
| Modal vào | fadeUp (tailwind.config có sẵn) | 0.5s | ease |
| Vòng Can Chi hero | rotate 360° | 120s | linear infinite |
| Khói nhang | smokeRise | 3.5s | ease-in infinite (5 puff, delay 0-1.2s) |
| Vòng thở thiền | breathe (scale 1→1.06) | 6s | ease-in-out infinite |
| Đầu nhang cháy | animate-pulse (tailwind) | — | — |
| Meditation progress | stroke-dashoffset | 1s | linear |
| Button hover border | border-color | 200ms | ease |

### Bell sound (Web Audio API)
Port y nguyên từ prototype:
```ts
export function playBell() {
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  const now = ctx.currentTime;
  const freqs = [196, 392, 587]; // G3, G4, D5
  const gains = [0.5, 0.3, 0.15];
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gains[i], now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 4);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(now); osc.stop(now + 4);
  });
  setTimeout(() => ctx.close(), 4500);
}
```
Lưu ý: Chỉ gọi `playBell()` trong response của user gesture (click) để Safari/iOS không block AudioContext.

### Accessibility
- Modal: trap focus, `role="dialog"`, `aria-modal="true"`, Escape để đóng (trừ khi đang burning/meditating)
- Ritual card: `aria-disabled` khi done/disabled
- Bell sound: có thể toggle tắt; respect `prefers-reduced-motion` cho khói + vòng xoay
- Countdown: `aria-live="polite"` cho screen reader

### Responsive
- Mobile: single column, modal `max-w-md` vẫn fit
- Hero stack dọc trên mobile (grid-cols-1)
- Hoa sen scale xuống 160px trên mobile nếu chật

---

## State Management (Next.js)

### Approach
- **Server source of truth**: Prisma model `CongDuc` + `DailyRitual` + `CongDucLog`
- **Client cache**: React Query / TanStack Query với key `['cong-duc', userId]`
- **Server Actions** (app/actions/cong-duc.ts):
  - `checkIn()` / `completeIncense()` / `completeMeditation()` / `completeFasting()`
  - `spendCongDuc(featureKey)`
  - `purchaseOffering(tier)` — trả về Stripe checkout URL
- Sau mỗi mutation: `revalidatePath('/dashboard/cong-duc')` + invalidate query

### Optimistic updates
- Check-in: optimistic +10 ngay lập tức, rollback nếu server fail
- Ritual complete: chỉ optimistic sau khi animation xong (bell + "Viên mãn")

### Daily reset
- Rituals reset lúc 00:00 theo timezone user (Asia/Ho_Chi_Minh default)
- Streak check: cron job hoặc lazy check khi user vào trang
  - Nếu `lastActivity < yesterday`: streak = 0
  - Cập nhật `longestStreak = max(longestStreak, streak)` khi streak thay đổi

---

---

## Landing Page (bonus — toàn bộ trang chủ marketing)

File `Landing Page (Tailwind).html` + `tailwind-components.jsx` là **trang chủ marketing** của Thiên Cơ Các. Next.js route gợi ý: `/` (root).

### Sections (theo thứ tự render)
1. **Nav** — Logo trái, 4 links giữa (Dịch vụ / Tra mệnh / Thư phòng / Về Thiên Cơ Các), nút "Đăng nhập" phải. Sticky, bg `bg-ink/80 backdrop-blur`.
2. **Hero** — Full viewport, stars background (3 radial-gradient + animation twinkle 6s), 4-5 "quẻ floating" (hexagrams Bát Quái) trang trí, tiêu đề lớn có chữ highlight gradient vàng, 2 CTA ("Bắt đầu tra cứu" primary + "Xem dịch vụ" ghost). Có vòng Bát Quái xoay 80s ở background.
3. **Services** — 6 dịch vụ (Tử vi, Phong thủy, Ngũ hành, Bát tự, Hợp tuổi, Xem ngày) trong grid 2x3 hoặc 3x2. Mỗi card: Hán tự `font-brush text-6xl` + title + desc + "Tìm hiểu →".
4. **MiniTool** (`#tool`) — Tra mệnh nhanh: 3 input (day/month/year) → hiển thị kết quả mệnh (Kim/Mộc/Thủy/Hỏa/Thổ) với **BaguaRing** (SVG vòng 8 quẻ xoay quanh tâm có icon Ngũ hành), nạp âm, lời khuyên. Dùng helper `window.NguHanh` từ `ngu-hanh.js` — port sang `lib/ngu-hanh.ts`.
5. **Blog** (`#blog`) — Grid 3 bài viết mẫu, mỗi card có date + category + title + excerpt.
6. **Footer** — 4 cột links + copyright.

### Modal: AuthModal
- Tabs "Đăng nhập" / "Đăng ký"
- Form: email, password (có toggle hiện/ẩn), nút primary
- Social login placeholder (Google, Facebook)
- Next.js: dùng NextAuth hoặc Clerk tùy codebase

### Tweaks Panel (prototype-only — KHÔNG port)
`TweaksPanel` trong prototype là công cụ designer-only (cho phép đổi copy live). Production Next.js KHÔNG cần.

### Animation keyframes (thêm vào `tailwind.config.ts`)
```ts
animation: {
  float: 'float 12s ease-in-out infinite',
  'float-reverse': 'float 14s ease-in-out infinite reverse',
  twinkle: 'twinkle 6s ease-in-out infinite',
  glow: 'glowPulse 4s ease-in-out infinite',
  'rotate-slow': 'rotate 80s linear infinite',
  bob: 'bob 2s ease-in-out infinite',
  'fade-up': 'fadeUp 0.6s ease',
  'fade-in': 'fadeIn 0.3s ease',
  'pop-in': 'popIn 0.4s cubic-bezier(0.2,0.9,0.3,1.1)',
},
keyframes: {
  float: { '0%,100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(40px,-30px)' } },
  twinkle: { '0%,100%': { opacity: '0.7' }, '50%': { opacity: '1' } },
  glowPulse: { '0%,100%': { opacity: '0.6', transform: 'scale(0.95)' }, '50%': { opacity: '1', transform: 'scale(1.05)' } },
  rotate: { to: { transform: 'rotate(360deg)' } },
  bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(4px)' } },
  fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
  fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
  popIn: { from: { opacity: '0', transform: 'translateY(16px) scale(0.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
}
```

### Stars utility (CSS custom trong `globals.css`)
```css
.stars {
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(244,207,115,0.8), transparent),
    radial-gradient(1px 1px at 80% 70%, rgba(244,207,115,0.6), transparent),
    radial-gradient(1px 1px at 40% 80%, rgba(244,207,115,0.7), transparent);
  background-size: 400px 400px;
  animation: twinkle 6s ease-in-out infinite;
}
```

### Components cần port (`tailwind-components.jsx`)
| Component | Mục đích | Next.js route |
|---|---|---|
| `Nav` | Sticky navigation | Layout root |
| `Hero` | Landing hero | `app/page.tsx` |
| `Services` | Grid 6 dịch vụ | `app/page.tsx` |
| `MiniTool` + `BaguaRing` + `ElementBadge` + `MenhResult` | Widget tra mệnh nhanh | `app/page.tsx` (Client) |
| `Blog` | Grid preview bài viết | `app/page.tsx` (có thể fetch từ CMS) |
| `Footer` | Footer | Layout |
| `AuthModal` | Login/Signup | Global modal + NextAuth |

### CTA flow
- Hero "Bắt đầu tra cứu" → mở AuthModal (nếu chưa login) hoặc `/dashboard`
- Nav "Đăng nhập" → AuthModal
- Services card click → `/dashboard` section tương ứng
- Sau login thành công → redirect `/dashboard`

### Link giữa Landing ↔ Dashboard
- Landing `/` → Login → Dashboard `/dashboard`
- Dashboard sidebar logo click → `/` (quay về landing)

---

## Files in Bundle
```
design_handoff_cong_duc/
├── README.md                              ← file này
│
│ ── DASHBOARD (tính năng Công Đức) ──
├── Thu Phong (Dashboard) v2.html          ← dashboard hoàn chỉnh với Công Đức
├── cong-duc.jsx                           ← Provider + hooks + Web Audio bell
├── cong-duc-ui.jsx                        ← LotusStreak SVG, IncenseRitual, MeditationTimer, SidebarWidget, RitualCard
├── cong-duc-section.jsx                   ← Hero, DailyRituals, ShopGrid, Log, CungDuong
│
│ ── LANDING PAGE (trang chủ marketing) ──
├── Landing Page (Tailwind).html           ← landing page hoàn chỉnh
├── tailwind-components.jsx                ← Nav, Hero, Services, MiniTool, BaguaRing, Blog, Footer, AuthModal
│
│ ── SHARED ──
├── ngu-hanh.js                            ← Engine Ngũ hành / Lục thập hoa giáp (dashboard + MiniTool đều dùng)
└── assets/logo.jpg                        ← logo Thiên Cơ Các
```

## Assets
- **Logo**: `assets/logo.jpg` — logo Thiên Cơ Các (dùng trong sidebar header, không liên quan feature Công Đức nhưng cần cho dashboard shell)
- **Hán tự**: render bằng font `Ma Shan Zheng` (Google Fonts, free). Không cần image.
- **Chuông**: tạo bằng Web Audio, không cần file audio.
- **Hoa sen**: 100% SVG inline, không cần image.

## Copy Reference (tiếng Việt — giữ chính xác)
| Key | Copy |
|---|---|
| Kicker hero | "Thiện tâm · Tu dưỡng" |
| Quote hero | "Tích thiện chi gia, tất hữu dư khánh — mỗi ngày thêm một phần tâm an, hoa sen nở thêm một cánh." |
| Ritual 1 title | "Điểm danh sáng sớm" |
| Ritual 2 title | "Đốt nén hương" |
| Ritual 3 title | "Thiền niệm" |
| Ritual 4 title | "Ăn chay ngày Rằm, Mùng 1" |
| Incense intro | "Một nén hương thành tâm — một phần tâm an tĩnh. Hít sâu, buông nhẹ, và khởi ngày mới." |
| Incense phases | "Định tâm" / "Tịnh niệm" / "Hồi hướng" |
| Incense done | "圓滿 / Viên mãn" |
| Streak bonus | "Hoàn tất 7 ngày liên tiếp được +50 công đức và mở hoa sen viên mãn." |
| Shop header | "Hồi hướng công đức / Dùng công đức mở tính năng" |
| Buy button | "Hồi hướng" (không dùng "Mua" / "Purchase") |
| Insufficient | "Cần thêm {N}" |
| Cung duong lead | "để nhận thêm công đức, hộ trì trang tri thức này" |
| Cung duong note | "Cúng dường không thay thế nghi thức hàng ngày — công đức thật nhất vẫn đến từ tâm an và thiện hạnh." |

---

## Testing Checklist
- [ ] Hoa sen nở đúng N cánh khi streak = 0..7
- [ ] Cánh trong chỉ hiện khi streak ≥ 4
- [ ] Sau khi điểm danh 7 ngày liên tiếp, tất cả 16 cánh (8 ngoài + 8 trong) đều nở + nhận +50 bonus
- [ ] Ritual idempotent: click đốt nhang 2 lần trong ngày chỉ earn 1 lần (15, không phải 30)
- [ ] Ăn chay chỉ active vào 15 và 1 âm lịch
- [ ] Streak reset về 0 nếu bỏ 1 ngày
- [ ] Modal incense không cho đóng khi đang burning
- [ ] Web Audio bell phát được trên iOS Safari (cần user gesture)
- [ ] Progress bar khói bay animation smooth trên mobile
- [ ] Spend: balance không bao giờ âm (server check trước khi commit)
- [ ] prefers-reduced-motion tắt khói + vòng xoay Can Chi
- [ ] Login khác máy: state load từ server, không bị mất streak
