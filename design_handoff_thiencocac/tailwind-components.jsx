// Landing Page v2 — Tịnh tâm Phật giáo edition
// All-in-one Tailwind version for Thiên Cơ Các.

const { useState, useEffect, useMemo } = React;

// ============ HELPERS ============
function parseHeroTitle(title, goldWord) {
  if (!goldWord || !title.includes(goldWord)) return [{ text: title, gold: false }];
  const idx = title.indexOf(goldWord);
  const parts = [];
  if (idx > 0) parts.push({ text: title.slice(0, idx), gold: false });
  parts.push({ text: goldWord, gold: true });
  if (idx + goldWord.length < title.length) parts.push({ text: title.slice(idx + goldWord.length), gold: false });
  return parts;
}

const btnBase = "inline-flex items-center gap-2.5 font-sans font-medium tracking-wide rounded-sm transition-all duration-200 cursor-pointer";
const btnPrimary = `${btnBase} bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold font-semibold hover:-translate-y-px hover:shadow-[0_0_0_3px_rgba(212,160,74,0.3),0_12px_32px_-6px_rgba(212,160,74,0.7)] shadow-[0_8px_24px_-8px_rgba(212,160,74,0.5)]`;
const btnGhost = `${btnBase} text-cream border border-gold/40 hover:border-gold hover:text-gold-bright`;

function Btn({ variant = "ghost", size = "md", children, className = "", ...props }) {
  const sizeCls = size === "sm" ? "px-4 py-2 text-[13px]" : size === "xl" ? "px-8 py-[18px] text-[15px] tracking-[0.06em]" : "px-[22px] py-3 text-sm";
  const v = variant === "primary" ? btnPrimary : btnGhost;
  return <button className={`${v} ${sizeCls} ${className}`} {...props}>{children}</button>;
}

// ============ NAV ============
function Nav({ onOpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["#tra-tuoi","Tra tuổi"],["#phap","Pháp môn"],["#niemphat","Niệm Phật"],["#thuvien","Thư viện"]];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-ink/80 border-b border-gold/20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 md:py-[18px] flex items-center justify-between gap-4 md:gap-8">
        <a href="Tinh Phong (Dashboard) v4.html" className="flex items-center gap-2 md:gap-3 font-serif text-[18px] md:text-[22px] font-semibold text-cream tracking-wide cursor-pointer">
          <img src="assets/logo.jpg" alt="" className="w-8 h-8 md:w-[38px] md:h-[38px] rounded-full object-cover" />
          <span className="hidden sm:inline">Thiên Cơ Các</span>
        </a>
        <div className="hidden md:flex gap-8">
          {links.map(([h,t]) => (
            <a key={t} href={h} className="text-cream-dim text-sm font-medium tracking-wider hover:text-gold-bright transition-colors cursor-pointer">{t}</a>
          ))}
        </div>
        <div className="hidden md:flex gap-2.5">
          <Btn size="sm" onClick={onOpenAuth}>Đăng nhập</Btn>
          <a href="Tinh Phong (Dashboard) v4.html"><Btn variant="primary" size="sm">Vào tịnh phòng</Btn></a>
        </div>
        <div className="flex md:hidden gap-2 items-center">
          <a href="Tinh Phong (Dashboard) v4.html"><Btn variant="primary" size="sm" className="!px-3 !py-2 !text-[12px]">Tịnh phòng</Btn></a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold-bright">
            <span className="font-brush text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-gold/20 bg-ink/95 backdrop-blur-xl">
          <div className="flex flex-col">
            {links.map(([h,t]) => (
              <a key={t} href={h} onClick={() => setMenuOpen(false)} className="px-5 py-4 border-b border-gold/10 text-cream text-[15px] font-medium hover:bg-ink-2">{t}</a>
            ))}
            <button onClick={() => { setMenuOpen(false); onOpenAuth(); }} className="px-5 py-4 text-left text-gold-bright font-medium">Đăng nhập →</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============ HERO ============
function Hero({ copy, onCTA }) {
  return (
    <section className="relative min-h-screen px-5 md:px-10 pt-24 md:pt-36 pb-16 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full blur-[80px] opacity-50 bg-[radial-gradient(circle,rgba(212,160,74,0.3),transparent_70%)] animate-float"></div>
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-[radial-gradient(circle,rgba(200,122,90,0.2),transparent_70%)] animate-float-reverse"></div>
        <div className="absolute inset-0 stars animate-twinkle"></div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-20 items-center">
        <div>
          <div className="inline-flex gap-2 mb-5 md:mb-8">
            {["Thiên","Cơ","Các"].map(c => (
              <span key={c} className="inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 border border-gold/40 font-brush text-gold text-xl md:text-2xl bg-gradient-to-br from-ink-2 to-ink">{c}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[10px] md:text-[12px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-gold font-medium mb-5 md:mb-7">
            <span className="w-6 md:w-10 h-px bg-gold"></span>
            <span>{copy.kicker}</span>
            <span className="w-6 md:w-10 h-px bg-gold"></span>
          </div>
          <h1 className="font-serif text-[40px] leading-[1.05] sm:text-5xl md:text-7xl lg:text-[84px] lg:leading-[1.02] font-medium tracking-tight text-cream mb-5 md:mb-7 text-balance">
            {copy.title.map((p, i) => p.gold
              ? <span key={i} className="italic font-normal bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">{p.text}</span>
              : <span key={i}>{p.text}</span>
            )}
          </h1>
          <p className="text-[15px] md:text-[18px] text-cream-dim max-w-[540px] mb-7 md:mb-10 leading-[1.65]">{copy.sub}</p>

          <div className="flex gap-3 mb-10 md:mb-14 flex-wrap">
            <Btn variant="primary" size="xl" onClick={onCTA} className="!px-6 md:!px-8 !py-3.5 md:!py-[18px] !text-sm md:!text-[15px] flex-1 sm:flex-initial justify-center">
              {copy.cta}
              <span className="text-base font-brush">Sen</span>
            </Btn>
            <Btn size="xl" className="!px-5 md:!px-8 !py-3.5 md:!py-[18px] !text-sm md:!text-[15px] justify-center"><span className="text-xs">▷</span> Xem hướng dẫn</Btn>
          </div>

          <div className="flex items-center gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gold/20">
            {[["12K+","Phật tử đồng tu"],["108","biến/ngày"],["100","thẻ xăm Quan Âm"]].map(([n,l], i, a) => (
              <React.Fragment key={l}>
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-medium text-gold-bright leading-none">{n}</div>
                  <div className="text-[11px] md:text-xs text-cream-dim tracking-wide mt-1 md:mt-1.5">{l}</div>
                </div>
                {i < a.length - 1 && <div className="w-px h-8 md:h-10 bg-gold/20"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Logo + lotus orbit */}
        <div className="relative flex flex-col items-center justify-center lg:min-h-[520px] order-first lg:order-last mb-4 lg:mb-0">
          <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(212,160,74,0.35),transparent_65%)] blur-[40px] animate-glow"></div>
            <img src="assets/logo.jpg" alt="Thiên Cơ Các" className="relative z-10 w-[200px] h-[200px] sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full object-cover ring-1 ring-gold shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]" />
            <div className="absolute inset-0 animate-rotate-slow">
              {["Phật","Pháp","Tăng","Sen","","Thiền","Bi","Tuệ"].map((c, i) => {
                const r = typeof window !== 'undefined' && window.innerWidth < 640 ? 115 : window.innerWidth < 1024 ? 150 : 180;
                return (
                  <span key={i}
                    className="absolute top-1/2 left-1/2 font-brush text-base md:text-xl text-gold/70 w-7 h-7 -mt-3.5 -ml-3.5 flex items-center justify-center"
                    style={{ transformOrigin: '0 0', transform: `rotate(${i*45}deg) translateY(-${r}px) rotate(${-i*45}deg)` }}>
                    {c}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="hidden lg:flex mt-6 items-center gap-3 font-serif italic text-cream-dim text-base max-w-[380px] text-center">
            <span className="font-brush text-gold text-[28px] border border-gold/40 w-11 h-11 inline-flex items-center justify-center flex-shrink-0">Sen</span>
            <span>"Tâm tịnh thì cõi tịnh — một niệm Phật, một đóa sen"</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-2.5 text-cream-dim text-xs tracking-[0.3em] uppercase">
        <span>Bước vào tịnh phòng</span>
        <span className="animate-bob">↓</span>
      </div>
    </section>
  );
}

// ============ PHAP MON (Services) ============
const PHAP = [
  { id:'niemphat', glyph:'Phật', title:'Niệm Phật mala 108', sub:'Tịnh độ pháp môn', desc:'Chuỗi 108 hạt mô phỏng — niệm A Di Đà, Quan Âm, Đại Thế Chí. Mỗi vòng đầy đủ tích lũy công đức và hồi hướng pháp giới.', tags:['108 hạt','6 danh hiệu','BPM tự động'], price:'Miễn phí', featured:true },
  { id:'xam', glyph:'Xăm', title:'Xăm Quan Âm 100 thẻ', sub:'Quan Âm linh thiêm', desc:'Chấp tay tịnh tâm, lay ống xăm — bốc một trong 100 thẻ. Mỗi thẻ là một bài kệ cổ, kèm luận giải Pháp sư AI.', tags:['100 thẻ cổ','Luận giải AI','Lưu nhật ký'], price:'Miễn phí' },
  { id:'luanhoi', glyph:'', title:'Lục đạo · Nhân quả', sub:'Soi nghiệp lục đạo', desc:'Nhập một việc bạn đã làm — Pháp sư AI luận theo Thập Thiện, chỉ ra cõi nó dẫn tới và cách sám hối, chuyển hóa.', tags:['6 cõi','Thập Thiện','Sám hối'], price:'Miễn phí' },
  { id:'thien', glyph:'Thiền', title:'Thiền quán hơi thở', sub:'Anapanasati', desc:'Thiền 5–30 phút theo hơi thở. Có chuông tịnh, hướng dẫn quán niệm, đếm hơi thở vào ra. Thuận pháp đạo Bụt.', tags:['Anapana','5–30 phút','Chuông tịnh'], price:'Miễn phí' },
  { id:'sam', glyph:'Sám', title:'Sám hối — hồi hướng', sub:'Tịnh nghiệp đạo tràng', desc:'Bài sám hối 6 căn theo nghi thức Phật giáo Bắc tông. Hồi hướng công đức cho cha mẹ, oan gia trái chủ, pháp giới chúng sinh.', tags:['Sám 6 căn','Hồi hướng','Công đức'], price:'Miễn phí' },
  { id:'phapsu', glyph:'Thầy', title:'Tham vấn Pháp sư', sub:'Riêng tư · từ bi', desc:'Đặt lịch tham vấn 1-1 với thầy qua video call 60 phút. Giải tỏa khúc mắc đời sống, giải nghiệp, hướng đạo Phật pháp.', tags:['60 phút','Video call','Bảo mật'], price:'Tịnh tài tùy duyên' }
];

function SectionHeader({ kicker, title, goldWord, sub }) {
  const parts = goldWord ? parseHeroTitle(title, goldWord) : [{ text: title, gold: false }];
  return (
    <div className="max-w-[820px] mx-auto mb-10 md:mb-16 text-center">
      <div className="inline-block text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-gold font-medium mb-4 md:mb-5 px-3 md:px-3.5 py-1.5 border border-gold/40 rounded-full">{kicker}</div>
      <h2 className="font-serif text-[32px] sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-medium tracking-tight text-cream mb-4 md:mb-5 text-balance">
        {parts.map((p, i) => p.gold
          ? <span key={i} className="italic font-medium bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">{p.text}</span>
          : <span key={i}>{p.text}</span>
        )}
      </h2>
      {sub && <p className="text-[15px] md:text-[17px] text-cream-dim leading-[1.65]">{sub}</p>}
    </div>
  );
}

function PhapMon() {
  return (
    <section id="phap" className="py-16 md:py-[120px] px-5 md:px-10 bg-ink relative bg-[radial-gradient(ellipse_at_top,rgba(212,160,74,0.06),transparent_50%)]">
      <SectionHeader
        kicker="Lục pháp môn"
        title="Sáu cánh sen — sáu lối quay về tự tánh"
        goldWord="quay về"
        sub="Mỗi pháp môn là một cánh cửa — niệm Phật, xăm linh, soi nghiệp, tọa thiền, sám hối, tham vấn — tùy duyên mà chọn, miễn là tâm hướng về thanh tịnh."
      />
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/20 border border-gold/20">
        {PHAP.map(s => (
          <article key={s.id} className={`bg-ink p-6 md:p-10 md:px-8 flex flex-col gap-4 md:gap-5 relative cursor-pointer transition-colors hover:bg-ink-2 ${s.featured ? 'bg-gradient-to-br from-ink-2 to-ink' : ''}`}>
            {s.featured && <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none"></div>}
            <div className="flex items-start justify-between relative gap-2">
              <span className="inline-flex items-center justify-center w-14 h-14 md:w-[68px] md:h-[68px] font-brush text-[32px] md:text-[42px] text-gold-bright bg-gradient-to-br from-ink-3 to-ink-2 border border-gold/40 shadow-[inset_0_0_20px_rgba(212,160,74,0.1)]">{s.glyph}</span>
              {s.featured && <span className="text-[10px] md:text-[11px] tracking-widest uppercase text-ink bg-gold px-2 md:px-2.5 py-1 md:py-[5px] font-semibold">Được tu nhiều</span>}
            </div>
            <div className="flex-1 relative">
              <div className="font-serif italic text-gold text-[13px] md:text-sm mb-1.5">{s.sub}</div>
              <h3 className="font-serif text-[22px] md:text-[28px] font-medium text-cream mb-2 md:mb-3 tracking-tight">{s.title}</h3>
              <p className="text-cream-dim text-[14px] md:text-[14.5px] leading-[1.65] mb-4">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => <span key={t} className="text-[11px] tracking-wide text-cream-dim border border-gold/20 px-2.5 py-1">{t}</span>)}
              </div>
            </div>
            <div className="flex justify-between items-center pt-5 border-t border-gold/20 relative">
              <span className="font-serif text-xl text-gold-bright font-medium">{s.price}</span>
              <a href="Tinh Phong (Dashboard) v4.html" className="bg-none border-none text-cream text-[13px] tracking-wider uppercase font-medium cursor-pointer hover:text-gold-bright">Vào tu →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============ NIEM PHAT MINI DEMO ============
function LotusSVG({ size = 240, beads = 32, count }) {
  const cx = size/2, cy = size/2;
  const r = size/2 - 18;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      <defs>
        <radialGradient id="lotus-glow">
          <stop offset="0%" stopColor="#e6b85a" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#0a0806" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r+8} fill="url(#lotus-glow)"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(212,160,74,0.3)" strokeDasharray="2 4"/>
      {Array.from({length: beads}).map((_, i) => {
        const a = (i/beads) * Math.PI * 2 - Math.PI/2;
        const bx = cx + Math.cos(a) * r;
        const by = cy + Math.sin(a) * r;
        const isActive = i < (count % beads);
        return (
          <circle key={i} cx={bx} cy={by} r="3.5"
            fill={isActive ? '#e6b85a' : '#3a2418'}
            stroke="rgba(212,160,74,0.5)" strokeWidth="0.5"
            style={{ filter: isActive ? 'drop-shadow(0 0 4px #e6b85a)' : 'none', transition: 'all 200ms' }}/>
        );
      })}
      {/* Lotus center */}
      <circle cx={cx} cy={cy} r={size*0.18} fill="#1c160e" stroke="rgba(212,160,74,0.5)"/>
      <text x={cx} y={cy+size*0.06} textAnchor="middle" fontSize={size*0.18}
        fontFamily="'Dancing Script', serif" fill="#d4a04a"
        style={{ filter: 'drop-shadow(0 0 8px #d4a04a)' }}>Phật</text>
    </svg>
  );
}

function NiemPhatDemo() {
  const [count, setCount] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCount(c => c+1), 800);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <section id="niemphat" className="max-w-[1280px] mx-auto py-16 md:py-[120px] px-5 md:px-10">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2.5 text-[10px] md:text-[12px] tracking-[0.3em] uppercase text-gold font-medium mb-4">
            <span className="w-6 md:w-10 h-px bg-gold"></span>
            Niệm Phật · Niệm Phật
            <span className="w-6 md:w-10 h-px bg-gold"></span>
          </div>
          <h2 className="font-serif text-[32px] sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.1] font-medium text-cream mb-5 text-balance">
            Một câu <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">A Di Đà</span>,<br/>
            tâm liền <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">an trú</span>
          </h2>
          <p className="text-cream-dim text-[15px] md:text-[16px] leading-[1.7] mb-6 max-w-[520px]">
            Chuỗi 108 hạt mala — mô phỏng đầy đủ. Niệm 6 danh hiệu lớn: A Di Đà, Quan Âm, Đại Thế Chí, Địa Tạng, Văn Thù, Phổ Hiền. Mỗi vòng đầy đủ +5 công đức, hồi hướng pháp giới.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { n: '108', l: 'hạt mala' },
              { n: '6', l: 'danh hiệu' },
              { n: '∞', l: 'công đức' }
            ].map(s => (
              <div key={s.l} className="bg-ink-2 border border-gold/20 px-3 py-2.5">
                <div className="font-serif text-2xl text-gold-bright font-medium leading-none">{s.n}</div>
                <div className="text-[11px] text-cream-dim tracking-wide mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <a href="Tinh Phong (Dashboard) v4.html"><Btn variant="primary" size="xl">
              Vào niệm Phật <span className="font-brush text-base">Sen</span>
            </Btn></a>
            <Btn size="xl">Xem nghi thức tụng kinh</Btn>
          </div>
        </div>

        {/* Demo mala */}
        <div className="relative">
          <div className="bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/40 p-6 md:p-8 relative">
            <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold"></span>
            <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold"></span>
            <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold"></span>
            <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold"></span>

            <div className="flex flex-col items-center">
              <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-1.5">Niệm thử</div>
              <div className="font-serif italic text-gold-bright text-lg mb-5">Nam mô A Di Đà Phật</div>

              <div className="relative">
                <LotusSVG size={260} beads={32} count={count}/>
              </div>

              <div className="font-serif text-cream text-2xl font-medium mt-4">
                {count} <span className="text-cream-dim text-base font-sans">/ 108 niệm</span>
              </div>
              <div className="w-full bg-ink h-1 mt-2 mb-5 border border-gold/15">
                <div className="h-full bg-gradient-to-r from-gold-bright to-gold transition-all duration-200"
                  style={{ width: `${Math.min(100, (count % 108) / 108 * 100)}%` }}></div>
              </div>

              <div className="flex gap-2 flex-wrap justify-center">
                <button onClick={() => setCount(c => c+1)}
                  className="px-5 py-2.5 bg-gradient-to-br from-gold-bright to-gold text-ink text-sm font-semibold tracking-wider">
                  +1 Niệm
                </button>
                <button onClick={() => setAuto(a => !a)}
                  className={`px-5 py-2.5 border text-sm font-medium tracking-wider transition-colors ${auto ? 'bg-lotus/20 border-lotus text-lotus' : 'border-gold/40 text-cream-dim hover:border-gold'}`}>
                  {auto ? '◼ Dừng' : '▷ Tự niệm'}
                </button>
                <button onClick={() => { setAuto(false); setCount(0); }}
                  className="px-4 py-2.5 border border-gold/30 text-cream-dim text-sm hover:text-cream">↻</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ THU VIEN (Blog) ============
const POSTS = [
  { tag:'Pháp môn Tịnh Độ', title:'Vì sao niệm Phật là pháp môn dễ tu nhất?', excerpt:'Tịnh Độ tông — pháp môn đơn giản, ai cũng tu được. Một câu Phật hiệu, đủ độ chúng sinh ba đời mười phương.', date:'18 · 04 · 2026', read:'12 phút', glyph:'Phật', big:true },
  { tag:'Quán Âm', title:'Lục tự đại minh chú: Án-ma-ni-bát-mê-hồng', excerpt:'Sáu chữ chân ngôn của Bồ Tát Quan Thế Âm — lực dụng, ý nghĩa và cách trì tụng đúng pháp.', date:'12 · 04 · 2026', read:'8 phút', glyph:'Quán' },
  { tag:'Nhân quả', title:'Lục đạo luân hồi: 6 cõi từ đâu đến đâu?', excerpt:'Cõi trời, A-tu-la, người, súc sinh, ngạ quỷ, địa ngục. Mỗi niệm khởi đều gieo hạt giống vào một cõi.', date:'05 · 04 · 2026', read:'10 phút', glyph:'' },
  { tag:'Sám hối', title:'Sám hối 6 căn — nghi thức tịnh nghiệp đạo tràng', excerpt:'Mắt-tai-mũi-lưỡi-thân-ý — sáu cửa tạo nghiệp. Bài sám cổ truyền giúp tâm thanh tịnh.', date:'28 · 03 · 2026', read:'6 phút', glyph:'Sám' }
];

function ThuVien() {
  return (
    <section id="thuvien" className="py-16 md:py-[120px] px-5 md:px-10 max-w-[1280px] mx-auto">
      <div className="flex items-end justify-between gap-6 md:gap-8 mb-10 md:mb-14 flex-wrap">
        <div>
          <div className="inline-block text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-gold font-medium mb-4 md:mb-5 px-3 md:px-3.5 py-1.5 border border-gold/40 rounded-full">Thư Viện Pháp Bảo</div>
          <h2 className="font-serif text-[30px] sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-medium tracking-tight text-cream">
            Đọc <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">kinh điển</span>,<br/>
            ngộ <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">đạo lý</span>
          </h2>
        </div>
        <Btn>Vào toàn bộ thư viện →</Btn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {POSTS.map((p, i) => (
          <article key={i} className={`bg-ink-2 border border-gold/20 flex flex-col cursor-pointer transition-colors hover:border-gold/40 overflow-hidden ${p.big ? 'md:row-span-2 md:col-span-1' : ''}`}>
            <div className={`relative overflow-hidden flex items-center justify-center ${p.big ? 'aspect-[16/11]' : 'aspect-[16/9]'} bg-gradient-to-br from-ink-3 to-ink`}>
              <span className={`font-brush text-gold/80 ${p.big ? 'text-[240px]' : 'text-[140px]'}`} style={{textShadow:'0 0 40px rgba(212,160,74,0.6)'}}>{p.glyph}</span>
              <span className="absolute top-[18px] left-[18px] bg-ink/80 backdrop-blur border border-gold/40 text-gold px-2.5 py-1.5 text-[11px] tracking-wider uppercase font-medium">{p.tag}</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className={`font-serif leading-tight font-medium text-cream mb-2.5 ${p.big ? 'text-[34px]' : 'text-[22px]'}`}>{p.title}</h3>
              <p className="text-cream-dim text-[14.5px] leading-[1.6] mb-4 flex-1">{p.excerpt}</p>
              <div className="flex gap-2 items-center text-xs text-cream-dim tracking-wide">
                <span>{p.date}</span><span>·</span><span>{p.read}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="bg-ink-2 border-t border-gold/40 px-5 md:px-10 pt-12 md:pt-20 pb-7 mt-16 md:mt-20">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 pb-10 md:pb-14 border-b border-gold/20">
        <div className="flex gap-4 items-start">
          <img src="assets/logo.jpg" className="w-14 h-14 rounded-full object-cover border border-gold"/>
          <div>
            <div className="font-serif text-2xl font-medium text-cream mb-1">Thiên Cơ Các</div>
            <div className="font-serif italic text-gold text-sm">Thiên Cơ · Tịnh phòng tâm linh — nương về Tam Bảo</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {[
            { t:'Pháp môn', items:['Niệm Phật mala','Xăm Quan Âm','Lục đạo nhân quả','Thiền quán','Sám hối'] },
            { t:'Thư viện', items:['Kinh A Di Đà','Phổ Môn phẩm','Địa Tạng kinh','Sám 6 căn'] },
            { t:'Liên hệ', items:['Hotline: 1900 86 86','Email: tinhtam@thiencoca.vn','Zalo: @thiencoca','Đạo tràng — Q.1, TP.HCM'] }
          ].map(col => (
            <div key={col.t}>
              <div className="text-xs tracking-[0.2em] uppercase text-gold font-medium mb-4">{col.t}</div>
              {col.items.map(x => <a key={x} className="block text-cream-dim text-sm py-1.5 cursor-pointer hover:text-gold-bright">{x}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-7 flex justify-between text-xs text-cream-dim tracking-wide flex-wrap gap-3">
        <div>© 2026 Thiên Cơ Các · Nam mô A Di Đà Phật</div>
        <div className="flex gap-6">
          <a className="cursor-pointer hover:text-gold-bright">Điều khoản</a>
          <a className="cursor-pointer hover:text-gold-bright">Bảo mật</a>
          <a className="cursor-pointer hover:text-gold-bright">Tịnh tài</a>
        </div>
      </div>
    </footer>
  );
}

// ============ AUTH MODAL ============
function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', birthYear:'', gender:'nam', remember:true, agree:false });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const isLogin = tab === 'login';

  const fieldLabel = "text-[11px] tracking-[0.15em] uppercase text-gold font-medium";
  const inputWrap = "flex items-center bg-ink border border-gold/40 transition-colors focus-within:border-gold";
  const inputCls = "flex-1 bg-transparent border-none outline-none text-cream font-sans text-[15px] px-3.5 py-3 w-full placeholder:text-cream-dim/70";
  const glyphCls = "px-3.5 font-brush text-gold text-lg min-w-[44px] text-center border-r border-gold/20 self-stretch flex items-center justify-center";

  return (
    <div className="fixed inset-0 z-[200] bg-ink/75 backdrop-blur-[10px] flex items-center justify-center p-3 md:p-6 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-[980px] max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gradient-to-br from-ink-2 to-ink-3 border border-gold shadow-[0_0_0_1px_rgba(212,160,74,0.2),0_40px_80px_-20px_rgba(0,0,0,0.8)] animate-pop-in"
           onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-ink text-cream-dim border border-gold/40 hover:border-gold hover:text-gold-bright text-sm">✕</button>

        <span className="absolute top-2.5 left-2.5 w-6 h-6 border-t border-l border-gold z-20 pointer-events-none"></span>
        <span className="absolute top-2.5 right-2.5 w-6 h-6 border-t border-r border-gold z-20 pointer-events-none"></span>
        <span className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b border-l border-gold z-20 pointer-events-none"></span>
        <span className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b border-r border-gold z-20 pointer-events-none"></span>

        <div className="grid md:grid-cols-[0.85fr_1fr] flex-1 min-h-0 overflow-hidden">
          <aside className="hidden md:block relative border-r border-gold/20 overflow-y-auto bg-gradient-to-br from-ink to-ink-2">
            <div className="relative z-10 p-14 px-11 flex flex-col gap-5 h-full">
              <div className="inline-flex gap-1.5">
                {['Thiên','Cơ','Các'].map(c => (
                  <span key={c} className="w-10 h-10 inline-flex items-center justify-center border border-gold/40 font-brush text-gold text-[22px] bg-ink">{c}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold font-medium">
                <span className="w-7 h-px bg-gold"></span>Tịnh phòng<span className="w-7 h-px bg-gold"></span>
              </div>
              <h3 className="font-serif text-[34px] leading-[1.15] font-medium text-cream tracking-tight text-balance">
                Mở cửa <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">tịnh phòng</span> của riêng bạn
              </h3>
              <p className="text-cream-dim text-[15px] leading-[1.65]">
                Lưu công đức, ghi nhật ký niệm Phật, theo dõi xăm và quán chiếu nhân quả — đồng hành cùng bạn trên đường tu.
              </p>
              <ul className="list-none flex flex-col gap-2.5 pt-5 border-t border-gold/20 mt-2">
                {['Lưu công đức tích lũy','Nhắc niệm Phật, mồng 1 — rằm','Nhật ký xăm + quán chiếu','Tham vấn riêng với Pháp sư'].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-cream text-sm"><span className="text-gold text-[10px]">◆</span>{t}</li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-3.5 text-cream-dim font-serif text-[15px] pt-6 border-t border-gold/20">
                <span className="font-brush text-gold text-[28px] border border-gold/40 w-11 h-11 inline-flex items-center justify-center flex-shrink-0">Sen</span>
                <em>"Tâm tịnh thì cõi tịnh — một niệm, một đóa sen."</em>
              </div>
            </div>
          </aside>

          <div className="p-6 md:p-10 md:px-12 overflow-y-auto min-h-0 flex flex-col gap-5">
            <div className="relative grid grid-cols-2 border border-gold/40 bg-ink">
              <div className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-gold-bright to-gold transition-transform duration-300 z-[1]`}
                   style={{ transform: `translateX(${isLogin ? '0%' : '100%'})` }}></div>
              {[['login','Đăng nhập'],['signup','Đăng ký']].map(([v,l]) => (
                <button key={v} onClick={() => setTab(v)}
                  className={`relative z-[2] py-3.5 font-serif text-base font-medium tracking-wide transition-colors ${tab === v ? 'text-ink' : 'text-cream-dim'}`}>{l}</button>
              ))}
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-cream mb-2 tracking-tight">
                {isLogin ? 'Mời quay lại tịnh phòng' : 'Khai mở tài khoản mới'}
              </h2>
              <p className="text-cream-dim text-[14.5px] leading-[1.6]">
                {isLogin ? 'Nhập thông tin để quay về tịnh phòng của bạn.' : 'Nhập vài thông tin cơ bản để bắt đầu hành trình tu tập.'}
              </p>
            </div>

            <form onSubmit={e => { e.preventDefault(); alert(isLogin?'Đang đăng nhập...':'Đang tạo tài khoản...'); }} className="flex flex-col gap-4">
              {!isLogin && (
                <label className="flex flex-col gap-1.5">
                  <span className={fieldLabel}>Pháp danh / Tên của bạn</span>
                  <div className={inputWrap}>
                    <span className={glyphCls}>Tên</span>
                    <input className={inputCls} type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nguyễn Văn A" required/>
                  </div>
                </label>
              )}
              <label className="flex flex-col gap-1.5">
                <span className={fieldLabel}>Email hoặc số điện thoại</span>
                <div className={inputWrap}>
                  <span className={glyphCls}>@</span>
                  <input className={inputCls} type="text" value={form.email} onChange={e => update('email', e.target.value)} placeholder="ban@thiencoca.vn" required/>
                </div>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={fieldLabel}>Mật khẩu</span>
                <div className={inputWrap}>
                  <span className={glyphCls}>Khóa</span>
                  <input className={inputCls} type={showPass?'text':'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder={isLogin?'Nhập mật khẩu':'Ít nhất 8 ký tự'} minLength={isLogin?undefined:8} required/>
                  <button type="button" onClick={() => setShowPass(s=>!s)} className="bg-none border-none cursor-pointer text-cream-dim hover:text-gold-bright px-3.5 text-lg">{showPass?'◎':'◉'}</button>
                </div>
              </label>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3.5">
                  <label className="flex flex-col gap-1.5">
                    <span className={fieldLabel}>Năm sinh</span>
                    <div className={inputWrap}>
                      <span className={glyphCls}>Tuổi</span>
                      <input className={inputCls} type="number" min="1900" max="2100" value={form.birthYear} onChange={e => update('birthYear', e.target.value)} placeholder="1992"/>
                    </div>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={fieldLabel}>Giới tính</span>
                    <div className="flex bg-ink border border-gold/40 overflow-hidden h-full">
                      {[['nam','Nam'],['nu','Nữ']].map(([v,l]) => (
                        <button key={v} type="button" onClick={() => update('gender', v)}
                          className={`flex-1 py-[11px] font-serif text-[15px] transition-all ${form.gender === v ? 'bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold' : 'text-cream-dim'}`}>{l}</button>
                      ))}
                    </div>
                  </label>
                </div>
              )}
              <div className="flex justify-between items-center gap-3 text-[13px] text-cream-dim flex-wrap">
                {isLogin ? (
                  <>
                    <label className="inline-flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" className="absolute opacity-0 pointer-events-none peer" checked={form.remember} onChange={e => update('remember', e.target.checked)}/>
                      <span className="w-4 h-4 border border-gold/40 bg-ink inline-flex items-center justify-center flex-shrink-0 peer-checked:bg-gradient-to-br peer-checked:from-gold-bright peer-checked:to-gold peer-checked:border-gold"></span>
                      <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <a className="text-gold-bright cursor-pointer font-medium border-b border-transparent hover:border-gold-bright">Quên mật khẩu?</a>
                  </>
                ) : (
                  <label className="inline-flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="peer" checked={form.agree} onChange={e => update('agree', e.target.checked)} required/>
                    <span>Tôi đồng ý với <a className="text-gold-bright cursor-pointer font-medium">Điều khoản</a> và <a className="text-gold-bright cursor-pointer font-medium">Chính sách bảo mật</a></span>
                  </label>
                )}
              </div>
              <Btn variant="primary" size="xl" className="w-full justify-center mt-1">
                <span>{isLogin ? 'Vào tịnh phòng' : 'Khai mở tài khoản'}</span><span className="text-base font-brush">Sen</span>
              </Btn>
            </form>

            <div className="flex items-center gap-3 text-cream-dim text-xs tracking-[0.15em] uppercase before:content-[''] before:flex-1 before:h-px before:bg-gold/20 after:content-[''] after:flex-1 after:h-px after:bg-gold/20">
              <span>hoặc tiếp tục với</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {['Google','Facebook','Zalo'].map(s => (
                <button key={s} className="inline-flex items-center justify-center gap-2 py-3 px-3.5 bg-ink text-cream border border-gold/40 text-[13px] font-medium cursor-pointer hover:border-gold hover:text-gold-bright transition-all">
                  {s}
                </button>
              ))}
            </div>

            <div className="text-center text-[13px] text-cream-dim pt-3 border-t border-gold/20">
              {isLogin
                ? <>Chưa có tài khoản? <a onClick={() => setTab('signup')} className="text-gold-bright cursor-pointer font-medium">Khai mở ngay</a></>
                : <>Đã có tài khoản? <a onClick={() => setTab('login')} className="text-gold-bright cursor-pointer font-medium">Đăng nhập</a></>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ TWEAKS PANEL ============
function TweaksPanel({ tweaks, setTweaks, onClose }) {
  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  const golds = ['#d4a04a','#e6b85a','#c79a3a','#b8923a'];
  const reds  = ['#c87a5a','#a85838','#8a4828','#a02828'];

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[320px] max-h-[calc(100vh-48px)] overflow-y-auto bg-ink-2 border border-gold shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,160,74,0.2)] text-cream font-sans">
      <div className="flex justify-between items-center p-4 px-5 border-b border-gold/20 bg-gradient-to-br from-ink-3 to-ink-2">
        <div className="font-serif text-lg text-gold-bright font-medium">Sen Tweaks</div>
        <button onClick={onClose} className="bg-none border-none text-cream-dim cursor-pointer text-lg">✕</button>
      </div>
      <div className="p-5 flex flex-col gap-5">
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2.5 font-medium">Vàng nghệ (saffron)</div>
          <div className="flex gap-2 flex-wrap">
            {golds.map(c => (
              <div key={c} onClick={() => update('primaryGold', c)}
                className={`w-9 h-9 rounded-full cursor-pointer border-2 transition-all ${tweaks.primaryGold === c ? 'border-cream' : 'border-transparent'}`}
                style={{ background: c }}/>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2.5 font-medium">Hoa sen / Cà sa</div>
          <div className="flex gap-2 flex-wrap">
            {reds.map(c => (
              <div key={c} onClick={() => update('accentRed', c)}
                className={`w-9 h-9 rounded-full cursor-pointer border-2 transition-all ${tweaks.accentRed === c ? 'border-cream' : 'border-transparent'}`}
                style={{ background: c }}/>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2.5 font-medium">Hero Copy</div>
          {[['heroKicker','Kicker'],['heroTitle','Tiêu đề chính'],['heroGoldWord','Cụm được highlight vàng'],['heroSub','Sub-heading'],['heroCTA','Nhãn nút CTA']].map(([k,l]) => (
            <React.Fragment key={k}>
              <label className="block text-[11px] text-cream-dim mb-1 tracking-wide">{l}</label>
              <input className="w-full px-3 py-2.5 bg-ink text-cream border border-gold/40 font-sans text-[13px] mb-1.5" value={tweaks[k]||''} onChange={e => update(k, e.target.value)}/>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ APP ============
function App() {
  const [tweaks, setTweaks] = useState(window.TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', h);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', h);
  }, []);

  const heroCopy = {
    kicker: tweaks.heroKicker,
    title: parseHeroTitle(tweaks.heroTitle, tweaks.heroGoldWord),
    sub: tweaks.heroSub,
    cta: tweaks.heroCTA
  };

  const goToDashboard = () => { window.location.href = 'Tinh Phong (Dashboard) v4.html'; };

  return (
    <>
      <Nav onOpenAuth={() => setAuthOpen(true)}/>
      <Hero copy={heroCopy} onCTA={goToDashboard}/>
      {window.TraTuoiSection && <window.TraTuoiSection onCTA={goToDashboard}/>}
      <PhapMon/>
      <NiemPhatDemo/>
      <ThuVien/>
      <Footer/>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)}/>
      {editMode && <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onClose={() => setEditMode(false)}/>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
