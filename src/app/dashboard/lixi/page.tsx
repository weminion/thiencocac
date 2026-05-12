'use client'

import { useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface EnvelopeDesign {
  id: string
  label: string
  bgFrom: string
  bgVia: string
  bgTo: string
  textDark: boolean
  accent: string
  pattern: string
}

interface LixiState {
  currentStep: 1 | 2 | 3 | 4
  selectedDesign: string
  recipientName: string
  recipientRelation: string
  message: string
  sent: boolean
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ENVELOPE_DESIGNS: EnvelopeDesign[] = [
  {
    id: 'gold',
    label: 'Kim Phật',
    bgFrom: '#a07020',
    bgVia: '#d4a04a',
    bgTo: '#f4cf73',
    textDark: true,
    accent: '#d4a04a',
    pattern: 'Phật',
  },
  {
    id: 'lotus',
    label: 'Sen hồng',
    bgFrom: '#7a1c2a',
    bgVia: '#c87a5a',
    bgTo: '#e9a080',
    textDark: false,
    accent: '#c87a5a',
    pattern: 'Sen',
  },
  {
    id: 'jade',
    label: 'Ngọc bích',
    bgFrom: '#064e3b',
    bgVia: '#065f46',
    bgTo: '#10b981',
    textDark: false,
    accent: '#10b981',
    pattern: 'Ngọc',
  },
  {
    id: 'night',
    label: 'Đêm linh',
    bgFrom: '#0c0a08',
    bgVia: '#1a1510',
    bgTo: '#2a2018',
    textDark: false,
    accent: '#d4a04a',
    pattern: 'Linh',
  },
]

const RELATION_OPTIONS = [
  'Bố mẹ', 'Ông bà', 'Anh chị em', 'Con cái',
  'Bạn bè', 'Đồng đạo', 'Thầy cô', 'Khác',
]

const DEFAULT_MESSAGES = [
  'Kính chúc năm mới an khang thịnh vượng, vạn sự như ý.',
  'Cầu Phật phù hộ gia đình sức khoẻ dồi dào, bình an hạnh phúc.',
  'Nguyện phước lành theo bước, công đức đầy tràn.',
]

const STEPS = ['Chọn mẫu bao', 'Người nhận', 'Lời chúc', 'Gửi']

const INITIAL_STATE: LixiState = {
  currentStep: 1,
  selectedDesign: 'gold',
  recipientName: '',
  recipientRelation: '',
  message: '',
  sent: false,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDesign(id: string): EnvelopeDesign {
  return ENVELOPE_DESIGNS.find(d => d.id === id) ?? ENVELOPE_DESIGNS[0]
}

// ── Envelope Preview ──────────────────────────────────────────────────────────

interface EnvelopePreviewProps {
  design: EnvelopeDesign
  recipientName: string
  message: string
  small?: boolean
}

function EnvelopePreview({ design, recipientName, message, small = false }: EnvelopePreviewProps) {
  const w = small ? 120 : 220
  const h = small ? 168 : 310
  const textColor = design.textDark ? '#1a1208' : '#fde68a'
  const dimColor = design.textDark ? 'rgba(26,18,8,0.65)' : 'rgba(253,230,138,0.65)'

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 220 310`}
      aria-label={`Phong bao ${design.label}`}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`env-bg-${design.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={design.bgFrom} />
          <stop offset="50%" stopColor={design.bgVia} />
          <stop offset="100%" stopColor={design.bgTo} />
        </linearGradient>
        <linearGradient id={`env-seal-${design.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4cf73" />
          <stop offset="100%" stopColor="#a07020" />
        </linearGradient>
      </defs>

      {/* Envelope body */}
      <rect
        x="0" y="0" width="220" height="310"
        fill={`url(#env-bg-${design.id})`}
        rx="4"
      />

      {/* Border frame */}
      <rect
        x="8" y="8" width="204" height="294"
        fill="none"
        stroke={design.accent}
        strokeWidth="1"
        strokeOpacity="0.6"
        rx="2"
      />
      <rect
        x="14" y="14" width="192" height="282"
        fill="none"
        stroke={design.accent}
        strokeWidth="0.5"
        strokeOpacity="0.3"
        rx="1"
      />

      {/* Corner ornaments */}
      {[
        [20, 20],
        [200, 20],
        [20, 290],
        [200, 290],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <circle r="3" fill={design.accent} opacity="0.8" />
          <circle r="6" fill="none" stroke={design.accent} strokeWidth="0.5" opacity="0.4" />
        </g>
      ))}

      {/* Background pattern glyph */}
      <text
        x="110"
        y="160"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="180"
        fontFamily="var(--font-cormorant), serif"
        fill={design.accent}
        opacity="0.04"
      >
        {design.pattern}
      </text>

      {/* Gold seal circle */}
      <circle cx="110" cy="130" r="36" fill={`url(#env-seal-${design.id})`} opacity="0.95" />
      <circle cx="110" cy="130" r="30" fill="none" stroke="#a07020" strokeWidth="1" opacity="0.6" />
      <text
        x="110"
        y="130"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="20"
        fontFamily="var(--font-cormorant), serif"
        fill="var(--color-ink, #1a1208)"
        fontWeight="600"
      >
        Phước
      </text>

      {/* Recipient name */}
      {recipientName ? (
        <text
          x="110"
          y="200"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="15"
          fontFamily="var(--font-cormorant), serif"
          fill={textColor}
          fontWeight="500"
        >
          {recipientName.length > 18 ? recipientName.slice(0, 18) + '…' : recipientName}
        </text>
      ) : (
        <text
          x="110"
          y="200"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontFamily="var(--font-be-vietnam), sans-serif"
          fill={dimColor}
          fontStyle="italic"
        >
          Tên người nhận
        </text>
      )}

      {/* Message snippet */}
      {message ? (
        <text
          x="110"
          y="224"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontFamily="var(--font-be-vietnam), sans-serif"
          fill={dimColor}
          fontStyle="italic"
        >
          {message.length > 30 ? message.slice(0, 30) + '…' : message}
        </text>
      ) : null}

      {/* Bottom label */}
      <text
        x="110"
        y="272"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontFamily="var(--font-be-vietnam), sans-serif"
        fill={dimColor}
        letterSpacing="2"
      >
        THIEN CO CAC
      </text>
      <text
        x="110"
        y="286"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fontFamily="var(--font-be-vietnam), sans-serif"
        fill={dimColor}
        letterSpacing="1"
      >
        Phuoc Lanh · {design.label}
      </text>
    </svg>
  )
}

// ── Confetti dots (CSS animated) ──────────────────────────────────────────────

function Confetti() {
  const dots = Array.from({ length: 28 }, (_, i) => ({
    left: `${5 + (i * 33.7) % 90}%`,
    animDelay: `${(i * 0.13) % 2}s`,
    color: ['#f4cf73', '#e6b85a', '#c87a5a', '#7ca85a', '#5aa3c8', '#d4a04a'][i % 6],
    size: 6 + (i % 4) * 3,
    duration: `${1.5 + (i % 3) * 0.4}s`,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: '-10px',
            width: d.size,
            height: d.size,
            background: d.color,
            animation: `fall ${d.duration} ${d.animDelay} ease-in forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ── Step components ───────────────────────────────────────────────────────────

interface Step1Props {
  selected: string
  onSelect: (id: string) => void
}

function Step1ChooseDesign({ selected, onSelect }: Step1Props) {
  return (
    <div>
      <p className="text-sm font-sans mb-4" style={{ color: 'var(--color-cream-dim)' }}>
        Chọn mẫu phong bao lì xì cho dịp Tết Nguyên Đán
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ENVELOPE_DESIGNS.map(d => (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className="flex flex-col items-center gap-3 p-4 transition-all"
            style={{
              background: selected === d.id ? `${d.accent}20` : 'var(--color-ink-3)',
              border: `2px solid ${selected === d.id ? d.accent : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <EnvelopePreview design={d} recipientName="" message="" small />
            <div className="font-brush text-base" style={{ color: selected === d.id ? d.accent : 'var(--color-cream-dim)' }}>
              {d.label}
            </div>
            {selected === d.id && (
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: d.accent }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <path d="M1.5 4L3.5 6L6.5 2" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

interface Step2Props {
  name: string
  relation: string
  onName: (v: string) => void
  onRelation: (v: string) => void
}

function Step2Recipient({ name, relation, onName, onRelation }: Step2Props) {
  return (
    <div className="space-y-5 max-w-md">
      <p className="text-sm font-sans" style={{ color: 'var(--color-cream-dim)' }}>
        Điền thông tin người nhận phong bao phước lành
      </p>

      <div>
        <label className="block text-xs font-sans tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold)' }}>
          Tên người nhận
        </label>
        <input
          type="text"
          value={name}
          onChange={e => onName(e.target.value)}
          placeholder="Ví dụ: Mẹ Lan, Bạn Minh…"
          maxLength={40}
          className="w-full px-4 py-3 text-sm font-sans outline-none transition-all"
          style={{
            background: 'var(--color-ink-3)',
            border: '1px solid rgba(212,162,75,0.3)',
            color: 'var(--color-cream)',
          }}
        />
      </div>

      <div>
        <label className="block text-xs font-sans tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold)' }}>
          Quan hệ
        </label>
        <div className="grid grid-cols-4 gap-2">
          {RELATION_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => onRelation(r)}
              className="py-2 px-2 text-xs font-sans transition-all"
              style={{
                background: relation === r ? 'rgba(212,162,75,0.2)' : 'var(--color-ink-3)',
                border: `1px solid ${relation === r ? 'rgba(212,162,75,0.6)' : 'rgba(255,255,255,0.06)'}`,
                color: relation === r ? 'var(--color-gold)' : 'var(--color-cream-dim)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface Step3Props {
  message: string
  onMessage: (v: string) => void
}

function Step3Message({ message, onMessage }: Step3Props) {
  return (
    <div className="space-y-5 max-w-md">
      <p className="text-sm font-sans" style={{ color: 'var(--color-cream-dim)' }}>
        Viết lời chúc đầu xuân từ tấm lòng thành
      </p>

      <div>
        <label className="block text-xs font-sans tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold)' }}>
          Lời chúc
        </label>
        <textarea
          value={message}
          onChange={e => onMessage(e.target.value)}
          placeholder="Kính chúc năm mới an khang thịnh vượng…"
          rows={5}
          maxLength={200}
          className="w-full px-4 py-3 text-sm font-sans outline-none resize-none transition-all"
          style={{
            background: 'var(--color-ink-3)',
            border: '1px solid rgba(212,162,75,0.3)',
            color: 'var(--color-cream)',
          }}
        />
        <div className="text-right text-[10px] font-sans mt-1" style={{ color: 'var(--color-cream-dim)' }}>
          {message.length}/200
        </div>
      </div>

      <div>
        <div className="text-xs font-sans tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold)' }}>
          Gợi ý lời chúc
        </div>
        <div className="space-y-2">
          {DEFAULT_MESSAGES.map((m, i) => (
            <button
              key={i}
              onClick={() => onMessage(m)}
              className="w-full text-left px-4 py-3 text-sm font-sans leading-snug transition-all hover:opacity-80"
              style={{
                background: 'var(--color-ink-3)',
                border: '1px solid rgba(212,162,75,0.15)',
                color: 'var(--color-cream-dim)',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface Step4Props {
  design: EnvelopeDesign
  recipientName: string
  recipientRelation: string
  message: string
  sent: boolean
  onSend: () => void
}

function Step4Preview({ design, recipientName, recipientRelation, message, sent, onSend }: Step4Props) {
  if (sent) {
    return (
      <div className="relative flex flex-col items-center justify-center py-10 text-center gap-5 overflow-hidden">
        <Confetti />
        <div className="relative">
          <div className="font-brush text-5xl mb-2" style={{ color: 'var(--color-gold)' }}>
            Phước
          </div>
          <h2 className="font-serif text-2xl font-medium" style={{ color: 'var(--color-cream)' }}>
            Đã gửi phước lành
          </h2>
          <p className="text-sm font-sans mt-2" style={{ color: 'var(--color-cream-dim)' }}>
            Lì xì đã gửi đến <strong style={{ color: 'var(--color-gold)' }}>{recipientName || 'người nhận'}</strong>
            {recipientRelation ? ` (${recipientRelation})` : ''}
          </p>
          <p className="text-xs font-sans mt-3 max-w-xs mx-auto italic leading-relaxed" style={{ color: 'var(--color-cream-dim)' }}>
            "{message || 'Kính chúc năm mới an khang thịnh vượng.'}"
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-sm"
          style={{
            boxShadow: `0 8px 32px ${design.accent}40`,
            transform: 'rotate(-2deg)',
          }}
        >
          <EnvelopePreview design={design} recipientName={recipientName} message={message} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-sm font-sans" style={{ color: 'var(--color-cream-dim)' }}>
        Xem lại phong bao và gửi đi phước lành
      </p>

      {/* Summary */}
      <div
        className="p-4 space-y-2 text-sm font-sans"
        style={{
          background: 'var(--color-ink-3)',
          border: '1px solid rgba(212,162,75,0.2)',
        }}
      >
        <div className="flex gap-3">
          <span style={{ color: 'var(--color-gold)' }}>Mẫu bao</span>
          <span style={{ color: 'var(--color-cream)' }}>{design.label}</span>
        </div>
        <div className="flex gap-3">
          <span style={{ color: 'var(--color-gold)' }}>Người nhận</span>
          <span style={{ color: 'var(--color-cream)' }}>
            {recipientName || <em style={{ color: 'var(--color-cream-dim)' }}>Chưa điền</em>}
            {recipientRelation ? ` (${recipientRelation})` : ''}
          </span>
        </div>
        <div className="flex gap-3">
          <span style={{ color: 'var(--color-gold)' }}>Lời chúc</span>
          <span className="italic leading-snug" style={{ color: 'var(--color-cream)' }}>
            {message ? (message.length > 60 ? message.slice(0, 60) + '…' : message)
              : <em style={{ color: 'var(--color-cream-dim)' }}>Chưa điền</em>}
          </span>
        </div>
      </div>

      <div
        className="flex justify-center"
        style={{ filter: `drop-shadow(0 8px 24px ${design.accent}40)` }}
      >
        <EnvelopePreview design={design} recipientName={recipientName} message={message} />
      </div>

      <button
        onClick={onSend}
        className="w-full py-4 font-serif text-lg font-medium tracking-[0.2em] transition-all hover:brightness-110 active:scale-95"
        style={{
          background: `linear-gradient(135deg, ${design.bgFrom}, ${design.bgVia}, ${design.bgTo})`,
          color: design.textDark ? 'var(--color-ink)' : 'var(--color-cream)',
          border: `1px solid ${design.accent}`,
        }}
      >
        Gửi phước lành
      </button>
    </div>
  )
}

// ── Progress stepper ──────────────────────────────────────────────────────────

interface StepperProps {
  current: number
  total: number
}

function Stepper({ current, total }: StepperProps) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-sans shrink-0 transition-all"
                style={{
                  background: done || active ? 'var(--color-gold)' : 'var(--color-ink-3)',
                  color: done || active ? 'var(--color-ink)' : 'var(--color-cream-dim)',
                  border: active ? '2px solid var(--color-gold-bright)' : 'none',
                }}
              >
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 5L4.5 7.5L8 2.5" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className="text-[9px] font-sans tracking-wider hidden sm:block"
                style={{ color: active ? 'var(--color-gold)' : 'var(--color-cream-dim)', opacity: done ? 0.7 : 1 }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-1 mb-4"
                style={{ background: done ? 'var(--color-gold)' : 'rgba(212,162,75,0.2)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LixiPage() {
  const [state, setState] = useState<LixiState>(INITIAL_STATE)

  const design = getDesign(state.selectedDesign)

  const canNext = (): boolean => {
    if (state.currentStep === 1) return !!state.selectedDesign
    if (state.currentStep === 2) return state.recipientName.trim().length > 0
    if (state.currentStep === 3) return state.message.trim().length > 0
    return true
  }

  const goNext = () => {
    if (state.currentStep < 4) {
      setState(prev => ({ ...prev, currentStep: (prev.currentStep + 1) as 1 | 2 | 3 | 4 }))
    }
  }

  const goPrev = () => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: (prev.currentStep - 1) as 1 | 2 | 3 | 4 }))
    }
  }

  const handleSend = () => {
    setState(prev => ({ ...prev, sent: true }))
  }

  const handleReset = () => {
    setState(INITIAL_STATE)
  }

  return (
    <div className="min-h-screen bg-ink text-cream p-4 md:p-6 lg:p-8">

      {/* Page header */}
      <div className="mb-6 text-center">
        <h1 className="font-brush text-3xl md:text-4xl text-gold-bright mb-1">Lì xì xuân</h1>
        <p className="text-cream-dim text-sm font-sans">Gửi phong bao phước lộc cho người thân</p>
      </div>

      <div className="max-w-5xl mx-auto">

        {/* ── Wizard grid ── */}
        <div className="grid lg:grid-cols-[1fr_260px] gap-6">

          {/* Left: wizard content */}
          <div className="space-y-5">

            {/* Stepper */}
            <div
              className="relative p-5"
              style={{
                background: 'var(--color-ink-2)',
                border: '1px solid rgba(212,162,75,0.2)',
              }}
            >
              <Stepper current={state.currentStep} total={4} />
            </div>

            {/* Step content */}
            <div
              className="relative p-5"
              style={{
                background: 'var(--color-ink-2)',
                border: '1px solid rgba(212,162,75,0.2)',
              }}
            >
              {/* Step label */}
              <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-1 font-sans" style={{ color: 'var(--color-gold)' }}>
                Bước {state.currentStep} / {STEPS.length}
              </div>
              <h2 className="font-serif text-xl font-medium mb-5" style={{ color: 'var(--color-cream)' }}>
                {STEPS[state.currentStep - 1]}
              </h2>

              {state.currentStep === 1 && (
                <Step1ChooseDesign
                  selected={state.selectedDesign}
                  onSelect={id => setState(prev => ({ ...prev, selectedDesign: id }))}
                />
              )}

              {state.currentStep === 2 && (
                <Step2Recipient
                  name={state.recipientName}
                  relation={state.recipientRelation}
                  onName={v => setState(prev => ({ ...prev, recipientName: v }))}
                  onRelation={v => setState(prev => ({ ...prev, recipientRelation: v }))}
                />
              )}

              {state.currentStep === 3 && (
                <Step3Message
                  message={state.message}
                  onMessage={v => setState(prev => ({ ...prev, message: v }))}
                />
              )}

              {state.currentStep === 4 && (
                <Step4Preview
                  design={design}
                  recipientName={state.recipientName}
                  recipientRelation={state.recipientRelation}
                  message={state.message}
                  sent={state.sent}
                  onSend={handleSend}
                />
              )}
            </div>

            {/* Navigation */}
            {!(state.currentStep === 4 && state.sent) && (
              <div className="flex gap-3">
                {state.currentStep > 1 && (
                  <button
                    onClick={goPrev}
                    className="px-5 py-3 text-sm font-sans tracking-wider transition-opacity hover:opacity-80"
                    style={{
                      background: 'var(--color-ink-2)',
                      border: '1px solid rgba(212,162,75,0.3)',
                      color: 'var(--color-cream-dim)',
                    }}
                  >
                    Quay lại
                  </button>
                )}

                {state.currentStep < 4 && (
                  <button
                    onClick={goNext}
                    disabled={!canNext()}
                    className="flex-1 py-3 text-sm font-sans font-semibold tracking-[0.15em] uppercase transition-all"
                    style={{
                      background: canNext()
                        ? 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))'
                        : 'var(--color-ink-3)',
                      color: canNext() ? 'var(--color-ink)' : 'var(--color-cream-dim)',
                      cursor: canNext() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {state.currentStep === 3 ? 'Xem trước' : 'Tiếp theo'}
                  </button>
                )}
              </div>
            )}

            {/* Reset after send */}
            {state.sent && (
              <button
                onClick={handleReset}
                className="w-full py-3 text-sm font-sans tracking-wider transition-opacity hover:opacity-80"
                style={{
                  background: 'var(--color-ink-2)',
                  border: '1px solid rgba(212,162,75,0.3)',
                  color: 'var(--color-cream-dim)',
                }}
              >
                Tạo phong bao mới
              </button>
            )}
          </div>

          {/* Right: live preview */}
          <div className="hidden lg:flex flex-col items-center gap-4 sticky top-6">
            <div
              className="relative w-full p-5 flex flex-col items-center gap-3"
              style={{
                background: 'var(--color-ink-2)',
                border: '1px solid rgba(212,162,75,0.2)',
              }}
            >
              {/* Corner marks */}
              <span className="absolute top-2 left-2 w-3 h-3 border-t border-l pointer-events-none" style={{ borderColor: design.accent, opacity: 0.5 }} />
              <span className="absolute top-2 right-2 w-3 h-3 border-t border-r pointer-events-none" style={{ borderColor: design.accent, opacity: 0.5 }} />
              <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l pointer-events-none" style={{ borderColor: design.accent, opacity: 0.5 }} />
              <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r pointer-events-none" style={{ borderColor: design.accent, opacity: 0.5 }} />

              <div className="text-[10px] tracking-[0.2em] uppercase font-sans" style={{ color: 'var(--color-gold)' }}>
                Xem trước
              </div>

              <div
                className="relative"
                style={{
                  filter: `drop-shadow(0 6px 20px ${design.accent}50)`,
                  transform: state.sent ? 'rotate(-3deg)' : 'none',
                  transition: 'transform 0.4s ease',
                }}
              >
                <EnvelopePreview
                  design={design}
                  recipientName={state.recipientName}
                  message={state.message}
                />
              </div>

              <div className="text-center space-y-0.5">
                <div className="font-brush text-base" style={{ color: design.accent }}>
                  {design.label}
                </div>
                {state.recipientName && (
                  <div className="text-xs font-sans" style={{ color: 'var(--color-cream-dim)' }}>
                    Gửi: {state.recipientName}
                    {state.recipientRelation ? ` · ${state.recipientRelation}` : ''}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
