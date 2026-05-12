'use client';

import { useState } from 'react';

interface Person {
  id: number;
  name: string;
  born: number;
  died?: number;
  alive: boolean;
  relation: string;
  wish: string;
  total: number;
  candle: number; // 0–1 flame intensity
}

interface LogEntry {
  id: number;
  personName: string;
  amount: number;
  when: string;
}

const DEFAULT_PEOPLE: Person[] = [
  { id: 1, name: 'Bà Nội Hương', born: 1932, died: 2018, alive: false, relation: 'Bà nội — đã mất', wish: 'Cầu siêu sinh Tịnh Độ', total: 1247, candle: 0.78 },
  { id: 2, name: 'Ông Ngoại Lâm', born: 1928, died: 2012, alive: false, relation: 'Ông ngoại — đã mất', wish: 'Cầu siêu sinh Tịnh Độ', total: 891, candle: 0.55 },
  { id: 3, name: 'Bố Tuấn', born: 1958, alive: true, relation: 'Bố — còn sống', wish: 'Cầu an, mạnh khỏe', total: 320, candle: 0.20 },
];

const INITIAL_LOG: LogEntry[] = [
  { id: 1, personName: 'Bà Nội Hương', amount: 30, when: '10 phút trước' },
  { id: 2, personName: 'Ông Ngoại Lâm', amount: 45, when: 'Hôm nay, 08:30' },
  { id: 3, personName: 'Bà Nội Hương', amount: 80, when: 'Hôm qua, 20:15' },
];

const RELATIONS = [
  'Ông nội', 'Bà nội', 'Ông ngoại', 'Bà ngoại',
  'Bố', 'Mẹ', 'Anh', 'Chị', 'Em',
  'Chú', 'Bác', 'Cô', 'Dì', 'Cậu',
  'Bạn bè', 'Khác',
];

const MERIT_OPTIONS = [10, 20, 30, 50, 80, 100];

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

// Candle flame component — CSS-only pulsing animation
function CandleFlame({ intensity }: { intensity: number }) {
  const clampedIntensity = Math.max(0.05, Math.min(1, intensity));
  const height = Math.round(20 + clampedIntensity * 28); // 20–48px
  const glowRadius = Math.round(4 + clampedIntensity * 12);
  const outerColor = `rgba(230,${Math.round(100 + clampedIntensity * 84)},40,${0.4 + clampedIntensity * 0.5})`;
  const innerColor = `rgba(255,${Math.round(200 + clampedIntensity * 50)},80,0.95)`;
  const shadowColor = `rgba(255,150,40,${0.3 + clampedIntensity * 0.5})`;

  return (
    <div className="flex flex-col items-center select-none pointer-events-none" style={{ width: 28 }}>
      {/* Flame SVG */}
      <div
        style={{
          width: 14,
          height,
          position: 'relative',
          animation: 'candle-flicker 1.8s ease-in-out infinite alternate',
          filter: `drop-shadow(0 0 ${glowRadius}px ${shadowColor})`,
        }}
      >
        <svg
          viewBox="0 0 14 48"
          width={14}
          height={height}
          style={{ display: 'block' }}
        >
          <defs>
            <radialGradient id="flame-grad" cx="50%" cy="70%" r="55%">
              <stop offset="0%" stopColor={innerColor} />
              <stop offset="100%" stopColor={outerColor} />
            </radialGradient>
          </defs>
          {/* Outer flame */}
          <path
            d="M7 48 C2 38 0 28 4 16 C5 10 7 4 7 0 C7 4 9 10 10 16 C14 28 12 38 7 48 Z"
            fill="url(#flame-grad)"
            opacity="0.9"
          />
          {/* Inner bright core */}
          <path
            d="M7 44 C5 36 4.5 28 6 20 C6.5 15 7 10 7 6 C7 10 7.5 15 8 20 C9.5 28 9 36 7 44 Z"
            fill={innerColor}
            opacity="0.7"
          />
        </svg>
      </div>
      {/* Wick */}
      <div style={{ width: 2, height: 6, background: '#5a3a1a', borderRadius: 1 }} />
      {/* Candle body */}
      <div
        style={{
          width: 12,
          height: 28,
          background: 'linear-gradient(180deg, #f5e8c8 0%, #e8d5a0 60%, #d4b870 100%)',
          borderRadius: '2px 2px 1px 1px',
          border: '1px solid rgba(180,130,60,0.4)',
        }}
      />
      {/* Base drip */}
      <div style={{ width: 16, height: 4, background: '#d4b870', borderRadius: '0 0 3px 3px', opacity: 0.6 }} />

      <style>{`
        @keyframes candle-flicker {
          0%   { transform: scaleX(1)   scaleY(1)   translateX(0); }
          25%  { transform: scaleX(0.97) scaleY(1.03) translateX(-0.5px); }
          50%  { transform: scaleX(1.03) scaleY(0.97) translateX(0.5px); }
          75%  { transform: scaleX(0.98) scaleY(1.02) translateX(-0.3px); }
          100% { transform: scaleX(1.02) scaleY(0.98) translateX(0.3px); }
        }
      `}</style>
    </div>
  );
}

interface AddPersonForm {
  name: string;
  born: string;
  died: string;
  relation: string;
  wish: string;
  alive: boolean;
}

const EMPTY_FORM: AddPersonForm = {
  name: '',
  born: '',
  died: '',
  relation: 'Khác',
  wish: '',
  alive: true,
};

interface HoiHuongModal {
  person: Person;
  amount: number;
}

export default function NguoiThanPage() {
  const [people, setPeople] = useState<Person[]>(DEFAULT_PEOPLE);
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<AddPersonForm>(EMPTY_FORM);
  const [modal, setModal] = useState<HoiHuongModal | null>(null);
  const [formError, setFormError] = useState('');
  const [nextId, setNextId] = useState(100);
  const [nextLogId, setNextLogId] = useState(10);
  const [doneFlash, setDoneFlash] = useState<number | null>(null);

  function openModal(person: Person) {
    setModal({ person, amount: 30 });
  }

  function closeModal() {
    setModal(null);
  }

  function confirmHoiHuong() {
    if (!modal) return;
    const { person, amount } = modal;

    // Update person
    setPeople((prev) =>
      prev.map((p) =>
        p.id === person.id
          ? {
              ...p,
              total: p.total + amount,
              candle: Math.min(1, p.candle + amount / 500),
            }
          : p
      )
    );

    // Add log entry
    const newEntry: LogEntry = {
      id: nextLogId,
      personName: person.name,
      amount,
      when: 'Vừa xong',
    };
    setLog((prev) => [newEntry, ...prev].slice(0, 20));
    setNextLogId((n) => n + 1);

    // Flash done
    setDoneFlash(person.id);
    setTimeout(() => setDoneFlash(null), 2500);

    closeModal();
  }

  function handleFormChange(field: keyof AddPersonForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError('');
  }

  function handleAddPerson() {
    if (!form.name.trim()) {
      setFormError('Vui lòng nhập tên người thân.');
      return;
    }
    const bornYear = parseInt(form.born, 10);
    if (!form.born || isNaN(bornYear) || bornYear < 1800 || bornYear > 2025) {
      setFormError('Vui lòng nhập năm sinh hợp lệ (1800–2025).');
      return;
    }
    let diedYear: number | undefined = undefined;
    if (!form.alive) {
      diedYear = parseInt(form.died, 10);
      if (!form.died || isNaN(diedYear) || diedYear < bornYear) {
        setFormError('Năm mất phải sau năm sinh.');
        return;
      }
    }

    const newPerson: Person = {
      id: nextId,
      name: form.name.trim(),
      born: bornYear,
      died: diedYear,
      alive: form.alive,
      relation: `${form.relation} — ${form.alive ? 'còn sống' : 'đã mất'}`,
      wish: form.wish.trim() || (form.alive ? 'Cầu an, mạnh khỏe' : 'Cầu siêu sinh Tịnh Độ'),
      total: 0,
      candle: 0.05,
    };

    setPeople((prev) => [...prev, newPerson]);
    setNextId((n) => n + 1);
    setForm(EMPTY_FORM);
    setShowAddForm(false);
    setFormError('');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6 animate-fade-up">

      {/* Header */}
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="font-brush text-4xl mb-1" style={{ color: 'var(--color-gold)' }}>Người thân</div>
          <div className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--color-cream-dim)' }}>
            Hồi hướng công đức · Cầu an · Cầu siêu
          </div>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="px-4 py-2 text-[12px] font-semibold tracking-wider uppercase transition-all hover:opacity-80"
          style={{ background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))', color: 'var(--color-ink)' }}
        >
          {showAddForm ? 'Huỷ' : '+ Thêm người thân'}
        </button>
      </div>

      {/* Add person form */}
      {showAddForm && (
        <div
          className="relative p-6 animate-fade-up"
          style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.3)' }}
        >
          <SealCorners />
          <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-4" style={{ color: 'var(--color-gold)' }}>
            Thêm người thân mới
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1.5 tracking-wide" style={{ color: 'var(--color-cream-dim)' }}>
                Tên người thân
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Ví dụ: Bà Nội Lan"
                className="w-full px-3 py-2 text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,162,75,0.25)',
                  color: 'var(--color-cream)',
                }}
              />
            </div>

            {/* Born */}
            <div>
              <label className="block text-xs mb-1.5 tracking-wide" style={{ color: 'var(--color-cream-dim)' }}>
                Năm sinh
              </label>
              <input
                type="number"
                value={form.born}
                onChange={(e) => handleFormChange('born', e.target.value)}
                placeholder="1950"
                min={1800}
                max={2025}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,162,75,0.25)',
                  color: 'var(--color-cream)',
                }}
              />
            </div>

            {/* Alive toggle */}
            <div className="flex flex-col justify-end">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleFormChange('alive', !form.alive)}
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{ background: form.alive ? 'var(--color-gold)' : 'rgba(255,255,255,0.12)' }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full transition-transform"
                    style={{
                      background: form.alive ? 'var(--color-ink)' : 'var(--color-cream-dim)',
                      left: form.alive ? 'calc(100% - 20px)' : 4,
                    }}
                  />
                </button>
                <span className="text-sm" style={{ color: 'var(--color-cream-dim)' }}>
                  {form.alive ? 'Còn sống' : 'Đã mất'}
                </span>
              </div>
            </div>

            {/* Died year (conditional) */}
            {!form.alive && (
              <div>
                <label className="block text-xs mb-1.5 tracking-wide" style={{ color: 'var(--color-cream-dim)' }}>
                  Năm mất
                </label>
                <input
                  type="number"
                  value={form.died}
                  onChange={(e) => handleFormChange('died', e.target.value)}
                  placeholder="2020"
                  min={1800}
                  max={2025}
                  className="w-full px-3 py-2 text-sm outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(212,162,75,0.25)',
                    color: 'var(--color-cream)',
                  }}
                />
              </div>
            )}

            {/* Relation */}
            <div>
              <label className="block text-xs mb-1.5 tracking-wide" style={{ color: 'var(--color-cream-dim)' }}>
                Mối quan hệ
              </label>
              <select
                value={form.relation}
                onChange={(e) => handleFormChange('relation', e.target.value)}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{
                  background: 'var(--color-ink-2)',
                  border: '1px solid rgba(212,162,75,0.25)',
                  color: 'var(--color-cream)',
                }}
              >
                {RELATIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Wish */}
            <div className="sm:col-span-2">
              <label className="block text-xs mb-1.5 tracking-wide" style={{ color: 'var(--color-cream-dim)' }}>
                Lời cầu nguyện (tùy chọn)
              </label>
              <textarea
                value={form.wish}
                onChange={(e) => handleFormChange('wish', e.target.value)}
                placeholder={form.alive ? 'Cầu an, thân tâm an lạc...' : 'Cầu siêu sinh Tịnh Độ, siêu thoát luân hồi...'}
                rows={2}
                className="w-full px-3 py-2 text-sm outline-none resize-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,162,75,0.25)',
                  color: 'var(--color-cream)',
                }}
              />
            </div>
          </div>

          {formError && (
            <div className="text-xs mb-3 px-3 py-2" style={{ background: 'rgba(200,90,90,0.15)', border: '1px solid rgba(200,90,90,0.3)', color: '#e8a0a0' }}>
              {formError}
            </div>
          )}

          <button
            onClick={handleAddPerson}
            className="px-5 py-2.5 text-sm font-semibold tracking-wider uppercase transition-opacity hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))', color: 'var(--color-ink)' }}
          >
            Lưu người thân
          </button>
        </div>
      )}

      {/* People cards */}
      <div>
        <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3" style={{ color: 'var(--color-gold)' }}>
          Danh sách người thân ({people.length} người)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => {
            const accentColor = person.alive ? '#7ca85a' : '#e6b85a';
            const isFlashing = doneFlash === person.id;
            return (
              <div
                key={person.id}
                className="relative p-5 transition-all"
                style={{
                  background: isFlashing ? `${accentColor}15` : 'var(--color-ink-2)',
                  border: `1px solid ${isFlashing ? accentColor + '50' : 'rgba(212,162,75,0.2)'}`,
                  transition: 'background 0.4s, border-color 0.4s',
                }}
              >
                <SealCorners color={accentColor} />

                {/* Top row: candle + name */}
                <div className="flex items-start gap-3 mb-3">
                  <CandleFlame intensity={person.candle} />
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="font-serif text-base font-semibold leading-snug truncate" style={{ color: 'var(--color-cream)' }}>
                      {person.name}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: accentColor }}>{person.relation}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-cream-dim)' }}>
                      {person.born}{person.died ? ` – ${person.died}` : ''}
                    </div>
                  </div>
                </div>

                {/* Wish */}
                <div
                  className="text-xs italic leading-relaxed px-3 py-2 mb-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--color-cream-dim)' }}
                >
                  &ldquo;{person.wish}&rdquo;
                </div>

                {/* Flame intensity bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--color-cream-dim)' }}>
                    <span>Ngọn lửa công đức</span>
                    <span style={{ color: accentColor }}>{Math.round(person.candle * 100)}%</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(3, person.candle * 100)}%`,
                        background: `linear-gradient(90deg, ${accentColor}99, ${accentColor})`,
                      }}
                    />
                  </div>
                </div>

                {/* Total niệm + button */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] tracking-wider uppercase" style={{ color: 'var(--color-cream-dim)' }}>Tổng hồi hướng</div>
                    <div className="font-serif text-lg font-semibold" style={{ color: 'var(--color-gold)' }}>
                      {person.total.toLocaleString('vi-VN')}
                      <span className="text-xs ml-1 font-normal" style={{ color: 'var(--color-cream-dim)' }}>niệm</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(person)}
                    className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase transition-all hover:opacity-80"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, color: 'var(--color-ink)' }}
                  >
                    Hồi hướng
                  </button>
                </div>

                {/* Flash badge */}
                {isFlashing && (
                  <div
                    className="absolute top-2 right-2 text-[10px] px-2 py-0.5 font-semibold animate-bounce"
                    style={{ background: accentColor, color: 'var(--color-ink)' }}
                  >
                    Đã hồi hướng
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity log */}
      <div
        className="p-5"
        style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.2)' }}
      >
        <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-4" style={{ color: 'var(--color-gold)' }}>
          Nhật ký hồi hướng gần đây
        </div>
        {log.length === 0 ? (
          <div className="text-sm text-center py-4" style={{ color: 'var(--color-cream-dim)' }}>
            Chưa có hồi hướng nào. Hãy chọn người thân và bấm Hồi hướng.
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'rgba(212,162,75,0.1)' }}>
            {log.map((entry) => (
              <li key={entry.id} className="flex items-center gap-4 py-3">
                {/* Flame indicator */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(230,184,90,0.12)', border: '1px solid rgba(230,184,90,0.25)' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ color: 'var(--color-gold)' }}>
                    <path
                      d="M12 22C12 22 5 17 5 11C5 7.13 8.13 4 12 4C15.87 4 19 7.13 19 11C19 17 12 22 12 22Z"
                      fill="currentColor"
                      opacity="0.7"
                    />
                    <path
                      d="M12 20C12 20 8 16 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 16 12 20 12 20Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--color-cream)' }}>
                    {entry.personName}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--color-cream-dim)' }}>{entry.when}</div>
                </div>
                <div className="text-sm font-semibold shrink-0" style={{ color: 'var(--color-gold)' }}>
                  +{entry.amount} công đức
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dharma note */}
      <div
        className="relative p-6 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(212,162,75,0.08), rgba(212,162,75,0.03))',
          border: '1px solid rgba(212,162,75,0.2)',
        }}
      >
        <SealCorners />
        <div className="font-brush text-2xl mb-2" style={{ color: 'var(--color-gold)' }}>Hồi hướng công đức</div>
        <p className="text-sm italic leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--color-cream-dim)' }}>
          Công đức hồi hướng như ánh sáng nến thắp — người cho không mất, người nhận thêm sáng. Tâm hiếu thảo chính là Bồ Đề tâm.
        </p>
      </div>

      {/* Hoi Huong Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-sm p-6 animate-fade-up"
            style={{
              background: 'var(--color-ink-2)',
              border: '1px solid rgba(212,162,75,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SealCorners />

            {/* Modal header */}
            <div className="font-brush text-2xl mb-1" style={{ color: 'var(--color-gold)' }}>
              Hồi hướng
            </div>
            <div className="text-sm mb-5" style={{ color: 'var(--color-cream-dim)' }}>
              Dành tặng công đức cho{' '}
              <span style={{ color: 'var(--color-cream)' }}>{modal.person.name}</span>
            </div>

            {/* Candle preview */}
            <div className="flex justify-center mb-5">
              <CandleFlame intensity={modal.person.candle} />
            </div>

            {/* Amount selector */}
            <div className="mb-5">
              <div className="text-[11px] tracking-[0.2em] uppercase mb-2.5" style={{ color: 'var(--color-cream-dim)' }}>
                Chọn số công đức
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {MERIT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setModal((prev) => prev ? { ...prev, amount: opt } : null)}
                    className="py-2 text-sm font-semibold transition-all"
                    style={
                      modal.amount === opt
                        ? { background: 'var(--color-gold)', color: 'var(--color-ink)' }
                        : { background: 'rgba(255,255,255,0.05)', color: 'var(--color-cream-dim)', border: '1px solid rgba(212,162,75,0.2)' }
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={modal.amount}
                  min={1}
                  max={9999}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) {
                      setModal((prev) => prev ? { ...prev, amount: val } : null);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm text-center outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(212,162,75,0.3)',
                    color: 'var(--color-cream)',
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--color-cream-dim)' }}>công đức</span>
              </div>
            </div>

            {/* Wish preview */}
            <div
              className="text-xs italic px-3 py-2 mb-5 leading-relaxed"
              style={{ background: 'rgba(212,162,75,0.06)', border: '1px solid rgba(212,162,75,0.15)', color: 'var(--color-cream-dim)' }}
            >
              &ldquo;{modal.person.wish}&rdquo;
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 text-sm font-medium transition-opacity hover:opacity-70"
                style={{ border: '1px solid rgba(212,162,75,0.25)', color: 'var(--color-cream-dim)' }}
              >
                Huỷ
              </button>
              <button
                onClick={confirmHoiHuong}
                className="flex-1 py-2.5 text-sm font-semibold tracking-wider uppercase transition-opacity hover:opacity-85"
                style={{
                  background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))',
                  color: 'var(--color-ink)',
                }}
              >
                Xác nhận hồi hướng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
