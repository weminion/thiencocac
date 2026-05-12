import Image from 'next/image';
import Link from 'next/link';

const ORBIT_WORDS = ['Phật', 'Pháp', 'Tăng', 'Sen', '', 'Thiền', 'Bi', 'Tuệ'];

export default function Hero() {
  return (
    <section className="relative min-h-screen px-5 md:px-10 pt-24 md:pt-36 pb-16 md:pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full blur-[80px] opacity-50 bg-[radial-gradient(circle,rgba(212,160,74,0.3),transparent_70%)] animate-float" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-[radial-gradient(circle,rgba(200,122,90,0.2),transparent_70%)] animate-float-reverse" />
        <div className="absolute inset-0 stars" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-20 items-center">
        {/* Copy */}
        <div>
          {/* Kicker badges — tiếng Việt thuần, không chữ Hán */}
          <div className="inline-flex gap-2 mb-5 md:mb-8">
            {['Thiên', 'Cơ', 'Các'].map(c => (
              <span
                key={c}
                className="inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 border font-brush text-xl md:text-2xl bg-gradient-to-br from-ink-2 to-ink"
                style={{ borderColor: 'rgba(212,160,74,0.4)', color: 'var(--color-gold)' }}
              >
                {c}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[10px] md:text-[12px] tracking-[0.25em] md:tracking-[0.3em] uppercase font-medium mb-5 md:mb-7" style={{ color: 'var(--color-gold)' }}>
            <span className="w-6 md:w-10 h-px bg-gold" />
            <span>Thiên Cơ Các · Tịnh phòng tâm linh</span>
            <span className="w-6 md:w-10 h-px bg-gold" />
          </div>

          <h1 className="font-serif text-[40px] leading-[1.05] sm:text-5xl md:text-7xl lg:text-[84px] lg:leading-[1.02] font-medium tracking-tight mb-5 md:mb-7" style={{ color: 'var(--color-cream)' }}>
            Tịnh tâm{' '}
            <span className="italic font-normal bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">an lạc</span>
            , hồi hướng vô biên
          </h1>

          <p className="text-[15px] md:text-[18px] max-w-[540px] mb-7 md:mb-10 leading-[1.65]" style={{ color: 'var(--color-cream-dim)' }}>
            Niệm Phật 108 hạt, xăm Quan Âm 100 thẻ, soi nghiệp lục đạo theo cổ pháp Phật giáo — một nơi để tâm bạn nương tựa giữa đời thường.
          </p>

          <div className="flex gap-3 mb-10 md:mb-14 flex-wrap">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-deep border shadow-[0_8px_24px_-8px_rgba(212,160,74,0.6)] hover:-translate-y-px hover:shadow-[0_0_0_3px_rgba(212,160,74,0.3),0_12px_32px_-6px_rgba(212,160,74,0.8)] transition-all px-6 md:px-8 py-3.5 md:py-[18px] text-sm md:text-[15px] flex-1 sm:flex-initial"
              style={{ color: 'var(--color-ink)', borderColor: 'var(--color-gold)' }}
            >
              Vào tịnh phòng
              <span className="text-base font-brush">Sen</span>
            </Link>
            <a
              href="#phap"
              className="inline-flex items-center justify-center gap-2.5 font-sans font-medium tracking-wide rounded-sm border hover:text-gold-bright transition-all px-5 md:px-8 py-3.5 md:py-[18px] text-sm md:text-[15px]"
              style={{ color: 'var(--color-cream)', borderColor: 'rgba(212,160,74,0.4)' }}
            >
              <span className="text-xs">▷</span> Xem hướng dẫn
            </a>
          </div>

          <div className="flex items-center gap-4 md:gap-6 pt-6 md:pt-8 border-t" style={{ borderColor: 'rgba(212,160,74,0.2)' }}>
            {([['12K+', 'Phật tử đồng tu'], ['108', 'biến/ngày'], ['100', 'thẻ xăm Quan Âm']] as const).map(([n, l], i, a) => (
              <div key={l} className="flex items-center gap-4 md:gap-6">
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-medium leading-none" style={{ color: 'var(--color-gold-bright)' }}>{n}</div>
                  <div className="text-[11px] md:text-xs tracking-wide mt-1 md:mt-1.5" style={{ color: 'var(--color-cream-dim)' }}>{l}</div>
                </div>
                {i < a.length - 1 && <div className="w-px h-8 md:h-10 bg-gold/20" />}
              </div>
            ))}
          </div>
        </div>

        {/* Logo + lotus orbit */}
        <div className="relative flex flex-col items-center justify-center lg:min-h-[520px] order-first lg:order-last mb-4 lg:mb-0">
          <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(212,160,74,0.35),transparent_65%)] blur-[40px] animate-glow" />
            <Image
              src="/logo.jpg"
              alt="Thiên Cơ Các"
              width={320}
              height={320}
              className="relative z-10 w-[200px] h-[200px] sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full object-cover ring-1 ring-gold shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
              priority
            />
            <div className="absolute inset-0 animate-rotate-slow" style={{ transformOrigin: 'center' }}>
              {ORBIT_WORDS.map((c, i) => (
                <span
                  key={i}
                  className="absolute top-1/2 left-1/2 font-brush text-sm md:text-lg w-6 h-6 -mt-3 -ml-3 flex items-center justify-center"
                  style={{
                    color: 'rgba(212,160,74,0.7)',
                    transform: `rotate(${i * 45}deg) translateY(-180px) rotate(${-i * 45}deg)`,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex mt-6 items-center gap-3 font-serif italic text-base max-w-[380px] text-center" style={{ color: 'var(--color-cream-dim)' }}>
            <span
              className="font-brush text-[28px] border w-11 h-11 inline-flex items-center justify-center flex-shrink-0"
              style={{ color: 'var(--color-gold)', borderColor: 'rgba(212,160,74,0.4)' }}
            >
              Sen
            </span>
            <span>"Tâm tịnh thì cõi tịnh — một niệm Phật, một đóa sen"</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-2.5 text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-cream-dim)' }}>
        <span>Bước vào tịnh phòng</span>
        <span className="animate-bob">↓</span>
      </div>
    </section>
  );
}
