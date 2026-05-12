// NIEM PHAT MALA 108 — Chuỗi tràng hạt 108 hạt
// Mỗi hạt = 1 niệm. Hoàn thành 108 hạt = 1 chu (round) = +5 công đức
// Có sẵn 6 danh hiệu: A Di Đà · Quan Thế Âm · Đại Thế Chí · Địa Tạng · Văn Thù · Phổ Hiền

const { useState: useStateN, useEffect: useEffectN, useRef: useRefN, useMemo: useMemoN } = React;

const PHAT_HIEU = [
  { key:'adida',   short:'Nam mô A Di Đà Phật',                    han:'Phật',     color:'#f4cf73' },
  { key:'quanam',  short:'Nam mô Đại Bi Quan Thế Âm Bồ Tát',      han:'QuánÂm',   color:'#e6b85a' },
  { key:'dtc',     short:'Nam mô Đại Thế Chí Bồ Tát',              han:'',   color:'#d4a04a' },
  { key:'diatang', short:'Nam mô Đại Nguyện Địa Tạng Vương Bồ Tát', han:'',   color:'#c87a5a' },
  { key:'vanthu',  short:'Nam mô Đại Trí Văn Thù Sư Lợi Bồ Tát',   han:'',     color:'#a07020' },
  { key:'pho',     short:'Nam mô Đại Hạnh Phổ Hiền Bồ Tát',        han:'',     color:'#a85838' },
];

const NIEM_REWARD_PER_ROUND = 5; // mỗi 108 niệm = 5 công đức

// ─────────────────────────────────────────────────────────
// Persistence
// ─────────────────────────────────────────────────────────
const NIEM_KEY = 'tcc-niem-phat-v1';
function loadNiem() {
  try {
    const raw = localStorage.getItem(NIEM_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function saveNiem(state) {
  try { localStorage.setItem(NIEM_KEY, JSON.stringify(state)); } catch {}
}

// ─────────────────────────────────────────────────────────
// MALA — vòng tràng hạt SVG 108 hạt
// ─────────────────────────────────────────────────────────
function MalaRing({ count, total = 108, color = '#d4a04a', size = 280 }) {
  const cx = size / 2, cy = size / 2;
  const radius = size / 2 - 18;
  const beadR = (2 * Math.PI * radius) / total / 2.6;

  const beads = useMemoN(() => {
    return Array.from({ length: total }, (_, i) => {
      const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const isMaster = i === 0;             // hạt mẫu (Phật đầu)
      const isMarker = (i + 1) % 27 === 0;  // hạt phân chia 27/54/81
      return { x, y, isMaster, isMarker, lit: i < count };
    });
  }, [count, total]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="drop-shadow-[0_0_30px_rgba(244,207,115,0.15)]">
      {/* Halo ánh sáng */}
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="60%" stopColor={color} stopOpacity="0.06"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
        <filter id="beadShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2"/>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={radius + 18} fill="url(#halo)"/>

      {/* Sợi dây */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(212,160,74,0.18)" strokeWidth="1"/>

      {/* Hạt */}
      {beads.map((b, i) => {
        const r = b.isMaster ? beadR * 1.8 : (b.isMarker ? beadR * 1.25 : beadR);
        const fill = b.lit
          ? (b.isMaster ? '#f4cf73' : (b.isMarker ? '#e6b85a' : color))
          : 'rgba(80,55,28,0.5)';
        const stroke = b.lit ? 'rgba(255,230,160,0.6)' : 'rgba(120,80,40,0.6)';
        return (
          <g key={i}>
            {b.lit && (
              <circle cx={b.x} cy={b.y} r={r * 1.6} fill={color} opacity="0.18" filter="url(#beadShadow)"/>
            )}
            <circle cx={b.x} cy={b.y} r={r} fill={fill} stroke={stroke} strokeWidth="0.5"/>
            {b.lit && <circle cx={b.x - r*0.3} cy={b.y - r*0.3} r={r*0.3} fill="rgba(255,250,220,0.6)"/>}
          </g>
        );
      })}

      {/* Tâm — hạt Phật đầu (3 hạt thắt nút) */}
      <g transform={`translate(${cx} ${cy + radius + 8})`}>
        <circle cx="0" cy="0" r={beadR * 2} fill="#a07020" stroke="#f4cf73" strokeWidth="1"/>
        <circle cx="-beadR*2.5" cy="2" r={beadR * 1.4} fill="#8a6a2a"/>
        <circle cx={beadR * 2.5} cy="2" r={beadR * 1.4} fill="#8a6a2a"/>
        <text x="0" y="2" textAnchor="middle" fontSize={beadR * 2.4} fontFamily="'Dancing Script', serif" fill="#1a1208">Phật</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// FULL PAGE — Niệm Phật
// ─────────────────────────────────────────────────────────
function NiemPhatPage() {
  const cdCtx = (typeof useCongDuc === 'function') ? useCongDuc() : null;

  const [phat, setPhat] = useStateN(() => {
    const s = loadNiem(); return s?.phat || 'adida';
  });
  const [count, setCount] = useStateN(() => loadNiem()?.count || 0);
  const [rounds, setRounds] = useStateN(() => loadNiem()?.rounds || 0);
  const [totalNiem, setTotalNiem] = useStateN(() => loadNiem()?.totalNiem || 0);
  const [autoMode, setAutoMode] = useStateN(false);
  const [bpm, setBpm] = useStateN(60); // niệm / phút
  const [showStats, setShowStats] = useStateN(false);

  const phatMeta = PHAT_HIEU.find(p => p.key === phat);

  // Persist
  useEffectN(() => {
    saveNiem({ phat, count, rounds, totalNiem });
  }, [phat, count, rounds, totalNiem]);

  // Auto-niệm
  useEffectN(() => {
    if (!autoMode) return;
    const interval = 60000 / bpm;
    const id = setInterval(() => doNiem(), interval);
    return () => clearInterval(id);
  }, [autoMode, bpm, count]);

  const doNiem = () => {
    setCount(c => {
      const next = c + 1;
      if (next >= 108) {
        // Hoàn thành 1 chu
        setRounds(r => r + 1);
        setTotalNiem(t => t + 108);
        if (cdCtx?.earn) cdCtx.earn(NIEM_REWARD_PER_ROUND, '__niem_phat__');
        return 0;
      }
      return next;
    });
  };

  const reset = () => {
    if (!confirm('Đặt lại chuỗi 108 hạt? (Giữ nguyên tổng số chu đã hoàn thành)')) return;
    setCount(0);
  };

  const resetAll = () => {
    if (!confirm('Xoá toàn bộ tiến trình niệm Phật? Không thể hoàn tác.')) return;
    setCount(0); setRounds(0); setTotalNiem(0);
  };

  const progressPercent = (count / 108) * 100;
  const todayMinutes = Math.round(totalNiem / bpm);

  return (
    <div className="p-5 md:p-10 md:pt-8">
      <div className="text-center mb-6">
        <div className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold font-medium mb-1">Niệm Phật · Nhiếp tâm</div>
        <h1 className="font-serif text-[26px] md:text-[36px] text-cream font-medium leading-tight">
          Một câu danh hiệu, <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">vạn niệm tịnh thanh</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 md:gap-8">
        {/* MAIN — Mala + nút niệm */}
        <div className="bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-6 md:p-10 relative overflow-hidden">
          <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold"></span>
          <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold"></span>
          <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold"></span>
          <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold"></span>

          {/* Chọn danh hiệu */}
          <div className="mb-6">
            <div className="text-[10px] tracking-[0.22em] uppercase text-gold font-medium mb-2">Danh hiệu niệm</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              {PHAT_HIEU.map(p => (
                <button key={p.key} onClick={() => setPhat(p.key)}
                  className={`px-3 py-2 border text-left transition-all ${
                    phat === p.key ? 'border-gold bg-gold/10' : 'border-gold/20 hover:border-gold/50'
                  }`}>
                  <div className="font-brush text-base" style={{ color: phat === p.key ? p.color : '#c9b896' }}>{p.han}</div>
                  <div className={`text-[11px] leading-tight ${phat === p.key ? 'text-cream' : 'text-cream-dim'}`}>{p.short}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mala */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <MalaRing count={count} color={phatMeta.color} size={300}/>
              {/* Số đếm tâm vòng */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-[9px] tracking-[0.3em] uppercase text-gold-bright/70">Hạt thứ</div>
                  <div className="font-brush text-[64px] text-gold-bright leading-none my-1"
                       style={{ textShadow: `0 0 30px ${phatMeta.color}66` }}>
                    {count}
                  </div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-cream-dim">/ 108</div>
                </div>
              </div>
            </div>

            {/* Câu niệm */}
            <div className="mt-4 mb-5 text-center">
              <p className="font-serif italic text-gold-bright text-[17px]"
                 style={{ textShadow: `0 0 20px ${phatMeta.color}40` }}>
                {phatMeta.short}
              </p>
            </div>

            {/* Nút niệm chính */}
            <button onClick={doNiem}
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink font-brush text-5xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform select-none"
              style={{ boxShadow: `0 0 40px ${phatMeta.color}60, inset 0 -8px 20px rgba(0,0,0,0.25)` }}>
              Phật
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] uppercase text-gold whitespace-nowrap">Niệm 1 hạt</span>
            </button>

            {/* Phụ trợ */}
            <div className="mt-12 flex items-center gap-3 flex-wrap justify-center">
              <button onClick={() => setAutoMode(m => !m)}
                className={`px-4 py-2 border text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  autoMode ? 'border-lotus bg-lotus/10 text-lotus' : 'border-gold/30 text-cream-dim hover:border-gold/60 hover:text-gold'
                }`}>
                {autoMode ? '⏸ Dừng tự niệm' : '▶ Tự động niệm'}
              </button>
              {autoMode && (
                <div className="flex items-center gap-2 text-[11px] text-cream-dim">
                  <span>Tốc độ</span>
                  <input type="range" min="20" max="120" step="5" value={bpm} onChange={e => setBpm(+e.target.value)}
                    className="accent-gold w-24"/>
                  <span className="text-gold-bright font-medium w-12">{bpm}/ph</span>
                </div>
              )}
              <button onClick={reset} className="px-3 py-2 text-[11px] tracking-widest uppercase text-cream-dim hover:text-gold-bright">↺ Hạt 0</button>
            </div>

            {/* Progress bar */}
            <div className="w-full mt-6">
              <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-cream-dim mb-1.5">
                <span>Tiến trình chu hiện tại</span>
                <span className="text-gold">{count}/108</span>
              </div>
              <div className="h-1 bg-ink border border-gold/15 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold-bright transition-all"
                     style={{ width: `${progressPercent}%`, boxShadow: `0 0 8px ${phatMeta.color}` }}></div>
              </div>
              {[27, 54, 81].map(m => (
                <div key={m} className="absolute" style={{ left: `${(m/108)*100}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Stats + công đức */}
        <div className="space-y-5">
          {/* Tổng kết */}
          <div className="bg-ink-2 border border-gold/25 p-6 relative">
            <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-gold"></span>
            <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-gold"></span>
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium mb-3">Tổng kết</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[9px] tracking-[0.2em] uppercase text-cream-dim">Chu hoàn thành</div>
                <div className="font-serif text-3xl text-cream font-medium leading-tight">{rounds}</div>
                <div className="text-[10px] text-gold-bright">×108 niệm</div>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.2em] uppercase text-cream-dim">Tổng niệm</div>
                <div className="font-serif text-3xl text-cream font-medium leading-tight">{(totalNiem + count).toLocaleString('vi-VN')}</div>
                <div className="text-[10px] text-cream-dim">~ {todayMinutes} phút</div>
              </div>
            </div>
            <div className="h-px bg-gold/15 my-4"></div>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="font-brush text-gold text-lg">Đức</span>
              <span className="text-cream-dim">Mỗi 108 niệm =</span>
              <span className="text-gold-bright font-semibold">+{NIEM_REWARD_PER_ROUND} công đức</span>
            </div>
            <div className="text-[11px] text-cream-dim mt-1">Đã tích từ niệm Phật: <span className="text-gold-bright font-medium">+{rounds * NIEM_REWARD_PER_ROUND}</span></div>
          </div>

          {/* Hồi hướng */}
          <div className="bg-gradient-to-br from-lotus/10 to-ink-3 border border-lotus/40 p-6 relative">
            <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-lotus"></span>
            <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-lotus"></span>
            <div className="font-brush text-lotus text-3xl mb-2"></div>
            <div className="font-serif text-lg text-cream font-medium mb-1">Hồi hướng công đức</div>
            <p className="text-[12px] text-cream-dim leading-relaxed mb-3">
              Nguyện đem công đức niệm Phật, hồi hướng cho oan gia trái chủ, cha mẹ hiện tiền, và pháp giới chúng sinh.
            </p>
            <button className="w-full py-2 bg-gradient-to-br from-lotus to-lotus-deep text-cream text-[11px] tracking-[0.18em] uppercase font-semibold">
              Hồi hướng ngay
            </button>
          </div>

          {/* Bài kệ phát nguyện */}
          <div className="bg-ink-2 border border-gold/20 p-6 relative">
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium mb-2">Bài kệ phát nguyện</div>
            <div className="font-serif italic text-cream-dim text-[13px] leading-relaxed space-y-1">
              <p>Nguyện sanh Tây phương Tịnh độ trung,</p>
              <p>Cửu phẩm liên hoa vi phụ mẫu,</p>
              <p>Hoa khai kiến Phật ngộ vô sanh,</p>
              <p>Bất thoái Bồ Tát vi bạn lữ.</p>
            </div>
          </div>

          <button onClick={resetAll} className="w-full text-[10px] tracking-[0.2em] uppercase text-cream-dim/60 hover:text-lotus py-2">
            ↻ Đặt lại toàn bộ
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// COMPACT WIDGET — cho Tịnh phòng / nhỏ gọn
// ─────────────────────────────────────────────────────────
function NiemPhatWidget({ onOpen }) {
  const cdCtx = (typeof useCongDuc === 'function') ? useCongDuc() : null;
  const [data, setData] = useStateN(() => loadNiem() || { count:0, rounds:0, totalNiem:0, phat:'adida' });

  // Re-read on focus
  useEffectN(() => {
    const handler = () => setData(loadNiem() || { count:0, rounds:0, totalNiem:0, phat:'adida' });
    window.addEventListener('focus', handler);
    const id = setInterval(handler, 1500);
    return () => { window.removeEventListener('focus', handler); clearInterval(id); };
  }, []);

  const phatMeta = PHAT_HIEU.find(p => p.key === (data.phat || 'adida'));

  const quickNiem = () => {
    const next = (data.count || 0) + 1;
    if (next >= 108) {
      const newState = { ...data, count: 0, rounds: (data.rounds||0) + 1, totalNiem: (data.totalNiem||0) + 108 };
      saveNiem(newState); setData(newState);
      if (cdCtx?.earn) cdCtx.earn(NIEM_REWARD_PER_ROUND, '__niem_phat__');
    } else {
      const newState = { ...data, count: next };
      saveNiem(newState); setData(newState);
    }
  };

  return (
    <div className="bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/30 p-5 relative overflow-hidden">
      <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-gold"></span>
      <span className="absolute -top-px -right-px w-3 h-3 border-t border-r border-gold"></span>
      <span className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-gold"></span>
      <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-gold"></span>
      <div className="absolute -right-4 -bottom-6 font-brush text-[90px] text-gold/[0.05] select-none pointer-events-none">Phật</div>

      <div className="relative flex items-center gap-4">
        {/* Mini mala */}
        <div className="relative w-[90px] h-[90px] flex-shrink-0">
          <MalaRing count={data.count || 0} color={phatMeta.color} size={90}/>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[20px] text-cream-bright leading-none">{data.count || 0}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.22em] uppercase text-gold font-medium">Niệm Phật</div>
          <div className="font-serif text-base text-cream font-medium leading-tight mb-0.5">{phatMeta.han}</div>
          <div className="text-[11px] text-cream-dim mb-2">
            {(data.rounds || 0)} chu · {((data.totalNiem||0) + (data.count||0)).toLocaleString('vi-VN')} niệm
          </div>
          <div className="flex gap-1.5">
            <button onClick={quickNiem}
              className="px-3 py-1.5 bg-gradient-to-br from-gold-bright to-gold text-ink text-[11px] tracking-widest uppercase font-semibold">
              + 1 niệm
            </button>
            <button onClick={onOpen}
              className="px-3 py-1.5 border border-gold/30 text-cream-dim hover:text-gold-bright hover:border-gold/60 text-[11px] tracking-widest uppercase">
              Mở chuỗi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NiemPhatPage, NiemPhatWidget });
