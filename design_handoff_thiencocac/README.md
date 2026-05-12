# Handoff: Thiên Cơ Các — Ứng dụng Phật pháp & Tu tập

## Tổng quan

**Thiên Cơ Các** là web app Phật pháp gồm 2 phần:

- **Landing Page** — trang marketing giới thiệu sản phẩm, dẫn người dùng vào ứng dụng.
- **Tịnh Phòng (Dashboard)** — không gian tu tập cá nhân sau khi đăng nhập, gồm 9 module: Niệm Phật, Xăm Quan Âm, Hồi hướng công đức, Luân hồi nhân quả, Thiền quán, Tụng kinh, Người thân, Lì xì xuân, Công Đức.

Tinh thần: **Phật giáo Bắc tông Việt Nam, gần gũi hiện đại (theo phong cách sách Thích Nhất Hạnh)** — KHÔNG dùng chữ Hán hay yếu tố Đạo giáo/Tử vi. Visual ngôn ngữ: nền đen huyền, ấn triện vàng kim, chữ thư pháp Việt (Dancing Script).

---

## ⚠️ Về các file trong gói này

Các file HTML/JSX trong gói này là **design reference (mockup)** — không phải production code để copy nguyên xi. HTML hiện tại load React + Babel + Tailwind qua CDN (Babel Standalone in-browser) — chỉ dùng cho prototype.

**Nhiệm vụ của bạn:** Recreate các design này trong codebase mục tiêu (React/Next.js/Vue/SwiftUI/...) theo pattern và library có sẵn của project. Nếu chưa có codebase, đề xuất: **Next.js 14 (App Router) + Tailwind + TypeScript** — match nguyên si với prototype hiện tại.

---

## 🎯 Fidelity: HIGH-FIDELITY

Các mockup ở mức pixel-perfect. Hãy recreate **chính xác** color/typography/spacing/border/shadow như mô tả bên dưới. Mọi component đã được hoàn thiện ở mức production-ready visual.

**Nếu lần trước đã setup mà UI không khớp 100%, nguyên nhân thường gặp:**
1. Thiếu Google Font (Dancing Script, Cormorant Garamond, Be Vietnam Pro)
2. Tailwind config thiếu các custom color/animation/keyframes (xem `tailwind.config` đầy đủ bên dưới)
3. Bỏ sót pattern "Góc ấn triện" (4 `<span>` border-corners trên card)
4. Dùng emoji/Hán tự thay vì giữ nguyên text tiếng Việt + SVG icon

---

## 🎨 Design Tokens (Tailwind Config bắt buộc)

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        ink:     { DEFAULT: '#14100a', 2: '#1c160e', 3: '#2a1f12' },  // Nền đen 3 lớp
        wood:    { DEFAULT: '#3a2418', 2: '#4a2e1c', light: '#6a4628' }, // Nâu gỗ chùa
        saffron: { DEFAULT: '#d4a04a', bright: '#e6b85a', deep: '#a07020' }, // Vàng nghệ (alias = gold)
        gold:    { DEFAULT: '#d4a04a', bright: '#e6b85a', deep: '#a07020' }, // Vàng kim ấn triện
        lotus:   { DEFAULT: '#c87a5a', deep: '#a85838' },              // Sen son (alias = red)
        red:     { DEFAULT: '#c87a5a', deep: '#a85838' },
        cream:   { DEFAULT: '#f0e4cc', dim: '#c9b896' }                // Chữ kem
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],   // Heading / hiển thị (cổ điển)
        sans:  ['"Be Vietnam Pro"', 'sans-serif'],  // Body — font Việt mặc định
        brush: ['"Dancing Script"', 'cursive']      // Thư pháp Việt (KHÔNG dùng Ma Shan Zheng / font Trung)
      },
      animation: {
        'rotate-slow': 'rotate 80s linear infinite',
        'fade-up':     'fadeUp 0.5s ease'
      },
      keyframes: {
        rotate: { to: { transform: 'rotate(360deg)' } },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  }
}
```

### Google Fonts (preconnect + import)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Dancing+Script:wght@500;600;700&display=swap" rel="stylesheet" />
```

### Body baseline

```css
body { font-family: 'Be Vietnam Pro', sans-serif; background: #14100a; color: #f0e4cc; }
html { scroll-behavior: smooth; }
```

---

## 🧩 Patterns cốt lõi (PHẢI nhớ — đây là điểm dễ sai)

### 1. Góc ấn triện (Seal Corners) — dấu nhận diện brand

Card quan trọng có 4 góc viền vàng kim như con dấu cổ. Đây là pattern XUẤT HIỆN KHẮP NƠI:

```jsx
function SealCorners({ size = 'sm', color = '#d4a04a' }) {
  const w = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
  const base = `pointer-events-none absolute ${w}`;
  return (
    <>
      <span className={`${base} -top-px -left-px  border-t border-l`} style={{ borderColor: color }} />
      <span className={`${base} -top-px -right-px border-t border-r`} style={{ borderColor: color }} />
      <span className={`${base} -bottom-px -left-px  border-b border-l`} style={{ borderColor: color }} />
      <span className={`${base} -bottom-px -right-px border-b border-r`} style={{ borderColor: color }} />
    </>
  );
}
// Dùng: <div className="relative ..."><SealCorners /> ...content... </div>
```

### 2. Title có highlight vàng gradient

```jsx
<h1 className="font-serif">
  Tu tập <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">an lạc</span>
</h1>
```

### 3. Kicker (eyebrow nhỏ trên heading)

```jsx
<div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium">An lạc · Trí tuệ</div>
```

### 4. Nút primary (gradient vàng kim)

```jsx
<button className="px-7 py-3.5 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink font-semibold text-[14px] tracking-wide rounded-sm shadow-[0_8px_24px_-8px_rgba(212,160,74,0.5)] hover:-translate-y-px hover:shadow-[0_0_0_3px_rgba(212,160,74,0.3),0_12px_32px_-6px_rgba(212,160,74,0.7)] transition-all">
  Vào tịnh phòng →
</button>
```

### 5. SVG icon (KHÔNG dùng emoji)

Sidebar và nhiều chỗ dùng line-icon SVG, stroke-width 1.5, viewBox 0 0 24 24. Xem `NAV_ICONS` trong `Tinh Phong (Dashboard).html` line 100–115 — đã có 12 path sẵn cho: home / today / congduc / quedich / luanhoi / niemphat / thien / tungkinh / nguoithan / lixi / history / sages.

### 6. Tránh tuyệt đối

- ❌ Chữ Hán (天機閣, 占, 甲, 福...) — đã thay hết bằng tiếng Việt
- ❌ Emoji (🙏, ☸️, 🪷, 🔥...) — dùng SVG icon hoặc text thuần
- ❌ Font Ma Shan Zheng (font thư pháp Trung) — đã thay bằng Dancing Script
- ❌ Yếu tố Đạo giáo/Tử vi/Phong thủy thuần (Ngũ hành/Lục thập hoa giáp đã loại khỏi sidebar)

---

## 📐 Cấu trúc trang

### A. Landing Page (`Landing Page.html`)

| Section | File component | Mục đích |
|---|---|---|
| Hero | `tailwind-components.jsx` → `Hero` | Câu chuyện brand + CTA "Vào Tịnh Phòng" |
| Features | `tailwind-components.jsx` → `Features` | Lưới 6 tính năng chính (Niệm Phật, Xăm, Hồi hướng...) |
| How it works | `tailwind-components.jsx` → `HowItWorks` | 3 bước onboarding |
| Testimonials | `tailwind-components.jsx` → `Testimonials` | Lời chứng thực |
| Pricing/CTA cuối | `tailwind-components.jsx` → `Pricing`, `Footer` | Gói Phật tử / Thượng khách |

→ Đọc `tailwind-components.jsx` để xem markup chính xác từng section.

### B. Tịnh Phòng — Dashboard (`Tinh Phong (Dashboard).html`)

Layout: **Sidebar trái cố định (260px desktop, drawer mobile) + Vùng nội dung phải**.

Sidebar gồm 9 mục (đã bỏ Hôm nay / Lịch sử / Pháp sư vì chưa có chức năng):

| ID | Label | Component | File |
|---|---|---|---|
| `home` | Tịnh phòng | `<HomeView />` (default) | trong `Tinh Phong (Dashboard).html` |
| `congduc` | Công Đức | `<CongDucPage />` | `cong-duc-section.jsx` (+ `cong-duc.jsx`, `cong-duc-ui.jsx`) |
| `quedich` | Xăm Quan Âm | `<XamQuanAmPage />` | `xam-quan-am-section.jsx` (+ `xam-quan-am.js`) |
| `luanhoi` | Luân hồi nhân quả | `<LuanHoiPage />` | `luan-hoi-section.jsx` |
| `niemphat` | Niệm Phật | `<NiemPhatPage />` | `niem-phat-section.jsx` |
| `thien` | Thiền quán | `<ThienQuanPage />` | `thien-quan-section.jsx` |
| `tungkinh` | Tụng kinh | `<TungKinhPage />` | `tung-kinh-section.jsx` |
| `nguoithan` | Người thân | `<NguoiThanPage />` | `nguoi-than-section.jsx` |
| `lixi` | Lì xì xuân | `<LiXiPage />` | `li-xi-section.jsx` |

Home view (khi `active === 'home'`) gồm: `XamPromoCard` → `ChartsSection` → grid (`LaSoHomNayCard` + `Reminders` + sidebar widgets) — chi tiết xem dashboard HTML từ line ~420.

---

## 🔌 Logic modules

- **`ngu-hanh.js`** — Tra Lục thập hoa giáp, can chi, mệnh nạp âm theo năm sinh. CHỈ DÙNG nội bộ (cho widget "Lá số hôm nay" hiển thị can chi của ngày). Đã được loại khỏi UI người dùng cuối.
- **`xam-quan-am.js`** — Database 100 lá xăm Quan Âm (số thẻ, cát hung, lời giải).
- **`cong-duc.jsx`** — Engine tính công đức (action → points).

---

## 🎬 Interactions cần re-implement

| Tương tác | Behavior |
|---|---|
| Click sidebar item | Đổi state `active`, mobile thì đóng drawer |
| Mở Niệm Phật | Lần chuỗi 108 hạt (tap để +1, vòng tròn xoay, lưu progress) |
| Bốc xăm Quan Âm | Animation lắc thẻ, reveal lá xăm, hiển thị lời giải |
| Hồi hướng | Form chọn người thân + loại công đức → submit |
| Thiền quán | Timer countdown (5/10/25 phút) + chuông kết thúc |
| Tụng kinh | Audio player + highlight dòng kinh đang đọc |
| Lì xì xuân | Wizard 4 bước (Quà → Người nhận → Lời chúc → Gửi) + preview phong bao real-time |

Animation transitions: `fade-up 0.5s ease` cho card xuất hiện, `rotate-slow 80s linear infinite` cho lá pháp luân.

---

## 📂 Files trong gói

```
design_handoff_thiencocac/
├── README.md                          ← Bạn đang đọc
├── Landing Page.html                  ← Trang marketing (entry 1)
├── Tinh Phong (Dashboard).html        ← Dashboard (entry 2)
├── tailwind-components.jsx            ← Components landing
├── ngu-hanh.js                        ← Engine can chi (nội bộ)
├── xam-quan-am.js                     ← Database 100 lá xăm
├── cong-duc.jsx                       ← Engine công đức
├── cong-duc-ui.jsx                    ← UI helpers công đức
├── cong-duc-section.jsx               ← Trang Công Đức
├── xam-quan-am-section.jsx            ← Trang Xăm Quan Âm
├── niem-phat-section.jsx              ← Trang Niệm Phật
├── luan-hoi-section.jsx               ← Trang Luân hồi nhân quả
├── thien-quan-section.jsx             ← Trang Thiền quán
├── tung-kinh-section.jsx              ← Trang Tụng kinh
├── nguoi-than-section.jsx             ← Trang Người thân (hồi hướng)
├── li-xi-section.jsx                  ← Trang Lì xì xuân
├── la-so-hom-nay.jsx                  ← Widget "Lá số hôm nay" trên Home
└── assets/
    └── logo.jpg                       ← Logo brand
```

---

## ✅ Checklist khi recreate

- [ ] Tailwind config có đủ 5 color groups (`ink`, `wood`, `gold/saffron`, `lotus/red`, `cream`) với DEFAULT/2/3/bright/deep variants
- [ ] Import đủ 3 Google Fonts (Cormorant Garamond + Be Vietnam Pro + Dancing Script)
- [ ] Body có `bg-ink text-cream font-sans`
- [ ] Component `SealCorners` được dùng trên mọi card quan trọng
- [ ] Title pattern (italic + bg-clip-text gradient vàng) chính xác
- [ ] Kicker pattern (`text-[11px] tracking-[0.25em] uppercase text-gold`)
- [ ] Sidebar dùng SVG icons (12 paths trong `NAV_ICONS`), KHÔNG dùng chữ/emoji
- [ ] Tất cả heading dùng `font-serif`, body dùng `font-sans`, chữ thư pháp dùng `font-brush` (Dancing Script)
- [ ] Animations `fade-up` và `rotate-slow` được định nghĩa trong `tailwind.config`
- [ ] KHÔNG có chữ Hán / emoji / font Trung Quốc nào trong UI
