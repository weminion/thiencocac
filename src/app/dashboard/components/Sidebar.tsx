'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import MeritSidebarWidget from './MeritSidebarWidget';

const NAV_ITEMS = [
  { href: '/dashboard',         glyph: '☯', label: 'Thư Phòng' },
  { href: '/dashboard/charts',  glyph: '命', label: 'Lá Số' },
  { href: '/dashboard/today',   glyph: '日', label: 'Hôm Nay' },
  { href: '/dashboard/merit',   glyph: '功', label: 'Công Đức' },
  { href: '/dashboard/almanac', glyph: '曆', label: 'Vận Niên' },
  { href: '/dashboard/history', glyph: '跡', label: 'Lịch Sử' },
  { href: '/dashboard/notes',   glyph: '書', label: 'Ghi Chú' },
  { href: '/dashboard/expert',  glyph: '師', label: 'Chuyên Gia' },
];

interface Props {
  mobileOpen?: boolean;
  onClose?: () => void;
  meritBalance?: number;
  meritStreak?: number;
}

export default function Sidebar({ mobileOpen = false, onClose, meritBalance = 0, meritStreak = 0 }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-[260px] z-40 flex flex-col',
          'transition-transform duration-300',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{
          background: 'var(--color-ink-2)',
          borderRight: '1px solid rgba(212,162,75,0.15)',
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-5 py-5 border-b"
          style={{ borderColor: 'rgba(212,162,75,0.15)' }}
        >
          <span
            className="text-2xl"
            style={{ fontFamily: 'var(--font-brush)', color: 'var(--color-gold)' }}
          >
            天機閣
          </span>
          <span
            className="text-sm"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-dim)' }}
          >
            Thiên Cơ Các
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ href, glyph, label }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg mb-0.5 transition-all duration-200"
                style={{
                  background: active ? 'rgba(212,162,75,0.15)' : 'transparent',
                  color: active ? 'var(--color-gold)' : 'var(--color-cream-dim)',
                  borderLeft: active ? '2px solid var(--color-gold)' : '2px solid transparent',
                }}
              >
                <span className="text-lg w-6 text-center leading-none">{glyph}</span>
                <span className="text-sm" style={{ fontFamily: 'var(--font-sans)' }}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Merit widget */}
        <MeritSidebarWidget balance={meritBalance} streak={meritStreak} />

        {/* Upgrade card */}
        <div
          className="mx-3 mb-3 rounded-xl p-3 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(160,40,40,0.3), rgba(106,24,24,0.3))', border: '1px solid rgba(160,40,40,0.4)' }}
        >
          <div className="text-xs mb-1" style={{ color: 'var(--color-cream-dim)' }}>Mở khóa đầy đủ</div>
          <button
            className="text-sm px-4 py-1.5 rounded-lg w-full transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-gold)', color: 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
          >
            Nâng cấp
          </button>
        </div>

        {/* User profile */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-t"
          style={{ borderColor: 'rgba(212,162,75,0.15)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}
          >
            U
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm truncate" style={{ color: 'var(--color-cream)' }}>Người dùng</div>
            <div className="text-xs truncate" style={{ color: 'var(--color-cream-dim)' }}>Thành viên</div>
          </div>
        </div>
      </aside>
    </>
  );
}
