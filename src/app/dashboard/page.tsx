import Link from 'next/link';

const REMINDERS = [
  { when: 'Ngày mai',       what: 'Mồng 1 âm lịch — nên lên chùa, ăn chay, phóng sinh',                   tag: 'Ngày lành' },
  { when: 'Thứ 5 tuần này', what: 'Đến chùa lễ Phật, niệm Bồ Tát Quan Âm — nguyện cầu giải chướng',      tag: 'Đạo tràng' },
  { when: 'Rằm tháng 4',   what: 'Đại lễ Phật Đản — tắm Phật, tụng kinh, hồi hướng',                     tag: 'Đại lễ' },
  { when: 'Đầu tháng 5',   what: '14 ngày tịnh khẩu — giữ lời hòa ái, không vọng ngữ',                  tag: 'Tu tập' },
];

const MODULES = [
  { href: '/dashboard/niemphat',  label: 'Niệm Phật',        desc: 'Chuỗi 108 hạt' },
  { href: '/dashboard/quedich',   label: 'Xăm Quan Âm',      desc: 'Bốc một lá xăm' },
  { href: '/dashboard/thien',     label: 'Thiền quán',        desc: 'Tĩnh tâm 5–30 phút' },
  { href: '/dashboard/tungkinh',  label: 'Tụng kinh',         desc: 'Các bài kinh nhật tụng' },
  { href: '/dashboard/congduc',   label: 'Công Đức',          desc: 'Tích công hằng ngày' },
  { href: '/dashboard/nguoithan', label: 'Người thân',        desc: 'Hồi hướng, cầu an' },
  { href: '/dashboard/luanhoi',   label: 'Luân hồi nhân quả', desc: 'Tra nhân duyên đời trước' },
  { href: '/dashboard/lixi',      label: 'Lì xì xuân',        desc: 'Phong bao phước lộc' },
];

function SealCorners({ color = '#d4a24b' }: { color?: string }) {
  return (
    <>
      <span className="absolute -top-px -left-px w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -top-px -right-px w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -bottom-px -left-px w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -bottom-px -right-px w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: color }} />
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-8 space-y-6 animate-fade-up">

      {/* Xam promo card */}
      <div
        className="relative overflow-hidden p-6"
        style={{
          background: 'linear-gradient(135deg, var(--color-ink-2), var(--color-ink-3), var(--color-ink-2))',
          border: '1px solid rgba(212,162,75,0.4)',
        }}
      >
        <SealCorners />
        <div className="absolute -right-2 -bottom-4 font-brush select-none pointer-events-none text-[120px] leading-none" style={{ color: 'rgba(212,162,75,0.06)' }}>Xăm</div>
        <div className="absolute right-4 top-4 font-brush select-none pointer-events-none text-2xl" style={{ color: 'rgba(212,162,75,0.3)' }}>QuánÂm</div>
        <div className="relative">
          <div className="font-brush text-3xl mb-2" style={{ color: 'var(--color-gold)' }}>Xăm · QuánÂm</div>
          <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-1" style={{ color: 'var(--color-gold)' }}>Xăm Quan Âm · 100 thẻ</div>
          <h3 className="font-serif text-2xl font-medium mb-2" style={{ color: 'var(--color-cream)' }}>
            Một niệm thành tâm,{' '}
            <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">một thẻ ứng nghiệm</span>
          </h3>
          <p className="text-sm leading-snug mb-4 max-w-md" style={{ color: 'var(--color-cream-dim)' }}>
            Niệm danh hiệu Bồ Tát Quan Thế Âm, đặt câu hỏi rồi rút thẻ trong ống xăm — 100 thẻ ứng từ Phổ Đà Sơn.
          </p>
          <Link
            href="/dashboard/quedich"
            className="inline-block px-5 py-2.5 text-[13px] font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))', color: 'var(--color-ink)' }}
          >
            Rút xăm →
          </Link>
        </div>
      </div>

      {/* Module grid */}
      <section>
        <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: 'var(--color-gold)' }}>
          Tra cứu nhanh
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MODULES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="relative p-4 transition-all hover:scale-[1.02]"
              style={{
                background: 'var(--color-ink-2)',
                border: '1px solid rgba(212,162,75,0.2)',
              }}
            >
              <div className="font-serif text-base font-medium mb-0.5" style={{ color: 'var(--color-cream)' }}>{m.label}</div>
              <div className="text-xs" style={{ color: 'var(--color-cream-dim)' }}>{m.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Reminders */}
      <div
        className="p-6"
        style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-1" style={{ color: 'var(--color-gold)' }}>Nhắc nhở</div>
            <div className="font-serif text-xl font-medium" style={{ color: 'var(--color-cream)' }}>Tuần tới có gì đáng chú ý</div>
          </div>
          <button className="text-xs tracking-wider uppercase transition-colors hover:opacity-70" style={{ color: 'var(--color-cream-dim)' }}>
            Xem cả tháng →
          </button>
        </div>
        <ul className="divide-y" style={{ borderColor: 'rgba(212,162,75,0.1)' }}>
          {REMINDERS.map((it, i) => (
            <li key={i} className="flex items-start gap-4 py-3">
              <div className="w-[110px] shrink-0">
                <div className="text-[10px] tracking-[0.18em] uppercase font-medium" style={{ color: 'var(--color-gold)' }}>{it.tag}</div>
                <div className="text-[13px]" style={{ color: 'var(--color-cream-dim)' }}>{it.when}</div>
              </div>
              <div className="flex-1 text-sm leading-snug" style={{ color: 'var(--color-cream)' }}>{it.what}</div>
              <button className="text-xs shrink-0 hover:opacity-70 transition-opacity" style={{ color: 'var(--color-cream-dim)' }}>
                Bỏ qua
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Teacher CTA */}
      <div
        className="relative p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(200,122,90,0.15), var(--color-ink-3))',
          border: '1px solid rgba(200,122,90,0.4)',
        }}
      >
        <span className="absolute -top-px -left-px w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: 'var(--color-lotus, #c87a5a)' }} />
        <span className="absolute -bottom-px -right-px w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: 'var(--color-lotus, #c87a5a)' }} />
        <div>
          <div className="font-brush text-3xl mb-2" style={{ color: 'var(--color-lotus, #c87a5a)' }}>Thầy</div>
          <div className="font-serif text-xl font-medium mb-1" style={{ color: 'var(--color-cream)' }}>Thỉnh giáo Pháp sư</div>
          <p className="text-sm leading-snug max-w-md" style={{ color: 'var(--color-cream-dim)' }}>
            Đặt lịch tham vấn 1-1 với thầy — 12 năm hộ niệm, giải nghiệp, hướng đạo.
          </p>
        </div>
        <button
          className="px-5 py-2.5 text-sm font-semibold tracking-wider flex-shrink-0 transition-opacity hover:opacity-80"
          style={{ background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))', color: 'var(--color-ink)' }}
        >
          Đặt lịch 60 phút
        </button>
      </div>

    </div>
  );
}
