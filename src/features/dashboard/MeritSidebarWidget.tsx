'use client';

interface Props {
  balance: number;
  streak: number;
}

export default function MeritSidebarWidget({ balance, streak }: Props) {
  const petals = Array.from({ length: 8 }, (_, i) => i);
  const activePetals = Math.min(streak, 8);

  return (
    <div
      className="mx-3 mb-3 rounded-xl p-3"
      style={{ background: 'rgba(212,162,75,0.08)', border: '1px solid rgba(212,162,75,0.2)' }}
    >
      <div className="flex items-center gap-3">
        {/* Mini lotus */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            {petals.map((i) => {
              const angle = (i * 45 - 90) * (Math.PI / 180);
              const cx = 20 + 11 * Math.cos(angle);
              const cy = 20 + 11 * Math.sin(angle);
              const active = i < activePetals;
              return (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx={4}
                  ry={6.5}
                  transform={`rotate(${i * 45 + 90}, ${cx}, ${cy})`}
                  fill={active ? 'var(--color-gold)' : 'rgba(212,162,75,0.2)'}
                  style={{ transition: 'fill 0.4s ease' }}
                />
              );
            })}
            <circle cx="20" cy="20" r="5" fill="var(--color-gold)" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs" style={{ color: 'var(--color-cream-dim)' }}>Công Đức</div>
          <div
            className="text-lg font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}
          >
            {balance.toLocaleString()}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-cream-dim)' }}>
            Streak: {streak} ngày
          </div>
        </div>
      </div>
    </div>
  );
}
