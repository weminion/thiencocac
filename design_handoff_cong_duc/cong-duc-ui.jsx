// Công Đức UI — Hoa sen, section, widget, ritual modal

const { useState: useStateUI, useEffect: useEffectUI, useRef: useRefUI } = React;

// ─────────────────────────────────────────────────────────
// HOA SEN — SVG, 8 cánh nở dần theo streak (0-7 ngày)
// ─────────────────────────────────────────────────────────

function LotusStreak({ streak = 0, size = 200 }) {
  const cx = size / 2;
  const cy = size / 2;
  const petalCount = 8;

  // 8 cánh hoa xếp đối xứng
  const petals = Array.from({ length: petalCount }, (_, i) => {
    const angle = (i * 360) / petalCount - 90; // bắt đầu từ trên
    const bloomed = i < streak;              // cánh đã nở
    const active  = i === streak;            // cánh đang nở (glow)
    return { angle, bloomed, active, i };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="block">
      <defs>
        <radialGradient id="lotus-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#f4cf73" />
          <stop offset="60%" stopColor="#d4a24b" />
          <stop offset="100%" stopColor="#8a6a2a" />
        </radialGradient>
        <linearGradient id="petal-bloomed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor="#f4cf73" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#d4a24b" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8a6a2a" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="petal-dormant" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor="#2a2018" stopOpacity="1" />
          <stop offset="100%" stopColor="#14100a" stopOpacity="1" />
        </linearGradient>
        <filter id="petal-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* halo ngoài */}
      <circle cx={cx} cy={cy} r={size*0.48} fill="none" stroke="#d4a24b" strokeOpacity="0.08" strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={size*0.42} fill="none" stroke="#d4a24b" strokeOpacity="0.15" strokeWidth="0.5" strokeDasharray="2 4"/>

      {/* 8 cánh hoa */}
      {petals.map(p => (
        <g key={p.i} transform={`rotate(${p.angle} ${cx} ${cy})`}>
          {/* cánh = ellipse dài hướng ra ngoài */}
          <ellipse
            cx={cx}
            cy={cy - size*0.22}
            rx={size*0.075}
            ry={size*0.16}
            fill={p.bloomed ? 'url(#petal-bloomed)' : 'url(#petal-dormant)'}
            stroke={p.bloomed ? '#d4a24b' : '#3a2e1e'}
            strokeOpacity={p.bloomed ? 0.6 : 0.4}
            strokeWidth="0.8"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: p.bloomed ? 1 : 0.35,
              filter: p.active ? 'url(#petal-glow)' : 'none'
            }}
          />
          {/* gân cánh */}
          {p.bloomed && (
            <line x1={cx} y1={cy - size*0.08} x2={cx} y2={cy - size*0.36}
              stroke="#f4cf73" strokeOpacity="0.4" strokeWidth="0.6"/>
          )}
        </g>
      ))}

      {/* lớp cánh trong (nhỏ hơn, lệch 22.5°) — chỉ hiện khi streak ≥ 4 */}
      {streak >= 4 && Array.from({ length: petalCount }, (_, i) => {
        const angle = (i * 360) / petalCount - 90 + 22.5;
        const visible = i < (streak - 3);
        return (
          <g key={`in-${i}`} transform={`rotate(${angle} ${cx} ${cy})`}>
            <ellipse
              cx={cx} cy={cy - size*0.12}
              rx={size*0.05} ry={size*0.1}
              fill="url(#petal-bloomed)"
              stroke="#f4cf73" strokeOpacity="0.5" strokeWidth="0.6"
              style={{
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                opacity: visible ? 0.9 : 0,
                transformOrigin: `${cx}px ${cy}px`
              }}
            />
          </g>
        );
      })}

      {/* tâm sen */}
      <circle cx={cx} cy={cy} r={size*0.07}
        fill="url(#lotus-core)"
        stroke="#f4cf73" strokeOpacity="0.6"/>
      {/* các hạt đài sen */}
      {[0,1,2,3,4].map(i => {
        const a = (i * 72 - 90) * Math.PI/180;
        const r = size*0.035;
        return <circle key={i} cx={cx + Math.cos(a)*r} cy={cy + Math.sin(a)*r}
          r={size*0.012} fill="#8a6a2a" opacity="0.9"/>;
      })}

      {/* số streak ở giữa */}
      <text x={cx} y={cy + size*0.015} textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif" fontSize={size*0.06}
        fill="#14100a" fontWeight="600">{streak}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// INCENSE RITUAL — modal đốt nhang
// ─────────────────────────────────────────────────────────

function IncenseRitual({ open, onClose, onComplete }) {
  const [phase, setPhase] = useStateUI('idle'); // idle | burning | done
  const [progress, setProgress] = useStateUI(0);
  const rafRef = useRefUI(null);

  useEffectUI(() => {
    if (!open) { setPhase('idle'); setProgress(0); }
  }, [open]);

  const startBurn = () => {
    if (phase !== 'idle') return;
    window.playBell && window.playBell();
    setPhase('burning');
    const start = performance.now();
    const DURATION = 8000; // 8s đốt
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        setPhase('done');
        window.playBell && window.playBell();
        setTimeout(() => {
          onComplete && onComplete();
        }, 1800);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffectUI(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/85 backdrop-blur-md animate-fade-up"
         onClick={phase !== 'burning' ? onClose : undefined}>
      <div className="relative bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/40 max-w-md w-full p-8 md:p-10"
           onClick={e => e.stopPropagation()}>
        <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold"></span>
        <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold"></span>
        <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold"></span>
        <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold"></span>

        <div className="text-center mb-6">
          <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Nghi thức buổi sáng</div>
          <h3 className="font-serif text-2xl md:text-3xl text-cream font-medium">
            <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">Tịnh tâm</span>, đốt nén hương
          </h3>
          <div className="font-brush text-gold/70 text-lg mt-1">香 · 敬</div>
        </div>

        {/* ─── SCENE ─── */}
        <div className="relative h-[260px] flex items-end justify-center mb-6 overflow-hidden">
          {/* khói */}
          {phase === 'burning' && (
            <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
              {[0, 0.3, 0.6, 0.9, 1.2].map(delay => (
                <span key={delay} className="smoke-puff"
                      style={{ animationDelay: `${delay}s` }}></span>
              ))}
            </div>
          )}

          {/* nhang */}
          <div className="relative z-10 flex flex-col items-center">
            {/* đầu nhang cháy */}
            {phase !== 'idle' && (
              <div className="relative w-3 h-3 mb-[-2px]">
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-pulse"
                     style={{ boxShadow: '0 0 14px 4px rgba(255,160,50,0.75), 0 0 6px 2px rgba(255,90,20,0.9)' }}></div>
              </div>
            )}
            {/* thân nhang */}
            <div className="relative" style={{ height: '200px' }}>
              <div className="w-[2px] bg-gradient-to-b from-orange-900/80 via-amber-900 to-amber-800"
                   style={{
                     height: phase === 'idle' ? '200px' : `${200 * (1 - progress * 0.7)}px`,
                     transition: phase === 'idle' ? 'height 0.3s' : 'none'
                   }}></div>
              {/* tàn nhang đã cháy = phần nhạt dần trên */}
            </div>
            {/* đế nhang */}
            <div className="w-16 h-3 bg-gradient-to-b from-ink-3 to-ink rounded-t-sm border-t border-gold/30"></div>
            <div className="w-24 h-2 bg-ink border border-gold/20 rounded-sm"></div>
          </div>
        </div>

        {/* ─── STATUS + BUTTON ─── */}
        <div className="text-center min-h-[80px]">
          {phase === 'idle' && (
            <>
              <p className="text-sm text-cream-dim italic mb-4 leading-relaxed max-w-sm mx-auto">
                "Một nén hương thành tâm — một phần tâm an tĩnh.<br/>
                Hít sâu, buông nhẹ, và khởi ngày mới."
              </p>
              <button onClick={startBurn}
                className="px-8 py-3 bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold tracking-[0.2em] uppercase text-sm">
                Thắp hương
              </button>
            </>
          )}
          {phase === 'burning' && (
            <>
              <p className="font-serif italic text-gold-bright text-lg mb-2">Hương đang cháy…</p>
              <p className="text-xs text-cream-dim tracking-widest uppercase">
                {progress < 0.33 ? 'Định tâm' : progress < 0.66 ? 'Tịnh niệm' : 'Hồi hướng'}
              </p>
              <div className="mt-4 h-px bg-gold/10 max-w-xs mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-bright to-gold transition-all ease-linear"
                     style={{ width: `${progress * 100}%` }}></div>
              </div>
            </>
          )}
          {phase === 'done' && (
            <div className="animate-fade-up">
              <div className="font-brush text-gold text-4xl mb-2">圓滿</div>
              <p className="font-serif text-xl text-cream mb-1">Viên mãn</p>
              <p className="text-sm text-gold-bright">+15 Công Đức</p>
            </div>
          )}
        </div>

        {phase !== 'burning' && (
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-cream-dim hover:text-gold-bright">✕</button>
        )}
      </div>

      <style>{`
        .smoke-puff {
          position: absolute;
          left: 50%;
          bottom: 50px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,236,217,0.22), rgba(245,236,217,0.04) 60%, transparent);
          filter: blur(8px);
          transform: translateX(-50%);
          animation: smokeRise 3.5s ease-in infinite;
          opacity: 0;
        }
        @keyframes smokeRise {
          0%   { transform: translate(-50%, 0) scale(0.4); opacity: 0; }
          15%  { opacity: 0.8; }
          100% { transform: translate(calc(-50% + 30px), -220px) scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SIDEBAR WIDGET
// ─────────────────────────────────────────────────────────

function CongDucSidebarWidget({ onOpen }) {
  const { state } = useCongDuc();
  return (
    <button onClick={onOpen}
      className="w-full bg-gradient-to-br from-ink-3 to-ink border border-gold/30 hover:border-gold/60 p-3 transition-all text-left relative group">
      <span className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-gold"></span>
      <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-gold"></span>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 flex-shrink-0">
          <LotusStreak streak={Math.min(state.streak, 7)} size={40}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] tracking-[0.22em] uppercase text-gold font-medium">Công Đức</div>
          <div className="font-serif text-gold-bright text-lg leading-tight">
            {state.balance.toLocaleString('vi-VN')}
          </div>
          <div className="text-[10px] text-cream-dim">Chuỗi {state.streak} ngày</div>
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// RITUAL CARDS — 4 hành động hàng ngày
// ─────────────────────────────────────────────────────────

function RitualCard({ glyph, title, subtitle, reward, done, disabled, disabledReason, onClick, accentClass }) {
  return (
    <button
      onClick={done || disabled ? undefined : onClick}
      disabled={done || disabled}
      className={`relative text-left bg-gradient-to-br from-ink-2 to-ink-3 border p-5 transition-all group ${
        done ? 'border-emerald-500/30 opacity-70 cursor-default'
        : disabled ? 'border-gold/10 opacity-50 cursor-not-allowed'
        : 'border-gold/25 hover:border-gold/60 cursor-pointer'
      }`}>
      {!done && !disabled && (<>
        <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-gold opacity-50 group-hover:opacity-100 transition-opacity"></span>
        <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-gold opacity-50 group-hover:opacity-100 transition-opacity"></span>
      </>)}

      <div className="flex items-start gap-4">
        <div className={`font-brush text-4xl w-14 h-14 flex items-center justify-center border flex-shrink-0 ${
          done ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5'
          : `text-gold border-gold/30 bg-ink ${!disabled ? 'group-hover:text-gold-bright group-hover:border-gold' : ''}`
        } transition-colors`}>
          {done ? '✓' : glyph}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-serif text-lg text-cream font-medium">{title}</h4>
            {done && <span className="text-[9px] tracking-[0.18em] uppercase text-emerald-400">Hoàn tất</span>}
          </div>
          <p className="text-[13px] text-cream-dim leading-snug">
            {done ? 'Đã viên mãn hôm nay — hẹn ngày mai.'
             : disabled ? disabledReason
             : subtitle}
          </p>
          {!done && !disabled && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="font-brush text-gold text-sm">功</span>
              <span className="text-[12px] text-gold-bright font-medium">+{reward} Công Đức</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// MEDITATION TIMER
// ─────────────────────────────────────────────────────────

function MeditationTimer({ open, onClose, onComplete }) {
  const [running, setRunning] = useStateUI(false);
  const [seconds, setSeconds] = useStateUI(300); // 5 phút
  const [elapsed, setElapsed] = useStateUI(0);

  useEffectUI(() => {
    if (!open) { setRunning(false); setElapsed(0); setSeconds(300); }
  }, [open]);

  useEffectUI(() => {
    if (!running) return;
    const id = setInterval(() => {
      setElapsed(e => {
        if (e + 1 >= seconds) {
          clearInterval(id);
          window.playBell && window.playBell();
          setTimeout(() => { onComplete && onComplete(); }, 1500);
          return seconds;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, seconds]);

  if (!open) return null;
  const remaining = seconds - elapsed;
  const mm = String(Math.floor(remaining/60)).padStart(2,'0');
  const ss = String(remaining%60).padStart(2,'0');
  const progress = elapsed / seconds;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md animate-fade-up"
         onClick={!running ? onClose : undefined}>
      <div className="relative max-w-md w-full text-center p-10" onClick={e => e.stopPropagation()}>
        <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">Thiền niệm</div>
        <h3 className="font-serif text-3xl text-cream mb-1">
          <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">Tĩnh lặng</span>
        </h3>
        <div className="font-brush text-gold/60 text-xl mb-8">禪 · 定</div>

        {/* vòng tròn thiền */}
        <div className="relative w-56 h-56 mx-auto mb-8">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#d4a24b" strokeOpacity="0.12" strokeWidth="1"/>
            <circle cx="100" cy="100" r="90" fill="none" stroke="url(#medGrad)" strokeWidth="2"
              strokeDasharray={`${2*Math.PI*90}`}
              strokeDashoffset={`${2*Math.PI*90 * (1-progress)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}/>
            <defs>
              <linearGradient id="medGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4cf73"/>
                <stop offset="100%" stopColor="#8a6a2a"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-serif text-6xl text-cream tabular-nums">{mm}:{ss}</div>
            <div className="text-xs text-cream-dim tracking-widest uppercase mt-2">
              {running ? 'Thở sâu, buông lo' : 'Chọn thời lượng'}
            </div>
          </div>
          {/* breathing ring */}
          {running && (
            <div className="absolute inset-0 rounded-full border border-gold/30 breathe-ring pointer-events-none"></div>
          )}
        </div>

        {!running && (
          <>
            <div className="flex justify-center gap-2 mb-6">
              {[300, 600, 900].map(s => (
                <button key={s} onClick={() => setSeconds(s)}
                  className={`px-4 py-1.5 text-xs tracking-widest uppercase border ${
                    seconds===s ? 'border-gold text-gold-bright bg-gold/10' : 'border-gold/25 text-cream-dim hover:border-gold/50'
                  }`}>{s/60} phút</button>
              ))}
            </div>
            <button onClick={() => setRunning(true)}
              className="px-8 py-3 bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold tracking-[0.2em] uppercase text-sm">
              Bắt đầu
            </button>
          </>
        )}

        {!running && (
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-cream-dim hover:text-gold-bright">✕</button>
        )}
      </div>
      <style>{`
        .breathe-ring { animation: breathe 6s ease-in-out infinite; }
        @keyframes breathe {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50%     { transform: scale(1.06); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { LotusStreak, IncenseRitual, MeditationTimer, CongDucSidebarWidget, RitualCard });
