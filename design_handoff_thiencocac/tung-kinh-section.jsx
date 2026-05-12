// Tụng Kinh — Audio sutra player
const { useState: useTKS, useEffect: useTKE, useRef: useTKR } = React;

function TKSeal({ size = 'sm' }) {
  const w = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
  const c = `pointer-events-none absolute ${w} border-gold`;
  return (
    <>
      <span className={`${c} -top-px -left-px border-t border-l`}></span>
      <span className={`${c} -top-px -right-px border-t border-r`}></span>
      <span className={`${c} -bottom-px -left-px border-b border-l`}></span>
      <span className={`${c} -bottom-px -right-px border-b border-r`}></span>
    </>
  );
}

const TK_SUTRAS = [
  {
    id: 'tam', glyph: 'Tâm', title: 'Bát Nhã Tâm Kinh',
    subtitle: 'Tinh hoa của 600 quyển Bát Nhã — 260 chữ',
    duration: '8 phút', dur: 480, monk: 'Thầy Thích Nhật Từ', plays: '1.2M',
    excerpt: 'Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách...',
    color: '#e6b85a', category: 'Phổ biến', merit: 30
  },
  {
    id: 'phap', glyph: 'Pháp', title: 'Kinh Pháp Cú',
    subtitle: '423 bài kệ dạy đạo lý sống',
    duration: '45 phút', dur: 2700, monk: 'Thầy Thích Trí Quảng', plays: '680K',
    excerpt: 'Ý dẫn đầu các pháp, ý làm chủ, ý tạo tác. Nếu với ý ô nhiễm, nói lên hay hành động, khổ não bước theo sau...',
    color: '#7ca85a', category: 'Đạo lý', merit: 50
  },
  {
    id: 'aDi', glyph: 'A Di Đà', title: 'Kinh A Di Đà',
    subtitle: 'Cõi Cực Lạc — pháp môn Tịnh Độ',
    duration: '20 phút', dur: 1200, monk: 'HT Thích Trí Tịnh', plays: '2.1M',
    excerpt: 'Như thị ngã văn: nhất thời Phật tại Xá Vệ quốc, Kỳ Thọ Cấp Cô Độc viên, dữ đại tỳ kheo tăng...',
    color: '#c87a5a', category: 'Tịnh Độ', merit: 40
  },
  {
    id: 'phomon', glyph: 'Phổ', title: 'Phẩm Phổ Môn',
    subtitle: 'Quan Thế Âm cứu khổ — Kinh Pháp Hoa quyển 25',
    duration: '25 phút', dur: 1500, monk: 'Thầy Thích Pháp Hòa', plays: '1.5M',
    excerpt: 'Nhược hữu vô lượng bá thiên vạn ức chúng sinh thọ chư khổ não, văn thị Quán Thế Âm Bồ Tát...',
    color: '#5aa3c8', category: 'Quan Âm', merit: 45
  },
  {
    id: 'vulan', glyph: 'Vu Lan', title: 'Kinh Vu Lan Báo Hiếu',
    subtitle: 'Mục Kiền Liên cứu mẹ — kinh báo ân cha mẹ',
    duration: '30 phút', dur: 1800, monk: 'HT Thích Thanh Từ', plays: '890K',
    excerpt: 'Một thuở nọ, Mục Liên Tôn giả dùng đạo nhãn quan sát thế gian, thấy mẹ mình sinh vào loài ngạ quỷ...',
    color: '#c89a5a', category: 'Báo hiếu', merit: 60
  },
  {
    id: 'dia', glyph: 'Địa Tạng', title: 'Kinh Địa Tạng',
    subtitle: 'Bồ tát Địa Tạng cứu độ chúng sinh trong địa ngục',
    duration: '90 phút', dur: 5400, monk: 'HT Thích Trí Tịnh', plays: '720K',
    excerpt: 'Như thị ngã văn: nhất thời Phật tại Đao Lợi thiên vì mẹ thuyết pháp...',
    color: '#a06848', category: 'Hồi hướng', merit: 80
  }
];

function PlayPauseBtn({ playing, onClick, color = '#e6b85a' }) {
  return (
    <button onClick={onClick}
      className="relative w-16 h-16 rounded-full border flex items-center justify-center text-2xl text-ink font-semibold transition-all hover:scale-105"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, borderColor: color, boxShadow: `0 12px 30px -8px ${color}80` }}>
      {playing ? '⏸' : '▶'}
    </button>
  );
}

function TungKinhPage() {
  const [active, setActive] = useTKS(TK_SUTRAS[0]);
  const [playing, setPlaying] = useTKS(false);
  const [elapsed, setElapsed] = useTKS(0);
  const [speed, setSpeed] = useTKS(1);
  const [totalListened, setTotalListened] = useTKS(0);
  const [completed, setCompleted] = useTKS(false);
  const tickRef = useTKR();

  useTKE(() => {
    if (!playing) return;
    tickRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + speed;
        if (next >= active.dur) {
          setPlaying(false);
          setCompleted(true);
          const cd = window.useCongDuc ? window.useCongDuc() : null;
          if (cd && cd.earn) cd.earn(active.merit, `Tụng ${active.title}`);
          return active.dur;
        }
        return next;
      });
      setTotalListened(t => t + speed);
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [playing, active, speed]);

  const choose = (s) => { setActive(s); setElapsed(0); setPlaying(false); setCompleted(false); };
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');
  const dmm = String(Math.floor(active.dur / 60)).padStart(2, '0');
  const dss = String(Math.floor(active.dur % 60)).padStart(2, '0');
  const pct = (elapsed / active.dur) * 100;

  return (
    <div className="px-5 md:px-10 py-6 md:py-10 max-w-[1280px] mx-auto">
      <div className="mb-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-8 font-brush text-[180px] text-gold/[0.04] leading-none select-none pointer-events-none hidden md:block">Kinh</div>
        <div className="text-[11px] tracking-[0.32em] uppercase text-gold font-medium">Tụng kinh · Audio</div>
        <h1 className="font-serif text-[30px] md:text-[44px] font-semibold text-cream mt-2 leading-tight text-balance">
          Nghe <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">lời Phật dạy</span> mỗi ngày
        </h1>
        <p className="text-[14px] md:text-[15px] text-cream-dim mt-3 max-w-[680px] leading-relaxed">
          6 bộ kinh phổ biến — do các Hòa thượng tụng. Mở loa, bày bàn, ngồi nghe — hoặc nghe khi lái xe, đi bộ, nấu cơm.
          <span className="text-gold-bright"> Mỗi bộ tụng xong = +30 đến +80 công đức.</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-6">
        {/* LEFT: Now playing + sutra list */}
        <div className="space-y-5">
          {/* Now playing card */}
          <div className="relative bg-gradient-to-br from-ink-3/60 to-ink-2 border border-gold/30 overflow-hidden">
            <TKSeal size="lg"/>
            <div className="absolute -top-8 -right-6 font-brush leading-none select-none pointer-events-none"
              style={{ fontSize: '220px', color: active.color + '12' }}>{active.glyph}</div>

            <div className="relative p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium">Đang tụng</span>
                <span className="text-[10px] px-2 py-0.5 border border-gold/40 text-gold-bright tracking-wider">{active.category}</span>
              </div>

              <div className="flex items-start gap-5 mb-5">
                <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 bg-ink border-2 flex items-center justify-center"
                  style={{ borderColor: active.color + '80' }}>
                  <span className="font-brush text-[40px] md:text-[48px] leading-none" style={{ color: active.color }}>
                    {active.glyph}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[22px] md:text-[28px] text-cream font-semibold leading-tight">{active.title}</div>
                  <div className="text-[13px] text-cream-dim mt-1">{active.subtitle}</div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gold/90">
                    <span>{active.monk}</span>
                    <span className="text-gold/30">·</span>
                    <span>{active.duration}</span>
                    <span className="text-gold/30">·</span>
                    <span>{active.plays} lượt nghe</span>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-ink/40 border-l-2 border-gold/40 px-4 py-3 mb-5">
                <div className="text-[10px] tracking-widest uppercase text-gold/80 mb-1">Đoạn mở</div>
                <div className="text-[13px] text-cream/90 leading-relaxed italic">"{active.excerpt}"</div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="h-1.5 bg-gold/15 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 transition-all duration-300"
                    style={{ width: pct + '%', background: `linear-gradient(90deg, ${active.color}, ${active.color}cc)` }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-cream-dim mt-1.5 tabular-nums">
                  <span>{mm}:{ss}</span>
                  <span>−{String(Math.floor((active.dur - elapsed) / 60)).padStart(2, '0')}:{String(Math.floor((active.dur - elapsed) % 60)).padStart(2, '0')}</span>
                  <span>{dmm}:{dss}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-5">
                <button onClick={() => setElapsed(Math.max(0, elapsed - 15))}
                  className="text-cream-dim hover:text-cream text-[11px] tracking-widest flex flex-col items-center gap-0.5">
                  <span className="text-xl">⟲</span>
                  <span>−15s</span>
                </button>
                <PlayPauseBtn playing={playing} onClick={() => setPlaying(p => !p)} color={active.color}/>
                <button onClick={() => setElapsed(Math.min(active.dur, elapsed + 15))}
                  className="text-cream-dim hover:text-cream text-[11px] tracking-widest flex flex-col items-center gap-0.5">
                  <span className="text-xl">⟳</span>
                  <span>+15s</span>
                </button>
              </div>

              {/* Speed + actions */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gold/15">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest uppercase text-cream-dim">Tốc độ</span>
                  {[0.75, 1, 1.25, 1.5].map(s => (
                    <button key={s} onClick={() => setSpeed(s)}
                      className={`px-2 py-1 text-[11px] border tabular-nums transition-all ${
                        speed === s ? 'border-gold bg-gold/10 text-gold-bright' : 'border-gold/15 text-cream-dim hover:border-gold/40'
                      }`}>{s}×</button>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-cream-dim">
                  <button className="hover:text-gold-bright tracking-wider">↓ Tải về</button>
                  <button className="hover:text-gold-bright tracking-wider">⤓ Hồi hướng</button>
                </div>
              </div>

              {completed && (
                <div className="mt-5 relative bg-gold/10 border border-gold/40 p-3 flex items-center gap-3 animate-fade-up">
                  <TKSeal />
                  <span className="font-brush text-2xl text-gold-bright shrink-0">Phúc</span>
                  <div className="flex-1 text-[12px]">
                    <div className="text-cream font-medium">Tụng xong {active.title} — +{active.merit} công đức</div>
                    <div className="text-cream-dim text-[11px]">Hồi hướng cho ai? Vào sổ Hồi hướng để gửi.</div>
                  </div>
                  <button className="text-[11px] px-3 py-1.5 bg-gold text-ink font-medium">Hồi hướng →</button>
                </div>
              )}
            </div>
          </div>

          {/* Sutra list */}
          <div className="relative bg-ink-3/30 border border-gold/20 p-5">
            <TKSeal size="lg"/>
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-1">Thư viện kinh</div>
            <div className="font-serif text-[20px] text-cream font-semibold mb-4">6 bộ kinh phổ biến</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {TK_SUTRAS.map(s => (
                <button key={s.id} onClick={() => choose(s)}
                  className={`relative text-left p-3 border transition-all ${
                    active.id === s.id ? 'border-gold bg-gold/[0.06]' : 'border-gold/15 hover:border-gold/40'
                  }`}>
                  {active.id === s.id && <TKSeal />}
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-12 h-12 bg-ink border flex items-center justify-center"
                      style={{ borderColor: s.color + '60' }}>
                      <span className="font-brush text-[22px] leading-none" style={{ color: s.color }}>{s.glyph}</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-[14px] text-cream font-semibold leading-tight truncate">{s.title}</div>
                      <div className="text-[11px] text-cream-dim leading-snug mt-0.5 line-clamp-1">{s.subtitle}</div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gold/80">
                        <span>{s.duration}</span>
                        <span className="text-gold/30">·</span>
                        <span>+{s.merit} đức</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: stats + queue */}
        <div className="space-y-5 lg:sticky lg:top-6 self-start">
          <div className="relative bg-gradient-to-br from-ink-3/50 to-ink-2 border border-gold/25 p-5">
            <TKSeal size="lg"/>
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-1">Tổng kết tu tập</div>
            <div className="font-serif text-[18px] text-cream font-semibold mb-4">7 ngày qua</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { v: '4', l: 'Bộ tụng', sub: 'xong' },
                { v: Math.floor(totalListened / 60) || '38', l: 'Phút', sub: 'tổng' },
                { v: '195', l: 'Công đức', sub: 'cộng' }
              ].map((s, i) => (
                <div key={i} className="border border-gold/15 p-3">
                  <div className="font-serif text-[24px] text-cream font-semibold tabular-nums leading-none">{s.v}</div>
                  <div className="text-[10px] tracking-widest uppercase text-gold mt-1.5">{s.l}</div>
                  <div className="text-[9px] text-cream-dim">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-ink-3/30 border border-gold/20 p-5">
            <TKSeal />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium">Tiếp theo</span>
              <button className="text-[10px] text-gold-bright hover:text-cream tracking-wider">SOẠN HÀNG ĐỢI →</button>
            </div>
            <ul className="space-y-2.5">
              {TK_SUTRAS.slice(1, 4).map((s, i) => (
                <li key={s.id} className="flex items-center gap-3">
                  <span className="text-[10px] text-cream-dim/60 tabular-nums w-4">{i + 1}</span>
                  <span className="w-9 h-9 bg-ink border flex items-center justify-center shrink-0"
                    style={{ borderColor: s.color + '50' }}>
                    <span className="font-brush text-base leading-none" style={{ color: s.color }}>{s.glyph}</span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-cream font-medium truncate">{s.title}</div>
                    <div className="text-[10px] text-cream-dim">{s.duration}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative bg-gold/[0.05] border border-gold/30 p-4 flex items-center gap-3">
            <TKSeal />
            <span className="font-brush text-3xl text-gold-bright shrink-0">Tâm</span>
            <div className="text-[12px] text-cream-dim leading-relaxed">
              <span className="text-cream">Mẹo:</span> Mở khi nấu cơm, đi bộ, lái xe. Tâm vô niệm nhưng tai vẫn nhập.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.TungKinhPage = TungKinhPage;
