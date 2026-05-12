// Thiền Quán — Meditation timer + breathing visualizer
const { useState: useTQS, useEffect: useTQE, useRef: useTQR } = React;

function TQSeal({ size = 'sm' }) {
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

const TQ_SESSIONS = [
  { id: 'breath', glyph: 'Thở', name: 'Thở chánh niệm', desc: 'Theo dõi hơi thở vào ra — căn bản nhất', duration: 5, color: '#7ca85a' },
  { id: 'metta', glyph: 'Từ', name: 'Quán Từ Bi', desc: 'Rải lòng từ cho mình, người thân, chúng sinh', duration: 10, color: '#e6b85a' },
  { id: 'body', glyph: 'Thân', name: 'Quán thân', desc: 'Quét cảm giác từ đỉnh đầu xuống chân', duration: 15, color: '#c89a5a' },
  { id: 'silence', glyph: 'Tịnh', name: 'Tịnh tọa', desc: 'Ngồi im — chỉ nghe, chỉ thấy, không bám víu', duration: 20, color: '#5aa3c8' },
  { id: 'walking', glyph: 'Bước', name: 'Thiền hành', desc: 'Đi chậm — mỗi bước một niệm Phật', duration: 10, color: '#c87a5a' }
];

const TQ_BREATH_CYCLES = [
  { label: 'Đơn giản 4-4', inhale: 4, hold: 0, exhale: 4, holdOut: 0 },
  { label: 'Cân bằng 4-4-4-4', inhale: 4, hold: 4, exhale: 4, holdOut: 4 },
  { label: 'Thư giãn 4-7-8', inhale: 4, hold: 7, exhale: 8, holdOut: 0 }
];

function BreathOrb({ phase, progress, color }) {
  const scale = phase === 'inhale' ? 0.6 + progress * 0.4
             : phase === 'hold' ? 1
             : phase === 'exhale' ? 1 - progress * 0.4
             : 0.6;
  return (
    <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] mx-auto flex items-center justify-center">
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
        transform: `scale(${scale * 1.2})`, transition: 'transform 0.5s ease-out'
      }}></div>
      <div className="absolute rounded-full border" style={{
        width: '70%', height: '70%', borderColor: color + '50',
        transform: `scale(${scale})`, transition: 'transform 0.5s ease-out',
        boxShadow: `0 0 60px ${color}40, inset 0 0 40px ${color}30`
      }}></div>
      <div className="absolute rounded-full" style={{
        width: '40%', height: '40%', background: `radial-gradient(circle, ${color}80, ${color}20)`,
        transform: `scale(${scale})`, transition: 'transform 0.5s ease-out'
      }}></div>
      <div className="relative text-center z-10">
        <div className="font-brush text-[44px] md:text-[56px] leading-none" style={{ color }}>
          {phase === 'inhale' ? 'Vào' : phase === 'hold' ? 'Giữ' : phase === 'exhale' ? 'Ra' : 'Nghỉ'}
        </div>
        <div className="text-[12px] tracking-[0.3em] uppercase text-cream-dim mt-2">
          {phase === 'inhale' ? 'Hít vào' : phase === 'hold' ? 'Giữ hơi' : phase === 'exhale' ? 'Thở ra' : 'Buông'}
        </div>
      </div>
    </div>
  );
}

function ThienQuanPage() {
  const [session, setSession] = useTQS(TQ_SESSIONS[0]);
  const [cycle, setCycle] = useTQS(TQ_BREATH_CYCLES[0]);
  const [running, setRunning] = useTQS(false);
  const [elapsed, setElapsed] = useTQS(0);
  const [phase, setPhase] = useTQS('inhale');
  const [phaseProgress, setPhaseProgress] = useTQS(0);
  const [completed, setCompleted] = useTQS(0); // sessions today
  const tickRef = useTQR();

  const totalSec = session.duration * 60;

  // Main timer
  useTQE(() => {
    if (!running) return;
    const start = Date.now() - elapsed * 1000;
    tickRef.current = setInterval(() => {
      const e = (Date.now() - start) / 1000;
      setElapsed(e);
      if (e >= totalSec) {
        setRunning(false);
        setCompleted(c => c + 1);
        const cd = window.useCongDuc ? window.useCongDuc() : null;
        if (cd && cd.earn) cd.earn(20, `Thiền ${session.name} · ${session.duration}p`);
      }
    }, 100);
    return () => clearInterval(tickRef.current);
  }, [running, totalSec, session]);

  // Breath phase cycler (only for 'breath' session)
  useTQE(() => {
    if (!running || session.id !== 'breath') return;
    const phases = [
      ['inhale', cycle.inhale],
      ['hold', cycle.hold],
      ['exhale', cycle.exhale],
      ['holdOut', cycle.holdOut]
    ].filter(([, d]) => d > 0);
    let phaseIdx = 0;
    let phaseStart = Date.now();
    setPhase(phases[0][0]);
    const id = setInterval(() => {
      const [p, dur] = phases[phaseIdx];
      const t = (Date.now() - phaseStart) / 1000;
      setPhaseProgress(Math.min(1, t / dur));
      if (t >= dur) {
        phaseIdx = (phaseIdx + 1) % phases.length;
        phaseStart = Date.now();
        setPhase(phases[phaseIdx][0]);
        setPhaseProgress(0);
      }
    }, 100);
    return () => clearInterval(id);
  }, [running, session, cycle]);

  const reset = () => { setRunning(false); setElapsed(0); setPhase('inhale'); setPhaseProgress(0); };
  const mm = String(Math.floor((totalSec - elapsed) / 60)).padStart(2, '0');
  const ss = String(Math.floor((totalSec - elapsed) % 60)).padStart(2, '0');

  return (
    <div className="px-5 md:px-10 py-6 md:py-10 max-w-[1280px] mx-auto">
      <div className="mb-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-8 font-brush text-[180px] text-gold/[0.04] leading-none select-none pointer-events-none hidden md:block">Thiền</div>
        <div className="text-[11px] tracking-[0.32em] uppercase text-gold font-medium">Thiền · Tịnh tọa</div>
        <h1 className="font-serif text-[30px] md:text-[44px] font-semibold text-cream mt-2 leading-tight text-balance">
          Mỗi hơi thở, một <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">trở về</span>
        </h1>
        <p className="text-[14px] md:text-[15px] text-cream-dim mt-3 max-w-[680px] leading-relaxed">
          Chọn bài thiền, ngồi xuống, theo dõi hơi thở. Không cần đạt gì — chỉ cần có mặt.
          <span className="text-gold-bright"> Mỗi buổi hoàn thành = +20 công đức.</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-6">
        {/* LEFT: session picker */}
        <div className="relative bg-ink-3/30 border border-gold/20 p-5 lg:sticky lg:top-6 self-start">
          <TQSeal size="lg"/>
          <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-3">Bài thiền</div>
          <div className="space-y-2 mb-5">
            {TQ_SESSIONS.map(s => (
              <button key={s.id} onClick={() => { setSession(s); reset(); }} disabled={running}
                className={`relative w-full text-left p-3 border transition-all ${
                  session.id === s.id ? 'border-gold bg-gold/[0.06]' : 'border-gold/15 hover:border-gold/40'
                } ${running ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {session.id === s.id && <TQSeal />}
                <div className="flex items-start gap-3">
                  <span className="font-brush text-2xl shrink-0 leading-none" style={{ color: s.color }}>{s.glyph}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-[15px] text-cream font-semibold leading-tight">{s.name}</span>
                      <span className="text-[10px] text-gold tracking-wider">{s.duration}p</span>
                    </div>
                    <div className="text-[11px] text-cream-dim mt-0.5 leading-snug">{s.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {session.id === 'breath' && (
            <>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-2 pt-4 border-t border-gold/15">Nhịp thở</div>
              <div className="space-y-1.5">
                {TQ_BREATH_CYCLES.map(c => (
                  <button key={c.label} onClick={() => setCycle(c)} disabled={running}
                    className={`relative w-full text-left px-3 py-2 text-[12px] border transition-all ${
                      cycle.label === c.label ? 'border-gold bg-gold/10 text-gold-bright' : 'border-gold/15 text-cream-dim hover:border-gold/40 hover:text-cream'
                    } ${running ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-5 pt-4 border-t border-gold/15">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-2">Hôm nay</div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-[28px] text-cream font-semibold leading-none">{completed}</span>
              <span className="text-[11px] text-cream-dim">buổi · {completed * 20} công đức</span>
            </div>
          </div>
        </div>

        {/* RIGHT: practice area */}
        <div className="relative bg-gradient-to-br from-ink-3/40 to-ink-2 border border-gold/20 p-6 md:p-10">
          <TQSeal size="lg"/>

          <div className="text-center mb-6">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">{session.name}</div>
            <div className="font-serif text-[20px] md:text-[24px] text-cream font-semibold italic">
              {running ? 'Có mặt, ngay đây' : 'Sẵn sàng bắt đầu'}
            </div>
          </div>

          {session.id === 'breath' ? (
            <BreathOrb phase={phase} progress={phaseProgress} color={session.color}/>
          ) : (
            <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{
                background: `radial-gradient(circle, ${session.color}20 0%, transparent 70%)`,
                animation: running ? 'pulse 4s ease-in-out infinite' : 'none'
              }}></div>
              <div className="absolute inset-8 rounded-full border" style={{ borderColor: session.color + '50' }}></div>
              <div className="absolute inset-16 rounded-full" style={{ background: `radial-gradient(circle, ${session.color}60, ${session.color}10)` }}></div>
              <div className="relative text-center z-10">
                <div className="font-brush text-[70px] md:text-[88px] leading-none" style={{ color: session.color }}>{session.glyph}</div>
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <div className="font-serif text-[44px] md:text-[56px] text-cream font-semibold tracking-wider tabular-nums leading-none">
              {mm}:{ss}
            </div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-cream-dim mt-2">
              {Math.floor(elapsed / 60)}p {Math.floor(elapsed % 60)}s đã trôi qua
            </div>

            {/* Progress bar */}
            <div className="mt-4 max-w-[400px] mx-auto h-px bg-gold/20 relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold-bright"
                style={{ width: `${(elapsed / totalSec) * 100}%`, transition: 'width 0.3s' }}></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-7">
            <button onClick={reset}
              className="px-5 py-2.5 text-[12px] tracking-widest border border-gold/30 text-cream-dim hover:border-gold hover:text-cream uppercase">
              Đặt lại
            </button>
            <button onClick={() => setRunning(r => !r)}
              className="px-8 py-3.5 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink font-semibold text-[14px] tracking-wide rounded-sm shadow-[0_8px_24px_-8px_rgba(212,160,74,0.5)] hover:-translate-y-px transition-all">
              {running ? '⏸ Tạm dừng' : elapsed > 0 ? '▶ Tiếp tục' : '▶ Bắt đầu'}
            </button>
          </div>

          {elapsed >= totalSec && (
            <div className="mt-6 relative bg-gold/10 border border-gold/40 p-4 text-center animate-fade-up">
              <TQSeal />
              <div className="font-brush text-3xl text-gold-bright">An</div>
              <div className="font-serif text-[16px] text-cream font-semibold mt-1">Hoàn thành — +20 công đức</div>
              <div className="text-[11px] text-cream-dim mt-1 italic">"Một niệm tỉnh giác hơn ngàn năm mê mờ."</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.ThienQuanPage = ThienQuanPage;
