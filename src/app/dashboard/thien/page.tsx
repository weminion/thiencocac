'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface TQSession {
  id: string
  glyph: string
  name: string
  desc: string
  duration: number // minutes
  color: string
}

interface BreathCycle {
  id: string
  label: string
  phases: BreathPhase[]
}

interface BreathPhase {
  name: string
  duration: number // seconds
  scale: number
}

type TimerStatus = 'idle' | 'running' | 'paused' | 'done'

// ── Constants ────────────────────────────────────────────────────────────────

const CONG_DUC_PER_SESSION = 20
const STORAGE_KEY = 'tcc-thien-quan-v1'

const TQ_SESSIONS: TQSession[] = [
  {
    id: 'breath',
    glyph: 'Thở',
    name: 'Thở chánh niệm',
    desc: 'Theo dõi hơi thở để định tâm, buông bỏ vọng niệm',
    duration: 5,
    color: '#7ca85a',
  },
  {
    id: 'metta',
    glyph: 'Từ',
    name: 'Quán Từ Bi',
    desc: 'Trải tâm từ bi đến bản thân, người thân và tất cả chúng sinh',
    duration: 10,
    color: '#e6b85a',
  },
  {
    id: 'body',
    glyph: 'Thân',
    name: 'Quán thân',
    desc: 'Quán chiếu thân tứ đại, nhận biết vô thường',
    duration: 15,
    color: '#c89a5a',
  },
  {
    id: 'silence',
    glyph: 'Tịnh',
    name: 'Tịnh tọa',
    desc: 'Ngồi yên lặng, để tâm trở về trạng thái tĩnh lặng tự nhiên',
    duration: 20,
    color: '#5aa3c8',
  },
  {
    id: 'walking',
    glyph: 'Bước',
    name: 'Thiền hành',
    desc: 'Thiền trong khi đi, chú tâm vào từng bước chân',
    duration: 10,
    color: '#c87a5a',
  },
]

const BREATH_CYCLES: BreathCycle[] = [
  {
    id: '4-4',
    label: '4 - 4 (Hít - Thở)',
    phases: [
      { name: 'Hít vào', duration: 4, scale: 1.5 },
      { name: 'Thở ra', duration: 4, scale: 1 },
    ],
  },
  {
    id: '4-4-4-4',
    label: '4 - 4 - 4 - 4 (Hộp)',
    phases: [
      { name: 'Hít vào', duration: 4, scale: 1.5 },
      { name: 'Giữ hơi', duration: 4, scale: 1.5 },
      { name: 'Thở ra', duration: 4, scale: 1 },
      { name: 'Nghỉ', duration: 4, scale: 1 },
    ],
  },
  {
    id: '4-7-8',
    label: '4 - 7 - 8 (Thư giãn)',
    phases: [
      { name: 'Hít vào', duration: 4, scale: 1.5 },
      { name: 'Giữ hơi', duration: 7, scale: 1.5 },
      { name: 'Thở ra', duration: 8, scale: 1 },
    ],
  },
]

// ── Storage helpers ──────────────────────────────────────────────────────────

interface StoredStats {
  completedToday: number
  lastDate: string
  totalCongDuc: number
}

function loadStats(): StoredStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completedToday: 0, lastDate: '', totalCongDuc: 0 }
    const parsed = JSON.parse(raw) as Partial<StoredStats>
    const today = new Date().toISOString().slice(0, 10)
    if (parsed.lastDate !== today) {
      return { completedToday: 0, lastDate: today, totalCongDuc: parsed.totalCongDuc ?? 0 }
    }
    return {
      completedToday: parsed.completedToday ?? 0,
      lastDate: parsed.lastDate ?? today,
      totalCongDuc: parsed.totalCongDuc ?? 0,
    }
  } catch {
    return { completedToday: 0, lastDate: '', totalCongDuc: 0 }
  }
}

function saveStats(stats: StoredStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

// ── Seal Corners ─────────────────────────────────────────────────────────────

function SealCorners({ color = '#d4a24b', opacity = 0.4 }: { color?: string; opacity?: number }) {
  return (
    <>
      <span
        className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 pointer-events-none"
        style={{ borderColor: color, opacity }}
      />
      <span
        className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 pointer-events-none"
        style={{ borderColor: color, opacity }}
      />
      <span
        className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 pointer-events-none"
        style={{ borderColor: color, opacity }}
      />
      <span
        className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 pointer-events-none"
        style={{ borderColor: color, opacity }}
      />
    </>
  )
}

// ── BreathOrb component ───────────────────────────────────────────────────────

interface BreathOrbProps {
  phase: BreathPhase | null
  phaseProgress: number // 0..1
  color: string
  glyph: string
}

function BreathOrb({ phase, phaseProgress, color, glyph }: BreathOrbProps) {
  const scale = phase
    ? phase.scale === 1
      ? 1 + (phase.scale - 1) * phaseProgress
      : 1 + (phase.scale - 1) * phaseProgress
    : 1

  const innerScale = phase ? scale : 1

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="relative flex items-center justify-center rounded-full transition-none"
        style={{
          width: 200,
          height: 200,
          transform: `scale(${innerScale})`,
          transition: phase ? `transform ${phase.duration * 0.9}s ease-in-out` : 'none',
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            boxShadow: `0 0 ${40 * innerScale}px ${color}40`,
          }}
        />
        {/* Main orb */}
        <div
          className="relative w-40 h-40 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}66 60%, ${color}22)`,
            boxShadow: `0 0 30px ${color}60, inset 0 0 20px ${color}30`,
          }}
        >
          <span
            className="font-brush text-4xl select-none"
            style={{ color: '#0a0806', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            {glyph}
          </span>
        </div>
      </div>
      {phase && (
        <p className="font-sans text-sm" style={{ color }}>
          {phase.name}
        </p>
      )}
    </div>
  )
}

// ── Format time ──────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ThienPage() {
  const [selectedSession, setSelectedSession] = useState<TQSession>(TQ_SESSIONS[0])
  const [selectedCycle, setSelectedCycle] = useState<BreathCycle>(BREATH_CYCLES[0])
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [remaining, setRemaining] = useState<number>(TQ_SESSIONS[0].duration * 60)
  const [stats, setStats] = useState<StoredStats>({ completedToday: 0, lastDate: '', totalCongDuc: 0 })

  // Breath animation state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseSecondsRef = useRef(0) // elapsed seconds in current phase

  // Load stats on mount
  useEffect(() => {
    setStats(loadStats())
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (breathTimerRef.current) clearInterval(breathTimerRef.current)
    }
  }, [])

  // When session changes, reset timer
  const handleSelectSession = useCallback((session: TQSession) => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (breathTimerRef.current) clearInterval(breathTimerRef.current)
    setSelectedSession(session)
    setStatus('idle')
    setRemaining(session.duration * 60)
    setCurrentPhaseIndex(0)
    setPhaseProgress(0)
    phaseSecondsRef.current = 0
  }, [])

  const stopBreathCycle = useCallback(() => {
    if (breathTimerRef.current) {
      clearInterval(breathTimerRef.current)
      breathTimerRef.current = null
    }
  }, [])

  const startBreathCycle = useCallback(() => {
    stopBreathCycle()
    if (selectedSession.id !== 'breath') return

    const cycle = selectedCycle
    let phaseIdx = currentPhaseIndex
    let phaseSec = phaseSecondsRef.current

    breathTimerRef.current = setInterval(() => {
      phaseSec += 1
      const currentPhase = cycle.phases[phaseIdx]
      const progress = Math.min(phaseSec / currentPhase.duration, 1)
      setPhaseProgress(progress)

      if (phaseSec >= currentPhase.duration) {
        phaseSec = 0
        phaseIdx = (phaseIdx + 1) % cycle.phases.length
        setCurrentPhaseIndex(phaseIdx)
      }
      phaseSecondsRef.current = phaseSec
    }, 1000)
  }, [selectedSession.id, selectedCycle, currentPhaseIndex, stopBreathCycle])

  const handleStart = useCallback(() => {
    setStatus('running')

    // Main countdown
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          stopBreathCycle()
          setStatus('done')

          // Update stats
          setStats(prev => {
            const today = new Date().toISOString().slice(0, 10)
            const next: StoredStats = {
              completedToday: prev.completedToday + 1,
              lastDate: today,
              totalCongDuc: prev.totalCongDuc + CONG_DUC_PER_SESSION,
            }
            saveStats(next)
            return next
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    startBreathCycle()
  }, [startBreathCycle, stopBreathCycle])

  const handlePause = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    stopBreathCycle()
    setStatus('paused')
  }, [stopBreathCycle])

  const handleResume = useCallback(() => {
    setStatus('running')
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          stopBreathCycle()
          setStatus('done')
          setStats(prev => {
            const today = new Date().toISOString().slice(0, 10)
            const next: StoredStats = {
              completedToday: prev.completedToday + 1,
              lastDate: today,
              totalCongDuc: prev.totalCongDuc + CONG_DUC_PER_SESSION,
            }
            saveStats(next)
            return next
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    startBreathCycle()
  }, [startBreathCycle, stopBreathCycle])

  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    stopBreathCycle()
    setStatus('idle')
    setRemaining(selectedSession.duration * 60)
    setCurrentPhaseIndex(0)
    setPhaseProgress(0)
    phaseSecondsRef.current = 0
  }, [selectedSession.duration, stopBreathCycle])

  const totalSeconds = selectedSession.duration * 60
  const progressPct = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0
  const currentPhase = selectedSession.id === 'breath' && status === 'running'
    ? selectedCycle.phases[currentPhaseIndex]
    : null

  return (
    <div className="min-h-screen bg-ink text-cream p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-6 text-center">
        <h1 className="font-brush text-3xl md:text-4xl text-gold-bright mb-1">Thiền Quán</h1>
        <p className="text-cream-dim text-sm font-sans">Định tâm — quán chiếu — giải thoát</p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-6">

        {/* ── Left column (sticky on lg) ── */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">

          {/* Session picker */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-4">
            <SealCorners color={selectedSession.color} />
            <p className="text-cream-dim text-xs font-sans mb-3 text-center tracking-widest uppercase">
              Chọn thời thiền
            </p>
            <div className="space-y-2">
              {TQ_SESSIONS.map(session => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  disabled={status === 'running'}
                  className={[
                    'w-full rounded-lg px-3 py-2.5 text-left transition-all flex items-center gap-3',
                    selectedSession.id === session.id
                      ? 'bg-ink'
                      : 'bg-ink-3 hover:bg-ink-2',
                    status === 'running' ? 'opacity-50 cursor-not-allowed' : '',
                  ].join(' ')}
                  style={
                    selectedSession.id === session.id
                      ? { boxShadow: `inset 0 0 0 1px ${session.color}60` }
                      : {}
                  }
                >
                  <span
                    className="font-brush text-lg w-10 text-center shrink-0"
                    style={{ color: session.color }}
                  >
                    {session.glyph}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className="block font-sans text-sm font-medium"
                      style={selectedSession.id === session.id ? { color: session.color } : { color: '#c9bd9e' }}
                    >
                      {session.name}
                    </span>
                    <span className="block font-sans text-xs text-cream-dim/60 truncate">
                      {session.duration} phút
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Breath cycle picker (only for breath session) */}
          {selectedSession.id === 'breath' && (
            <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-4">
              <SealCorners color={selectedSession.color} />
              <p className="text-cream-dim text-xs font-sans mb-3 text-center tracking-widest uppercase">
                Nhịp thở
              </p>
              <div className="space-y-2">
                {BREATH_CYCLES.map(cycle => (
                  <button
                    key={cycle.id}
                    onClick={() => setSelectedCycle(cycle)}
                    disabled={status === 'running'}
                    className={[
                      'w-full rounded-lg px-3 py-2 text-left transition-all font-sans text-sm',
                      selectedCycle.id === cycle.id
                        ? 'bg-ink'
                        : 'bg-ink-3 hover:bg-ink-2 text-cream-dim',
                      status === 'running' ? 'opacity-50 cursor-not-allowed' : '',
                    ].join(' ')}
                    style={
                      selectedCycle.id === cycle.id
                        ? { color: selectedSession.color, boxShadow: `inset 0 0 0 1px ${selectedSession.color}60` }
                        : {}
                    }
                  >
                    {cycle.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Today stats */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-4">
            <SealCorners />
            <h3 className="font-brush text-base text-gold-bright mb-3 text-center">Hôm Nay</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-serif text-gold">{stats.completedToday}</p>
                <p className="text-xs text-cream-dim font-sans mt-1">Thời thiền</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif text-gold-bright">{stats.totalCongDuc}</p>
                <p className="text-xs text-cream-dim font-sans mt-1">Công đức</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-5">

          {/* Session info */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-5">
            <SealCorners color={selectedSession.color} />
            <div className="flex items-center gap-3 mb-2">
              <span
                className="font-brush text-2xl"
                style={{ color: selectedSession.color }}
              >
                {selectedSession.glyph}
              </span>
              <div>
                <h2 className="font-serif text-lg text-cream">{selectedSession.name}</h2>
                <p className="text-xs text-cream-dim font-sans">{selectedSession.duration} phút</p>
              </div>
            </div>
            <p className="text-cream-dim text-sm font-sans leading-relaxed">
              {selectedSession.desc}
            </p>
          </div>

          {/* Breath orb / visual area */}
          <div
            className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-8 flex flex-col items-center justify-center min-h-[280px]"
            style={{ borderColor: `${selectedSession.color}40` }}
          >
            <SealCorners color={selectedSession.color} />
            <BreathOrb
              phase={currentPhase}
              phaseProgress={phaseProgress}
              color={selectedSession.color}
              glyph={selectedSession.glyph}
            />
            {status === 'idle' && (
              <p className="mt-4 text-cream-dim/60 text-xs font-sans">
                Nhấn bắt đầu để vào thiền
              </p>
            )}
            {status === 'paused' && (
              <p className="mt-4 text-cream-dim/60 text-xs font-sans">
                Tạm dừng — nhấn tiếp tục khi sẵn sàng
              </p>
            )}
          </div>

          {/* Timer display */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-6">
            <SealCorners color={selectedSession.color} />
            {/* Countdown */}
            <div className="text-center mb-4">
              <span
                className="font-serif text-6xl tabular-nums"
                style={{ color: selectedSession.color }}
              >
                {formatTime(remaining)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-ink rounded-full overflow-hidden mb-6">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(to right, ${selectedSession.color}60, ${selectedSession.color})`,
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              {status === 'idle' && (
                <button
                  onClick={handleStart}
                  className="flex-1 max-w-[200px] rounded-xl py-3 font-brush text-lg text-ink bg-gradient-to-br from-gold-bright via-gold to-gold-deep hover:brightness-110 transition-all"
                >
                  Bắt Đầu
                </button>
              )}
              {status === 'running' && (
                <>
                  <button
                    onClick={handlePause}
                    className="flex-1 max-w-[160px] rounded-xl py-3 font-sans text-sm text-cream bg-ink-2 border border-gold/30 hover:bg-ink-3 transition-all"
                  >
                    Tạm dừng
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl px-5 py-3 font-sans text-sm text-cream-dim bg-ink-3 hover:bg-ink-2 transition-all"
                  >
                    Đặt lại
                  </button>
                </>
              )}
              {status === 'paused' && (
                <>
                  <button
                    onClick={handleResume}
                    className="flex-1 max-w-[160px] rounded-xl py-3 font-brush text-lg text-ink bg-gradient-to-br from-gold-bright via-gold to-gold-deep hover:brightness-110 transition-all"
                  >
                    Tiếp Tục
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl px-5 py-3 font-sans text-sm text-cream-dim bg-ink-3 hover:bg-ink-2 transition-all"
                  >
                    Đặt lại
                  </button>
                </>
              )}
              {status === 'done' && (
                <button
                  onClick={handleReset}
                  className="flex-1 max-w-[200px] rounded-xl py-3 font-brush text-lg text-ink bg-gradient-to-br from-gold-bright via-gold to-gold-deep hover:brightness-110 transition-all"
                >
                  Thời Mới
                </button>
              )}
            </div>
          </div>

          {/* Completion card */}
          {status === 'done' && (
            <div
              className="relative rounded-xl border p-6 text-center overflow-hidden"
              style={{
                background: `linear-gradient(to bottom, ${selectedSession.color}15, ${selectedSession.color}08)`,
                borderColor: `${selectedSession.color}60`,
              }}
            >
              <SealCorners color={selectedSession.color} />
              {/* Background glyph */}
              <span
                className="absolute inset-0 flex items-center justify-center font-brush text-8xl select-none pointer-events-none"
                style={{ color: selectedSession.color, opacity: 0.05 }}
                aria-hidden="true"
              >
                {selectedSession.glyph}
              </span>
              <div className="relative">
                <p className="font-brush text-2xl mb-1" style={{ color: selectedSession.color }}>
                  Hoàn Tất
                </p>
                <p className="font-sans text-cream-dim text-sm mb-3">
                  Bạn đã hoàn thành thời {selectedSession.name.toLowerCase()}
                </p>
                <div
                  className="inline-block rounded-lg px-4 py-2 font-serif text-lg"
                  style={{
                    background: `${selectedSession.color}20`,
                    color: selectedSession.color,
                    border: `1px solid ${selectedSession.color}40`,
                  }}
                >
                  +{CONG_DUC_PER_SESSION} công đức
                </div>
                <p className="mt-3 text-xs text-cream-dim/60 font-sans">
                  Hãy hồi hướng công đức này đến tất cả chúng sinh
                </p>
              </div>
            </div>
          )}

          {/* Guidance text */}
          {status !== 'done' && (
            <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-5">
              <SealCorners />
              <h3 className="font-brush text-base text-gold-bright mb-3">Hướng Dẫn</h3>
              {selectedSession.id === 'breath' && (
                <div className="space-y-2 font-sans text-sm text-cream-dim leading-relaxed">
                  <p>Ngồi thẳng lưng, hai tay đặt trên đùi, mắt nhắm nhẹ.</p>
                  <p>Tập trung vào hơi thở tự nhiên qua mũi.</p>
                  <p>Khi vọng tưởng khởi, nhẹ nhàng đưa tâm trở lại hơi thở.</p>
                </div>
              )}
              {selectedSession.id === 'metta' && (
                <div className="space-y-2 font-sans text-sm text-cream-dim leading-relaxed">
                  <p>Nguyện cho mình được an vui, hạnh phúc và thoát khỏi khổ đau.</p>
                  <p>Nguyện cho người thân được an vui, hạnh phúc và thoát khỏi khổ đau.</p>
                  <p>Nguyện cho tất cả chúng sinh được an vui, hạnh phúc và thoát khỏi khổ đau.</p>
                </div>
              )}
              {selectedSession.id === 'body' && (
                <div className="space-y-2 font-sans text-sm text-cream-dim leading-relaxed">
                  <p>Quán chiếu thân này do tứ đại hợp thành: đất, nước, lửa, gió.</p>
                  <p>Nhận biết sự vô thường của thân xác, không bám víu, không sợ hãi.</p>
                  <p>Trở về hiện tại với sự biết ơn đối với cuộc sống này.</p>
                </div>
              )}
              {selectedSession.id === 'silence' && (
                <div className="space-y-2 font-sans text-sm text-cream-dim leading-relaxed">
                  <p>Ngồi yên lặng, không cố kiểm soát tâm.</p>
                  <p>Để mọi suy nghĩ tự đến rồi tự đi như mây trôi qua bầu trời.</p>
                  <p>Nhận biết không gian yên lặng nằm bên dưới mọi hoạt động tâm trí.</p>
                </div>
              )}
              {selectedSession.id === 'walking' && (
                <div className="space-y-2 font-sans text-sm text-cream-dim leading-relaxed">
                  <p>Đi chậm rãi, chú tâm vào cảm giác của từng bước chân chạm đất.</p>
                  <p>Phối hợp hơi thở với bước chân: hít vào 2 bước, thở ra 2 bước.</p>
                  <p>Khi tâm tán loạn, dừng lại, hít thở, rồi tiếp tục bước.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
