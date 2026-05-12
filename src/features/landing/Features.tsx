import Link from 'next/link';

const PHAP_MON = [
  {
    id: 'niemphat',
    glyph: 'Phật',
    title: 'Niệm Phật mala 108',
    sub: 'Tịnh độ pháp môn',
    desc: 'Chuỗi 108 hạt mô phỏng — niệm A Di Đà, Quan Âm, Đại Thế Chí. Mỗi vòng đầy đủ tích lũy công đức và hồi hướng pháp giới.',
    tags: ['108 hạt', '6 danh hiệu', 'BPM tự động'],
    price: 'Miễn phí',
    featured: true,
    href: '/dashboard/niemphat',
  },
  {
    id: 'xam',
    glyph: 'Xăm',
    title: 'Xăm Quan Âm 100 thẻ',
    sub: 'Quan Âm linh thiêm',
    desc: 'Chấp tay tịnh tâm, lay ống xăm — bốc một trong 100 thẻ. Mỗi thẻ là một bài kệ cổ, kèm luận giải.',
    tags: ['100 thẻ cổ', 'Lưu nhật ký'],
    price: 'Miễn phí',
    href: '/dashboard/quedich',
  },
  {
    id: 'luanhoi',
    glyph: '',
    title: 'Lục đạo · Nhân quả',
    sub: 'Soi nghiệp lục đạo',
    desc: 'Nhập một việc bạn đã làm — luận theo Thập Thiện, chỉ ra cõi nó dẫn tới và cách sám hối, chuyển hóa.',
    tags: ['6 cõi', 'Thập Thiện', 'Sám hối'],
    price: 'Miễn phí',
    href: '/dashboard/luanhoi',
  },
  {
    id: 'thien',
    glyph: 'Thiền',
    title: 'Thiền quán hơi thở',
    sub: 'Anapanasati',
    desc: 'Thiền 5–30 phút theo hơi thở. Có chuông tịnh, hướng dẫn quán niệm, đếm hơi thở vào ra theo pháp đạo Bụt.',
    tags: ['Anapana', '5–30 phút', 'Chuông tịnh'],
    price: 'Miễn phí',
    href: '/dashboard/thien',
  },
  {
    id: 'sam',
    glyph: 'Sám',
    title: 'Sám hối — hồi hướng',
    sub: 'Tịnh nghiệp đạo tràng',
    desc: 'Bài sám hối 6 căn theo nghi thức Phật giáo Bắc tông. Hồi hướng công đức cho cha mẹ, oan gia trái chủ, pháp giới.',
    tags: ['Sám 6 căn', 'Hồi hướng', 'Công đức'],
    price: 'Miễn phí',
    href: '/dashboard/nguoithan',
  },
  {
    id: 'phapsu',
    glyph: 'Thầy',
    title: 'Tham vấn Pháp sư',
    sub: 'Riêng tư · từ bi',
    desc: 'Đặt lịch tham vấn 1-1 với thầy qua video call 60 phút. Giải tỏa khúc mắc đời sống, giải nghiệp, hướng đạo Phật pháp.',
    tags: ['60 phút', 'Video call', 'Bảo mật'],
    price: 'Tịnh tài tùy duyên',
    href: '/dashboard',
  },
];

export default function Features() {
  return (
    <section id="phap" className="py-16 md:py-[120px] px-5 md:px-10 bg-ink relative bg-[radial-gradient(ellipse_at_top,rgba(212,160,74,0.06),transparent_50%)]">
      <div className="max-w-[820px] mx-auto mb-10 md:mb-16 text-center">
        <div
          className="inline-block text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.35em] uppercase font-medium mb-4 md:mb-5 px-3 md:px-3.5 py-1.5 border rounded-full"
          style={{ color: 'var(--color-gold)', borderColor: 'rgba(212,160,74,0.4)' }}
        >
          Lục pháp môn
        </div>
        <h2 className="font-serif text-[32px] sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-medium tracking-tight mb-4 md:mb-5" style={{ color: 'var(--color-cream)' }}>
          Sáu cánh sen —{' '}
          <span className="italic font-medium bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">
            sáu lối quay về tự tánh
          </span>
        </h2>
        <p className="text-[15px] md:text-[17px] leading-[1.65]" style={{ color: 'var(--color-cream-dim)' }}>
          Mỗi pháp môn là một cánh cửa — niệm Phật, xăm linh, soi nghiệp, tọa thiền, sám hối, tham vấn — tùy duyên mà chọn, miễn là tâm hướng về thanh tịnh.
        </p>
      </div>

      <div
        className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
        style={{ background: 'rgba(212,160,74,0.2)', border: '1px solid rgba(212,160,74,0.2)' }}
      >
        {PHAP_MON.map(s => (
          <article
            key={s.id}
            className="flex flex-col gap-4 md:gap-5 relative cursor-pointer transition-colors hover:bg-ink-2 p-6 md:p-10 md:px-8"
            style={{
              background: s.featured
                ? 'linear-gradient(135deg, var(--color-ink-2), var(--color-ink))'
                : 'var(--color-ink)',
            }}
          >
            {s.featured && <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />}

            <div className="flex items-start justify-between relative gap-2">
              <span
                className="inline-flex items-center justify-center w-14 h-14 md:w-[68px] md:h-[68px] font-brush text-[32px] md:text-[42px] bg-gradient-to-br from-ink-3 to-ink-2 border shadow-[inset_0_0_20px_rgba(212,160,74,0.1)]"
                style={{ color: 'var(--color-gold-bright)', borderColor: 'rgba(212,160,74,0.4)' }}
              >
                {s.glyph}
              </span>
              {s.featured && (
                <span
                  className="text-[10px] md:text-[11px] tracking-widest uppercase px-2 md:px-2.5 py-1 md:py-[5px] font-semibold"
                  style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}
                >
                  Được tu nhiều
                </span>
              )}
            </div>

            <div className="flex-1 relative">
              <div className="font-serif italic text-[13px] md:text-sm mb-1.5" style={{ color: 'var(--color-gold)' }}>{s.sub}</div>
              <h3 className="font-serif text-[22px] md:text-[28px] font-medium mb-2 md:mb-3 tracking-tight" style={{ color: 'var(--color-cream)' }}>{s.title}</h3>
              <p className="text-[14px] md:text-[14.5px] leading-[1.65] mb-4" style={{ color: 'var(--color-cream-dim)' }}>{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => (
                  <span key={t} className="text-[11px] tracking-wide border px-2.5 py-1" style={{ color: 'var(--color-cream-dim)', borderColor: 'rgba(212,160,74,0.2)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-5 border-t relative" style={{ borderColor: 'rgba(212,160,74,0.2)' }}>
              <span className="font-serif text-xl font-medium" style={{ color: 'var(--color-gold-bright)' }}>{s.price}</span>
              <Link href={s.href} className="text-[13px] tracking-wider uppercase font-medium transition-colors hover:opacity-70" style={{ color: 'var(--color-cream)' }}>
                Vào tu →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
