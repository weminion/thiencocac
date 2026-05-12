// Lì Xì Xuân — Gửi quẻ Tết viral
const { useState: useLXS, useMemo: useLXM } = React;

function LXSeal({ color = '#d4a04a', size = 'sm' }) {
  const w = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
  const c = `pointer-events-none absolute ${w}`;
  return (
    <>
      <span className={`${c} -top-px -left-px border-t border-l`} style={{ borderColor: color }}></span>
      <span className={`${c} -top-px -right-px border-t border-r`} style={{ borderColor: color }}></span>
      <span className={`${c} -bottom-px -left-px border-b border-l`} style={{ borderColor: color }}></span>
      <span className={`${c} -bottom-px -right-px border-b border-r`} style={{ borderColor: color }}></span>
    </>
  );
}

const GIFT_TYPES = [
  { id: 'xam', kanji: 'Xăm', name: 'Lá xăm Quan Âm', desc: 'Bốc 1 lá xăm cát lành từ Quan Thế Âm Bồ Tát', sample: 'Trung cát · Bình minh sau mưa — duyên hiền sắp tới.' },
  { id: 'laso', kanji: 'Mệnh', name: 'Lá số đầu năm', desc: 'Vận mệnh Bính Ngọ 2026 — quý nhân, tài lộc, hôn nhân', sample: 'Năm Bính Ngọ — danh tiếng lên cao, quý nhân hỗ trợ tháng 4–7.' },
  { id: 'ke', kanji: 'Kệ', name: 'Câu kệ may mắn', desc: 'Một câu thiền kệ ngắn, in lên giấy điều', sample: '"Tâm bình thì thế giới bình."' }
];

const ENVELOPE_THEMES = [
  { id: 'red', name: 'Hỷ Sự', kanji: '', bg: 'from-[#8a2818] via-[#a83828] to-[#6a1a10]', accent: '#e6b85a' },
  { id: 'gold', name: 'Phú Quý', kanji: '', bg: 'from-[#3a2a14] via-[#5a3e1c] to-[#2a1f10]', accent: '#f4cf73' },
  { id: 'lotus', name: 'Thanh Tịnh', kanji: 'Sen', bg: 'from-[#3a2418] via-[#4a2e1c] to-[#2a1f12]', accent: '#c87a5a' },
  { id: 'jade', name: 'Bình An', kanji: 'An', bg: 'from-[#1a3a28] via-[#284a38] to-[#0f1e14]', accent: '#7ca85a' }
];

const GREETINGS = [
  { vi: 'Chúc một năm mới vạn sự cát tường, an khang thịnh vượng.', han: 'Cát' },
  { vi: 'Cung chúc tân xuân — phúc lộc đầy nhà, vạn sự như ý.', han: 'Phúc' },
  { vi: 'Tân niên hỷ lạc, tài nguyên quảng tiến, quý nhân tương trợ.', han: 'Tiến' },
  { vi: 'Năm mới tâm an, gia đạo hòa thuận, sự nghiệp hanh thông.', han: '' }
];

function EnvelopePreview({ theme, gift, sender, recipient, message }) {
  const t = ENVELOPE_THEMES.find(x => x.id === theme) || ENVELOPE_THEMES[0];
  const g = GIFT_TYPES.find(x => x.id === gift) || GIFT_TYPES[0];
  return (
    <div className={`relative aspect-[3/4] bg-gradient-to-br ${t.bg} overflow-hidden border-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]`} style={{ borderColor: t.accent + '99' }}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${t.accent}55 0 1px, transparent 1px 14px)` }}></div>
      <div className="absolute inset-3 border" style={{ borderColor: t.accent + '66' }}></div>
      <div className="absolute -top-8 -right-6 font-brush text-[200px] leading-none select-none pointer-events-none" style={{ color: t.accent + '22' }}>{t.kanji}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-cream">
        <div className="font-brush text-[80px] leading-none drop-shadow-[0_0_30px_rgba(230,184,90,0.4)]" style={{ color: t.accent }}>{t.kanji}</div>
        <div className="font-serif text-[26px] font-semibold italic mt-2" style={{ color: t.accent }}>{t.name}</div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-cream-dim mt-1">Cung Hỷ Phát Tài</div>
        <div className="my-3 w-12 h-px" style={{ background: t.accent + '88' }}></div>
        <div className="text-[11px] text-cream/95 leading-relaxed text-balance px-2 italic">"{message}"</div>
        <div className="my-3 w-8 h-px" style={{ background: t.accent + '44' }}></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 border" style={{ borderColor: t.accent + '66' }}>
          <span className="font-brush text-base" style={{ color: t.accent }}>{g.kanji}</span>
          <span className="text-[9px] tracking-widest uppercase" style={{ color: t.accent }}>{g.name}</span>
        </div>
        <div className="mt-4 px-3 py-1.5 border text-[9px] tracking-[0.3em] uppercase" style={{ borderColor: t.accent + '66', color: t.accent }}>Bấm để mở · </div>
      </div>
      <span className="absolute top-2 left-2 font-brush text-xl" style={{ color: t.accent }}></span>
      <span className="absolute top-2 right-2 font-brush text-xl" style={{ color: t.accent }}></span>
      <span className="absolute bottom-2 left-2 text-[8px] tracking-widest" style={{ color: t.accent + 'cc' }}>Từ {sender || '?'}</span>
      <span className="absolute bottom-2 right-2 text-[8px] tracking-widest" style={{ color: t.accent + 'cc' }}>Tới {recipient || '?'}</span>
    </div>
  );
}

function StepDot({ n, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[12px] font-serif font-semibold ${done ? 'bg-gold border-gold text-ink' : active ? 'border-gold-bright text-gold-bright bg-gold/10' : 'border-gold/25 text-cream-dim/60'}`}>{done ? '✓' : n}</div>
      <span className={`text-[11px] tracking-wider uppercase ${active ? 'text-gold-bright' : done ? 'text-cream-dim' : 'text-cream-dim/50'}`}>{label}</span>
    </div>
  );
}

function LiXiPage() {
  const [step, setStep] = useLXS(1);
  const [theme, setTheme] = useLXS('red');
  const [gift, setGift] = useLXS('xam');
  const [sender, setSender] = useLXS('Minh');
  const [recipient, setRecipient] = useLXS('Hà');
  const [message, setMessage] = useLXS(GREETINGS[0].vi);
  const [sent, setSent] = useLXS(false);
  const canContinue = step === 1 ? gift : step === 2 ? recipient && sender : message;
  const sentLog = [
    { name: 'Mẹ Hà', time: '2 ngày trước', opened: true },
    { name: 'Anh Tuấn', time: '4 ngày trước', opened: true },
    { name: 'Cô Lan', time: '5 ngày trước', opened: false },
    { name: 'Bé An', time: '6 ngày trước', opened: true }
  ];

  return (
    <div className="px-5 md:px-10 py-6 md:py-10 max-w-[1280px] mx-auto">
      <div className="mb-7 relative overflow-hidden">
        <div className="absolute -top-12 -right-8 font-brush text-[180px] text-lotus/[0.06] leading-none select-none pointer-events-none hidden md:block">Phúc</div>
        <div className="text-[11px] tracking-[0.32em] uppercase text-gold font-medium"> · Lì xì xuân</div>
        <h1 className="font-serif text-[30px] md:text-[44px] font-semibold text-cream mt-2 leading-tight text-balance">
          Gửi <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">phước lành</span> đầu năm
        </h1>
        <p className="text-[14px] md:text-[15px] text-cream-dim mt-3 max-w-[680px] leading-relaxed">
          Tặng người thân một lá xăm + lời chúc gói trong phong bao đỏ — họ mở qua link, nhận quẻ riêng.
          <span className="text-gold-bright"> Mỗi lì xì mở = +10 công đức.</span>
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-5 mb-6 overflow-x-auto pb-2">
        <StepDot n={1} label="Chọn quà" active={step === 1} done={step > 1}/>
        <span className="h-px w-6 md:w-12 bg-gold/30"></span>
        <StepDot n={2} label="Người nhận" active={step === 2} done={step > 2}/>
        <span className="h-px w-6 md:w-12 bg-gold/30"></span>
        <StepDot n={3} label="Lời chúc" active={step === 3} done={step > 3}/>
        <span className="h-px w-6 md:w-12 bg-gold/30"></span>
        <StepDot n={4} label="Gửi" active={step === 4} done={sent}/>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,420px)] gap-6 md:gap-8 items-start">
        <div className="relative bg-ink-3/30 border border-gold/20 p-5 md:p-7">
          <LXSeal size="lg"/>
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Bước 1</div>
              <div className="font-serif text-[22px] text-cream font-semibold mb-1">Chọn quà gói trong bao</div>
              <div className="text-[12px] text-cream-dim mb-5">Mỗi loại sẽ sinh nội dung riêng khi người nhận mở.</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {GIFT_TYPES.map(g => (
                  <button key={g.id} onClick={() => setGift(g.id)}
                    className={`relative text-left p-4 border transition-all ${gift === g.id ? 'border-gold bg-gold/[0.06]' : 'border-gold/20 hover:border-gold/50 bg-ink-2/40'}`}>
                    {gift === g.id && <LXSeal />}
                    <div className="font-brush text-3xl mb-2" style={{ color: gift === g.id ? '#e6b85a' : '#d4a04a99' }}>{g.kanji}</div>
                    <div className="font-serif text-[16px] text-cream font-semibold leading-tight">{g.name}</div>
                    <div className="text-[11px] text-cream-dim leading-snug mt-1.5">{g.desc}</div>
                    <div className="mt-3 pt-2.5 border-t border-gold/15 text-[10px] text-gold-bright italic leading-snug">Ví dụ: {g.sample}</div>
                  </button>
                ))}
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Phong bao</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ENVELOPE_THEMES.map(t => (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className={`relative aspect-[3/4] border-2 overflow-hidden bg-gradient-to-br ${t.bg} transition-all ${theme === t.id ? 'scale-[1.03]' : 'opacity-70 hover:opacity-100'}`}
                    style={{ borderColor: theme === t.id ? t.accent : t.accent + '50' }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-brush text-3xl" style={{ color: t.accent }}>{t.kanji}</span>
                      <span className="text-[9px] tracking-widest uppercase mt-1" style={{ color: t.accent }}>{t.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Bước 2</div>
              <div className="font-serif text-[22px] text-cream font-semibold mb-1">Gửi cho ai?</div>
              <div className="text-[12px] text-cream-dim mb-5">Tên sẽ in trên phong bao và cá nhân hóa quẻ.</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="relative bg-ink-3/40 border border-gold/25 p-4">
                  <LXSeal />
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Từ bạn</div>
                  <input value={sender} onChange={e => setSender(e.target.value)} placeholder="Tên bạn"
                    className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-2 text-cream text-[15px] outline-none"/>
                </div>
                <div className="relative bg-ink-3/40 border border-gold/25 p-4">
                  <LXSeal />
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Tới</div>
                  <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Tên người nhận"
                    className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-2 text-cream text-[15px] outline-none"/>
                </div>
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Gửi nhanh cho</div>
              <div className="flex gap-2 flex-wrap">
                {['Mẹ', 'Bố', 'Vợ', 'Chồng', 'Anh', 'Chị', 'Bạn thân', 'Sếp'].map(r => (
                  <button key={r} onClick={() => setRecipient(r)}
                    className="px-3 py-1.5 text-[12px] border border-gold/25 hover:border-gold hover:bg-gold/[0.06] text-cream-dim hover:text-gold-bright transition-all">{r}</button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Bước 3</div>
              <div className="font-serif text-[22px] text-cream font-semibold mb-1">Lời chúc</div>
              <div className="text-[12px] text-cream-dim mb-5">Chọn câu có sẵn hoặc viết riêng.</div>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                placeholder="Viết lời chúc của bạn..."
                className="w-full bg-ink-3/40 border border-gold/25 focus:border-gold p-3 text-cream text-[14px] outline-none placeholder:text-cream-dim/50 leading-relaxed mb-4 resize-none"/>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Mẫu có sẵn</div>
              <div className="space-y-2">
                {GREETINGS.map((g, i) => (
                  <button key={i} onClick={() => setMessage(g.vi)}
                    className={`w-full relative text-left p-3 pr-12 border transition-all ${message === g.vi ? 'border-gold bg-gold/[0.06]' : 'border-gold/20 hover:border-gold/50'}`}>
                    <div className="text-[12px] text-cream leading-snug">{g.vi}</div>
                    <span className="absolute top-2 right-2 font-brush text-base text-gold/70">{g.han}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-up">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Bước 4</div>
              <div className="font-serif text-[22px] text-cream font-semibold mb-1">{sent ? 'Đã gửi! ✓' : 'Sẵn sàng gửi'}</div>
              <div className="text-[12px] text-cream-dim mb-5">
                {sent ? 'Phong bao đã tạo và link đã sao chép. Dán vào Zalo/Messenger để gửi.' : `Lì xì cho ${recipient} sẽ được mở khi họ bấm vào link riêng.`}
              </div>
              {sent ? (
                <div className="relative bg-gold/10 border border-gold/40 p-4 mb-4">
                  <LXSeal />
                  <div className="text-[10px] tracking-widest uppercase text-gold mb-1">Link đã sao chép</div>
                  <div className="font-mono text-[12px] text-gold-bright break-all">thienco.cac/li-xi/abc123-x7k</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: 'Z', label: 'Zalo', color: 'from-[#0068ff] to-[#0050c7]' },
                    { icon: 'M', label: 'Messenger', color: 'from-[#0084ff] to-[#0064c7]' },
                    { icon: '🔗', label: 'Sao chép link', color: 'from-gold-bright to-gold-deep' }
                  ].map(b => (
                    <button key={b.label} onClick={() => setSent(true)}
                      className={`flex flex-col items-center gap-1.5 py-3 bg-gradient-to-br ${b.color} text-cream font-medium transition-all hover:-translate-y-px`}>
                      <span className="font-serif text-base">{b.icon}</span>
                      <span className="text-[11px] tracking-wider">{b.label}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="bg-ink-3/40 border border-gold/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-brush text-xl text-gold">Duyên</span>
                  <span className="text-[12px] text-cream font-medium">+10 công đức khi người nhận mở</span>
                </div>
                <div className="text-[10px] text-cream-dim leading-relaxed">
                  Nếu họ chưa có Thiên Cơ Các, link sẽ dẫn họ vào nhận quẻ riêng — bạn được +20 công đức.
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-7 pt-5 border-t border-gold/15">
            <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
              className="px-4 py-2 text-[12px] tracking-wider text-cream-dim hover:text-cream disabled:opacity-30 disabled:cursor-not-allowed">← Quay lại</button>
            {step < 4 ? (
              <button onClick={() => canContinue && setStep(s => s + 1)} disabled={!canContinue}
                className={`px-6 py-2.5 text-[13px] font-semibold tracking-wide rounded-sm transition-all ${canContinue ? 'bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink shadow-[0_8px_24px_-8px_rgba(212,160,74,0.5)] hover:-translate-y-px' : 'bg-ink/40 text-cream-dim/50 border border-gold/15 cursor-not-allowed'}`}>Tiếp tục →</button>
            ) : (
              <button onClick={() => { setSent(false); setStep(1); }}
                className="px-6 py-2.5 text-[13px] font-semibold tracking-wide border border-gold/40 text-cream hover:border-gold hover:text-gold-bright">Gửi lì xì khác</button>
            )}
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-6">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2 text-center">Xem trước phong bao</div>
            <EnvelopePreview theme={theme} gift={gift} sender={sender} recipient={recipient} message={message}/>
            <div className="text-[10px] text-cream-dim/70 italic text-center mt-2">Người nhận sẽ thấy như vầy khi mở link.</div>
          </div>
          <div className="relative bg-ink-3/40 border border-gold/20 p-4">
            <LXSeal />
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium">Đã gửi</div>
                <div className="font-serif text-[15px] text-cream font-semibold">Tết Bính Ngọ 2026</div>
              </div>
              <div className="text-right">
                <div className="font-serif text-[20px] text-gold-bright font-semibold leading-none">12</div>
                <div className="text-[9px] text-cream-dim tracking-widest">LÌ XÌ</div>
              </div>
            </div>
            <ul className="divide-y divide-gold/10">
              {sentLog.map((s, i) => (
                <li key={i} className="flex items-center gap-3 py-2">
                  <span className={`w-2 h-2 rounded-full ${s.opened ? 'bg-gold' : 'bg-cream-dim/30'}`}></span>
                  <span className="text-[12px] text-cream flex-1 truncate">{s.name}</span>
                  <span className="text-[10px] text-cream-dim">{s.time}</span>
                  <span className={`text-[9px] tracking-widest ${s.opened ? 'text-gold-bright' : 'text-cream-dim/50'}`}>{s.opened ? 'ĐÃ MỞ' : 'CHỜ'}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-gold/15 flex items-center justify-between">
              <span className="text-[10px] text-cream-dim">3/4 đã mở · +30 công đức</span>
              <button className="text-[10px] tracking-widest text-gold-bright hover:text-cream">XEM TẤT CẢ →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.LiXiPage = LiXiPage;
