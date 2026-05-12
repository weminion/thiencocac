'use client'

import { useState, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface MeritAction {
  id: string
  label: string
  pts: number
  glyph: string
  desc: string
  color: string
}

interface Transaction {
  id: string
  actionId: string
  label: string
  pts: number
  color: string
  ts: number
}

interface CongDucState {
  balance: number
  streak: number
  lastDate: string
  log: Transaction[]
}

// ── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'tcc-congduc-v1'

const MERIT_ACTIONS: MeritAction[] = [
  { id: 'niem',     label: 'Niệm 108 hạt',       pts: 5,  glyph: 'Phật',  desc: 'Hoàn thành 1 vòng chuỗi',             color: '#f4cf73' },
  { id: 'xam',      label: 'Rút xăm Quan Âm',     pts: 15, glyph: 'Xăm',   desc: 'Một lần rút thẻ thành tâm',           color: '#e6b85a' },
  { id: 'thien',    label: 'Thiền quán 5+ phút',  pts: 20, glyph: 'Thiền', desc: 'Hoàn thành 1 buổi thiền',             color: '#7ca85a' },
  { id: 'kinh',     label: 'Tụng kinh xong',       pts: 30, glyph: 'Kinh',  desc: 'Nghe/tụng hết 1 bộ',                  color: '#5aa3c8' },
  { id: 'bothi',    label: 'Bố thí công đức',      pts: 10, glyph: 'Từ',    desc: 'Gửi công đức cho người thân',          color: '#c87a5a' },
  { id: 'giugioi',  label: 'Giữ giới 1 ngày',      pts: 50, glyph: 'Giới',  desc: 'Ngũ giới trọn vẹn trong ngày',        color: '#d4a04a' },
  { id: 'hoihuong', label: 'Hồi hướng',            pts: 5,  glyph: 'Hướng', desc: 'Hồi hướng cho pháp giới',             color: '#a07020' },
]

interface Tier {
  label: string
  min: number
  max: number
  color: string
}

const TIERS: Tier[] = [
  { label: 'Tập sự',   min: 0,    max: 99,   color: '#c9bd9e' },
  { label: 'Cư sĩ',   min: 100,  max: 499,  color: '#e6b85a' },
  { label: 'Thiện tín', min: 500, max: 1999, color: '#f4cf73' },
  { label: 'Bồ tát',  min: 2000, max: Infinity, color: '#fde68a' },
]

const DEFAULT_STATE: CongDucState = {
  balance: 0,
  streak: 0,
  lastDate: '',
  log: [],
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTier(balance: number): Tier {
  return TIERS.findLast(t => balance >= t.min) ?? TIERS[0]
}

function getNextTier(balance: number): Tier | null {
  return TIERS.find(t => t.min > balance) ?? null
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SealCorners({ color = '#d4a24b', opacity = 0.5 }: { color?: string; opacity?: number }) {
  return (
    <>
      <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: color, opacity }} />
      <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: color, opacity }} />
      <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: color, opacity }} />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: color, opacity }} />
    </>
  )
}

interface ActionCardProps {
  action: MeritAction
  onEarn: (action: MeritAction) => void
  flash: boolean
}

function ActionCard({ action, onEarn, flash }: ActionCardProps) {
  return (
    <div
      className="relative flex flex-col gap-2 p-4 transition-all"
      style={{
        background: 'var(--color-ink-2)',
        border: `1px solid ${action.color}40`,
      }}
    >
      {/* Decorative glyph */}
      <span
        className="absolute top-2 right-3 font-brush text-4xl select-none pointer-events-none leading-none"
        style={{ color: action.color, opacity: 0.08 }}
        aria-hidden="true"
      >
        {action.glyph}
      </span>

      <div className="flex items-start gap-2">
        <div
          className="w-9 h-9 flex items-center justify-center shrink-0 font-brush text-base"
          style={{
            background: `${action.color}20`,
            border: `1px solid ${action.color}50`,
            color: action.color,
          }}
        >
          {action.glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-sans text-sm font-medium leading-snug" style={{ color: 'var(--color-cream)' }}>
            {action.label}
          </div>
          <div className="text-xs leading-snug mt-0.5" style={{ color: 'var(--color-cream-dim)' }}>
            {action.desc}
          </div>
        </div>
      </div>

      <button
        onClick={() => onEarn(action)}
        className={[
          'w-full py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-all',
          flash ? 'scale-95' : 'hover:brightness-110',
        ].join(' ')}
        style={{
          background: `linear-gradient(135deg, ${action.color}cc, ${action.color})`,
          color: 'var(--color-ink)',
        }}
      >
        +{action.pts} Tích lũy
      </button>
    </div>
  )
}

// ── Tier Progress Bar ─────────────────────────────────────────────────────────

function TierProgress({ balance }: { balance: number }) {
  const tier = getTier(balance)
  const next = getNextTier(balance)
  const pct = next
    ? Math.min(100, ((balance - tier.min) / (next.min - tier.min)) * 100)
    : 100

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-brush text-base" style={{ color: tier.color }}>{tier.label}</span>
        {next && (
          <span className="text-xs font-sans" style={{ color: 'var(--color-cream-dim)' }}>
            {next.min - balance} nữa → {next.label}
          </span>
        )}
        {!next && (
          <span className="text-xs font-sans" style={{ color: tier.color }}>Cấp tối cao</span>
        )}
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-ink)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, ${tier.color}80, ${tier.color})`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {TIERS.map((t, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: balance >= t.min ? t.color : 'var(--color-ink-3)' }}
            />
            <span className="text-[9px] font-sans" style={{ color: balance >= t.min ? t.color : 'var(--color-cream-dim)' }}>
              {t.min === 0 ? '0' : t.min >= 1000 ? `${t.min / 1000}k` : t.min}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CongDucPage() {
  const [state, setState] = useState<CongDucState>(DEFAULT_STATE)
  const [flashId, setFlashId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ label: string; pts: number; color: string } | null>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CongDucState>
        setState(prev => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore corrupt data
    }
  }, [])

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state])

  const handleEarn = (action: MeritAction) => {
    const today = todayStr()
    setState(prev => {
      const isNewDay = prev.lastDate !== today
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak

      const tx: Transaction = {
        id: `${Date.now()}-${action.id}`,
        actionId: action.id,
        label: action.label,
        pts: action.pts,
        color: action.color,
        ts: Date.now(),
      }

      return {
        ...prev,
        balance: prev.balance + action.pts,
        streak: newStreak,
        lastDate: today,
        log: [tx, ...prev.log].slice(0, 50),
      }
    })

    // Flash card
    setFlashId(action.id)
    setTimeout(() => setFlashId(null), 200)

    // Toast
    setToast({ label: action.label, pts: action.pts, color: action.color })
    setTimeout(() => setToast(null), 2500)
  }

  const handleReset = () => {
    if (confirm('Xoá toàn bộ dữ liệu công đức?')) {
      setState(DEFAULT_STATE)
    }
  }

  const tier = getTier(state.balance)

  return (
    <div className="min-h-screen bg-ink text-cream p-4 md:p-6 lg:p-8">

      {/* Toast notification */}
      {toast && (
        <div
          className="fixed top-20 right-4 z-50 px-4 py-3 shadow-xl text-sm font-sans font-semibold animate-fade-up"
          style={{
            background: `linear-gradient(135deg, ${toast.color}cc, ${toast.color})`,
            color: 'var(--color-ink)',
          }}
        >
          +{toast.pts} — {toast.label}
        </div>
      )}

      {/* Page header */}
      <div className="mb-6 text-center">
        <h1 className="font-brush text-3xl md:text-4xl text-gold-bright mb-1">Công Đức</h1>
        <p className="text-cream-dim text-sm font-sans">Tích lũy phước lành mỗi ngày</p>
      </div>

      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── Balance card ── */}
        <div
          className="relative overflow-hidden p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, var(--color-ink-3), var(--color-ink-2), var(--color-ink-3))',
            border: '1px solid rgba(212,162,75,0.4)',
          }}
        >
          <SealCorners color="#d4a04a" opacity={0.6} />

          {/* Background glyph */}
          <span
            className="absolute -right-4 -bottom-6 font-brush select-none pointer-events-none text-[140px] leading-none"
            style={{ color: 'rgba(212,162,75,0.05)' }}
            aria-hidden="true"
          >
            {tier.label}
          </span>

          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-2 font-sans" style={{ color: 'var(--color-gold)' }}>
                Tổng công đức
              </div>
              <div
                className="font-serif font-bold leading-none mb-3"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 5rem)',
                  background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold), var(--color-gold-deep))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {state.balance.toLocaleString('vi-VN')}
              </div>
              <TierProgress balance={state.balance} />
            </div>

            <div className="flex md:flex-col gap-4 md:gap-3 md:items-end">
              {/* Streak */}
              <div
                className="relative flex flex-col items-center justify-center w-24 h-24 shrink-0"
                style={{
                  background: 'var(--color-ink)',
                  border: '1px solid rgba(212,162,75,0.3)',
                }}
              >
                <span className="font-serif text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>
                  {state.streak}
                </span>
                <span className="text-[10px] tracking-widest uppercase font-sans mt-0.5" style={{ color: 'var(--color-cream-dim)' }}>
                  Ngày liên tiếp
                </span>
                {/* Flame-like SVG */}
                <svg className="absolute -top-2 -right-2 w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-5-5-11-5-11z"
                    fill={state.streak > 0 ? '#f4cf73' : '#3a2418'}
                    opacity={state.streak > 0 ? 0.9 : 0.4}
                  />
                  <path
                    d="M12 10c0 0-2 3-2 5a2 2 0 004 0c0-2-2-5-2-5z"
                    fill={state.streak > 2 ? '#fff' : 'transparent'}
                    opacity={0.6}
                  />
                </svg>
              </div>

              <div className="text-right">
                <div className="text-xs font-sans" style={{ color: 'var(--color-cream-dim)' }}>
                  Cấp bậc
                </div>
                <div className="font-brush text-2xl" style={{ color: tier.color }}>
                  {tier.label}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Actions grid ── */}
        <div>
          <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3 font-sans" style={{ color: 'var(--color-gold)' }}>
            Tích lũy công đức
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MERIT_ACTIONS.map(action => (
              <ActionCard
                key={action.id}
                action={action}
                onEarn={handleEarn}
                flash={flashId === action.id}
              />
            ))}
          </div>
        </div>

        {/* ── Tier guide ── */}
        <div
          className="relative p-5"
          style={{
            background: 'var(--color-ink-2)',
            border: '1px solid rgba(212,162,75,0.2)',
          }}
        >
          <SealCorners color="#d4a04a" opacity={0.3} />
          <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-4 font-sans" style={{ color: 'var(--color-gold)' }}>
            Thang bậc tu tập
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIERS.map((t, i) => {
              const reached = state.balance >= t.min
              const isCurrent = getTier(state.balance).label === t.label
              return (
                <div
                  key={i}
                  className="flex flex-col gap-1 p-3 transition-all"
                  style={{
                    background: isCurrent ? `${t.color}15` : 'var(--color-ink-3)',
                    border: `1px solid ${isCurrent ? t.color : reached ? `${t.color}50` : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <div className="font-brush text-xl" style={{ color: reached ? t.color : 'var(--color-cream-dim)' }}>
                    {t.label}
                  </div>
                  <div className="text-xs font-sans" style={{ color: 'var(--color-cream-dim)' }}>
                    {t.min === 0 ? '0' : t.min.toLocaleString('vi-VN')}
                    {t.max !== Infinity ? ` – ${t.max.toLocaleString('vi-VN')}` : '+'} công đức
                  </div>
                  {isCurrent && (
                    <div className="text-[10px] tracking-wider uppercase font-sans mt-1" style={{ color: t.color }}>
                      Cấp hiện tại
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Transaction history ── */}
        <div
          className="relative p-5"
          style={{
            background: 'var(--color-ink-2)',
            border: '1px solid rgba(212,162,75,0.2)',
          }}
        >
          <SealCorners color="#d4a04a" opacity={0.3} />
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] tracking-[0.25em] uppercase font-medium font-sans" style={{ color: 'var(--color-gold)' }}>
              Lịch sử tích lũy
            </div>
            {state.log.length > 0 && (
              <button
                onClick={handleReset}
                className="text-xs font-sans transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-cream-dim)' }}
              >
                Xoá tất cả
              </button>
            )}
          </div>

          {state.log.length === 0 ? (
            <div className="text-center py-8">
              <div className="font-brush text-5xl mb-3" style={{ color: 'rgba(212,162,75,0.2)' }}>Phật</div>
              <p className="text-sm font-sans" style={{ color: 'var(--color-cream-dim)' }}>
                Chưa có công đức nào. Hãy bắt đầu tu tập!
              </p>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: 'rgba(212,162,75,0.08)' }}>
              {state.log.map(tx => (
                <li key={tx.id} className="flex items-center gap-3 py-3">
                  {/* Color dot */}
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: tx.color }}
                  />
                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-sans truncate" style={{ color: 'var(--color-cream)' }}>
                      {tx.label}
                    </div>
                    <div className="text-[10px] font-sans" style={{ color: 'var(--color-cream-dim)' }}>
                      {formatDate(tx.ts)} · {formatTime(tx.ts)}
                    </div>
                  </div>
                  {/* Points */}
                  <div
                    className="font-serif text-base font-semibold shrink-0"
                    style={{ color: tx.color }}
                  >
                    +{tx.pts}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
