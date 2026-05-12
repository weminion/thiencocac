'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Intent = 'thien' | 'votam' | 'acY';
type RealmId = 'thien' | 'atula' | 'nhan' | 'sucsinh' | 'ngaquy' | 'diaguc';
type NghiepType = 'thien' | 'trung' | 'ac';

interface Realm {
  id: RealmId;
  name: string;
  cause: string;
  color: string;
  textColor: string;
}

interface AnalysisResult {
  realm: Realm;
  nghiepType: NghiepType;
  giaithich: string;
  samhoi: string;
}

interface HistoryRecord {
  action: string;
  intent: Intent;
  realm: RealmId;
  nghiepType: NghiepType;
  analyzedAt: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'tcc-luan-hoi-v1';

const LUC_DAO: Realm[] = [
  {
    id: 'thien',
    name: 'Coi Troi',
    cause: 'Tu thap thien, bo thi va tu tap phap lanh...',
    color: '#e6b85a',
    textColor: '#1a1200',
  },
  {
    id: 'atula',
    name: 'Coi A-tu-la',
    cause: 'Co phuoc nhung kieu ngao, hay tranh gianh...',
    color: '#c87a5a',
    textColor: '#ffffff',
  },
  {
    id: 'nhan',
    name: 'Coi Nguoi',
    cause: 'Giu ngu gioi, song chan thuc, biet dau kho...',
    color: '#d4a04a',
    textColor: '#1a0e00',
  },
  {
    id: 'sucsinh',
    name: 'Coi Suc Sinh',
    cause: 'Si me, theo ban nang, khong biet phan biet...',
    color: '#8a6a4a',
    textColor: '#ffffff',
  },
  {
    id: 'ngaquy',
    name: 'Coi Nga Quy',
    cause: 'Tham lam, bo bon, khong bo thi, ky bo...',
    color: '#a85838',
    textColor: '#ffffff',
  },
  {
    id: 'diaguc',
    name: 'Coi Dia Nguc',
    cause: 'Sat sinh, trom cap, ta dam, vong ngu...',
    color: '#6a1818',
    textColor: '#ffcccc',
  },
];

const REALM_MAP: Record<RealmId, Realm> = Object.fromEntries(
  LUC_DAO.map((r) => [r.id, r])
) as Record<RealmId, Realm>;

const THAP_THIEN = [
  { so: 1,  hanh: 'Khong sat sinh', mo: 'Bao ve sinh mang, phong sinh, khong gia hai chung sinh' },
  { so: 2,  hanh: 'Khong trom cap',  mo: 'Ton trong tai san nguoi khac, khong chiem doat bat chinh' },
  { so: 3,  hanh: 'Khong ta dam',    mo: 'Giu tinh tinh nghia, khong tham duc phi ly' },
  { so: 4,  hanh: 'Khong vong ngu',  mo: 'Noi loi chan that, khong lua doi, khong du doi' },
  { so: 5,  hanh: 'Khong noi doi', mo: 'Tu bo loi noi xao quyet va khoe khoang' },
  { so: 6,  hanh: 'Khong noi hai',   mo: 'Khong noi nhung loi chia re, ly gian nguoi khac' },
  { so: 7,  hanh: 'Khong noi ac',    mo: 'Tranh loi noi thu at, thoi ma, hung han' },
  { so: 8,  hanh: 'Khong tham lam',  mo: 'Biet du, khong them muon tai san va quyen luc' },
  { so: 9,  hanh: 'Khong san si',    mo: 'Tu tam gian, khoan dung, khong om long thu han' },
  { so: 10, hanh: 'Khong ta kien',   mo: 'Hieu biet Phap, tin nhan qua nghiep bao, khong ta kien' },
];

// ─── Keyword analysis ─────────────────────────────────────────────────────────

const EVIL_KEYWORDS = [
  'giet', 'trom', 'lua', 'noi doi', 'danh', 'chui', 'nguy hiem', 'pha', 'tranh',
  'gianh', 'cuop', 'nham', 'hai', 'pha hoai', 'chong', 'sat', 'hung', 'ac',
  'gian', 'lan',
];

const GOOD_KEYWORDS = [
  'bo thi', 'niem phat', 'giup do', 'tu tap', 'phong sinh', 'bao ve',
  'cuu', 'yeu thuong', 'thien', 'tu bi', 'nhan ai', 'chia se', 'biet on',
  'sam hoi', 'suc khoe', 'hoa binh', 'doan ket', 'thuong',
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

function analyzeAction(action: string, intent: Intent): AnalysisResult {
  const norm = normalize(action);

  let evilScore = EVIL_KEYWORDS.filter((k) => norm.includes(normalize(k))).length;
  let goodScore = GOOD_KEYWORDS.filter((k) => norm.includes(normalize(k))).length;

  // Intent modifier
  if (intent === 'acY')   evilScore += 3;
  if (intent === 'thien') goodScore += 3;
  // votam: no modifier

  const net = goodScore - evilScore;

  let realm: Realm;
  let nghiepType: NghiepType;
  let giaithich: string;
  let samhoi: string;

  if (net >= 4) {
    realm = REALM_MAP['thien'];
    nghiepType = 'thien';
    giaithich =
      'Hanh dong nay mang nhieu thien nghiep. Y lanh, viec lanh ket hop tao phuoc duc lon. Tiep tuc giu vung tam nguyen va tu thap thien se dan den coi troi an lac.';
    samhoi =
      'Hay hoi huong cong duc nay den tat ca chung sinh. Tiep tuc bo thi, niem Phat va giu gioi de phuc duc them vung ben.';
  } else if (net >= 2) {
    realm = REALM_MAP['nhan'];
    nghiepType = 'thien';
    giaithich =
      'Hanh dong thien luong, giu gin ngu gioi tuong doi tot. Nhon duyen phu hop de tiep tuc tu hanh tai coi nguoi — noi co du dieu kien giac ngo.';
    samhoi =
      'Tich cuc lam viec tot, bo thi, phong sinh de tang them phuc bao. Nho niem Phat moi ngay de tam khong buong lung.';
  } else if (net >= 0) {
    realm = REALM_MAP['atula'];
    nghiepType = 'trung';
    giaithich =
      'Hanh dong co ca thien lan bat thien. Co phuoc duc nhung co the con mang trong long kieu ngao hoac tranh gianh. Can them khiem ton va bo thi.';
    samhoi =
      'Kiem diem lai long kieu man. Luyen tap biet on, khiem ton va tha thu de hoa giai nghiep a-tu-la.';
  } else if (net >= -2) {
    realm = REALM_MAP['sucsinh'];
    nghiepType = 'ac';
    giaithich =
      'Hanh dong cho thay su si me, theo ban nang ma it dung tri tue. Can giac tinh de khong chim dac trong vo minh.';
    samhoi =
      'Niem Bo Tat Dia Tang, doc Kinh Vu Lan hoac Kinh A Di Da. Bo thi va phong sinh de giai toa nghiep chuong.';
  } else if (net >= -4) {
    realm = REALM_MAP['ngaquy'];
    nghiepType = 'ac';
    giaithich =
      'Hanh dong mang nhieu nghiep tham lam hoac bo bon. Tam tham lam keo chung sinh xuong coi nga quy — noi cua doi khat khong duoc thoa man.';
    samhoi =
      'Khan thiep Bo Tat Quan The Am. Tap bo thi khong dieu kien — cho di ma khong mong cau bao dap. Doc Kinh Du Lan Bon va cung duong Tam Bao.';
  } else {
    realm = REALM_MAP['diaguc'];
    nghiepType = 'ac';
    giaithich =
      'Hanh dong mang ac nghiep nang ne. Nhat tham, nhi san, tam si — ba doc to gay ra nhung nghiep nay co the dua den dia nguc. Can sam hoi chan thanh.';
    samhoi =
      'Sam hoi truoc Tam Bao mot cach chan thanh. Tung Kinh Dia Tang 7 ngay, phong sinh 108 con. Nguyen tu bo ac va giu gioi nghiem tuc tu nay tro di.';
  }

  return { realm, nghiepType, giaithich, samhoi };
}

// ─── SVG Wheel ────────────────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function wedgePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
}

function VongLuanHoi({ highlightId }: { highlightId: RealmId | null }) {
  const cx = 120, cy = 120, r = 100, innerR = 32;
  const sliceAngle = 360 / 6;

  return (
    <svg viewBox="0 0 240 240" width="240" height="240" className="select-none">
      {/* Outer ring background */}
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="rgba(212,162,75,0.3)" strokeWidth="1" />

      {LUC_DAO.map((realm, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        const midAngle = startAngle + sliceAngle / 2;
        const isHighlighted = realm.id === highlightId;
        const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle);

        // Wedge for outer ring (donut approach: outer - inner)
        const sOuter = polarToCartesian(cx, cy, r, startAngle);
        const eOuter = polarToCartesian(cx, cy, r, endAngle);
        const sInner = polarToCartesian(cx, cy, innerR, startAngle);
        const eInner = polarToCartesian(cx, cy, innerR, endAngle);
        const outerPath = `M ${sInner.x} ${sInner.y} L ${sOuter.x} ${sOuter.y} A ${r} ${r} 0 0 1 ${eOuter.x} ${eOuter.y} L ${eInner.x} ${eInner.y} A ${innerR} ${innerR} 0 0 0 ${sInner.x} ${sInner.y} Z`;

        return (
          <g key={realm.id}>
            <path
              d={outerPath}
              fill={realm.color}
              opacity={isHighlighted ? 1 : 0.45}
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="1"
            />
            {isHighlighted && (
              <path
                d={outerPath}
                fill="none"
                stroke={realm.color}
                strokeWidth="2.5"
                opacity={0.9}
                filter="url(#glow)"
              />
            )}
            {/* Label */}
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isHighlighted ? realm.textColor : 'rgba(255,255,255,0.7)'}
              fontSize="7"
              fontFamily="serif"
              fontWeight={isHighlighted ? 'bold' : 'normal'}
            >
              {realm.name}
            </text>
            {/* Divider line */}
            <line
              x1={cx}
              y1={cy}
              x2={polarToCartesian(cx, cy, r, startAngle).x}
              y2={polarToCartesian(cx, cy, r, startAngle).y}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
          </g>
        );
      })}

      {/* Center hub */}
      <circle cx={cx} cy={cy} r={innerR} fill="var(--color-ink-2, #1a1200)" stroke="rgba(212,162,75,0.5)" strokeWidth="1.5" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(212,162,75,0.8)" fontSize="7" fontFamily="brush, serif">Luan</text>
      <text x={cx} y={cy + 6} textAnchor="middle" fill="rgba(212,162,75,0.8)" fontSize="7" fontFamily="brush, serif">Hoi</text>

      {/* Glow filter */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

const NGHIEP_LABEL: Record<NghiepType, { label: string; color: string }> = {
  thien: { label: 'Thien nghiep',  color: '#34d399' },
  trung: { label: 'Trung tinh',    color: '#d4a04a' },
  ac:    { label: 'Ac nghiep',     color: '#ef4444' },
};

function ResultCard({ result }: { result: AnalysisResult }) {
  const nghiep = NGHIEP_LABEL[result.nghiepType];
  return (
    <div
      className="relative p-5 animate-fade-up space-y-4"
      style={{
        background: 'var(--color-ink-2)',
        border: `1px solid ${result.realm.color}66`,
      }}
    >
      <SealCorners color={result.realm.color} />

      {/* Realm badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="px-3 py-1 font-serif text-sm font-semibold"
          style={{ background: result.realm.color, color: result.realm.textColor }}
        >
          {result.realm.name}
        </div>
        <div
          className="px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase rounded-sm"
          style={{ background: `${nghiep.color}22`, border: `1px solid ${nghiep.color}55`, color: nghiep.color }}
        >
          {nghiep.label}
        </div>
      </div>

      {/* Cause */}
      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: 'var(--color-gold)' }}>
          Nguyen nhan
        </div>
        <p className="text-xs" style={{ color: 'var(--color-cream-dim)' }}>
          {result.realm.cause}
        </p>
      </div>

      {/* Explanation */}
      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: 'var(--color-gold)' }}>
          Phan tich
        </div>
        <p className="text-sm leading-6" style={{ color: 'var(--color-cream)' }}>
          {result.giaithich}
        </p>
      </div>

      {/* Repentance guidance */}
      <div
        className="p-3"
        style={{ background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--color-gold)' }}
      >
        <div className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: 'var(--color-gold)' }}>
          Huong dan sam hoi
        </div>
        <p className="text-sm leading-6" style={{ color: 'var(--color-cream-dim)' }}>
          {result.samhoi}
        </p>
      </div>
    </div>
  );
}

function ThapThienCard() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: 'var(--color-gold)' }}>
            Tu lieu
          </div>
          <div className="font-serif text-base font-medium" style={{ color: 'var(--color-cream)' }}>
            Thap Thien — 10 dieu lanh
          </div>
        </div>
        <span style={{ color: 'var(--color-gold)' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div
            className="h-px mb-3"
            style={{ background: 'rgba(212,162,75,0.15)' }}
          />
          <ol className="space-y-2">
            {THAP_THIEN.map((item) => (
              <li key={item.so} className="flex gap-3">
                <span
                  className="font-brush text-lg w-6 shrink-0 text-center leading-none mt-0.5"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {item.so}
                </span>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-cream)' }}>
                    {item.hanh}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-cream-dim)' }}>
                    {item.mo}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function HistoryList({ records }: { records: HistoryRecord[] }) {
  if (records.length === 0) {
    return (
      <div
        className="p-4 text-center text-sm"
        style={{ color: 'var(--color-cream-dim)', background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.15)' }}
      >
        Chua co lich su phan tich
      </div>
    );
  }

  const INTENT_LABEL: Record<Intent, string> = {
    thien: 'Thien y',
    votam: 'Vo tam',
    acY:   'Ac y',
  };

  return (
    <ul className="space-y-2">
      {records.slice(0, 15).map((rec, i) => {
        const realm = REALM_MAP[rec.realm];
        const nghiep = NGHIEP_LABEL[rec.nghiepType];
        return (
          <li
            key={i}
            className="px-3 py-2.5"
            style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.12)' }}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className="text-xs font-semibold px-2 py-0.5"
                style={{ background: realm.color, color: realm.textColor }}
              >
                {realm.name}
              </span>
              <span className="text-[10px]" style={{ color: nghiep.color }}>
                {nghiep.label}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--color-cream-dim)' }}>
                {new Date(rec.analyzedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
            <div className="text-xs truncate" style={{ color: 'var(--color-cream-dim)' }}>
              [{INTENT_LABEL[rec.intent]}] {rec.action}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const INTENTS: { id: Intent; label: string; desc: string }[] = [
  { id: 'thien', label: 'Thien y',  desc: 'Lam viec voi long tu bi, mong muon tot dep' },
  { id: 'votam', label: 'Vo tam',   desc: 'Lam khong chu y, khong co y dinh ro rang' },
  { id: 'acY',   label: 'Ac y',     desc: 'Lam voi y dinh gay hai hoac vu loi' },
];

export default function LuanHoiPage() {
  const [action, setAction] = useState('');
  const [intent, setIntent] = useState<Intent>('votam');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as HistoryRecord[]);
    } catch {
      // ignore
    }
  }, []);

  const saveHistory = useCallback((records: HistoryRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!action.trim() || analyzing) return;

    setAnalyzing(true);
    setResult(null);

    // Small delay for UX
    setTimeout(() => {
      const res = analyzeAction(action.trim(), intent);
      setResult(res);
      setAnalyzing(false);

      const record: HistoryRecord = {
        action: action.trim(),
        intent,
        realm: res.realm.id,
        nghiepType: res.nghiepType,
        analyzedAt: Date.now(),
      };
      const updated = [record, ...history].slice(0, 30);
      setHistory(updated);
      saveHistory(updated);
    }, 700);
  }, [action, intent, analyzing, history, saveHistory]);

  const highlightId = result ? result.realm.id : null;

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-8 space-y-6">

      {/* Header */}
      <div
        className="relative overflow-hidden p-5"
        style={{
          background: 'linear-gradient(135deg, var(--color-ink-2), var(--color-ink-3))',
          border: '1px solid rgba(200,122,90,0.35)',
        }}
      >
        <SealCorners color="#c87a5a" />
        <div
          className="absolute -right-4 -bottom-4 font-brush select-none pointer-events-none text-[90px] leading-none"
          style={{ color: 'rgba(200,122,90,0.05)' }}
        >
          Luan hoi
        </div>
        <div className="relative">
          <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-1" style={{ color: 'var(--color-gold)' }}>
            Luan hoi nhan qua
          </div>
          <h1 className="font-serif text-2xl font-medium" style={{ color: 'var(--color-cream)' }}>
            Phan tich Nghiep — Luc Dao
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-cream-dim)' }}>
            Mo ta hanh dong, chon dong co va de he thong phan tich nghiep bao theo giao ly Phat giao.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: input + wheel */}
        <div className="md:col-span-1 space-y-5">

          {/* Luc dao wheel */}
          <div
            className="relative p-4 flex flex-col items-center"
            style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
          >
            <div className="text-[10px] tracking-[0.2em] uppercase font-medium mb-3" style={{ color: 'var(--color-gold)' }}>
              Luc Dao Luan Hoi
            </div>
            <VongLuanHoi highlightId={highlightId} />
            {result && (
              <div
                className="mt-3 text-center text-sm font-serif font-medium"
                style={{ color: result.realm.color }}
              >
                {result.realm.name}
              </div>
            )}
          </div>

          {/* Legend */}
          <div
            className="p-3 space-y-1.5"
            style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.15)' }}
          >
            <div className="text-[10px] tracking-[0.2em] uppercase font-medium mb-2" style={{ color: 'var(--color-gold)' }}>
              Cac coi
            </div>
            {LUC_DAO.map((realm) => (
              <div key={realm.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ background: realm.color, opacity: highlightId === realm.id ? 1 : 0.5 }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: highlightId === realm.id ? realm.color : 'var(--color-cream-dim)',
                    fontWeight: highlightId === realm.id ? 600 : 400,
                  }}
                >
                  {realm.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form + result */}
        <div className="md:col-span-2 space-y-4">

          {/* Action input */}
          <div>
            <label
              className="block text-[11px] tracking-[0.2em] uppercase font-medium mb-2"
              style={{ color: 'var(--color-gold)' }}
              htmlFor="lh-action"
            >
              Mo ta hanh dong cua ban
            </label>
            <textarea
              id="lh-action"
              rows={4}
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Vd: Hom nay toi bo thi cho nguoi an xin va niem Phat..."
              maxLength={500}
              className="w-full px-4 py-3 text-sm bg-transparent outline-none resize-none"
              style={{
                background: 'var(--color-ink-2)',
                border: '1px solid rgba(212,162,75,0.25)',
                color: 'var(--color-cream)',
              }}
            />
            <div className="text-right text-[10px] mt-1" style={{ color: 'var(--color-cream-dim)' }}>
              {action.length}/500
            </div>
          </div>

          {/* Intent selector */}
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase font-medium mb-2" style={{ color: 'var(--color-gold)' }}>
              Dong co / y dinh
            </div>
            <div className="grid grid-cols-3 gap-2">
              {INTENTS.map((it) => (
                <button
                  key={it.id}
                  onClick={() => setIntent(it.id)}
                  className="p-3 text-left transition-all"
                  style={
                    intent === it.id
                      ? {
                          background: 'rgba(212,162,75,0.15)',
                          border: '1px solid rgba(212,162,75,0.5)',
                        }
                      : {
                          background: 'var(--color-ink-2)',
                          border: '1px solid rgba(212,162,75,0.15)',
                        }
                  }
                >
                  <div
                    className="text-sm font-semibold mb-0.5"
                    style={{
                      color: intent === it.id ? 'var(--color-gold)' : 'var(--color-cream)',
                    }}
                  >
                    {it.label}
                  </div>
                  <div className="text-[10px] leading-snug" style={{ color: 'var(--color-cream-dim)' }}>
                    {it.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!action.trim() || analyzing}
            className="w-full py-3 font-semibold tracking-wider text-sm uppercase transition-all hover:opacity-80 active:scale-[0.99] disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))',
              color: 'var(--color-ink)',
            }}
          >
            {analyzing ? 'Dang phan tich...' : 'Phan tich nghiep bao'}
          </button>

          {/* Result */}
          {result && <ResultCard result={result} />}

          {!result && !analyzing && (
            <div
              className="py-10 flex flex-col items-center text-center"
              style={{
                background: 'var(--color-ink-2)',
                border: '1px dashed rgba(212,162,75,0.15)',
              }}
            >
              <div className="font-brush text-4xl mb-2" style={{ color: 'rgba(212,162,75,0.25)' }}>
                Nhan qua
              </div>
              <div className="text-sm" style={{ color: 'var(--color-cream-dim)' }}>
                Mo ta hanh dong va chon dong co de he thong phan tich nghiep bao
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thap Thien reference */}
      <ThapThienCard />

      {/* History */}
      <div>
        <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: 'var(--color-gold)' }}>
          Lich su phan tich
        </div>
        <HistoryList records={history} />
      </div>

    </div>
  );
}
