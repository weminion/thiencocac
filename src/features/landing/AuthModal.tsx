'use client';

import { useState, useEffect } from 'react';

type Tab = 'login' | 'signup';

interface FormState {
  name: string;
  email: string;
  password: string;
  birthYear: string;
  gender: 'nam' | 'nu';
  remember: boolean;
  agree: boolean;
}

const FIELD_LABEL = "text-[11px] tracking-[0.15em] uppercase text-gold font-medium";
const INPUT_WRAP = "flex items-center bg-ink border border-gold/40 transition-colors focus-within:border-gold";
const INPUT_CLS = "flex-1 bg-transparent border-none outline-none text-cream font-sans text-[15px] px-3.5 py-3 w-full placeholder:text-cream-dim/70";
const GLYPH_CLS = "px-3.5 font-brush text-gold text-lg min-w-[44px] text-center border-r border-gold/20 self-stretch flex items-center justify-center";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '', birthYear: '', gender: 'nam', remember: true, agree: false });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(p => ({ ...p, [k]: v }));
  const isLogin = tab === 'login';

  return (
    <div className="fixed inset-0 z-[200] bg-ink/75 backdrop-blur-[10px] flex items-center justify-center p-3 md:p-6 animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-[980px] max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gradient-to-br from-ink-2 to-ink-3 border border-gold shadow-[0_0_0_1px_rgba(212,162,75,0.2),0_40px_80px_-20px_rgba(0,0,0,0.8)] animate-pop-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-ink text-cream-dim border border-gold/40 hover:border-gold hover:text-gold-bright text-sm transition-colors">✕</button>

        {/* Corner accents */}
        <span className="absolute top-2.5 left-2.5 w-6 h-6 border-t border-l border-gold z-20 pointer-events-none" />
        <span className="absolute top-2.5 right-2.5 w-6 h-6 border-t border-r border-gold z-20 pointer-events-none" />
        <span className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b border-l border-gold z-20 pointer-events-none" />
        <span className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b border-r border-gold z-20 pointer-events-none" />

        <div className="grid md:grid-cols-[0.85fr_1fr] flex-1 min-h-0 overflow-hidden">
          {/* Aside */}
          <aside className="hidden md:block relative border-r border-gold/20 overflow-y-auto bg-gradient-to-br from-ink to-ink-2">
            <div className="relative z-10 p-14 px-11 flex flex-col gap-5 h-full">
              <div className="inline-flex gap-1.5">
                {['天', '機', '閣'].map(c => (
                  <span key={c} className="w-10 h-10 inline-flex items-center justify-center border border-gold/40 font-brush text-gold text-[22px] bg-ink">{c}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold font-medium">
                <span className="w-7 h-px bg-gold" />Thiên Cơ Các<span className="w-7 h-px bg-gold" />
              </div>
              <h3 className="font-serif text-[34px] leading-[1.15] font-medium text-cream tracking-tight">
                Mở cửa <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">thư phòng</span> của riêng bạn
              </h3>
              <p className="text-cream-dim text-[15px] leading-[1.65]">
                Lưu lá số, theo dõi vận niên, nhận nhắc giờ tốt mỗi ngày — tất cả đồng bộ ngay trong tài khoản của bạn.
              </p>
              <ul className="list-none flex flex-col gap-2.5 pt-5 border-t border-gold/20 mt-2">
                {['Lưu lá số tử vi trọn đời', 'Thông báo ngày tốt hàng tuần', 'Ưu đãi riêng cho hội viên', 'Lịch sử thỉnh giáo chuyên gia'].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-cream text-sm"><span className="text-gold text-[10px]">◆</span>{t}</li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-3.5 text-cream-dim font-serif text-[15px] pt-6 border-t border-gold/20">
                <span className="font-brush text-gold text-[28px] border border-gold/40 w-11 h-11 inline-flex items-center justify-center flex-shrink-0">占</span>
                <em>"Biết mình biết vận, trăm sự hanh thông."</em>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="p-6 md:p-10 md:px-12 overflow-y-auto min-h-0 flex flex-col gap-5">
            {/* Tab switcher */}
            <div className="relative grid grid-cols-2 border border-gold/40 bg-ink">
              <div
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-gold-bright to-gold transition-transform duration-300 z-[1]"
                style={{ transform: `translateX(${isLogin ? '0%' : '100%'})` }}
              />
              {(['login', 'signup'] as const).map(v => (
                <button key={v} onClick={() => setTab(v)}
                  className={`relative z-[2] py-3.5 font-serif text-base font-medium tracking-wide transition-colors ${tab === v ? 'text-ink' : 'text-cream-dim'}`}>
                  {v === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </button>
              ))}
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-cream mb-2 tracking-tight">
                {isLogin ? 'Thỉnh giáo lần nữa' : 'Khai mở tài khoản mới'}
              </h2>
              <p className="text-cream-dim text-[14.5px] leading-[1.6]">
                {isLogin ? 'Nhập thông tin để quay lại thư phòng của bạn.' : 'Nhập vài thông tin cơ bản để Thiên Cơ Các an bài lá số cho bạn.'}
              </p>
            </div>

            <form onSubmit={e => { e.preventDefault(); }} className="flex flex-col gap-4">
              {!isLogin && (
                <label className="flex flex-col gap-1.5">
                  <span className={FIELD_LABEL}>Tên của bạn</span>
                  <div className={INPUT_WRAP}>
                    <span className={GLYPH_CLS}>名</span>
                    <input className={INPUT_CLS} type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                </label>
              )}
              <label className="flex flex-col gap-1.5">
                <span className={FIELD_LABEL}>Email hoặc số điện thoại</span>
                <div className={INPUT_WRAP}>
                  <span className={GLYPH_CLS}>@</span>
                  <input className={INPUT_CLS} type="text" value={form.email} onChange={e => update('email', e.target.value)} placeholder="ban@thiencoca.vn" required />
                </div>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={FIELD_LABEL}>Mật khẩu</span>
                <div className={INPUT_WRAP}>
                  <span className={GLYPH_CLS}>鎖</span>
                  <input className={INPUT_CLS} type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder={isLogin ? 'Nhập mật khẩu' : 'Ít nhất 8 ký tự'} minLength={isLogin ? undefined : 8} required />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="bg-none border-none cursor-pointer text-cream-dim hover:text-gold-bright px-3.5 text-lg transition-colors">
                    {showPass ? '◎' : '◉'}
                  </button>
                </div>
              </label>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3.5">
                  <label className="flex flex-col gap-1.5">
                    <span className={FIELD_LABEL}>Năm sinh</span>
                    <div className={INPUT_WRAP}>
                      <span className={GLYPH_CLS}>歲</span>
                      <input className={INPUT_CLS} type="number" min="1900" max="2100" value={form.birthYear} onChange={e => update('birthYear', e.target.value)} placeholder="1992" />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={FIELD_LABEL}>Giới tính</span>
                    <div className="flex bg-ink border border-gold/40 overflow-hidden h-full">
                      {(['nam', 'nu'] as const).map(v => (
                        <button key={v} type="button" onClick={() => update('gender', v)}
                          className={`flex-1 py-[11px] font-serif text-[15px] transition-all ${form.gender === v ? 'bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold' : 'text-cream-dim'}`}>
                          {v === 'nam' ? 'Nam' : 'Nữ'}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              )}

              <div className="flex justify-between items-center gap-3 text-[13px] text-cream-dim flex-wrap">
                {isLogin ? (
                  <>
                    <label className="inline-flex items-center gap-2.5 cursor-pointer">
                      <span className={`w-4 h-4 border border-gold/40 bg-ink inline-flex items-center justify-center flex-shrink-0 ${form.remember ? 'bg-gradient-to-br from-gold-bright to-gold border-gold' : ''}`} onClick={() => update('remember', !form.remember)} />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <a className="text-gold-bright cursor-pointer font-medium border-b border-transparent hover:border-gold-bright transition-colors">Quên mật khẩu?</a>
                  </>
                ) : (
                  <label className="inline-flex items-center gap-2.5 cursor-pointer">
                    <span className={`w-4 h-4 border border-gold/40 bg-ink inline-flex items-center justify-center flex-shrink-0 ${form.agree ? 'bg-gradient-to-br from-gold-bright to-gold border-gold' : ''}`} onClick={() => update('agree', !form.agree)} />
                    <span>Tôi đồng ý với <a className="text-gold-bright cursor-pointer font-medium">Điều khoản</a> và <a className="text-gold-bright cursor-pointer font-medium">Chính sách bảo mật</a></span>
                  </label>
                )}
              </div>

              <button type="submit" className="w-full inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold shadow-[0_8px_24px_-8px_rgba(212,162,75,0.6)] hover:-translate-y-px transition-all px-8 py-[18px] text-[15px] mt-1">
                <span>{isLogin ? 'Thỉnh vào thư phòng' : 'Khai mở tài khoản'}</span><span className="text-base">☯</span>
              </button>
            </form>

            <div className="flex items-center gap-3 text-cream-dim text-xs tracking-[0.15em] uppercase before:content-[''] before:flex-1 before:h-px before:bg-gold/20 after:content-[''] after:flex-1 after:h-px after:bg-gold/20">
              <span>hoặc tiếp tục với</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {['Google', 'Facebook', 'Zalo'].map(s => (
                <button key={s} className="inline-flex items-center justify-center gap-2 py-3 px-3.5 bg-ink text-cream border border-gold/40 text-[13px] font-medium cursor-pointer hover:border-gold hover:text-gold-bright transition-all">
                  {s}
                </button>
              ))}
            </div>

            <div className="text-center text-[13px] text-cream-dim pt-3 border-t border-gold/20">
              {isLogin
                ? <><span>Chưa có tài khoản? </span><a onClick={() => setTab('signup')} className="text-gold-bright cursor-pointer font-medium">Khai mở ngay</a></>
                : <><span>Đã có tài khoản? </span><a onClick={() => setTab('login')} className="text-gold-bright cursor-pointer font-medium">Thỉnh vào lại</a></>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
