'use client';

import { useState } from 'react';
import Image from 'next/image';

const LINKS: [string, string][] = [
  ['#services', 'Dịch vụ'],
  ['#tool', 'Tra mệnh'],
  ['#blog', 'Thư phòng'],
  ['#', 'Về Thiên Cơ Các'],
];

export default function Nav({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-ink/80 border-b border-gold/20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 md:py-[18px] flex items-center justify-between gap-4 md:gap-8">
        <a href="/" className="flex items-center gap-2 md:gap-3 font-serif text-[18px] md:text-[22px] font-semibold text-cream tracking-wide cursor-pointer">
          <Image src="/logo.jpg" alt="Thiên Cơ Các" width={38} height={38} className="w-8 h-8 md:w-[38px] md:h-[38px] rounded-full object-cover" />
          <span className="hidden sm:inline">Thiên Cơ Các</span>
        </a>

        <div className="hidden md:flex gap-8">
          {LINKS.map(([href, label]) => (
            <a key={label} href={href} className="text-cream-dim text-sm font-medium tracking-wider hover:text-gold-bright transition-colors cursor-pointer">
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex gap-2.5">
          <button onClick={onOpenAuth} className="inline-flex items-center gap-2.5 font-sans font-medium tracking-wide rounded-sm transition-all duration-200 text-cream border border-gold/40 hover:border-gold hover:text-gold-bright px-4 py-2 text-[13px]">
            Đăng nhập
          </button>
          <button onClick={onOpenAuth} className="inline-flex items-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm transition-all duration-200 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold hover:-translate-y-px hover:shadow-[0_0_0_3px_rgba(212,162,75,0.3),0_12px_32px_-6px_rgba(212,162,75,0.8)] shadow-[0_8px_24px_-8px_rgba(212,162,75,0.6)] px-4 py-2 text-[13px]">
            Thỉnh giáo
          </button>
        </div>

        <div className="flex md:hidden gap-2 items-center">
          <button onClick={onOpenAuth} className="inline-flex items-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold px-3 py-2 text-[12px]">
            Thỉnh giáo
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold-bright">
            <span className="font-brush text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gold/20 bg-ink/95 backdrop-blur-xl">
          <div className="flex flex-col">
            {LINKS.map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="px-5 py-4 border-b border-gold/10 text-cream text-[15px] font-medium hover:bg-ink-2">
                {label}
              </a>
            ))}
            <button onClick={() => { setMenuOpen(false); onOpenAuth(); }} className="px-5 py-4 text-left text-gold-bright font-medium">
              Đăng nhập →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
