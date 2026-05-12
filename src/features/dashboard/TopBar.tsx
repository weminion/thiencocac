'use client';

interface Props {
  userName?: string;
  onMenuClick?: () => void;
}

export default function TopBar({ userName = 'Khách', onMenuClick }: Props) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 px-4 lg:px-6 h-14"
      style={{
        background: 'rgba(10,8,6,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212,162,75,0.12)',
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
        style={{ color: 'var(--color-cream-dim)' }}
        aria-label="Mở menu"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
        </svg>
      </button>

      {/* Greeting */}
      <div className="flex-1">
        <span
          className="text-sm"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-dim)' }}
        >
          Thỉnh giáo,{' '}
          <span style={{ color: 'var(--color-gold)' }}>{userName}</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--color-cream-dim)' }}
          aria-label="Thông báo"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 10a6 6 0 00-12 0v3l-1 1v1h14v-1l-1-1v-3z" />
            <path d="M9 18a2 2 0 002-2H7a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-opacity hover:opacity-80"
          style={{
            background: 'var(--color-gold)',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
          }}
        >
          <span>+</span>
          <span>Thêm lá số</span>
        </button>
      </div>
    </header>
  );
}
