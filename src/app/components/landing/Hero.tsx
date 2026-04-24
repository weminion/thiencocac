import Image from 'next/image';

const TITLE_PARTS = [
  { text: 'Thiên cơ khai mở, nhân duyên ', gold: false },
  { text: 'tỏ tường', gold: true },
];

const CAN_CHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export default function Hero() {
  return (
    <section className="relative min-h-screen px-5 md:px-10 pt-24 md:pt-36 pb-16 md:pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full blur-[80px] opacity-50 bg-[radial-gradient(circle,rgba(212,162,75,0.3),transparent_70%)] animate-float" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-[radial-gradient(circle,rgba(160,40,40,0.2),transparent_70%)] animate-float-reverse" />
        <div className="absolute inset-0 stars" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-20 items-center">
        {/* Copy */}
        <div>
          <div className="inline-flex gap-2 mb-5 md:mb-8">
            {['天', '機', '閣'].map(c => (
              <span key={c} className="inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 border border-gold/40 font-brush text-gold text-xl md:text-2xl bg-gradient-to-br from-ink-2 to-ink">
                {c}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[10px] md:text-[12px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-gold font-medium mb-5 md:mb-7">
            <span className="w-6 md:w-10 h-px bg-gold" />
            <span>天機閣 · Thiên Cơ Các</span>
            <span className="w-6 md:w-10 h-px bg-gold" />
          </div>

          <h1 className="font-serif text-[40px] leading-[1.05] sm:text-5xl md:text-7xl lg:text-[84px] lg:leading-[1.02] font-medium tracking-tight text-cream mb-5 md:mb-7">
            {TITLE_PARTS.map((p, i) =>
              p.gold
                ? <span key={i} className="italic font-normal bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">{p.text}</span>
                : <span key={i}>{p.text}</span>
            )}
          </h1>

          <p className="text-[15px] md:text-[18px] text-cream-dim max-w-[540px] mb-7 md:mb-10 leading-[1.65]">
            Xem ngày tốt kinh doanh, tra mệnh hợp khắc, luận vận niên 2026 — tất cả trong một nơi, dựa trên cổ pháp truyền thống hơn ngàn năm.
          </p>

          <div className="flex gap-3 mb-10 md:mb-14 flex-wrap">
            <a href="#tool" className="inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold shadow-[0_8px_24px_-8px_rgba(212,162,75,0.6)] hover:-translate-y-px hover:shadow-[0_0_0_3px_rgba(212,162,75,0.3),0_12px_32px_-6px_rgba(212,162,75,0.8)] transition-all px-6 md:px-8 py-3.5 md:py-[18px] text-sm md:text-[15px] flex-1 sm:flex-initial">
              Khai mở thiên cơ <span className="text-base">☯</span>
            </a>
            <a href="#services" className="inline-flex items-center justify-center gap-2.5 font-sans font-medium tracking-wide rounded-sm text-cream border border-gold/40 hover:border-gold hover:text-gold-bright transition-all px-5 md:px-8 py-3.5 md:py-[18px] text-sm md:text-[15px]">
              <span className="text-xs">▷</span> Xem hướng dẫn
            </a>
          </div>

          <div className="flex items-center gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gold/20">
            {([['18.4K', 'lượt/tháng'], ['12', 'chuyên gia'], ['98%', 'quay lại']] as const).map(([n, l], i, a) => (
              <div key={l} className="flex items-center gap-4 md:gap-6">
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-medium text-gold-bright leading-none">{n}</div>
                  <div className="text-[11px] md:text-xs text-cream-dim tracking-wide mt-1 md:mt-1.5">{l}</div>
                </div>
                {i < a.length - 1 && <div className="w-px h-8 md:h-10 bg-gold/20" />}
              </div>
            ))}
          </div>
        </div>

        {/* Logo + orbit */}
        <div className="relative flex flex-col items-center justify-center lg:min-h-[520px] order-first lg:order-last mb-4 lg:mb-0">
          <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(212,162,75,0.35),transparent_65%)] blur-[40px] animate-glow" />
            <Image
              src="/logo.jpg"
              alt="Thiên Cơ Các"
              width={320}
              height={320}
              className="relative z-10 w-[200px] h-[200px] sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full object-cover ring-1 ring-gold shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
              priority
            />
            <div className="absolute inset-0 animate-rotate-slow" style={{ transformOrigin: 'center' }}>
              {CAN_CHI.map((c, i) => (
                <span
                  key={i}
                  className="absolute top-1/2 left-1/2 font-brush text-sm md:text-lg text-gold/70 w-6 h-6 -mt-3 -ml-3 flex items-center justify-center"
                  style={{ transform: `rotate(${i * 30}deg) translateY(-180px) rotate(${-i * 30}deg)` }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex mt-6 items-center gap-3 font-serif italic text-cream-dim text-base max-w-[380px] text-center">
            <span className="font-brush text-gold text-[28px] border border-gold/40 w-11 h-11 inline-flex items-center justify-center flex-shrink-0">占</span>
            <span>"Thiên cơ bất khả lộ — nhưng người có duyên ắt tỏ tường"</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-2.5 text-cream-dim text-xs tracking-[0.3em] uppercase">
        <span>Thỉnh giáo thiên cơ</span>
        <span className="animate-bob">↓</span>
      </div>
    </section>
  );
}
