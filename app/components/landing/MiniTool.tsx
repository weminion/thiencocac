'use client';

import { useState, useMemo, useEffect } from 'react';
import { getMenh, getYearAdvice, ELEMENT_META, type NguHanhElement } from '@/lib/ngu-hanh';
import BaguaRing from './BaguaRing';

function ElementBadge({ element }: { element: NguHanhElement }) {
  const meta = ELEMENT_META[element];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
        style={{ background: `radial-gradient(circle at 30% 30%, ${meta.color}, ${meta.bg})`, boxShadow: `0 0 0 1px ${meta.color}aa, 0 0 24px ${meta.color}44` }}
      >
        <span style={{ fontSize: 24, color: '#0a0806', fontFamily: "'Ma Shan Zheng', serif" }}>{meta.symbol}</span>
      </div>
      <span className="font-serif text-[13px] text-cream font-medium">{element}</span>
    </div>
  );
}

function MenhResult({ birthYear }: { birthYear: number }) {
  const menh = useMemo(() => getMenh(birthYear), [birthYear]);
  const advice = useMemo(() => getYearAdvice(menh.element), [menh.element]);
  const meta = menh.meta;

  return (
    <div className="mt-12 animate-fade-up">
      {/* Hero result */}
      <div
        className="grid lg:grid-cols-[1fr_320px] gap-12 items-center p-10 border mb-8 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${meta.color} 10%, #14100a), #0a0806)`, borderColor: `color-mix(in oklab, ${meta.color} 40%, rgba(212,162,75,0.4))` }}
      >
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] blur-[40px] pointer-events-none" style={{ background: `radial-gradient(circle, color-mix(in oklab, ${meta.color} 30%, transparent), transparent 70%)` }} />
        <div className="relative z-10">
          <div className="text-[11px] tracking-[0.3em] uppercase text-cream-dim mb-2.5">Năm sinh {birthYear} · Can Chi</div>
          <div className="font-serif text-[22px] text-gold-bright italic mb-1.5">{menh.full}</div>
          <div className="font-serif text-[18px] text-cream-dim mb-7">{menh.napAm}</div>
          <div className="font-serif text-5xl text-cream leading-none mb-5 font-medium">
            Mệnh{' '}
            <span className="font-semibold italic" style={{ color: meta.color, textShadow: `0 0 24px color-mix(in oklab, ${meta.color} 50%, transparent)` }}>
              {menh.element}
            </span>
          </div>
          <p className="text-cream-dim text-base max-w-[480px] leading-[1.65]">{meta.desc}</p>
        </div>
        <div className="flex items-center justify-center relative z-10">
          <BaguaRing element={meta.symbol} color={meta.color} />
        </div>
      </div>

      {/* Relations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gold/20 border border-gold/20 mb-8">
        {[
          { chip: 'Quý nhân', sub: 'Sinh ra mệnh bạn', bad: false, el1: menh.duocSinh, arrow: `→ sinh ${menh.element}` },
          { chip: 'Bạn giúp', sub: 'Mệnh bạn sinh ra', bad: false, el1: menh.element, arrow: `→ sinh ${menh.sinhRa}`, el2: menh.sinhRa },
          { chip: 'Tránh xung', sub: 'Khắc chế mệnh bạn', bad: true, el1: menh.biKhac, arrow: `⚡ khắc ${menh.element}` },
          { chip: 'Bạn chế ngự', sub: 'Mệnh bạn khắc', bad: true, el1: menh.element, arrow: `⚡ khắc ${menh.khacDi}`, el2: menh.khacDi },
        ].map((row, i) => (
          <div key={i} className="bg-ink-2 p-6 px-5 flex flex-col gap-3.5">
            <div className="flex flex-col gap-0.5">
              <span className={`text-[10px] tracking-[0.2em] uppercase font-semibold ${row.bad ? 'text-red-400' : 'text-emerald-400'}`}>{row.chip}</span>
              <span className="text-xs text-cream-dim">{row.sub}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <ElementBadge element={row.el1} />
              <span className={`font-serif italic text-[13px] ${row.bad ? 'text-red-400' : 'text-cream-dim'}`}>{row.arrow}</span>
              {row.el2 && <ElementBadge element={row.el2} />}
            </div>
          </div>
        ))}
      </div>

      {/* Colors + direction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/20 border border-gold/20 mb-8">
        {[
          { title: 'Màu tương hợp', chips: meta.luckyColors, good: true },
          { title: 'Màu cần tránh', chips: meta.unluckyColors, good: false },
          { title: 'Hướng tốt 2026', chips: [advice.direction], good: true },
        ].map((c, i) => (
          <div key={i} className="bg-ink-2 p-5 px-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-gold mb-3 font-medium">{c.title}</div>
            <div className="flex flex-wrap gap-1.5">
              {c.chips.map(x => (
                <span key={x} className={`text-[13px] px-3 py-1.5 rounded-full border ${c.good ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'border-gold/40 text-cream-dim opacity-70'}`}>
                  {x}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Advice */}
      <div className="bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/40 p-9 px-10 relative">
        <span className="absolute -top-px -left-px w-6 h-6 border-t border-l border-gold" />
        <span className="absolute -bottom-px -right-px w-6 h-6 border-b border-r border-gold" />
        <div className="flex items-center gap-4 font-serif text-[26px] text-cream mb-3.5 font-medium">
          <span className="font-brush text-gold text-3xl w-[50px] h-[50px] border border-gold/40 inline-flex items-center justify-center">甲</span>
          <span>Thiên cơ năm 2026 dành cho bạn</span>
        </div>
        <p className="text-cream-dim text-[17px] leading-[1.65] mb-7 max-w-[720px] font-serif italic">{advice.overall}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-7 py-6 border-y border-gold/20">
          {[
            { t: 'Nên làm', items: advice.do, cls: 'text-emerald-400' },
            { t: 'Nên tránh', items: advice.avoid, cls: 'text-red-400' },
            { t: 'Tháng cát lợi', months: advice.luckyMonths, cls: 'text-cream-dim' },
          ].map(col => (
            <div key={col.t}>
              <div className={`text-[11px] tracking-[0.2em] uppercase mb-3 font-medium ${col.cls}`}>{col.t}</div>
              {'items' in col && col.items ? (
                <ul className="list-none">
                  {col.items.map((x, i) => (
                    <li key={i} className="text-cream text-[14.5px] py-2 pl-5 relative border-b border-dashed border-gold/20 last:border-0 before:content-['◆'] before:text-gold before:absolute before:left-0 before:top-2 before:text-[10px]">
                      {x}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {col.months?.map(m => (
                    <span key={m} className="bg-gold/15 border border-gold/40 text-gold-bright text-[13px] px-3 py-1.5 font-serif">
                      Tháng {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="inline-flex items-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold px-[22px] py-3 text-sm hover:-translate-y-px transition-all">
            Xem luận giải chi tiết →
          </button>
          <button className="inline-flex items-center gap-2.5 font-sans font-medium tracking-wide rounded-sm text-cream border border-gold/40 hover:border-gold hover:text-gold-bright px-[22px] py-3 text-sm transition-all">
            Đặt lịch tư vấn 1-1
          </button>
        </div>
      </div>
    </div>
  );
}

const INPUT_CLS = "w-full bg-ink text-cream border border-gold/40 px-4 py-3 font-serif text-xl rounded-sm font-medium focus:outline-none focus:border-gold";
const LABEL_CLS = "text-[11px] tracking-[0.18em] uppercase text-gold font-medium";

export default function MiniTool() {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(6);
  const [year, setYear] = useState(1992);
  const [gender, setGender] = useState<'nam' | 'nu'>('nam');
  const [submitted, setSubmitted] = useState(false);
  const [resultYear, setResultYear] = useState<number | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseInt(String(year), 10);
    if (isNaN(y) || y < 1900 || y > 2100) return;
    setResultYear(y);
    setSubmitted(true);
    setTimeout(() => {
      const el = document.getElementById('result-anchor');
      if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 80, behavior: 'smooth' });
    }, 50);
  };

  return (
    <section id="tool" className="max-w-[1280px] mx-auto py-16 md:py-[120px] px-5 md:px-10 relative">
      <div className="text-center max-w-[780px] mx-auto mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2.5 text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-gold font-medium mb-4 md:mb-5">
          <span className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_theme(colors.gold.DEFAULT)] animate-pulse" />
          Thiên Cơ Đoán Mệnh
        </div>
        <h2 className="font-serif text-[30px] sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.1] font-medium text-cream mb-4">
          Nhập{' '}
          <span className="font-medium italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">ngày sinh</span>
          , luận ngay{' '}
          <span className="font-medium italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">mệnh trời</span>
        </h2>
        <p className="text-cream-dim text-base leading-[1.65]">
          Tra cứu nạp âm Lục Thập Hoa Giáp · Ngũ hành tương sinh tương khắc · Vận niên 2026 · Miễn phí, tức thì, chính xác theo cổ pháp.
        </p>
      </div>

      <form onSubmit={onSubmit} className="max-w-[900px] mx-auto mb-10 md:mb-16 bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/40 p-5 md:p-9 relative">
        <span className="absolute -top-px -left-px w-[18px] h-[18px] border-t border-l border-gold" />
        <span className="absolute -bottom-px -right-px w-[18px] h-[18px] border-b border-r border-gold" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-[18px] mb-5 md:mb-6">
          {([['Ngày', day, setDay, 1, 31], ['Tháng', month, setMonth, 1, 12], ['Năm sinh', year, setYear, 1900, 2100]] as const).map(([label, val, setter, min, max]) => (
            <label key={label} className="flex flex-col gap-2">
              <span className={LABEL_CLS}>{label}</span>
              <input
                type="number" value={val}
                onChange={e => (setter as (v: number) => void)(Number(e.target.value))}
                min={min} max={max}
                className={INPUT_CLS}
              />
            </label>
          ))}
          <label className="flex flex-col gap-2">
            <span className={LABEL_CLS}>Giới tính</span>
            <div className="flex bg-ink border border-gold/40 rounded-sm overflow-hidden">
              {(['nam', 'nu'] as const).map(v => (
                <button key={v} type="button" onClick={() => setGender(v)}
                  className={`flex-1 py-3 font-serif text-lg transition-all ${gender === v ? 'bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold' : 'text-cream-dim'}`}>
                  {v === 'nam' ? 'Nam' : 'Nữ'}
                </button>
              ))}
            </div>
          </label>
        </div>
        <button type="submit" className="w-full inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold shadow-[0_8px_24px_-8px_rgba(212,162,75,0.6)] hover:-translate-y-px hover:shadow-[0_0_0_3px_rgba(212,162,75,0.3),0_12px_32px_-6px_rgba(212,162,75,0.8)] transition-all px-8 py-[18px] text-[15px]">
          <span>Khai mở thiên cơ</span><span className="text-base">☯</span>
        </button>
      </form>

      <div id="result-anchor" />
      {submitted && resultYear && <MenhResult birthYear={resultYear} />}
    </section>
  );
}
