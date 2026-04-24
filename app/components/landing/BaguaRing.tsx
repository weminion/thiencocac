const TRIGRAMS = ['☰', '☱', '☲', '☳', '☷', '☶', '☵', '☴'];

export default function BaguaRing({ size = 220, element, color }: { size?: number; element?: string; color: string }) {
  const r = size / 2 - 24;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 0 24px ${color}66)` }}>
      <defs>
        <radialGradient id="bagua-bg">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="70%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r + 14} fill="url(#bagua-bg)" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeOpacity="0.35" />
      <g className="animate-rotate-slow" style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}>
        {TRIGRAMS.map((t, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const x = size / 2 + Math.cos(a) * r;
          const y = size / 2 + Math.sin(a) * r;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect x="-14" y="-14" width="28" height="28" fill="#0a0806" stroke={color} strokeOpacity="0.7" />
              <text textAnchor="middle" dominantBaseline="central" fill={color} fontSize="16" fontFamily="serif">{t}</text>
            </g>
          );
        })}
      </g>
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={size * 0.38}
        fontFamily="'Ma Shan Zheng', serif"
        style={{ filter: `drop-shadow(0 0 12px ${color})` }}
      >
        {element ?? '玄'}
      </text>
    </svg>
  );
}
