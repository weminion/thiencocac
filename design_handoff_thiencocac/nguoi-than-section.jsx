// Hồi hướng cho người thân — Sổ ghi tên ông bà / cha mẹ
// Mỗi câu niệm Phật được ghi vào sổ riêng — cầu siêu, cầu an

const { useState: useNTS, useEffect: useNTE } = React;

const NT_DEFAULT_PEOPLE = [
  { id: 1, name: 'Bà Nội Hương', kanji: '', born: 1932, died: 2018, total: 1247, last: '2 giờ trước', candle: 0.78, relation: 'Bà nội — đã mất', wish: 'Cầu siêu sinh Tịnh Độ' },
  { id: 2, name: 'Ông Ngoại Lâm', kanji: '', born: 1928, died: 2012, total: 891, last: 'Hôm qua', candle: 0.55, relation: 'Ông ngoại — đã mất', wish: 'Cầu siêu sinh Tịnh Độ' },
  { id: 3, name: 'Bố Tuấn', kanji: '', born: 1958, died: null, total: 320, last: '3 ngày trước', candle: 0.20, alive: true, relation: 'Bố — còn sống', wish: 'Cầu an, mạnh khỏe' }
];

const NT_RECENT = [
  { time: '10:24', msg: 'Hồi hướng 108 biến cho Bà Nội Hương — A Di Đà Phật', kind: 'niem' },
  { time: '08:50', msg: 'Đốt nhang sáng · Cầu an cho Bố Tuấn', kind: 'incense' },
  { time: 'Hôm qua', msg: 'Hồi hướng 54 biến cho Ông Ngoại Lâm', kind: 'niem' },
  { time: 'Hôm qua', msg: 'Tụng Kinh Địa Tạng 30 phút · Hồi hướng cả nhà', kind: 'sutra' },
  { time: '2 ngày', msg: 'Bố thí công đức 50 → Bà Nội Hương', kind: 'transfer' }
];

function NTCandleFlame({ intensity = 0.5, size = 'md' }) {
  const opacity = 0.4 + intensity * 0.6;
  const scale = 0.7 + intensity * 0.5;
  const dim = size === 'lg' ? { w: 28, h: 38, fw: 24, fh: 32 } : { w: 22, h: 32, fw: 20, fh: 28 };
  return (
    <div className="relative" style={{ width: dim.w, height: dim.h }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 transition-all"
           style={{ opacity, transform: `translateX(-50%) scale(${scale})` }}>
        <svg width={dim.fw} height={dim.fh} viewBox="0 0 20 28">
          <defs>
            <radialGradient id={`flame-grad-${size}-${Math.round(intensity*100)}`} cx="50%" cy="60%" r="60%">
              <stop offset="0%" stopColor="#fff8c8"/>
              <stop offset="40%" stopColor="#f4cf73"/>
              <stop offset="80%" stopColor="#d4a04a"/>
              <stop offset="100%" stopColor="#a07020" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <path d="M 10 2 C 4 10, 4 18, 10 24 C 16 18, 16 10, 10 2 Z" fill={`url(#flame-grad-${size}-${Math.round(intensity*100)})`}/>
          <path d="M 10 8 C 7 13, 7 18, 10 22 C 13 18, 13 13, 10 8 Z" fill="#fff8c8" opacity="0.6"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-3 bg-gradient-to-b from-cream to-cream-dim"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gold/40"></div>
    </div>
  );
}

function NTSeal() {
  return (
    <>
      <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-gold pointer-events-none"></span>
      <span className="absolute -top-px -right-px w-3 h-3 border-t border-r border-gold pointer-events-none"></span>
      <span className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-gold pointer-events-none"></span>
      <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-gold pointer-events-none"></span>
    </>
  );
}

function NTAncestorCard({ a, onDedicate }) {
  return (
    <div className="relative bg-gradient-to-br from-ink-3/60 to-ink-2 border border-gold/25 p-5 hover:border-gold/50 transition-colors group">
      <NTSeal/>

      <div className="flex items-start gap-4">
        {/* portrait + candle */}
        <div className="flex flex-col items-center gap-2.5 shrink-0">
          <div className="w-16 h-20 bg-ink border border-gold/30 flex items-center justify-center relative">
            <span className="font-brush text-[36px] text-gold/80 leading-none">{a.kanji}</span>
            {!a.alive && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 bg-ink-2 text-[8px] tracking-widest text-gold/70 border border-gold/30">Di</div>
            )}
            {a.alive && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 bg-ink-2 text-[8px] tracking-widest text-emerald-400/70 border border-emerald-500/30"></div>
            )}
          </div>
          <NTCandleFlame intensity={a.candle} size="lg"/>
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <div className="font-serif text-[19px] text-cream font-semibold leading-tight truncate">{a.name}</div>
            <div className="text-[10px] tracking-widest text-cream-dim shrink-0">
              {a.alive ? `${a.born} —` : `${a.born}–${a.died}`}
            </div>
          </div>
          <div className="text-[11px] text-cream-dim/90 mb-1">{a.relation}</div>
          <div className="text-[11px] text-gold/80 italic mb-3">{a.wish}</div>

          <div className="flex items-baseline gap-2 mb-1.5">
            <div className="font-serif text-[26px] text-gold-bright font-semibold leading-none">
              {a.total.toLocaleString()}
            </div>
            <div className="text-[11px] text-cream-dim">biến đã hồi hướng</div>
          </div>

          <div className="relative h-1 bg-ink/60 overflow-hidden mb-2">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-all"
                 style={{ width: `${a.candle * 100}%` }}></div>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-cream-dim">Cập nhật {a.last}</span>
            <button onClick={() => onDedicate && onDedicate(a)} className="text-gold-bright tracking-wider hover:text-cream transition-colors font-medium">
              + Hồi hướng →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NTDedicateModal({ open, person, onClose, onSubmit }) {
  const [count, setCount] = useNTS(108);
  const [pham, setPham] = useNTS('A Di Đà Phật');
  if (!open || !person) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fade-up overflow-y-auto" onClick={onClose}>
      <div className="relative bg-ink-2 border border-gold/30 max-w-[480px] w-full p-6 md:p-7" onClick={e => e.stopPropagation()}>
        <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold pointer-events-none"></span>
        <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold pointer-events-none"></span>
        <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold pointer-events-none"></span>
        <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold pointer-events-none"></span>

        <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-cream-dim hover:text-gold-bright text-xl">✕</button>

        <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium">Hồi · Hồi Hướng</div>
        <div className="font-serif text-[22px] text-cream font-semibold mt-1 leading-tight">
          Hồi hướng cho <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">{person.name}</span>
        </div>
        <div className="text-[12px] text-cream-dim mt-1">{person.relation}</div>

        <div className="my-5 border-t border-gold/15"></div>

        <div className="text-[10px] tracking-widest uppercase text-gold mb-2">Số biến niệm</div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[7, 21, 54, 108].map(n => (
            <button key={n} onClick={() => setCount(n)}
              className={`py-2.5 text-[14px] font-serif transition-all border ${
                count === n
                  ? 'border-gold bg-gold/10 text-gold-bright'
                  : 'border-gold/20 text-cream-dim hover:border-gold/50'
              }`}>{n}</button>
          ))}
        </div>

        <div className="text-[10px] tracking-widest uppercase text-gold mb-2">Phẩm niệm</div>
        <div className="space-y-1.5 mb-5">
          {['A Di Đà Phật', 'Nam Mô Quan Thế Âm Bồ Tát', 'Nam Mô Địa Tạng Vương Bồ Tát'].map(p => (
            <button key={p} onClick={() => setPham(p)}
              className={`w-full py-2.5 px-3 text-left text-[13px] transition-all border ${
                pham === p
                  ? 'border-gold bg-gold/[0.08] text-cream'
                  : 'border-gold/15 text-cream-dim hover:border-gold/40'
              }`}>
              <span className="font-brush text-gold mr-2">Phật</span>{p}
            </button>
          ))}
        </div>

        <div className="bg-ink-3/50 border border-gold/15 p-3 mb-5 text-[11px] text-cream-dim italic leading-relaxed">
          "Nguyện đem công đức niệm Phật {count} biến này, hồi hướng cho hương linh <span className="text-cream">{person.name}</span> {person.alive ? '— được bình an, sức khỏe, sống lâu trăm tuổi.' : '— được vãng sinh Tịnh Độ, lìa khổ được vui.'}"
        </div>

        <button onClick={() => onSubmit({ count, pham })}
          className="w-full py-3.5 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink font-semibold text-[14px] tracking-wide rounded-sm shadow-[0_8px_24px_-8px_rgba(212,160,74,0.5)] hover:-translate-y-px transition-all flex items-center justify-center gap-2.5">
          <span className="font-brush text-xl">Phật</span>
          <span>Bắt đầu niệm {count} biến</span>
        </button>
      </div>
    </div>
  );
}

function NTAddPersonModal({ open, onClose, onAdd }) {
  const [name, setName] = useNTS('');
  const [kanji, setKanji] = useNTS('');
  const [born, setBorn] = useNTS('');
  const [died, setDied] = useNTS('');
  const [alive, setAlive] = useNTS(false);
  const [relation, setRelation] = useNTS('Bố — đã mất');

  if (!open) return null;
  const canSubmit = name && born && (alive || died);

  return (
    <div className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fade-up overflow-y-auto" onClick={onClose}>
      <div className="relative bg-ink-2 border border-gold/30 max-w-[480px] w-full p-6 md:p-7" onClick={e => e.stopPropagation()}>
        <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold pointer-events-none"></span>
        <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold pointer-events-none"></span>
        <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold pointer-events-none"></span>
        <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold pointer-events-none"></span>

        <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-cream-dim hover:text-gold-bright text-xl">✕</button>

        <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium">Thêm người thân</div>
        <div className="font-serif text-[22px] text-cream font-semibold mt-1 leading-tight">
          Ghi tên vào <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">sổ hồi hướng</span>
        </div>

        <div className="my-5 border-t border-gold/15"></div>

        <label className="block text-[10px] tracking-widest uppercase text-gold mb-1.5">Tên đầy đủ</label>
        <input type="text" placeholder="VD: Bà Nội Hương" value={name} onChange={e => setName(e.target.value)}
          className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-2 text-cream text-[14px] outline-none placeholder:text-cream-dim/50 mb-4"/>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-gold mb-1.5">Năm sinh</label>
            <input type="number" placeholder="1932" value={born} onChange={e => setBorn(e.target.value)}
              className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-2 text-cream text-[14px] outline-none placeholder:text-cream-dim/50"/>
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-gold mb-1.5">Năm mất</label>
            <input type="number" placeholder="2018" value={died} onChange={e => setDied(e.target.value)} disabled={alive}
              className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-2 text-cream text-[14px] outline-none placeholder:text-cream-dim/50 disabled:opacity-30"/>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <button onClick={() => { setAlive(false); setRelation(relation.replace('còn sống', 'đã mất')); }}
            className={`flex-1 py-2.5 text-[12px] tracking-wider transition-all border ${
              !alive ? 'border-gold bg-gold/10 text-gold-bright' : 'border-gold/20 text-cream-dim'
            }`}>
            <span className="font-brush mr-1.5">Di</span> Đã mất · Cầu siêu
          </button>
          <button onClick={() => { setAlive(true); setRelation(relation.replace('đã mất', 'còn sống')); }}
            className={`flex-1 py-2.5 text-[12px] tracking-wider transition-all border ${
              alive ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300' : 'border-gold/20 text-cream-dim'
            }`}>
            <span className="font-brush mr-1.5"></span> Còn sống · Cầu an
          </button>
        </div>

        <label className="block text-[10px] tracking-widest uppercase text-gold mb-1.5">Quan hệ với bạn</label>
        <input type="text" value={relation} onChange={e => setRelation(e.target.value)}
          className="w-full bg-transparent border-b border-gold/30 focus:border-gold py-2 text-cream text-[14px] outline-none placeholder:text-cream-dim/50 mb-5"/>

        <button onClick={() => canSubmit && onAdd({ name, kanji, born: parseInt(born), died: alive ? null : parseInt(died), alive, relation, wish: alive ? 'Cầu an, mạnh khỏe' : 'Cầu siêu sinh Tịnh Độ', total: 0, last: 'vừa thêm', candle: 0 })}
          disabled={!canSubmit}
          className={`w-full py-3.5 font-semibold text-[14px] tracking-wide rounded-sm transition-all flex items-center justify-center gap-2.5 ${
            canSubmit
              ? 'bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink shadow-[0_8px_24px_-8px_rgba(212,160,74,0.5)] hover:-translate-y-px'
              : 'bg-ink/40 text-cream-dim/50 border border-gold/15 cursor-not-allowed'
          }`}>
          <span className="font-brush text-lg">＋</span>
          <span>Ghi vào sổ</span>
        </button>
      </div>
    </div>
  );
}

function NguoiThanPage() {
  const [people, setPeople] = useNTS(NT_DEFAULT_PEOPLE);
  const [dedicateOpen, setDedicateOpen] = useNTS(false);
  const [target, setTarget] = useNTS(null);
  const [addOpen, setAddOpen] = useNTS(false);

  const cd = window.useCongDuc ? window.useCongDuc() : null;

  const total = people.reduce((s, a) => s + a.total, 0);

  const handleDedicate = (a) => {
    setTarget(a);
    setDedicateOpen(true);
  };

  const handleSubmit = ({ count, pham }) => {
    setPeople(ps => ps.map(p => p.id === target.id
      ? { ...p, total: p.total + count, last: 'vừa xong', candle: Math.min(1, p.candle + 0.05) }
      : p));
    if (cd && cd.earn) cd.earn(Math.floor(count / 10), `Hồi hướng ${count} biến cho ${target.name}`);
    setDedicateOpen(false);
    setTarget(null);
  };

  const handleAdd = (newPerson) => {
    setPeople(ps => [...ps, { ...newPerson, id: Date.now() }]);
    setAddOpen(false);
  };

  const kindIcon = { niem: 'Phật', incense: 'Hương', sutra: 'Kinh', transfer: 'Hồi' };

  return (
    <div className="p-5 md:p-10 md:pt-8 max-w-[1280px]">
      {/* Header */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute -top-12 -right-6 font-brush leading-none select-none pointer-events-none"
             style={{ fontSize: '180px', color: 'rgba(212,160,74,0.05)' }}>Hồi</div>
        <div className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold font-medium">HồiCông Đức · Hồi Hướng Công Đức</div>
        <h1 className="font-serif text-[28px] md:text-[40px] text-cream font-semibold mt-2 leading-tight">
          Sổ <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">người thân</span>
        </h1>
        <p className="text-[13px] md:text-[15px] text-cream-dim mt-2 max-w-[680px] leading-relaxed">
          Mỗi câu niệm Phật của bạn được ghi vào sổ riêng cho từng người — cầu siêu cho người đã khuất, cầu an cho người còn sống.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { kanji: 'Tổng', label: 'Tổng đã hồi hướng', val: total.toLocaleString(), unit: 'biến' },
          { kanji: 'Tên', label: 'Người trong sổ', val: people.length, unit: 'vị' },
          { kanji: 'Nhật', label: 'Ngày liên tục', val: 4, unit: 'ngày' },
          { kanji: '', label: 'Đèn đang cháy', val: people.filter(p => p.candle > 0.1).length, unit: 'ngọn' }
        ].map(s => (
          <div key={s.label} className="relative bg-ink-2 border border-gold/20 p-4 flex items-center gap-3">
            <NTSeal/>
            <span className="font-brush text-[28px] text-gold/70 leading-none">{s.kanji}</span>
            <div>
              <div className="text-[10px] tracking-widest uppercase text-cream-dim">{s.label}</div>
              <div className="font-serif text-[20px] text-cream font-semibold leading-tight">
                {s.val} <span className="text-[12px] text-cream-dim font-normal">{s.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main: list + recent */}
      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5 md:gap-6">
        {/* People list */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium mb-1">Người thân của bạn</div>
              <div className="font-serif text-[20px] text-cream font-medium">{people.length} vị trong sổ</div>
            </div>
            <button onClick={() => setAddOpen(true)} className="text-[11px] text-gold-bright tracking-wider hover:text-cream uppercase">+ Thêm người</button>
          </div>

          <div className="space-y-3">
            {people.map(a => <NTAncestorCard key={a.id} a={a} onDedicate={handleDedicate}/>)}

            <button onClick={() => setAddOpen(true)} className="w-full border border-dashed border-gold/30 hover:border-gold hover:bg-gold/[0.04] py-5 flex items-center justify-center gap-2 text-cream-dim hover:text-gold-bright transition-all">
              <span className="font-brush text-2xl leading-none">＋</span>
              <span className="text-[13px] tracking-wider">Thêm người thân vào sổ</span>
            </button>
          </div>
        </div>

        {/* Recent activity + ritual */}
        <div className="flex flex-col gap-5">
          {/* Recent */}
          <div className="bg-ink-2 border border-gold/20 p-5">
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold mb-4 font-medium">Hoạt động gần đây</div>
            <div className="space-y-3">
              {NT_RECENT.map((r, i) => (
                <div key={i} className="flex gap-3 text-[12px]">
                  <span className="font-brush text-base text-gold/60 shrink-0 leading-none mt-px">{kindIcon[r.kind] || 'Hương'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-cream/95 leading-snug">{r.msg}</div>
                    <div className="text-[10px] text-cream-dim mt-0.5 tracking-wider">{r.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ritual */}
          <div className="relative bg-gradient-to-br from-lotus/15 to-ink-3 border border-lotus/40 p-5">
            <span className="absolute -top-px -left-px w-4 h-4 border-t border-l border-lotus"></span>
            <span className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-lotus"></span>
            <div className="font-brush text-lotus text-3xl mb-2 leading-none"></div>
            <div className="font-serif text-[18px] text-cream font-semibold mb-1 leading-tight">Lễ Vu Lan đang đến gần</div>
            <div className="text-[12px] text-cream-dim leading-snug mb-4">
              Rằm tháng 7 còn 92 ngày — hồi hướng trong tháng này được nhân đôi công đức.
            </div>
            <button className="w-full py-2.5 bg-gradient-to-br from-gold-bright to-gold text-ink text-[12px] font-semibold tracking-wider">
              Đặt lịch nhắc nhở
            </button>
          </div>

          {/* Sutra suggestion */}
          <div className="bg-ink-2 border border-gold/20 p-5">
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold mb-2 font-medium">Kinh khuyên đọc</div>
            <div className="font-serif text-[15px] text-cream font-medium leading-tight">Kinh Địa Tạng Bồ Tát</div>
            <div className="text-[11px] text-cream-dim mt-1 leading-relaxed">
              Đặc biệt linh ứng cho hồi hướng người đã khuất. 13 phẩm, đọc 30 phút mỗi ngày.
            </div>
            <button className="text-[11px] text-gold-bright tracking-wider hover:text-cream mt-3 uppercase">Mở kinh →</button>
          </div>
        </div>
      </div>

      <NTDedicateModal open={dedicateOpen} person={target} onClose={() => setDedicateOpen(false)} onSubmit={handleSubmit}/>
      <NTAddPersonModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd}/>

      {/* Sticky-ish CTA on mobile */}
      <div className="mt-8 relative bg-gradient-to-r from-ink-3 via-ink-2 to-ink-3 border border-gold/25 p-5 md:p-6 flex flex-col md:flex-row items-center gap-4">
        <NTSeal/>
        <span className="font-brush text-5xl text-gold-bright shrink-0 leading-none">Phật</span>
        <div className="flex-1 text-center md:text-left">
          <div className="font-serif text-[18px] md:text-[20px] text-cream font-semibold leading-tight">
            "Nguyện đem công đức này, hướng về khắp tất cả..."
          </div>
          <div className="text-[12px] text-cream-dim mt-1 leading-relaxed">
            Niệm Phật chung cho tất cả {people.length} người trong sổ — chia đều công đức.
          </div>
        </div>
        <button className="shrink-0 px-6 py-3 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink font-semibold text-[13px] tracking-wide rounded-sm hover:-translate-y-px transition-all">
          Niệm chung 108 biến →
        </button>
      </div>
    </div>
  );
}

window.NguoiThanPage = NguoiThanPage;
