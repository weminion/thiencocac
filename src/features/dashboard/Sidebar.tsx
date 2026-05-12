'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const NAV_ICONS: Record<string, string> = {
  home:      'M12 2.5l9 7.5v10.5a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V10l9-7.5z',
  congduc:   'M12 3l2.6 5.6L20.5 9.5l-4.3 4 1 5.9L12 16.6l-5.2 2.8 1-5.9-4.3-4 5.9-.9L12 3z',
  quedich:   'M5 3h11l3 3v15H5V3zm3 6h8M8 13h8M8 17h5',
  luanhoi:   'M21 12a9 9 0 11-3.3-6.9M21 4v5h-5',
  niemphat:  'M12 3a4 4 0 014 4c0 1.6-1 3-2 3.5 2 1 4 3.5 4 6.5v4H6v-4c0-3 2-5.5 4-6.5-1-.5-2-1.9-2-3.5a4 4 0 014-4z',
  thien:     'M12 14c-3 0-5-2-5-4s2-4 5-4 5 2 5 4-2 4-5 4zm-7 5c2-2 4-3 7-3s5 1 7 3M9 8c1-1 2-1.5 3-1.5s2 .5 3 1.5',
  tungkinh:  'M3 5h7a4 4 0 014 4v11H7a4 4 0 01-4-4V5zm18 0h-7a4 4 0 00-4 4v11h7a4 4 0 004-4V5z',
  nguoithan: 'M12 21s-7-4.5-7-10a4 4 0 017-2.7A4 4 0 0119 11c0 5.5-7 10-7 10z',
  lixi:      'M3 8h18v3H3V8zm1 3h16v10H4V11zm8-3V5a2 2 0 114 0 2 2 0 01-2 3M12 8V5a2 2 0 10-4 0 2 2 0 002 3M12 8v13',
};

function NavIcon({ id, className, style }: { id: string; className?: string; style?: React.CSSProperties }) {
  const d = NAV_ICONS[id];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d={d} />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: '/dashboard',           id: 'home',      label: 'Tịnh phòng' },
  { href: '/dashboard/congduc',   id: 'congduc',   label: 'Công Đức' },
  { href: '/dashboard/quedich',   id: 'quedich',   label: 'Xăm Quan Âm' },
  { href: '/dashboard/luanhoi',   id: 'luanhoi',   label: 'Luân hồi nhân quả' },
  { href: '/dashboard/niemphat',  id: 'niemphat',  label: 'Niệm Phật' },
  { href: '/dashboard/thien',     id: 'thien',     label: 'Thiền quán' },
  { href: '/dashboard/tungkinh',  id: 'tungkinh',  label: 'Tụng kinh' },
  { href: '/dashboard/nguoithan', id: 'nguoithan', label: 'Người thân' },
  { href: '/dashboard/lixi',      id: 'lixi',      label: 'Lì xì xuân' },
];

interface Props {
  mobileOpen?: boolean;
  onClose?: () => void;
  userName?: string;
  userId?: string;
}

export default function Sidebar({ mobileOpen = false, onClose, userName = 'Khách', userId }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col',
          'lg:sticky lg:z-0 lg:translate-x-0',
          'transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{
          background: 'var(--color-ink-2)',
          borderRight: '1px solid rgba(212,162,75,0.2)',
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-5 border-b"
          style={{ borderColor: 'rgba(212,162,75,0.2)' }}
          onClick={onClose}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border"
            style={{ background: 'rgba(212,162,75,0.15)', borderColor: 'rgba(212,162,75,0.4)' }}
          >
            <span className="font-brush text-base" style={{ color: 'var(--color-gold)' }}>T</span>
          </div>
          <div>
            <div className="font-serif text-[17px] font-semibold leading-tight" style={{ color: 'var(--color-cream)' }}>Thiên Cơ Các</div>
            <div className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: 'var(--color-gold)' }}>Tịnh phòng</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, id, label }) => {
            const active = href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium transition-all"
                style={{
                  background: active ? 'linear-gradient(to right, rgba(212,162,75,0.2), transparent)' : 'transparent',
                  color: active ? 'var(--color-gold-bright)' : 'var(--color-cream-dim)',
                  borderLeft: active ? '2px solid var(--color-gold)' : '2px solid transparent',
                }}
              >
                <NavIcon
                  id={id}
                  className="w-5 h-5 shrink-0"
                  style={{ color: active ? 'var(--color-gold)' : 'rgba(212,162,75,0.6)' } as React.CSSProperties}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(212,162,75,0.2)' }}>
          <div
            className="p-4 relative"
            style={{
              background: 'linear-gradient(135deg, var(--color-ink-3), var(--color-ink))',
              border: '1px solid rgba(212,162,75,0.4)',
            }}
          >
            <span className="absolute -top-px -left-px w-3 h-3 border-t border-l" style={{ borderColor: 'var(--color-gold)' }} />
            <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r" style={{ borderColor: 'var(--color-gold)' }} />
            <div className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: 'var(--color-gold)' }}>Hội viên</div>
            <div className="font-serif text-[15px] mb-2" style={{ color: 'var(--color-cream)' }}>Nâng cấp Thượng khách</div>
            <div className="text-xs leading-snug mb-3" style={{ color: 'var(--color-cream-dim)' }}>
              Tụng kinh âm thanh · Nhắc nhở hàng ngày · Ưu đãi tư vấn 1-1
            </div>
            <button
              className="w-full py-2 text-xs font-semibold tracking-wider uppercase"
              style={{ background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))', color: 'var(--color-ink)' }}
            >
              Khai mở
            </button>
          </div>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 p-4 border-t" style={{ borderColor: 'rgba(212,162,75,0.2)' }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-brush text-base flex-shrink-0 uppercase"
            style={{ background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold-deep))', color: 'var(--color-ink)' }}
          >
            {userName.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--color-cream)' }}>{userName}</div>
            <div className="text-[11px]" style={{ color: 'var(--color-cream-dim)' }}>Thiện căn</div>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:text-gold-bright flex-shrink-0"
            style={{ color: 'var(--color-cream-dim)' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M10 3h4v10h-4M7 10l3-3-3-3M10 7H2" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
