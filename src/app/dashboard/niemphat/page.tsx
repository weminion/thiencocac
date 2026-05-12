'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface PhatHieu {
  key: string
  short: string
  han: string
  color: string
}

interface NiemPhatState {
  count: number
  rounds: number
  totalNiem: number
  congDuc: number
  selectedKey: string
}

// ── Constants ────────────────────────────────────────────────────────────────

const TOTAL_BEADS = 108
const CONG_DUC_PER_ROUND = 5

const PHAT_HIEU: PhatHieu[] = [
  { key: 'adida',   short: 'Nam mô A Di Đà Phật',                     han: 'A Di Đà',  color: '#f4cf73' },
  { key: 'quanam',  short: 'Nam mô Đại Bi Quan Thế Âm Bồ Tát',       han: 'Quan Âm',  color: '#e6b85a' },
  { key: 'dtc',     short: 'Nam mô Đại Thế Chí Bồ Tát',               han: 'Đại Thế Chí', color: '#d4a04a' },
  { key: 'diatang', short: 'Nam mô Đại Nguyện Địa Tạng Vương Bồ Tát', han: 'Địa Tạng', color: '#c87a5a' },
  { key: 'vanthu',  short: 'Nam mô Đại Trí Văn Thù Sư Lợi Bồ Tát',   han: 'Văn Thù',  color: '#a07020' },
  { key: 'pho',     short: 'Nam mô Đại Hạnh Phổ Hiền Bồ Tát',         han: 'Phổ Hiền', color: '#a85838' },
]

const BAI_KE = [
  'Nguyện đem công đức này',
  'Hướng về khắp tất cả',
  'Đệ tử và chúng sinh',
  'Đều trọn thành Phật đạo',
]

const STORAGE_KEY = 'tcc-niem-phat-v1'

const DEFAULT_STATE: NiemPhatState = {
  count: 0,
  rounds: 0,
  totalNiem: 0,
  congDuc: 0,
  selectedKey: 'adida',
}

// ── MalaRing SVG Component ───────────────────────────────────────────────────

interface MalaRingProps {
  count: number
  total?: number
  color?: string
  size?: number
}

function MalaRing({ count, total = TOTAL_BEADS, color = '#d4a04a', size = 280 }: MalaRingProps) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.42
  const beadR = size * 0.034

  const beads = Array.from({ length: total }, (_, i) => {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    const isLit = i < count
    const isCurrent = i === count - 1 && count > 0
    return { x, y, isLit, isCurrent }
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`Tràng hạt: ${count}/${total} hạt`}
    >
      {/* Outer glow ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius + beadR * 2}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.15"
      />
      {/* Inner cord ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#3a2418"
        strokeWidth="2"
        opacity="0.5"
      />
      {/* Beads */}
      {beads.map((bead, i) => (
        <circle
          key={i}
          cx={bead.x}
          cy={bead.y}
          r={bead.isCurrent ? beadR * 1.4 : beadR}
          fill={
            bead.isCurrent
              ? color
              : bead.isLit
              ? `${color}cc`
              : '#3a2418'
          }
          stroke={bead.isLit ? color : '#6a4628'}
          strokeWidth={bead.isCurrent ? 1.5 : 0.5}
          opacity={bead.isLit ? 1 : 0.5}
          style={bead.isCurrent ? { filter: `drop-shadow(0 0 4px ${color})` } : undefined}
        />
      ))}
      {/* Center text */}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={size * 0.12}
        fontFamily="var(--font-cormorant), serif"
        fontWeight="600"
      >
        {count}
      </text>
      <text
        x={cx}
        y={cy + size * 0.1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#c9bd9e"
        fontSize={size * 0.055}
        fontFamily="var(--font-be-vietnam), sans-serif"
      >
        /{total} hạt
      </text>
    </svg>
  )
}

// ── Seal Corner Decoration ───────────────────────────────────────────────────

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

// ── Main Page ────────────────────────────────────────────────────────────────

export default function NiemPhatPage() {
  const [state, setState] = useState<NiemPhatState>(DEFAULT_STATE)
  const [autoMode, setAutoMode] = useState(false)
  const [bpm, setBpm] = useState(60)
  const [flash, setFlash] = useState(false)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const selectedHieu = PHAT_HIEU.find(p => p.key === state.selectedKey) ?? PHAT_HIEU[0]

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<NiemPhatState>
        setState(prev => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore corrupt data
    }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state])

  const doNiem = useCallback(() => {
    setState(prev => {
      const nextCount = prev.count + 1
      if (nextCount >= TOTAL_BEADS) {
        return {
          ...prev,
          count: 0,
          rounds: prev.rounds + 1,
          totalNiem: prev.totalNiem + 1,
          congDuc: prev.congDuc + CONG_DUC_PER_ROUND,
        }
      }
      return {
        ...prev,
        count: nextCount,
        totalNiem: prev.totalNiem + 1,
      }
    })
    setFlash(true)
    setTimeout(() => setFlash(false), 120)
  }, [])

  // Auto mode interval
  useEffect(() => {
    if (autoMode) {
      const interval = Math.round(60000 / bpm)
      autoRef.current = setInterval(doNiem, interval)
    } else {
      if (autoRef.current) clearInterval(autoRef.current)
    }
    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
    }
  }, [autoMode, bpm, doNiem])

  const handleReset = () => {
    setAutoMode(false)
    setState(DEFAULT_STATE)
  }

  const handleSelectHieu = (key: string) => {
    setState(prev => ({ ...prev, selectedKey: key }))
  }

  return (
    <div className="min-h-screen bg-ink text-cream p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-6 text-center">
        <h1 className="font-brush text-3xl md:text-4xl text-gold-bright mb-1">Niệm Phật</h1>
        <p className="text-cream-dim text-sm font-sans">Trì danh niệm Phật — tích lũy công đức</p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5">

          {/* MalaRing card */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-6 flex flex-col items-center gap-4">
            <SealCorners />
            <MalaRing
              count={state.count}
              total={TOTAL_BEADS}
              color={selectedHieu.color}
              size={280}
            />
            <p className="font-brush text-lg text-center" style={{ color: selectedHieu.color }}>
              {selectedHieu.short}
            </p>
          </div>

          {/* Danh hiệu selector */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-4">
            <SealCorners />
            <p className="text-cream-dim text-xs font-sans mb-3 text-center tracking-widest uppercase">
              Chọn danh hiệu
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PHAT_HIEU.map(p => (
                <button
                  key={p.key}
                  onClick={() => handleSelectHieu(p.key)}
                  className={[
                    'rounded-lg px-3 py-2 text-sm font-sans transition-all',
                    state.selectedKey === p.key
                      ? 'bg-ink'
                      : 'bg-ink-3 hover:bg-ink-2 text-cream-dim',
                  ].join(' ')}
                  style={
                    state.selectedKey === p.key
                      ? { color: p.color, boxShadow: `inset 0 0 0 2px ${p.color}` }
                      : {}
                  }
                >
                  <span
                    className="block font-brush text-base"
                    style={state.selectedKey === p.key ? { color: p.color } : {}}
                  >
                    {p.han}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tap button */}
          <button
            onClick={doNiem}
            disabled={autoMode}
            className={[
              'relative w-full rounded-2xl py-6 text-3xl font-brush tracking-widest transition-all select-none',
              'bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink shadow-lg',
              flash ? 'scale-95' : 'scale-100',
              autoMode ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-110 active:scale-95',
            ].join(' ')}
            aria-label="Niệm một hạt"
          >
            {selectedHieu.han}
            {flash && (
              <span
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: `0 0 24px 4px ${selectedHieu.color}80` }}
              />
            )}
          </button>

          {/* Auto mode */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-4">
            <SealCorners />
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-sm text-cream-dim">Tự động niệm</span>
              <button
                onClick={() => setAutoMode(v => !v)}
                className={[
                  'relative w-12 h-6 rounded-full transition-colors',
                  autoMode ? 'bg-gold' : 'bg-ink-3 border border-gold/30',
                ].join(' ')}
                aria-pressed={autoMode}
                aria-label="Bật/tắt tự động niệm"
              >
                <span
                  className={[
                    'absolute top-1 w-4 h-4 rounded-full bg-cream transition-transform',
                    autoMode ? 'translate-x-7' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-cream-dim font-sans w-16">20 BPM</span>
              <input
                type="range"
                min={20}
                max={120}
                value={bpm}
                onChange={e => setBpm(Number(e.target.value))}
                className="flex-1 accent-gold"
                aria-label="Tốc độ niệm (BPM)"
              />
              <span className="text-xs text-cream-dim font-sans w-16 text-right">120 BPM</span>
            </div>
            <p className="text-center text-gold font-sans text-sm mt-2">
              {bpm} lần / phút
            </p>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-5">

          {/* Stats panel */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-5">
            <SealCorners />
            <h2 className="font-brush text-xl text-gold-bright mb-4 text-center">Công Đức</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-2xl font-serif text-gold">{state.rounds}</p>
                <p className="text-xs text-cream-dim font-sans mt-1">Tràng</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif text-gold">{state.totalNiem}</p>
                <p className="text-xs text-cream-dim font-sans mt-1">Tổng niệm</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif text-gold-bright">{state.congDuc}</p>
                <p className="text-xs text-cream-dim font-sans mt-1">Công đức</p>
              </div>
            </div>
            {/* Progress bar for current round */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-cream-dim font-sans mb-1">
                <span>Tràng hiện tại</span>
                <span>{state.count}/{TOTAL_BEADS}</span>
              </div>
              <div className="w-full h-2 bg-ink rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(state.count / TOTAL_BEADS) * 100}%`,
                    background: `linear-gradient(to right, ${selectedHieu.color}80, ${selectedHieu.color})`,
                  }}
                />
              </div>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 w-full text-xs text-cream-dim/50 hover:text-cream-dim font-sans py-1 transition-colors"
            >
              Đặt lại
            </button>
          </div>

          {/* Hồi hướng card */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-5 overflow-hidden">
            <SealCorners />
            {/* Decorative background glyph */}
            <span
              className="absolute inset-0 flex items-center justify-center font-brush text-9xl select-none pointer-events-none"
              style={{ color: selectedHieu.color, opacity: 0.04 }}
              aria-hidden="true"
            >
              Phật
            </span>
            <h3 className="font-brush text-lg text-gold-bright mb-3 text-center relative">
              Hồi Hướng
            </h3>
            <p className="text-cream-dim text-xs font-sans text-center mb-4 relative leading-relaxed">
              Sau mỗi thời niệm Phật, hãy hồi hướng công đức đến tất cả chúng sinh
            </p>
            <div className="relative space-y-1">
              {BAI_KE.map((line, i) => (
                <p
                  key={i}
                  className="font-brush text-center text-base"
                  style={{ color: selectedHieu.color, opacity: 0.85 + i * 0.04 }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Bài kệ phát nguyện */}
          <div className="relative rounded-xl bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/30 p-5">
            <SealCorners />
            <h3 className="font-brush text-lg text-gold-bright mb-3 text-center">Bài Kệ Phát Nguyện</h3>
            <div className="space-y-2 text-center">
              <p className="font-sans text-cream-dim text-sm leading-relaxed">
                Con nguyện vãng sinh Tây phương Tịnh Độ,
              </p>
              <p className="font-sans text-cream-dim text-sm leading-relaxed">
                Chín phẩm hoa sen là cha mẹ con.
              </p>
              <p className="font-sans text-cream-dim text-sm leading-relaxed">
                Hoa khai kiến Phật ngộ vô sinh,
              </p>
              <p className="font-sans text-cream-dim text-sm leading-relaxed">
                Bất thoái Bồ Tát thị bạn lữ.
              </p>
            </div>
            <div
              className="mt-4 pt-4 border-t text-center"
              style={{ borderColor: `${selectedHieu.color}30` }}
            >
              <p className="text-xs text-cream-dim/60 font-sans">
                Mỗi tràng hạt = {CONG_DUC_PER_ROUND} công đức
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
