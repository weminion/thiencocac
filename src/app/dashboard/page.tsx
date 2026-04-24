import Link from 'next/link';

const CHART_SAMPLES = [
  { name: 'Nguyễn Văn A', year: 1990, element: 'Kim', color: '#d4a24b' },
  { name: 'Trần Thị B', year: 1995, element: 'Thủy', color: '#4a90d9' },
  { name: 'Lê Minh C', year: 1988, element: 'Mộc', color: '#5aaa5a' },
];

const QUICK_TOOLS = [
  { href: '/dashboard/today',   glyph: '日', label: 'Hôm Nay',    desc: 'Giờ tốt xấu' },
  { href: '/dashboard/almanac', glyph: '曆', label: 'Vận Niên',   desc: 'Xem vận hạn' },
  { href: '/dashboard/merit',   glyph: '功', label: 'Công Đức',   desc: 'Tích công hằng ngày' },
  { href: '/dashboard/expert',  glyph: '師', label: 'Chuyên Gia', desc: 'Tư vấn trực tiếp' },
];

const REMINDERS = [
  { icon: '🕯️', text: 'Hôm nay là ngày Rằm — nên thắp hương', type: 'lunar' },
  { icon: '⏰', text: 'Giờ Thìn (7–9h) là giờ vàng hôm nay', type: 'hour' },
  { icon: '📅', text: 'Ngày mai có sao Thái Bạch — tránh xuất hành', type: 'caution' },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-[fadeUp_0.5s_ease]">

      {/* Charts section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-lg"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
          >
            命 Lá Số Của Bạn
          </h2>
          <Link
            href="/dashboard/charts"
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-cream-dim)' }}
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CHART_SAMPLES.map((c) => (
            <div
              key={c.name}
              className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-3"
                style={{ background: `${c.color}22`, color: c.color }}
              >
                {c.name.charAt(0)}
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--color-cream)' }}>{c.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-cream-dim)' }}>
                Năm {c.year} · Mệnh {c.element}
              </div>
            </div>
          ))}

          {/* Add new */}
          <button
            className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:opacity-80"
            style={{
              background: 'var(--color-ink-2)',
              border: '1px dashed rgba(212,162,75,0.3)',
              color: 'var(--color-cream-dim)',
            }}
          >
            <span className="text-2xl">+</span>
            <span className="text-xs">Thêm lá số</span>
          </button>
        </div>
      </section>

      {/* Today + Reminders row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Today card */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
        >
          <h2
            className="text-base mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
          >
            日 Hôm Nay
          </h2>

          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(212,162,75,0.1)', border: '1px solid rgba(212,162,75,0.3)' }}
            >
              <span className="text-2xl" style={{ fontFamily: 'var(--font-brush)', color: 'var(--color-gold)' }}>
                甲
              </span>
              <span className="text-xs mt-0.5" style={{ color: 'var(--color-cream-dim)' }}>Giáp</span>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-xs" style={{ color: 'var(--color-cream-dim)' }}>Ngày Can Chi: </span>
                <span className="text-sm" style={{ color: 'var(--color-cream)' }}>Giáp Tý</span>
              </div>
              <div>
                <span className="text-xs" style={{ color: 'var(--color-cream-dim)' }}>Tốt: </span>
                <span className="text-sm" style={{ color: '#5aaa5a' }}>Cúng tế, Xuất hành, Ký kết</span>
              </div>
              <div>
                <span className="text-xs" style={{ color: 'var(--color-cream-dim)' }}>Tránh: </span>
                <span className="text-sm" style={{ color: 'var(--color-red)' }}>Động thổ, Phá tường</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/today"
            className="mt-4 block text-center text-xs py-2 rounded-lg transition-colors"
            style={{
              background: 'rgba(212,162,75,0.1)',
              color: 'var(--color-gold)',
              border: '1px solid rgba(212,162,75,0.2)',
            }}
          >
            Xem đầy đủ giờ tốt →
          </Link>
        </div>

        {/* Reminders */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
        >
          <h2
            className="text-base mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
          >
            🔔 Nhắc Nhở
          </h2>

          <div className="space-y-3">
            {REMINDERS.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <span className="text-lg leading-none mt-0.5">{r.icon}</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-cream-dim)' }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick tools */}
      <section>
        <h2
          className="text-base mb-3"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
        >
          ⚡ Truy Cập Nhanh
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.15)' }}
            >
              <span className="text-2xl">{t.glyph}</span>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-cream)' }}>{t.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-cream-dim)' }}>{t.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Expert CTA */}
      <div
        className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(160,40,40,0.2), rgba(106,24,24,0.15))',
          border: '1px solid rgba(160,40,40,0.3)',
        }}
      >
        <div>
          <div
            className="text-base font-medium mb-1"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream)' }}
          >
            師 Cần tư vấn chuyên sâu?
          </div>
          <p className="text-sm" style={{ color: 'var(--color-cream-dim)' }}>
            Kết nối với các thầy phong thủy, tử vi hàng đầu
          </p>
        </div>
        <Link
          href="/dashboard/expert"
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 flex-shrink-0"
          style={{ background: 'var(--color-red)', color: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}
        >
          Xem chuyên gia
        </Link>
      </div>

    </div>
  );
}
