'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Sutra {
  id: string;
  glyph: string;
  title: string;
  subtitle: string;
  duration: string;
  dur: number;
  monk: string;
  merit: number;
  color: string;
  category: string;
  excerpt: string;
}

const SUTRAS: Sutra[] = [
  { id: 'tam', glyph: 'Tâm', title: 'Bát Nhã Tâm Kinh', subtitle: 'Tinh hoa 600 quyển Bát Nhã — 260 chữ', duration: '8 phút', dur: 480, monk: 'Thầy Thích Nhật Từ', merit: 30, color: '#e6b85a', category: 'Phổ biến', excerpt: 'Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời...' },
  { id: 'adi', glyph: 'A Di Đà', title: 'Kinh A Di Đà', subtitle: 'Cõi Cực Lạc — pháp môn Tịnh Độ', duration: '20 phút', dur: 1200, monk: 'HT Thích Trí Tịnh', merit: 40, color: '#c87a5a', category: 'Tịnh Độ', excerpt: 'Như thị ngã văn: nhất thời Phật tại Xá Vệ quốc...' },
  { id: 'phomon', glyph: 'Phổ', title: 'Phẩm Phổ Môn', subtitle: 'Quan Thế Âm cứu khổ — Kinh Pháp Hoa quyển 25', duration: '25 phút', dur: 1500, monk: 'Thầy Thích Pháp Hòa', merit: 45, color: '#5aa3c8', category: 'Quan Âm', excerpt: 'Nhược hữu vô lượng bá thiên vạn ức chúng sinh thọ chư khổ não...' },
  { id: 'vulan', glyph: 'Vu Lan', title: 'Kinh Vu Lan Báo Hiếu', subtitle: 'Mục Kiền Liên cứu mẹ — kinh báo ân cha mẹ', duration: '30 phút', dur: 1800, monk: 'HT Thích Thanh Từ', merit: 60, color: '#c89a5a', category: 'Báo hiếu', excerpt: 'Một thuở nọ, Mục Liên Tôn giả dùng đạo nhãn...' },
  { id: 'phap', glyph: 'Pháp', title: 'Kinh Pháp Cú', subtitle: '423 bài kệ dạy đạo lý sống', duration: '45 phút', dur: 2700, monk: 'Thầy Thích Trí Quảng', merit: 50, color: '#7ca85a', category: 'Đạo lý', excerpt: 'Ý dẫn đầu các pháp, ý làm chủ, ý tạo tác...' },
  { id: 'dia', glyph: 'Địa Tạng', title: 'Kinh Địa Tạng', subtitle: 'Bồ tát Địa Tạng cứu độ chúng sinh trong địa ngục', duration: '90 phút', dur: 5400, monk: 'HT Thích Trí Tịnh', merit: 80, color: '#a06848', category: 'Hồi hướng', excerpt: 'Như thị ngã văn: nhất thời Phật tại Đao Lợi thiên...' },
];

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;
type Speed = typeof SPEEDS[number];

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function SealCorners({ color = '#d4a24b' }: { color?: string }) {
  return (
    <>
      <span className="absolute -top-px -left-px w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -top-px -right-px w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -bottom-px -left-px w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -bottom-px -right-px w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: color }} />
    </>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <rect x="5" y="3" width="4" height="18" rx="1" />
      <rect x="15" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function SkipBackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M6 6h2v12H6zm.75 6 8.5-6v12z" />
    </svg>
  );
}

function SkipForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16 6h2v12h-2zm-1 6L6.5 6v12z" />
    </svg>
  );
}

function SeekBackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 5V2L7 7l5 5V9c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
      <text x="9" y="16" fontSize="6" fill="currentColor" stroke="none">15</text>
    </svg>
  );
}

function SeekForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 5V2l5 5-5 5V9c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
      <text x="9" y="16" fontSize="6" fill="currentColor" stroke="none">15</text>
    </svg>
  );
}

export default function TungKinhPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [totalMerit, setTotalMerit] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = SUTRAS[currentIndex] as Sutra;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const markCompleted = useCallback((sutra: Sutra) => {
    setCompleted((prev) => {
      if (prev.has(sutra.id)) return prev;
      const next = new Set(prev);
      next.add(sutra.id);
      return next;
    });
    setJustCompleted(sutra.id);
    setTotalMerit((prev) => prev + sutra.merit);
    setTimeout(() => setJustCompleted(null), 3500);
  }, []);

  useEffect(() => {
    clearTimer();
    if (!playing) return;

    const intervalMs = 1000 / speed;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= current.dur) {
          clearTimer();
          setPlaying(false);
          markCompleted(current);
          return current.dur;
        }
        return next;
      });
    }, intervalMs);

    return clearTimer;
  }, [playing, speed, current, clearTimer, markCompleted]);

  function selectSutra(index: number) {
    clearTimer();
    setPlaying(false);
    setCurrentIndex(index);
    setElapsed(0);
  }

  function togglePlay() {
    if (elapsed >= current.dur) {
      setElapsed(0);
    }
    setPlaying((prev) => !prev);
  }

  function seek(delta: number) {
    setElapsed((prev) => Math.max(0, Math.min(current.dur, prev + delta)));
  }

  function skipPrev() {
    if (currentIndex > 0) {
      selectSutra(currentIndex - 1);
    }
  }

  function skipNext() {
    if (currentIndex < SUTRAS.length - 1) {
      selectSutra(currentIndex + 1);
    }
  }

  function handleSeekClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setElapsed(Math.round(ratio * current.dur));
  }

  const progress = current.dur > 0 ? elapsed / current.dur : 0;
  const isDone = elapsed >= current.dur;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6 animate-fade-up">

      {/* Header */}
      <div className="flex items-baseline gap-3">
        <div className="font-brush text-4xl" style={{ color: 'var(--color-gold)' }}>Tụng kinh</div>
        <div className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--color-cream-dim)' }}>
          Nhật tụng · {SUTRAS.length} bài kinh
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* LEFT column */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Now Playing card */}
          <div
            className="relative p-6 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--color-ink-2), var(--color-ink-3))',
              border: `1px solid ${current.color}55`,
            }}
          >
            <SealCorners color={current.color} />

            {/* Watermark glyph */}
            <div
              className="absolute -right-4 -bottom-6 font-brush select-none pointer-events-none text-[110px] leading-none"
              style={{ color: `${current.color}10` }}
            >
              {current.glyph}
            </div>

            {/* Category badge + title */}
            <div className="relative">
              <div
                className="inline-block text-[10px] tracking-[0.22em] uppercase font-semibold px-2.5 py-1 mb-3"
                style={{ background: `${current.color}20`, color: current.color, border: `1px solid ${current.color}40` }}
              >
                {current.category}
              </div>
              <div className="font-brush text-3xl md:text-4xl mb-1" style={{ color: current.color }}>
                {current.glyph}
              </div>
              <h2 className="font-serif text-2xl font-semibold mb-0.5" style={{ color: 'var(--color-cream)' }}>
                {current.title}
              </h2>
              <p className="text-sm mb-1" style={{ color: 'var(--color-cream-dim)' }}>{current.subtitle}</p>
              <p className="text-xs italic leading-relaxed mb-4 max-w-lg" style={{ color: 'var(--color-cream-dim)' }}>
                &ldquo;{current.excerpt}&rdquo;
              </p>
              <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-cream-dim)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                {current.duration}
                <span className="opacity-40">·</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
                </svg>
                {current.monk}
                <span className="opacity-40">·</span>
                <span style={{ color: current.color }}>+{current.merit} công đức</span>
              </div>

              {/* Progress bar */}
              <div
                className="relative h-1.5 rounded-full mb-2 cursor-pointer group"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onClick={handleSeekClick}
              >
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${current.color}, ${current.color}99)` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress * 100}% - 6px)`, background: current.color, borderColor: 'var(--color-ink)' }}
                />
              </div>
              <div className="flex justify-between text-[11px] mb-5" style={{ color: 'var(--color-cream-dim)' }}>
                <span>{formatTime(elapsed)}</span>
                <span>{formatTime(current.dur)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-5">
                {/* Skip back */}
                <button
                  onClick={skipPrev}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-full transition-opacity disabled:opacity-30 hover:opacity-70"
                  style={{ color: 'var(--color-cream-dim)' }}
                  title="Bài trước"
                >
                  <SkipBackIcon />
                </button>

                {/* Seek -15s */}
                <button
                  onClick={() => seek(-15)}
                  className="flex flex-col items-center gap-0.5 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-cream-dim)' }}
                  title="Lùi 15 giây"
                >
                  <SeekBackIcon />
                  <span className="text-[9px]">-15s</span>
                </button>

                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${current.color}, ${current.color}bb)`,
                    color: 'var(--color-ink)',
                  }}
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>

                {/* Seek +15s */}
                <button
                  onClick={() => seek(15)}
                  className="flex flex-col items-center gap-0.5 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-cream-dim)' }}
                  title="Tiến 15 giây"
                >
                  <SeekForwardIcon />
                  <span className="text-[9px]">+15s</span>
                </button>

                {/* Skip next */}
                <button
                  onClick={skipNext}
                  disabled={currentIndex === SUTRAS.length - 1}
                  className="p-2 rounded-full transition-opacity disabled:opacity-30 hover:opacity-70"
                  style={{ color: 'var(--color-cream-dim)' }}
                  title="Bài kế"
                >
                  <SkipForwardIcon />
                </button>
              </div>

              {/* Speed selector */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-[11px] tracking-wider uppercase" style={{ color: 'var(--color-cream-dim)' }}>Tốc độ</span>
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className="px-2.5 py-1 text-[11px] font-semibold transition-all"
                    style={
                      speed === s
                        ? { background: current.color, color: 'var(--color-ink)' }
                        : { background: 'rgba(255,255,255,0.06)', color: 'var(--color-cream-dim)', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Completion bonus banner */}
          {justCompleted && (
            <div
              className="p-4 text-center animate-fade-up"
              style={{ background: 'linear-gradient(90deg, rgba(230,184,90,0.15), rgba(230,184,90,0.05))', border: '1px solid rgba(230,184,90,0.4)' }}
            >
              <div className="font-brush text-2xl mb-1" style={{ color: 'var(--color-gold)' }}>Công đức viên mãn</div>
              <div className="text-sm" style={{ color: 'var(--color-cream)' }}>
                Tụng xong — nhận{' '}
                <span className="font-semibold" style={{ color: 'var(--color-gold-bright)' }}>
                  +{SUTRAS.find((s) => s.id === justCompleted)?.merit ?? 0} công đức
                </span>
              </div>
            </div>
          )}

          {/* Sutra grid */}
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: 'var(--color-gold)' }}>
              Danh sách kinh
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUTRAS.map((sutra, i) => {
                const isActive = i === currentIndex;
                const isDoneItem = completed.has(sutra.id);
                return (
                  <button
                    key={sutra.id}
                    onClick={() => selectSutra(i)}
                    className="relative text-left p-4 transition-all hover:scale-[1.01] w-full"
                    style={{
                      background: isActive ? `${sutra.color}15` : 'var(--color-ink-2)',
                      border: `1px solid ${isActive ? sutra.color + '55' : 'rgba(212,162,75,0.15)'}`,
                    }}
                  >
                    {isDoneItem && (
                      <div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                        style={{ background: sutra.color, color: 'var(--color-ink)' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                    <div className="font-brush text-xl mb-1" style={{ color: sutra.color }}>
                      {sutra.glyph}
                    </div>
                    <div className="font-serif text-sm font-medium mb-0.5" style={{ color: 'var(--color-cream)' }}>
                      {sutra.title}
                    </div>
                    <div className="text-xs mb-2" style={{ color: 'var(--color-cream-dim)' }}>{sutra.subtitle}</div>
                    <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--color-cream-dim)' }}>
                      <span>{sutra.duration}</span>
                      <span style={{ color: sutra.color }}>+{sutra.merit} công đức</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT column — stats + queue */}
        <div className="w-full lg:w-72 space-y-4 lg:sticky lg:top-6">

          {/* Stats */}
          <div
            className="p-5"
            style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
          >
            <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-4" style={{ color: 'var(--color-gold)' }}>
              Thống kê hôm nay
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm" style={{ color: 'var(--color-cream-dim)' }}>Đã hoàn thành</span>
                <span className="font-serif text-lg font-semibold" style={{ color: 'var(--color-cream)' }}>
                  {completed.size} / {SUTRAS.length}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm" style={{ color: 'var(--color-cream-dim)' }}>Công đức tích lũy</span>
                <span className="font-serif text-lg font-semibold" style={{ color: 'var(--color-gold)' }}>
                  +{totalMerit}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm" style={{ color: 'var(--color-cream-dim)' }}>Tốc độ hiện tại</span>
                <span className="font-serif text-base font-semibold" style={{ color: 'var(--color-cream)' }}>
                  {speed}×
                </span>
              </div>

              {/* Overall progress bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'var(--color-cream-dim)' }}>
                  <span>Tiến độ tổng</span>
                  <span>{Math.round((completed.size / SUTRAS.length) * 100)}%</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(completed.size / SUTRAS.length) * 100}%`,
                      background: 'linear-gradient(90deg, var(--color-gold-bright), var(--color-gold))',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Queue / Up next */}
          <div
            className="p-5"
            style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
          >
            <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-4" style={{ color: 'var(--color-gold)' }}>
              Hàng chờ
            </div>
            <div className="space-y-2">
              {SUTRAS.map((sutra, i) => {
                const isActive = i === currentIndex;
                const isDoneItem = completed.has(sutra.id);
                return (
                  <button
                    key={sutra.id}
                    onClick={() => selectSutra(i)}
                    className="w-full flex items-center gap-3 p-2.5 text-left transition-all hover:opacity-80 rounded"
                    style={{
                      background: isActive ? `${sutra.color}18` : 'transparent',
                      border: `1px solid ${isActive ? sutra.color + '40' : 'transparent'}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded text-[11px] font-brush shrink-0"
                      style={{ background: `${sutra.color}20`, color: sutra.color }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium truncate" style={{ color: isDoneItem ? 'var(--color-cream-dim)' : 'var(--color-cream)' }}>
                        {sutra.title}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--color-cream-dim)' }}>{sutra.duration}</div>
                    </div>
                    {isDoneItem && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 shrink-0" style={{ color: sutra.color }}>
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isActive && !isDoneItem && (
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: sutra.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dharma note */}
          <div
            className="p-4 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(212,162,75,0.08), rgba(212,162,75,0.03))', border: '1px solid rgba(212,162,75,0.2)' }}
          >
            <div className="font-brush text-xl mb-2" style={{ color: 'var(--color-gold)' }}>Lời Phật dạy</div>
            <p className="text-xs italic leading-relaxed" style={{ color: 'var(--color-cream-dim)' }}>
              Tụng kinh không hiểu nghĩa vẫn gieo hạt giống lành. Hiểu nghĩa mà tụng — hoa trí tuệ nở.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
