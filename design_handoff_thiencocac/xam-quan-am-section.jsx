// XAM QUAN AM — Section + Promo + Flow
// Phụ thuộc: xam-quan-am.js (window.XamQuanAm), cong-duc.jsx (useCongDuc)

const { useState: useStateX, useEffect: useEffectX, useRef: useRefX } = React;

const XAM_COST = 30;

const FIELDS_XAM = [
  { key:'duyen',  label:'Tình duyên',  glyph:'Duyên' },
  { key:'sn',     label:'Sự nghiệp',   glyph:'Nghiệp' },
  { key:'tl',     label:'Tài lộc',     glyph:'' },
  { key:'sk',     label:'Sức khỏe',    glyph:'' },
  { key:'gd',     label:'Gia đạo',     glyph:'' },
  { key:'kt',     label:'Kiện tụng',   glyph:'' },
  { key:'xh',     label:'Xuất hành',   glyph:'' },
];

const TIER_COLORS = {
  thuong:     { bg:'from-emerald-900/40 to-ink-3', border:'border-emerald-500/50', text:'text-emerald-300', accent:'#10b981' },
  thuongtrung:{ bg:'from-green-900/30 to-ink-3',   border:'border-green-500/40',   text:'text-green-300',   accent:'#22c55e' },
  trungcat:   { bg:'from-amber-900/25 to-ink-3',   border:'border-gold/50',        text:'text-gold-bright', accent:'#d4a04a' },
  trungbinh:  { bg:'from-ink-2 to-ink-3',          border:'border-cream-dim/30',   text:'text-cream',       accent:'#c9b896' },
  trunghanp:  { bg:'from-orange-900/25 to-ink-3',  border:'border-lotus/40',       text:'text-lotus',       accent:'#c87a5a' },
  ha:         { bg:'from-red-900/30 to-ink-3',     border:'border-lotus-deep/50',  text:'text-lotus',       accent:'#a85838' },
};

// ─────────────────────────────────────────────────────────
// PROMO CARD (cho Tịnh phòng)
// ─────────────────────────────────────────────────────────
function XamPromoCard({ onOpen }) {
  return (
    <div className="bg-gradient-to-br from-ink-2 via-ink-3 to-ink-2 border border-gold/40 p-6 relative overflow-hidden">
      <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold"></span>
      <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold"></span>
      <div className="absolute -right-2 -bottom-4 font-brush text-[120px] text-gold/[0.06] select-none pointer-events-none">Xăm</div>
      <div className="absolute right-4 top-4 font-brush text-2xl text-gold/30 select-none pointer-events-none">QuánÂm</div>

      <div className="relative">
        <div className="font-brush text-gold text-3xl mb-2">Xăm · QuánÂm</div>
        <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-1">Xăm Quan Âm · 100 thẻ</div>
        <h3 className="font-serif text-2xl text-cream font-medium mb-2">
          Một niệm thành tâm, <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">một thẻ ứng nghiệm</span>
        </h3>
        <p className="text-sm text-cream-dim leading-snug mb-4 max-w-md">
          Niệm danh hiệu Bồ Tát Quan Thế Âm, đặt câu hỏi rồi rút thẻ trong ống xăm — 100 thẻ ứng từ Phổ Đà Sơn.
        </p>
        <div className="flex items-center gap-3">
          <button onClick={onOpen}
            className="px-5 py-2.5 bg-gradient-to-br from-gold-bright to-gold text-ink text-[13px] font-semibold tracking-[0.18em] uppercase">
            Rút xăm →
          </button>
          <span className="text-[11px] text-cream-dim flex items-center gap-1">
            <span className="font-brush text-gold">Đức</span> {XAM_COST} công đức / lá xăm
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// XAM TUBE — Ống xăm tre, lắc & rút
// ─────────────────────────────────────────────────────────
function XamTube({ onDrawn }) {
  const [phase, setPhase] = useStateX('idle'); // idle | shaking | drawing | drawn
  const [drawnNum, setDrawnNum] = useStateX(null);
  const shakeTimerRef = useRefX(null);

  const startShake = () => {
    if (phase !== 'idle') return;
    setPhase('shaking');
    setTimeout(() => {
      setPhase('drawing');
      const num = window.XamQuanAm.rutThe();
      setDrawnNum(num);
      setTimeout(() => {
        setPhase('drawn');
        setTimeout(() => onDrawn && onDrawn(num), 1200);
      }, 1400);
    }, 2400);
  };

  // Render 7 thanh tre trong ống
  const sticks = Array.from({ length: 7 });

  return (
    <div className="flex flex-col items-center">
      {/* Khu vực ống xăm */}
      <div className="relative h-[320px] w-[280px] flex items-end justify-center mb-4">
        {/* Ánh sáng nhang phía sau */}
        <div className="absolute inset-x-0 top-4 h-32 pointer-events-none flex justify-center">
          <div className="w-40 h-40 rounded-full opacity-20"
               style={{ background: 'radial-gradient(circle, rgba(244,207,115,0.5), transparent 60%)' }}></div>
        </div>

        {/* Tre xăm */}
        <div className={`relative w-32 ${phase === 'shaking' ? 'animate-xam-shake' : ''}`} style={{ height: '260px' }}>
          {/* Thanh tre lộ ra trên đỉnh */}
          {phase !== 'drawn' && sticks.map((_, i) => {
            const offset = (i - 3) * 4;
            const lift = phase === 'shaking' ? Math.random() * 8 - 4 : 0;
            return (
              <div key={i} className="absolute bottom-12 left-1/2 origin-bottom"
                   style={{
                     transform: `translateX(${-50 + offset}%) translateY(${-lift}px) rotate(${(i-3)*1.5}deg)`,
                     width: '4px',
                     height: `${180 + (i%3)*8}px`,
                     background: 'linear-gradient(to bottom, #f0d090 0%, #d4a04a 30%, #8a6a2a 70%, #5a3a18 100%)',
                     boxShadow: '0 0 1px rgba(0,0,0,0.6)',
                     borderRadius: '1px',
                     transition: phase === 'shaking' ? 'transform 0.08s' : 'transform 0.4s ease-out',
                     zIndex: i,
                   }}>
                {/* Vết ghi số trên đầu thanh tre */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-3 bg-red-900/40"></div>
              </div>
            );
          })}

          {/* Thanh tre RỚT RA — khi drawing */}
          {(phase === 'drawing' || phase === 'drawn') && drawnNum && (
            <div className="absolute left-1/2 -translate-x-1/2"
                 style={{
                   bottom: phase === 'drawn' ? '180px' : '20px',
                   transform: phase === 'drawn'
                     ? 'translate(-50%, 0) rotate(0deg) scale(1.1)'
                     : 'translate(-50%, 0) rotate(-12deg) scale(0.9)',
                   transition: 'all 1.4s cubic-bezier(0.34, 1.36, 0.64, 1)',
                   zIndex: 50,
                 }}>
              <div className="relative" style={{ width: '14px', height: '220px' }}>
                <div className="absolute inset-0 rounded-sm"
                     style={{
                       background: 'linear-gradient(to bottom, #f4d590 0%, #e6b85a 30%, #a07020 70%, #6a4218 100%)',
                       boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 0 1px rgba(0,0,0,0.4)',
                     }}></div>
                {/* Số trên đầu thẻ */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-12 bg-red-900/70 flex items-center justify-center">
                  <span className="font-brush text-[8px] text-cream font-bold" style={{ writingMode: 'vertical-rl' }}>{drawnNum}</span>
                </div>
              </div>
            </div>
          )}

          {/* Ống tre */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
               style={{ width: '128px', height: '120px', zIndex: 30 }}>
            {/* Thân ống */}
            <div className="absolute inset-x-0 bottom-0 h-[110px] rounded-sm"
                 style={{
                   background: 'linear-gradient(to bottom, #4a2818 0%, #6a3e22 20%, #5a3018 50%, #3a1808 100%)',
                   boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.4)',
                 }}>
              {/* Vành ống trên */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-700 to-amber-900"></div>
              {/* Vành ống dưới (đáy) */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-900 to-black"></div>
              {/* Vạch tre dọc */}
              {[15, 30, 45, 60, 75, 90].map(p => (
                <div key={p} className="absolute top-2 bottom-2 w-px bg-black/30" style={{ left: `${p}%` }}></div>
              ))}
              {/* Chữ Hán mặt ống */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-brush text-gold/60 text-2xl">Xăm</span>
              </div>
            </div>
            {/* Đế ống */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-36 h-2 bg-gradient-to-b from-amber-950 to-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Status / button */}
      <div className="text-center min-h-[80px]">
        {phase === 'idle' && (
          <>
            <p className="text-[13px] text-cream-dim italic mb-3 max-w-xs mx-auto leading-snug">
              "Nam mô Đại Từ Đại Bi Quan Thế Âm Bồ Tát"<br/>
              Niệm 3 lần, định tâm, rồi lắc ống xăm.
            </p>
            <button onClick={startShake}
              className="px-7 py-2.5 bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold text-[12px] tracking-[0.2em] uppercase">
              Lắc ống xăm
            </button>
          </>
        )}
        {phase === 'shaking' && (
          <p className="font-serif italic text-gold-bright text-base">Đang lắc ống xăm…</p>
        )}
        {phase === 'drawing' && (
          <p className="font-serif italic text-gold-bright text-base">Một thẻ rơi ra…</p>
        )}
        {phase === 'drawn' && (
          <div className="animate-fade-up">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Thẻ rút được</div>
            <div className="font-serif text-3xl text-cream-bright">
              <span className="bg-gradient-to-br from-gold-bright to-gold bg-clip-text text-transparent"> {drawnNum} Xăm</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes xam-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-3px, -2px) rotate(-2deg); }
          20% { transform: translate(3px, -3px) rotate(3deg); }
          30% { transform: translate(-4px, 2px) rotate(-3deg); }
          40% { transform: translate(4px, 3px) rotate(2deg); }
          50% { transform: translate(-3px, -3px) rotate(-2deg); }
          60% { transform: translate(3px, 2px) rotate(3deg); }
          70% { transform: translate(-3px, -2px) rotate(-2deg); }
          80% { transform: translate(2px, 3px) rotate(2deg); }
          90% { transform: translate(-2px, -2px) rotate(-1deg); }
        }
        .animate-xam-shake { animation: xam-shake 0.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// FLOW: 4 bước — Tịnh tâm → Câu hỏi → Rút xăm → Luận giải
// ─────────────────────────────────────────────────────────
function XamFlow({ onClose, onSaved }) {
  const { state, spend } = useCongDuc();
  const [step, setStep] = useStateX(state.balance >= XAM_COST ? 'purify' : 'no-balance');
  const [field, setField] = useStateX('duyen');
  const [question, setQuestion] = useStateX('');
  const [theNum, setTheNum] = useStateX(null);
  const [purifyTimer, setPurifyTimer] = useStateX(0);

  const handleStart = () => {
    if (state.balance < XAM_COST) return;
    spend(XAM_COST, '__xam_quan_am__');
    setStep('purify');
  };

  // Tịnh tâm — 8s timer
  useEffectX(() => {
    if (step !== 'purify') return;
    let t = 0;
    const id = setInterval(() => {
      t += 0.1;
      setPurifyTimer(t);
      if (t >= 8) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [step]);

  const purifyDone = purifyTimer >= 8;

  const handleDrawn = (num) => {
    setTheNum(num);
    setStep('result');
  };

  const the = theNum ? window.XamQuanAm.getThe(theNum) : null;

  return (
    <div className="bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/40 p-6 md:p-10 relative">
      <span className="absolute -top-px -left-px w-6 h-6 border-t border-l border-gold"></span>
      <span className="absolute -top-px -right-px w-6 h-6 border-t border-r border-gold"></span>
      <span className="absolute -bottom-px -left-px w-6 h-6 border-b border-l border-gold"></span>
      <span className="absolute -bottom-px -right-px w-6 h-6 border-b border-r border-gold"></span>

      <div className="flex items-center justify-between mb-6">
        <div className="font-brush text-gold/60 text-2xl">QuánÂmXăm · 100</div>
        <button onClick={onClose} className="text-cream-dim hover:text-gold-bright text-lg">✕</button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        {['purify','question','draw','result'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-7 h-7 flex items-center justify-center text-[11px] font-medium border ${
              step === s ? 'bg-gold text-ink border-gold'
              : (['purify','question','draw','result'].indexOf(step) > i ? 'border-gold/60 text-gold' : 'border-gold/20 text-cream-dim')
            }`}>{i+1}</div>
            {i < 3 && <div className={`w-10 h-px ${['purify','question','draw','result'].indexOf(step) > i ? 'bg-gold/60' : 'bg-gold/15'}`}></div>}
          </div>
        ))}
      </div>

      {/* No balance */}
      {step === 'no-balance' && (
        <div className="text-center py-12">
          <div className="font-brush text-gold/40 text-5xl mb-3">Đức</div>
          <h3 className="font-serif text-xl text-cream mb-2">Không đủ công đức</h3>
          <p className="text-sm text-cream-dim mb-4">Cần {XAM_COST} công đức để rút xăm. Hiện có {state.balance}.</p>
          <button onClick={onClose} className="px-5 py-2 border border-gold/30 text-cream-dim hover:text-gold text-[12px] tracking-widest uppercase">Đóng</button>
        </div>
      )}

      {/* Purify */}
      {step === 'purify' && (
        <div className="text-center max-w-md mx-auto py-4">
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-1">Bước 1</div>
          <h3 className="font-serif text-2xl text-cream mb-2">Tịnh tâm — niệm Quan Âm</h3>
          <p className="text-sm text-cream-dim italic mb-6 leading-relaxed">
            "Nam mô Đại Từ Đại Bi Cứu Khổ Cứu Nạn<br/>Quảng Đại Linh Cảm Quan Thế Âm Bồ Tát"
          </p>
          {/* Vòng thời gian */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(212,160,74,0.15)" strokeWidth="2"/>
              <circle cx="50" cy="50" r="44" fill="none" stroke="#d4a04a" strokeWidth="2"
                      strokeDasharray={`${(purifyTimer/8)*276} 276`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-brush text-gold-bright text-4xl">Sen</span>
            </div>
          </div>
          <button onClick={() => setStep('question')} disabled={!purifyDone}
            className={`px-6 py-2.5 text-[12px] tracking-[0.18em] uppercase font-semibold ${
              purifyDone ? 'bg-gradient-to-br from-gold-bright to-gold text-ink' : 'border border-gold/20 text-cream-dim/50 cursor-not-allowed'
            }`}>
            {purifyDone ? 'Tâm đã định →' : `Niệm tiếp ${Math.max(0, Math.ceil(8 - purifyTimer))}s`}
          </button>
        </div>
      )}

      {/* Question */}
      {step === 'question' && (
        <div className="max-w-xl mx-auto py-2">
          <div className="text-center mb-6">
            <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-1">Bước 2</div>
            <h3 className="font-serif text-2xl text-cream">Đặt câu hỏi · Chọn lĩnh vực</h3>
          </div>

          {/* Lĩnh vực */}
          <div className="mb-5">
            <div className="text-[10px] tracking-[0.22em] uppercase text-gold mb-2 font-medium">Lĩnh vực</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
              {FIELDS_XAM.map(f => (
                <button key={f.key} onClick={() => setField(f.key)}
                  className={`p-2.5 border text-center transition-all ${
                    field === f.key
                      ? 'border-gold bg-gold/10 text-gold-bright'
                      : 'border-gold/20 text-cream-dim hover:border-gold/50'
                  }`}>
                  <div className="font-brush text-lg">{f.glyph}</div>
                  <div className="text-[10px] mt-0.5">{f.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Câu hỏi */}
          <div className="mb-5">
            <div className="text-[10px] tracking-[0.22em] uppercase text-gold mb-2 font-medium">Tâm sự / Câu hỏi</div>
            <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={3}
              placeholder="Bồ Tát Quan Âm minh chứng — con xin hỏi…"
              className="w-full bg-ink border border-gold/25 focus:border-gold/60 outline-none p-3 text-cream placeholder:text-cream-dim/50 text-[14px] font-serif italic resize-none"/>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setStep('purify')} className="px-5 py-2 border border-gold/25 text-cream-dim hover:text-cream text-[12px] tracking-widest uppercase">← Quay lại</button>
            <button onClick={() => question.trim() && setStep('draw')}
              className={`px-6 py-2.5 text-[12px] tracking-[0.18em] uppercase font-semibold ${
                question.trim() ? 'bg-gradient-to-br from-gold-bright to-gold text-ink' : 'border border-gold/20 text-cream-dim/50 cursor-not-allowed'
              }`}>
              Đến ống xăm →
            </button>
          </div>
        </div>
      )}

      {/* Draw */}
      {step === 'draw' && (
        <div className="py-2">
          <div className="text-center mb-2">
            <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-1">Bước 3 · Rút xăm</div>
            <h3 className="font-serif text-xl text-cream">
              <span className="italic text-gold-bright">"{question}"</span>
            </h3>
            <div className="text-[11px] text-cream-dim mt-1">
              <span className="font-brush text-gold mr-1">{FIELDS_XAM.find(f=>f.key===field).glyph}</span>
              {FIELDS_XAM.find(f=>f.key===field).label}
            </div>
          </div>
          <XamTube onDrawn={handleDrawn}/>
        </div>
      )}

      {/* Result */}
      {step === 'result' && the && (
        <XamResult the={the} field={field} question={question}
          onClose={onClose}
          onSave={() => { onSaved && onSaved(theNum, field); onClose(); }}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// XAM RESULT — Lá xăm + luận giải
// ─────────────────────────────────────────────────────────
function XamResult({ the, field, question, onClose, onSave }) {
  const fieldMeta = FIELDS_XAM.find(f => f.key === field);
  const tier = TIER_COLORS[the.tier];

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Quan Âm chỉ dạy</div>
        <p className="text-cream italic text-sm max-w-lg mx-auto">"{question}"</p>
        <div className="text-[11px] text-cream-dim mt-1">
          <span className="font-brush text-gold mr-1">{fieldMeta.glyph}</span>{fieldMeta.label}
        </div>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start mb-6">
        {/* Lá xăm */}
        <div className="text-center">
          <div className={`relative bg-gradient-to-br ${tier.bg} border-2 ${tier.border} p-6 mx-auto`} style={{ maxWidth: '240px' }}>
            <span className="absolute -top-px -left-px w-4 h-4 border-t border-l border-current" style={{ color: tier.accent }}></span>
            <span className="absolute -top-px -right-px w-4 h-4 border-t border-r border-current" style={{ color: tier.accent }}></span>
            <span className="absolute -bottom-px -left-px w-4 h-4 border-b border-l border-current" style={{ color: tier.accent }}></span>
            <span className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-current" style={{ color: tier.accent }}></span>

            <div className="text-[10px] tracking-[0.3em] uppercase text-cream-dim mb-1">Thẻ thứ</div>
            <div className="font-brush text-5xl text-gold-bright mb-1"> {the.num} Xăm</div>
            <div className={`text-[11px] tracking-[0.22em] uppercase font-bold ${tier.text}`}>
              {the.tierMeta.han} · {the.tierMeta.label}
            </div>
            <div className="h-px bg-gold/30 my-3"></div>
            <div className="font-serif text-lg text-cream font-medium">{the.name}</div>
          </div>
        </div>

        {/* Luận giải */}
        <div className="space-y-5">
          {/* Kệ thơ */}
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-gold font-medium mb-2">Kệ thơ (Thẻ văn)</div>
            <div className="bg-ink/50 border-l-2 border-gold/50 pl-4 py-2">
              {the.ke.map((line, i) => (
                <p key={i} className="font-serif italic text-gold-bright text-[15px] leading-relaxed">{line}</p>
              ))}
            </div>
          </div>

          {/* Tổng luận */}
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-gold font-medium mb-1">Tổng luận</div>
            <p className="text-[14px] text-cream leading-relaxed">{the.tongluan}</p>
          </div>

          {/* Ứng vào lĩnh vực */}
          <div className="border-t border-gold/15 pt-4">
            <div className="text-[10px] tracking-[0.22em] uppercase text-gold font-medium mb-2">
              Ứng vào {fieldMeta.label.toLowerCase()}
            </div>
            <p className={`text-[14px] leading-relaxed ${tier.text}`}>
              <span className="font-brush mr-2">{fieldMeta.glyph}</span>
              {the.fields[field]}
            </p>
          </div>

          {/* 6 lĩnh vực còn lại */}
          <div className="border-t border-gold/15 pt-4">
            <div className="text-[10px] tracking-[0.22em] uppercase text-gold font-medium mb-2">Ứng cho việc khác</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {FIELDS_XAM.filter(f => f.key !== field).map(f => (
                <div key={f.key} className="flex items-start gap-2 text-[12px]">
                  <span className="font-brush text-gold mt-0.5">{f.glyph}</span>
                  <div>
                    <div className="text-cream-dim text-[10px] tracking-wider uppercase">{f.label}</div>
                    <div className="text-cream-dim/90 leading-snug">{the.fields[f.key]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-gold/15">
        <button onClick={onClose}
          className="px-5 py-2.5 border border-gold/30 text-cream-dim hover:text-cream hover:border-gold/60 text-[12px] tracking-widest uppercase">
          Đóng
        </button>
        <button onClick={onSave}
          className="px-6 py-2.5 bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold text-[12px] tracking-widest uppercase">
          Hồi hướng · Lưu sổ tay
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// XAM JOURNAL — Lịch sử xăm đã rút
// ─────────────────────────────────────────────────────────
const XAM_HISTORY = [
  { date:'24/04', field:'sn',    num:31, name:'Khương Tử Nha Phong Thần', tier:'thuong',     question:'Có nên nhận lời mời hợp tác?', verified:'success' },
  { date:'20/04', field:'duyen', num:43, name:'Lương Sơn Bá – Chúc Anh Đài', tier:'trungbinh', question:'Người ấy có hợp với mình không?', verified:null },
  { date:'15/04', field:'tl',    num:67, name:'Hạng Vũ Vây Khốn',          tier:'ha',         question:'Vốn này nên đầu tư không?', verified:'partial' },
];

function XamJournal() {
  return (
    <div className="bg-ink-2 border border-gold/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-1">Sổ xăm</div>
          <div className="font-serif text-xl text-cream font-medium">Những thẻ đã rút</div>
        </div>
        <button className="text-xs text-cream-dim hover:text-gold-bright tracking-wider uppercase">Tất cả →</button>
      </div>
      <ul className="space-y-3">
        {XAM_HISTORY.map((it, i) => {
          const fieldMeta = FIELDS_XAM.find(f => f.key === it.field);
          const tier = TIER_COLORS[it.tier];
          return (
            <li key={i} className="flex items-start gap-4 p-3 border border-gold/10 hover:border-gold/30 transition-colors group">
              <div className={`flex flex-col items-center justify-center w-14 h-16 ${tier.bg} bg-gradient-to-br border ${tier.border} flex-shrink-0`}>
                <div className="text-[9px] tracking-widest text-cream-dim"></div>
                <div className="font-brush text-gold text-xl leading-none">{it.num}</div>
                <div className="text-[8px] tracking-widest uppercase mt-0.5" style={{ color: tier.accent }}>
                  {window.XamQuanAm.TIERS[it.tier].han}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-serif text-base text-cream">{it.name}</span>
                  <span className="text-[10px] tracking-widest uppercase text-cream-dim">·</span>
                  <span className="text-[11px] text-cream-dim flex items-center gap-1">
                    <span className="font-brush text-gold">{fieldMeta.glyph}</span>{fieldMeta.label}
                  </span>
                </div>
                <p className="text-[13px] text-cream italic truncate">"{it.question}"</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-cream-dim">{it.date}</span>
                  {it.verified === 'success' && <span className="text-[10px] text-emerald-400">✓ ứng nghiệm</span>}
                  {it.verified === 'partial' && <span className="text-[10px] text-gold">~ một phần</span>}
                  {!it.verified && (
                    <button className="text-[10px] text-cream-dim hover:text-gold-bright underline-offset-2 hover:underline">+ ghi kết quả</button>
                  )}
                </div>
              </div>
              <button className="text-[11px] text-cream-dim group-hover:text-gold-bright tracking-widest uppercase shrink-0">Xem →</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// XAM PAGE
// ─────────────────────────────────────────────────────────
function XamQuanAmPage() {
  const [flowOpen, setFlowOpen] = useStateX(false);
  const { state } = useCongDuc();
  return (
    <div className="p-5 md:p-10 md:pt-8 space-y-6 md:space-y-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-1">Xăm Quan Âm</div>
          <h1 className="font-serif text-[26px] md:text-[36px] text-cream font-medium">
            <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">Linh xăm</span> Phổ Đà Sơn · 100 thẻ
          </h1>
          <p className="text-sm text-cream-dim mt-1">Bồ Tát Quan Thế Âm thị hiện — tâm thành ắt được ứng nghiệm.</p>
        </div>
        <button onClick={() => setFlowOpen(true)}
          disabled={state.balance < XAM_COST}
          className={`px-6 py-3 text-[12px] tracking-[0.2em] uppercase font-semibold ${
            state.balance >= XAM_COST
              ? 'bg-gradient-to-br from-gold-bright to-gold text-ink'
              : 'border border-gold/30 text-cream-dim/60 cursor-not-allowed'
          }`}>
          {state.balance >= XAM_COST ? 'Khởi xăm →' : `Cần ${XAM_COST} công đức`}
        </button>
      </div>

      {flowOpen ? <XamFlow onClose={() => setFlowOpen(false)} onSaved={() => {}}/> : (
        <>
          <XamPromoCard onOpen={() => setFlowOpen(true)}/>
          <XamJournal/>

          {/* 100 thẻ grid (preview) */}
          <div className="bg-ink-2 border border-gold/20 p-6">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-1">100 thẻ Phổ Đà Sơn</div>
            <div className="font-serif text-xl text-cream font-medium mb-4">Bộ xăm Quan Âm linh cảm</div>
            <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 lg:grid-cols-20 gap-1">
              {Array.from({ length: 100 }, (_, i) => {
                const t = window.XamQuanAm.getThe(i + 1);
                return (
                  <button key={i+1}
                    title={`${t.num}. ${t.name} — ${t.tierMeta.label}`}
                    className="aspect-[3/4] border border-gold/15 hover:border-gold/60 hover:bg-gold/10 flex items-center justify-center font-brush text-gold text-xs transition-colors group">
                    <span className="group-hover:text-gold-bright">{t.num}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { XamQuanAmPage, XamPromoCard });
