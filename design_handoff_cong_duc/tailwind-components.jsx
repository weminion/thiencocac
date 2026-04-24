// All-in-one Tailwind version: Thiên Cơ Các Landing
// Uses Tailwind Play CDN config for custom colors/fonts.

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
const btnPrimary = `${btnBase} bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold font-semibold hover:-translate-y-px hover:shadow-[0_0_0_3px_rgba(212,162,75,0.3),0_12px_32px_-6px_rgba(212,162,75,0.8)] shadow-[0_8px_24px_-8px_rgba(212,162,75,0.6)]`;
const btnGhost = `${btnBase} text-cream border border-gold/40 hover:border-gold hover:text-gold-bright`;

function Btn({ variant = "ghost", size = "md", children, className = "", ...props }) {
  const sizeCls = size === "sm" ? "px-4 py-2 text-[13px]" : size === "xl" ? "px-8 py-[18px] text-[15px] tracking-[0.06em]" : "px-[22px] py-3 text-sm";
  const v = variant === "primary" ? btnPrimary : btnGhost;
  return <button className={`${v} ${sizeCls} ${className}`} {...props}>{children}</button>;
}

// ============ NAV ============
function Nav({ onOpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["#services","Dịch vụ"],["#tool","Tra mệnh"],["#blog","Thư phòng"],["#","Về Thiên Cơ Các"]];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-ink/80 border-b border-gold/20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 md:py-[18px] flex items-center justify-between gap-4 md:gap-8">
        <a className="flex items-center gap-2 md:gap-3 font-serif text-[18px] md:text-[22px] font-semibold text-cream tracking-wide cursor-pointer">
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
          <Btn variant="primary" size="sm" onClick={onOpenAuth}>Thỉnh giáo</Btn>
        </div>
        <div className="flex md:hidden gap-2 items-center">
          <Btn variant="primary" size="sm" onClick={onOpenAuth} className="!px-3 !py-2 !text-[12px]">Thỉnh giáo</Btn>
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
      {/* BG */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full blur-[80px] opacity-50 bg-[radial-gradient(circle,rgba(212,162,75,0.3),transparent_70%)] animate-float"></div>
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-[radial-gradient(circle,rgba(160,40,40,0.2),transparent_70%)] animate-float-reverse"></div>
        <div className="absolute inset-0 stars animate-twinkle"></div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-20 items-center">
        <div>
          <div className="inline-flex gap-2 mb-5 md:mb-8">
            {["天","機","閣"].map(c => (
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
              <span className="text-base">☯</span>
            </Btn>
            <Btn size="xl" className="!px-5 md:!px-8 !py-3.5 md:!py-[18px] !text-sm md:!text-[15px] justify-center"><span className="text-xs">▷</span> Xem hướng dẫn</Btn>
          </div>

          <div className="flex items-center gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gold/20">
            {[["18.4K","lượt/tháng"],["12","chuyên gia"],["98%","quay lại"]].map(([n,l], i, a) => (
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

        {/* Logo + orbit */}
        <div className="relative flex flex-col items-center justify-center lg:min-h-[520px] order-first lg:order-last mb-4 lg:mb-0">
          <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(212,162,75,0.35),transparent_65%)] blur-[40px] animate-glow"></div>
            <img src="assets/logo.jpg" alt="Thiên Cơ Các" className="relative z-10 w-[200px] h-[200px] sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full object-cover ring-1 ring-gold shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]" />
            <div className="absolute inset-0 animate-rotate-slow">
              {["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"].map((c, i) => {
                const r = typeof window !== 'undefined' && window.innerWidth < 640 ? 115 : window.innerWidth < 1024 ? 150 : 180;
                return (
                  <span key={i}
                    className="absolute top-1/2 left-1/2 font-brush text-sm md:text-lg text-gold/70 w-6 h-6 -mt-3 -ml-3 flex items-center justify-center"
                    style={{ transformOrigin: '0 0', transform: `rotate(${i*30}deg) translateY(-${r}px) rotate(${-i*30}deg)` }}>
                    {c}
                  </span>
                );
              })}
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

// ============ SERVICES ============
const SERVICES = [
  { id:'tuvi', glyph:'紫', title:'Tử vi trọn đời', sub:'An bài 12 cung', desc:'Lá số tử vi chi tiết — cung Mệnh, Thân, Tài, Phúc, Di, Quan. Luận giải vận hạn từng năm, tháng lớn nhỏ.', tags:['12 cung','Đại vận','Tiểu hạn'], price:'Từ 299k', featured:true },
  { id:'phongthuy', glyph:'風', title:'Phong thủy nhà ở', sub:'Địa lý bát trạch', desc:'Khảo sát hướng nhà, bố trí nội thất theo mệnh chủ. Hóa giải sát khí, kích hoạt tài vị, cát phương.', tags:['Bát trạch','Huyền không','Khai quang'], price:'Từ 2tr5' },
  { id:'ngaytot', glyph:'吉', title:'Xem ngày tốt', sub:'Chọn ngày cát', desc:'Ngày đẹp khai trương, cưới hỏi, động thổ, nhập trạch, ký hợp đồng. Tránh sát chủ, tam nương, nguyệt kỵ.', tags:['Khai trương','Hôn sự','Nhập trạch'], price:'Từ 99k' },
  { id:'kinhdoanh', glyph:'財', title:'Vận kinh doanh', sub:'Thiên thời địa lợi', desc:'Xem ngày xuất hành, ký hợp đồng, gặp đối tác. Phân tích năm 2026 theo mệnh: nên mở rộng hay thủ.', tags:['Hợp tác','Đầu tư','Ra mắt'], price:'Từ 499k' },
  { id:'hoptuoi', glyph:'合', title:'Hợp tuổi — hợp mệnh', sub:'Tương sinh tương khắc', desc:'Luận tuổi vợ chồng, đối tác làm ăn, cha mẹ — con cái. Ngũ hành sinh khắc, thiên can địa chi xung hợp.', tags:['Vợ chồng','Đối tác','Con cái'], price:'Từ 199k' },
  { id:'tuvan', glyph:'師', title:'Tư vấn 1-1 với Thầy', sub:'Riêng tư · tận tâm', desc:'Trò chuyện riêng với chuyên gia qua video call 60 phút. Giải đáp mọi khúc mắc đời sống, sự nghiệp, tình duyên.', tags:['60 phút','Video call','Bảo mật'], price:'Từ 1tr2' }
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

function Services() {
  return (
    <section id="services" className="py-16 md:py-[120px] px-5 md:px-10 bg-ink relative bg-[radial-gradient(ellipse_at_top,rgba(212,162,75,0.06),transparent_50%)]">
      <SectionHeader
        kicker="Lục Pháp"
        title="Sáu cửa thiên cơ — mở ra một cuộc đời tỏ tường"
        goldWord="thiên cơ"
        sub="Mỗi dịch vụ được xây trên nền tảng cổ pháp truyền thống kết hợp với chuyên môn hiện đại — để bạn không chỉ biết, mà còn hiểu và hành động đúng lúc."
      />
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/20 border border-gold/20">
        {SERVICES.map(s => (
          <article key={s.id} className={`bg-ink p-6 md:p-10 md:px-8 flex flex-col gap-4 md:gap-5 relative cursor-pointer transition-colors hover:bg-ink-2 ${s.featured ? 'bg-gradient-to-br from-ink-2 to-ink' : ''}`}>
            {s.featured && <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none"></div>}
            <div className="flex items-start justify-between relative gap-2">
              <span className="inline-flex items-center justify-center w-14 h-14 md:w-[68px] md:h-[68px] font-brush text-[32px] md:text-[42px] text-gold-bright bg-gradient-to-br from-ink-3 to-ink-2 border border-gold/40 shadow-[inset_0_0_20px_rgba(212,162,75,0.1)]">{s.glyph}</span>
              {s.featured && <span className="text-[10px] md:text-[11px] tracking-widest uppercase text-ink bg-gold px-2 md:px-2.5 py-1 md:py-[5px] font-semibold">Được chọn nhiều</span>}
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
              <button className="bg-none border-none text-cream text-[13px] tracking-wider uppercase font-medium cursor-pointer hover:text-gold-bright">Thỉnh giáo →</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============ MINI TOOL ============
function BaguaRing({ size = 220, element, color }) {
  const trigrams = ['☰','☱','☲','☳','☷','☶','☵','☴'];
  const r = size/2 - 24;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 0 24px ${color}66)` }}>
      <defs>
        <radialGradient id="bg2">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
          <stop offset="70%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r+14} fill="url(#bg2)"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeOpacity="0.35"/>
      <g className="animate-rotate-slow" style={{ transformOrigin: `${size/2}px ${size/2}px` }}>
        {trigrams.map((t, i) => {
          const a = (i/8)*Math.PI*2 - Math.PI/2;
          const x = size/2 + Math.cos(a)*r;
          const y = size/2 + Math.sin(a)*r;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect x="-14" y="-14" width="28" height="28" fill="#0a0806" stroke={color} strokeOpacity="0.7"/>
              <text textAnchor="middle" dominantBaseline="central" fill={color} fontSize="16" fontFamily="serif">{t}</text>
            </g>
          );
        })}
      </g>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fill={color}
            fontSize={size*0.38} fontFamily="'Ma Shan Zheng', serif" style={{ filter: `drop-shadow(0 0 12px ${color})` }}>
        {element || '玄'}
      </text>
    </svg>
  );
}

function ElementBadge({ element, label }) {
  const meta = window.NguHanh.ELEMENT_META[element];
  if (!meta) return null;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
           style={{ background: `radial-gradient(circle at 30% 30%, ${meta.color}, ${meta.bg})`,
                    boxShadow: `0 0 0 1px ${meta.color}aa, 0 0 24px ${meta.color}44` }}>
        <span style={{ fontSize: 24, color: '#0a0806', fontFamily: "'Ma Shan Zheng', serif" }}>{meta.symbol}</span>
      </div>
      <span className="font-serif text-[13px] text-cream font-medium">{label || element}</span>
    </div>
  );
}

function MenhResult({ menh, year }) {
  if (!menh?.meta) return null;
  const advice = window.NguHanh.getYearAdvice(menh.element);
  const meta = menh.meta;
  const elemStyle = { '--elem': meta.color };

  return (
    <div className="mt-12 animate-fade-up" style={elemStyle}>
      {/* Hero result */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-center p-10 border mb-8 relative overflow-hidden"
           style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${meta.color} 10%, #14100a), #0a0806)`,
                    borderColor: `color-mix(in oklab, ${meta.color} 40%, rgba(212,162,75,0.4))` }}>
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] blur-[40px] pointer-events-none"
             style={{ background: `radial-gradient(circle, color-mix(in oklab, ${meta.color} 30%, transparent), transparent 70%)`}}></div>
        <div className="relative z-10">
          <div className="text-[11px] tracking-[0.3em] uppercase text-cream-dim mb-2.5">Năm sinh {year} · Can Chi</div>
          <div className="font-serif text-[22px] text-gold-bright italic mb-1.5">{menh.canChi}</div>
          <div className="font-serif text-[18px] text-cream-dim mb-7">{menh.napAm}</div>
          <div className="font-serif text-5xl text-cream leading-none mb-5 font-medium">
            Mệnh <span className="font-semibold italic" style={{ color: meta.color, textShadow: `0 0 24px color-mix(in oklab, ${meta.color} 50%, transparent)` }}>{menh.element}</span>
          </div>
          <p className="text-cream-dim text-base max-w-[480px] leading-[1.65]">{meta.desc}</p>
        </div>
        <div className="flex items-center justify-center relative z-10">
          <BaguaRing element={meta.symbol} color={meta.color}/>
        </div>
      </div>

      {/* Relations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gold/20 border border-gold/20 mb-8">
        {[
          { chip:'Quý nhân', sub:'Sinh ra mệnh bạn', bad:false, body:<><ElementBadge element={menh.duocSinh}/><div className="font-serif italic text-[13px] text-cream-dim">→ sinh {menh.element}</div></> },
          { chip:'Bạn giúp', sub:'Mệnh bạn sinh ra', bad:false, body:<><ElementBadge element={menh.element}/><div className="font-serif italic text-[13px] text-cream-dim">→ sinh {menh.sinhRa}</div><ElementBadge element={menh.sinhRa}/></> },
          { chip:'Tránh xung', sub:'Khắc chế mệnh bạn', bad:true, body:<><ElementBadge element={menh.biKhac}/><div className="font-serif italic text-[13px] text-red-400">⚡ khắc {menh.element}</div></> },
          { chip:'Bạn chế ngự', sub:'Mệnh bạn khắc', bad:true, body:<><ElementBadge element={menh.element}/><div className="font-serif italic text-[13px] text-red-400">⚡ khắc {menh.khacDi}</div><ElementBadge element={menh.khacDi}/></> }
        ].map((r, i) => (
          <div key={i} className="bg-ink-2 p-6 px-5 flex flex-col gap-3.5">
            <div className="flex flex-col gap-0.5">
              <span className={`text-[10px] tracking-[0.2em] uppercase font-semibold ${r.bad ? 'text-red-400' : 'text-emerald-400'}`}>{r.chip}</span>
              <span className="text-xs text-cream-dim">{r.sub}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap flex-1">{r.body}</div>
          </div>
        ))}
      </div>

      {/* Colors + direction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/20 border border-gold/20 mb-8">
        {[
          { title:'Màu tương hợp', chips: meta.luckyColors, good: true },
          { title:'Màu cần tránh', chips: meta.unluckyColors, good: false },
          { title:'Hướng tốt 2026', chips: [advice.direction], good: true }
        ].map((c, i) => (
          <div key={i} className="bg-ink-2 p-5 px-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-gold mb-3 font-medium">{c.title}</div>
            <div className="flex flex-wrap gap-1.5">
              {c.chips.map(x => (
                <span key={x} className={`text-[13px] px-3 py-1.5 rounded-full border ${c.good ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'border-gold/40 text-cream-dim opacity-70'}`}>{x}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Advice */}
      <div className="bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/40 p-9 px-10 relative">
        <span className="absolute -top-px -left-px w-6 h-6 border-t border-l border-gold"></span>
        <span className="absolute -bottom-px -right-px w-6 h-6 border-b border-r border-gold"></span>
        <div className="flex items-center gap-4 font-serif text-[26px] text-cream mb-3.5 font-medium">
          <span className="font-brush text-gold text-3xl w-[50px] h-[50px] border border-gold/40 inline-flex items-center justify-center">甲</span>
          <span>Thiên cơ năm 2026 dành cho bạn</span>
        </div>
        <p className="text-cream-dim text-[17px] leading-[1.65] mb-7 max-w-[720px] font-serif italic">{advice.overall}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-7 py-6 border-y border-gold/20">
          {[
            { t:'Nên làm', items:advice.do, cls:'text-emerald-400' },
            { t:'Nên tránh', items:advice.avoid, cls:'text-red-400' },
            { t:'Tháng cát lợi', months:advice.luckyMonths, cls:'text-cream-dim' }
          ].map(col => (
            <div key={col.t}>
              <div className={`text-[11px] tracking-[0.2em] uppercase mb-3 font-medium ${col.cls}`}>{col.t}</div>
              {col.items ? (
                <ul className="list-none">
                  {col.items.map((x, i) => (
                    <li key={i} className="text-cream text-[14.5px] py-2 pl-5 relative border-b border-dashed border-gold/20 last:border-0 before:content-['◆'] before:text-gold before:absolute before:left-0 before:top-2 before:text-[10px]">{x}</li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {col.months.map(m => <span key={m} className="bg-gold/15 border border-gold/40 text-gold-bright text-[13px] px-3 py-1.5 font-serif">Tháng {m}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          <Btn variant="primary">Xem luận giải chi tiết →</Btn>
          <Btn>Đặt lịch tư vấn 1-1</Btn>
        </div>
      </div>
    </div>
  );
}

function MiniTool() {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(6);
  const [year, setYear] = useState(1992);
  const [gender, setGender] = useState('nam');
  const [submitted, setSubmitted] = useState(true);

  const menh = useMemo(() => {
    const y = parseInt(year, 10);
    if (isNaN(y) || y < 1900 || y > 2100) return null;
    return window.NguHanh.getMenh(y);
  }, [year]);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      const el = document.getElementById('result-anchor');
      if (el) {
        const rect = el.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'smooth' });
      }
    }, 50);
  };

  const inputCls = "w-full bg-ink text-cream border border-gold/40 px-4 py-3 font-serif text-xl rounded-sm font-medium focus:outline-none focus:border-gold";
  const labelCls = "text-[11px] tracking-[0.18em] uppercase text-gold font-medium";

  return (
    <section id="tool" className="max-w-[1280px] mx-auto py-16 md:py-[120px] px-5 md:px-10 relative">
      <div className="text-center max-w-[780px] mx-auto mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2.5 text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-gold font-medium mb-4 md:mb-5">
          <span className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_theme(colors.gold.DEFAULT)] animate-pulse"></span>
          Thiên Cơ Đoán Mệnh
        </div>
        <h2 className="font-serif text-[30px] sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.1] font-medium text-cream mb-4 text-balance">
          Nhập <span className="font-medium italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">ngày sinh</span>, luận ngay <span className="font-medium italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">mệnh trời</span>
        </h2>
        <p className="text-cream-dim text-base leading-[1.65]">
          Tra cứu nạp âm Lục Thập Hoa Giáp · Ngũ hành tương sinh tương khắc · Vận niên 2026 · Miễn phí, tức thì, chính xác theo cổ pháp.
        </p>
      </div>

      <form onSubmit={onSubmit} className="max-w-[900px] mx-auto mb-10 md:mb-16 bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/40 p-5 md:p-9 relative">
        <span className="absolute -top-px -left-px w-[18px] h-[18px] border-t border-l border-gold"></span>
        <span className="absolute -bottom-px -right-px w-[18px] h-[18px] border-b border-r border-gold"></span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-[18px] mb-5 md:mb-6">
          {[["Ngày",day,setDay,1,31,"15"],["Tháng",month,setMonth,1,12,"6"],["Năm sinh",year,setYear,1900,2100,"1992"]].map(([l,v,s,mn,mx,ph]) => (
            <label key={l} className="flex flex-col gap-2">
              <span className={labelCls}>{l}</span>
              <input type="number" value={v} onChange={e => s(e.target.value)} min={mn} max={mx} placeholder={ph} className={inputCls}/>
            </label>
          ))}
          <label className="flex flex-col gap-2">
            <span className={labelCls}>Giới tính</span>
            <div className="flex bg-ink border border-gold/40 rounded-sm overflow-hidden">
              {[['nam','Nam'],['nu','Nữ']].map(([v,l]) => (
                <button key={v} type="button" onClick={() => setGender(v)}
                  className={`flex-1 py-3 font-serif text-lg transition-all ${gender === v ? 'bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold' : 'text-cream-dim'}`}>{l}</button>
              ))}
            </div>
          </label>
        </div>
        <Btn variant="primary" size="xl" className="w-full justify-center">
          <span>Khai mở thiên cơ</span><span className="text-base">☯</span>
        </Btn>
      </form>

      <div id="result-anchor"></div>
      {submitted && menh && <MenhResult menh={menh} year={year}/>}
    </section>
  );
}

// ============ BLOG ============
const POSTS = [
  { tag:'Tử vi 2026', title:'Mười hai con giáp năm Bính Ngọ: ai hanh thông, ai cần thủ?', excerpt:'Năm 2026 Bính Ngọ — hành Thiên Thượng Hỏa. Luận vận từng tuổi theo thiên can địa chi, thái tuế, tam tai.', date:'18 · 04 · 2026', read:'12 phút', glyph:'運', big:true },
  { tag:'Phong thủy', title:'Bố trí bàn làm việc hút tài lộc theo mệnh', excerpt:'Vị trí, hướng, vật phẩm phong thủy phù hợp với 5 mệnh Kim Mộc Thủy Hỏa Thổ.', date:'12 · 04 · 2026', read:'8 phút', glyph:'風' },
  { tag:'Cổ pháp', title:'Lục Thập Hoa Giáp: vì sao 60 năm một vòng?', excerpt:'Giải mã nguyên lý phối hợp 10 thiên can và 12 địa chi tạo nên chu kỳ nạp âm huyền diệu.', date:'05 · 04 · 2026', read:'10 phút', glyph:'甲' },
  { tag:'Chọn ngày', title:'Tam nương sát là gì? Vì sao tránh cưới hỏi ngày này?', excerpt:'Nguồn gốc tích cổ, cách tính ngày tam nương trong tháng, và khi nào có thể hóa giải.', date:'28 · 03 · 2026', read:'6 phút', glyph:'吉' }
];

function Blog() {
  return (
    <section id="blog" className="py-16 md:py-[120px] px-5 md:px-10 max-w-[1280px] mx-auto">
      <div className="flex items-end justify-between gap-6 md:gap-8 mb-10 md:mb-14 flex-wrap">
        <div>
          <div className="inline-block text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-gold font-medium mb-4 md:mb-5 px-3 md:px-3.5 py-1.5 border border-gold/40 rounded-full">Thư Phòng</div>
          <h2 className="font-serif text-[30px] sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-medium tracking-tight text-cream">
            Luận <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">cổ pháp</span>,<br/>
            bàn chuyện <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">đương thời</span>
          </h2>
        </div>
        <Btn>Đọc thêm bài viết →</Btn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {POSTS.map((p, i) => (
          <article key={i} className={`bg-ink-2 border border-gold/20 flex flex-col cursor-pointer transition-colors hover:border-gold/40 overflow-hidden ${p.big ? 'md:row-span-2 md:col-span-1' : ''}`}>
            <div className={`relative overflow-hidden flex items-center justify-center ${p.big ? 'aspect-[16/11]' : 'aspect-[16/9]'} bg-gradient-to-br from-ink-3 to-ink`}>
              <span className={`font-brush text-gold/80 ${p.big ? 'text-[240px]' : 'text-[140px]'}`} style={{textShadow:'0 0 40px rgba(212,162,75,0.6)'}}>{p.glyph}</span>
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
            <div className="font-serif italic text-gold text-sm">天機閣 · Nơi thiên cơ gặp nhân duyên</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {[
            { t:'Dịch vụ', items:['Tử vi trọn đời','Phong thủy nhà ở','Xem ngày tốt','Hợp tuổi','Tư vấn 1-1'] },
            { t:'Thư phòng', items:['Tử vi 2026','Cổ pháp','Phong thủy','Chọn ngày'] },
            { t:'Liên hệ', items:['Hotline: 1900 86 86','Email: thinhgiao@thiencoca.vn','Zalo: @thiencoca','Phòng thỉnh giáo — Q.1, TP.HCM'] }
          ].map(col => (
            <div key={col.t}>
              <div className="text-xs tracking-[0.2em] uppercase text-gold font-medium mb-4">{col.t}</div>
              {col.items.map(x => <a key={x} className="block text-cream-dim text-sm py-1.5 cursor-pointer hover:text-gold-bright">{x}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-7 flex justify-between text-xs text-cream-dim tracking-wide flex-wrap gap-3">
        <div>© 2026 Thiên Cơ Các · 天機閣</div>
        <div className="flex gap-6">
          <a className="cursor-pointer hover:text-gold-bright">Điều khoản</a>
          <a className="cursor-pointer hover:text-gold-bright">Bảo mật</a>
          <a className="cursor-pointer hover:text-gold-bright">Chính sách hoàn phí</a>
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
      <div className="relative w-full max-w-[980px] max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gradient-to-br from-ink-2 to-ink-3 border border-gold shadow-[0_0_0_1px_rgba(212,162,75,0.2),0_40px_80px_-20px_rgba(0,0,0,0.8)] animate-pop-in"
           onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-ink text-cream-dim border border-gold/40 hover:border-gold hover:text-gold-bright text-sm">✕</button>

        {/* Corners */}
        <span className="absolute top-2.5 left-2.5 w-6 h-6 border-t border-l border-gold z-20 pointer-events-none"></span>
        <span className="absolute top-2.5 right-2.5 w-6 h-6 border-t border-r border-gold z-20 pointer-events-none"></span>
        <span className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b border-l border-gold z-20 pointer-events-none"></span>
        <span className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b border-r border-gold z-20 pointer-events-none"></span>

        <div className="grid md:grid-cols-[0.85fr_1fr] flex-1 min-h-0 overflow-hidden">
          {/* Aside */}
          <aside className="hidden md:block relative border-r border-gold/20 overflow-y-auto bg-gradient-to-br from-ink to-ink-2">
            <div className="relative z-10 p-14 px-11 flex flex-col gap-5 h-full">
              <div className="inline-flex gap-1.5">
                {['天','機','閣'].map(c => (
                  <span key={c} className="w-10 h-10 inline-flex items-center justify-center border border-gold/40 font-brush text-gold text-[22px] bg-ink">{c}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold font-medium">
                <span className="w-7 h-px bg-gold"></span>Thiên Cơ Các<span className="w-7 h-px bg-gold"></span>
              </div>
              <h3 className="font-serif text-[34px] leading-[1.15] font-medium text-cream tracking-tight text-balance">
                Mở cửa <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">thư phòng</span> của riêng bạn
              </h3>
              <p className="text-cream-dim text-[15px] leading-[1.65]">
                Lưu lá số, theo dõi vận niên, nhận nhắc giờ tốt mỗi ngày — tất cả đồng bộ ngay trong tài khoản của bạn.
              </p>
              <ul className="list-none flex flex-col gap-2.5 pt-5 border-t border-gold/20 mt-2">
                {['Lưu lá số tử vi trọn đời','Thông báo ngày tốt hàng tuần','Ưu đãi riêng cho hội viên','Lịch sử thỉnh giáo chuyên gia'].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-cream text-sm"><span className="text-gold text-[10px]">◆</span>{t}</li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-3.5 text-cream-dim font-serif text-[15px] pt-6 border-t border-gold/20">
                <span className="font-brush text-gold text-[28px] border border-gold/40 w-11 h-11 inline-flex items-center justify-center flex-shrink-0">占</span>
                <em>"Biết mình biết vận, trăm sự hanh thông."</em>
              </div>
            </div>
          </aside>

          {/* Main */}
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
                {isLogin ? 'Thỉnh giáo lần nữa' : 'Khai mở tài khoản mới'}
              </h2>
              <p className="text-cream-dim text-[14.5px] leading-[1.6]">
                {isLogin ? 'Nhập thông tin để quay lại thư phòng của bạn.' : 'Nhập vài thông tin cơ bản để Thiên Cơ Các an bài lá số cho bạn.'}
              </p>
            </div>

            <form onSubmit={e => { e.preventDefault(); alert(isLogin?'Đang đăng nhập...':'Đang tạo tài khoản...'); }} className="flex flex-col gap-4">
              {!isLogin && (
                <label className="flex flex-col gap-1.5">
                  <span className={fieldLabel}>Tên của bạn</span>
                  <div className={inputWrap}>
                    <span className={glyphCls}>名</span>
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
                  <span className={glyphCls}>鎖</span>
                  <input className={inputCls} type={showPass?'text':'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder={isLogin?'Nhập mật khẩu':'Ít nhất 8 ký tự'} minLength={isLogin?undefined:8} required/>
                  <button type="button" onClick={() => setShowPass(s=>!s)} className="bg-none border-none cursor-pointer text-cream-dim hover:text-gold-bright px-3.5 text-lg">{showPass?'◎':'◉'}</button>
                </div>
              </label>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3.5">
                  <label className="flex flex-col gap-1.5">
                    <span className={fieldLabel}>Năm sinh</span>
                    <div className={inputWrap}>
                      <span className={glyphCls}>歲</span>
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
                <span>{isLogin ? 'Thỉnh vào thư phòng' : 'Khai mở tài khoản'}</span><span className="text-base">☯</span>
              </Btn>
            </form>

            <div className="flex items-center gap-3 text-cream-dim text-xs tracking-[0.15em] uppercase before:content-[''] before:flex-1 before:h-px before:bg-gold/20 after:content-[''] after:flex-1 after:h-px after:bg-gold/20">
              <span>hoặc tiếp tục với</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                {n:'Google', c:'text-cream'},
                {n:'Facebook', c:'text-cream'},
                {n:'Zalo', c:'text-cream'}
              ].map(s => (
                <button key={s.n} className={`inline-flex items-center justify-center gap-2 py-3 px-3.5 bg-ink ${s.c} border border-gold/40 text-[13px] font-medium cursor-pointer hover:border-gold hover:text-gold-bright transition-all`}>
                  {s.n}
                </button>
              ))}
            </div>

            <div className="text-center text-[13px] text-cream-dim pt-3 border-t border-gold/20">
              {isLogin
                ? <>Chưa có tài khoản? <a onClick={() => setTab('signup')} className="text-gold-bright cursor-pointer font-medium">Khai mở ngay</a></>
                : <>Đã có tài khoản? <a onClick={() => setTab('login')} className="text-gold-bright cursor-pointer font-medium">Thỉnh vào lại</a></>
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
  const golds = ['#d4a24b','#c79a3a','#e8c278','#b8923a'];
  const reds  = ['#a02828','#c03030','#8a1818','#6a1818'];

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[320px] max-h-[calc(100vh-48px)] overflow-y-auto bg-ink-2 border border-gold shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,162,75,0.2)] text-cream font-sans">
      <div className="flex justify-between items-center p-4 px-5 border-b border-gold/20 bg-gradient-to-br from-ink-3 to-ink-2">
        <div className="font-serif text-lg text-gold-bright font-medium">☯ Tweaks</div>
        <button onClick={onClose} className="bg-none border-none text-cream-dim cursor-pointer text-lg">✕</button>
      </div>
      <div className="p-5 flex flex-col gap-5">
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2.5 font-medium">Màu vàng kim</div>
          <div className="flex gap-2 flex-wrap">
            {golds.map(c => (
              <div key={c} onClick={() => update('primaryGold', c)}
                className={`w-9 h-9 rounded-full cursor-pointer border-2 transition-all ${tweaks.primaryGold === c ? 'border-cream' : 'border-transparent'}`}
                style={{ background: c }}/>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2.5 font-medium">Màu son (accent)</div>
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

  useEffect(() => {
    const r = document.documentElement.style;
    if (tweaks.primaryGold) r.setProperty('--tw-gold', tweaks.primaryGold);
    if (tweaks.accentRed) r.setProperty('--tw-red', tweaks.accentRed);
  }, [tweaks]);

  const heroCopy = {
    kicker: tweaks.heroKicker,
    title: parseHeroTitle(tweaks.heroTitle, tweaks.heroGoldWord),
    sub: tweaks.heroSub,
    cta: tweaks.heroCTA
  };

  const scrollToTool = () => {
    const el = document.getElementById('tool');
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top - 60, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Nav onOpenAuth={() => setAuthOpen(true)}/>
      <Hero copy={heroCopy} onCTA={scrollToTool}/>
      <Services/>
      <MiniTool/>
      <Blog/>
      <Footer/>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)}/>
      {editMode && <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onClose={() => setEditMode(false)}/>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
