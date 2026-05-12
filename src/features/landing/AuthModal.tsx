'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createClient } from '@/lib/supabase/client';

type Tab = 'login' | 'signup';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  birthYear: string;
  gender: 0 | 1;
  agree: boolean;
}

const loginSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
  remember: yup.boolean().default(true),
});

const signupSchema = yup.object({
  name: yup.string().min(2, 'Tên phải có ít nhất 2 ký tự').required('Vui lòng nhập tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
  birthYear: yup
    .string()
    .matches(/^\d{4}$/, 'Năm sinh phải là 4 chữ số')
    .test('range', 'Năm sinh từ 1900 đến 2025', v => !v || (Number(v) >= 1900 && Number(v) <= 2025))
    .optional()
    .default(''),
  gender: yup.mixed<0 | 1>().oneOf([0, 1]).default(0),
  agree: yup.boolean().oneOf([true], 'Vui lòng đồng ý với Điều khoản và Chính sách bảo mật').required(),
});

const FIELD_LABEL = "text-[11px] tracking-[0.15em] uppercase text-gold font-medium";
const INPUT_WRAP = "flex items-center bg-ink border border-gold/40 transition-colors focus-within:border-gold";
const INPUT_CLS = "flex-1 bg-transparent border-none outline-none text-cream font-sans text-[15px] px-3.5 py-3 w-full placeholder:text-cream-dim/70";
const GLYPH_CLS = "px-3.5 font-brush text-gold text-lg min-w-[44px] text-center border-r border-gold/20 self-stretch flex items-center justify-center";
const ERROR_CLS = "text-[12px] text-red-400 mt-1";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  const loginForm = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  });

  const signupForm = useForm<SignupForm>({
    resolver: yupResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', birthYear: '', gender: 0, agree: false },
  });

  const isLogin = tab === 'login';
  const { register: loginReg, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }, control: loginControl } = loginForm;
  const { register: signupReg, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors }, setValue: signupSet, control: signupControl, reset: resetSignup } = signupForm;

  const gender = useWatch({ control: signupControl, name: 'gender' });
  const agree = useWatch({ control: signupControl, name: 'agree' });
  const remember = useWatch({ control: loginControl, name: 'remember' });

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

  function switchTab(t: Tab) {
    setTab(t);
    setServerError('');
    setSuccess('');
  }

  async function onLogin(data: LoginForm) {
    setServerError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      router.push('/dashboard');
      router.refresh();
      onClose();
    } catch (err: unknown) {
      setServerError(translateError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra.'));
    } finally {
      setLoading(false);
    }
  }

  async function onSignup(data: SignupForm) {
    setServerError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            birth_year: data.birthYear,
            gender: data.gender,
          },
        },
      });
      if (error) throw error;
      setSuccess('Tài khoản đã được tạo! Vui lòng kiểm tra email để xác nhận.');
      resetSignup();
    } catch (err: unknown) {
      setServerError(translateError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setServerError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setServerError(translateError(error.message));
  }

  return (
    <div
      className="fixed inset-0 z-[200] bg-ink/75 backdrop-blur-[10px] flex items-center justify-center p-3 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[980px] max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gradient-to-br from-ink-2 to-ink-3 border border-gold shadow-[0_0_0_1px_rgba(212,162,75,0.2),0_40px_80px_-20px_rgba(0,0,0,0.8)] animate-pop-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-ink text-cream-dim border border-gold/40 hover:border-gold hover:text-gold-bright text-sm transition-colors"
        >
          ✕
        </button>

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
                  <span
                    key={c}
                    className="w-10 h-10 inline-flex items-center justify-center border border-gold/40 font-brush text-gold text-[22px] bg-ink"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold font-medium">
                <span className="w-7 h-px bg-gold" />Thiên Cơ Các<span className="w-7 h-px bg-gold" />
              </div>
              <h3 className="font-serif text-[34px] leading-[1.15] font-medium text-cream tracking-tight">
                Mở cửa{' '}
                <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">
                  thư phòng
                </span>{' '}
                của riêng bạn
              </h3>
              <p className="text-cream-dim text-[15px] leading-[1.65]">
                Lưu lá số, theo dõi vận niên, nhận nhắc giờ tốt mỗi ngày — tất cả đồng bộ ngay trong tài khoản của bạn.
              </p>
              <ul className="list-none flex flex-col gap-2.5 pt-5 border-t border-gold/20 mt-2">
                {[
                  'Lưu lá số tử vi trọn đời',
                  'Thông báo ngày tốt hàng tuần',
                  'Ưu đãi riêng cho hội viên',
                  'Lịch sử thỉnh giáo chuyên gia',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-cream text-sm">
                    <span className="text-gold text-[10px]">◆</span>{t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-3.5 text-cream-dim font-serif text-[15px] pt-6 border-t border-gold/20">
                <span className="font-brush text-gold text-[28px] border border-gold/40 w-11 h-11 inline-flex items-center justify-center flex-shrink-0">
                  占
                </span>
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
                <button
                  key={v}
                  onClick={() => switchTab(v)}
                  className={`relative z-[2] py-3.5 font-serif text-base font-medium tracking-wide transition-colors ${tab === v ? 'text-ink' : 'text-cream-dim'}`}
                >
                  {v === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </button>
              ))}
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-cream mb-2 tracking-tight">
                {isLogin ? 'Thỉnh giáo lần nữa' : 'Khai mở tài khoản mới'}
              </h2>
              <p className="text-cream-dim text-[14.5px] leading-[1.6]">
                {isLogin
                  ? 'Nhập thông tin để quay lại thư phòng của bạn.'
                  : 'Nhập vài thông tin cơ bản để Thiên Cơ Các an bài lá số cho bạn.'}
              </p>
            </div>

            {serverError && (
              <div
                className="px-4 py-3 text-sm border"
                style={{ background: 'rgba(200,80,80,0.1)', borderColor: 'rgba(200,80,80,0.4)', color: '#e88' }}
              >
                {serverError}
              </div>
            )}
            {success && (
              <div
                className="px-4 py-3 text-sm border"
                style={{ background: 'rgba(80,160,80,0.1)', borderColor: 'rgba(80,160,80,0.4)', color: '#8d8' }}
              >
                {success}
              </div>
            )}

            {isLogin ? (
              <form onSubmit={handleLoginSubmit(onLogin)} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={FIELD_LABEL}>Email</span>
                  <div className={INPUT_WRAP}>
                    <span className={GLYPH_CLS}>@</span>
                    <input
                      {...loginReg('email')}
                      className={INPUT_CLS}
                      type="email"
                      placeholder="ban@thiencoca.vn"
                    />
                  </div>
                  {loginErrors.email && <p className={ERROR_CLS}>{loginErrors.email.message}</p>}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={FIELD_LABEL}>Mật khẩu</span>
                  <div className={INPUT_WRAP}>
                    <span className={GLYPH_CLS}>鎖</span>
                    <input
                      {...loginReg('password')}
                      className={INPUT_CLS}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="bg-none border-none cursor-pointer text-cream-dim hover:text-gold-bright px-3.5 text-lg transition-colors"
                    >
                      {showPass ? '◎' : '◉'}
                    </button>
                  </div>
                  {loginErrors.password && <p className={ERROR_CLS}>{loginErrors.password.message}</p>}
                </label>

                <div className="flex justify-between items-center gap-3 text-[13px] text-cream-dim flex-wrap">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer">
                    <span
                      className={`w-4 h-4 border border-gold/40 bg-ink inline-flex items-center justify-center flex-shrink-0 ${remember ? 'bg-gradient-to-br from-gold-bright to-gold border-gold' : ''}`}
                      onClick={() => loginForm.setValue('remember', !remember, { shouldValidate: true })}
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <a className="text-gold-bright cursor-pointer font-medium border-b border-transparent hover:border-gold-bright transition-colors">
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold shadow-[0_8px_24px_-8px_rgba(212,162,75,0.6)] hover:-translate-y-px transition-all px-8 py-[18px] text-[15px] mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {loading ? <span>Đang xử lý…</span> : <><span>Thỉnh vào thư phòng</span><span className="text-base">☯</span></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit(onSignup)} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={FIELD_LABEL}>Tên của bạn</span>
                  <div className={INPUT_WRAP}>
                    <span className={GLYPH_CLS}>名</span>
                    <input
                      {...signupReg('name')}
                      className={INPUT_CLS}
                      type="text"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  {signupErrors.name && <p className={ERROR_CLS}>{signupErrors.name.message}</p>}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={FIELD_LABEL}>Email</span>
                  <div className={INPUT_WRAP}>
                    <span className={GLYPH_CLS}>@</span>
                    <input
                      {...signupReg('email')}
                      className={INPUT_CLS}
                      type="email"
                      placeholder="ban@thiencoca.vn"
                    />
                  </div>
                  {signupErrors.email && <p className={ERROR_CLS}>{signupErrors.email.message}</p>}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={FIELD_LABEL}>Mật khẩu</span>
                  <div className={INPUT_WRAP}>
                    <span className={GLYPH_CLS}>鎖</span>
                    <input
                      {...signupReg('password')}
                      className={INPUT_CLS}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Ít nhất 6 ký tự"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="bg-none border-none cursor-pointer text-cream-dim hover:text-gold-bright px-3.5 text-lg transition-colors"
                    >
                      {showPass ? '◎' : '◉'}
                    </button>
                  </div>
                  {signupErrors.password && <p className={ERROR_CLS}>{signupErrors.password.message}</p>}
                </label>

                <div className="grid grid-cols-2 gap-3.5">
                  <label className="flex flex-col gap-1.5">
                    <span className={FIELD_LABEL}>Năm sinh</span>
                    <div className={INPUT_WRAP}>
                      <span className={GLYPH_CLS}>歲</span>
                      <input
                        {...signupReg('birthYear')}
                        className={INPUT_CLS}
                        type="number"
                        min="1900"
                        max="2025"
                        placeholder="1992"
                      />
                    </div>
                    {signupErrors.birthYear && <p className={ERROR_CLS}>{signupErrors.birthYear.message}</p>}
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={FIELD_LABEL}>Giới tính</span>
                    <div className="flex bg-ink border border-gold/40 overflow-hidden h-full">
                      {([0, 1] as const).map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => signupSet('gender', v)}
                          className={`flex-1 py-[11px] font-serif text-[15px] transition-all ${gender === v ? 'bg-gradient-to-br from-gold-bright to-gold text-ink font-semibold' : 'text-cream-dim'}`}
                        >
                          {v === 0 ? 'Nam' : 'Nữ'}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>

                <label className="inline-flex items-center gap-2.5 cursor-pointer text-[13px] text-cream-dim">
                  <span
                    className={`w-4 h-4 border border-gold/40 bg-ink inline-flex items-center justify-center flex-shrink-0 ${agree ? 'bg-gradient-to-br from-gold-bright to-gold border-gold' : ''}`}
                    onClick={() => signupSet('agree', !agree)}
                  />
                  <span>
                    Tôi đồng ý với{' '}
                    <a className="text-gold-bright cursor-pointer font-medium">Điều khoản</a> và{' '}
                    <a className="text-gold-bright cursor-pointer font-medium">Chính sách bảo mật</a>
                  </span>
                </label>
                {signupErrors.agree && <p className={ERROR_CLS}>{signupErrors.agree.message}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-wide rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink border border-gold shadow-[0_8px_24px_-8px_rgba(212,162,75,0.6)] hover:-translate-y-px transition-all px-8 py-[18px] text-[15px] mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {loading ? <span>Đang xử lý…</span> : <><span>Khai mở tài khoản</span><span className="text-base">☯</span></>}
                </button>
              </form>
            )}

            <div className="flex items-center gap-3 text-cream-dim text-xs tracking-[0.15em] uppercase before:content-[''] before:flex-1 before:h-px before:bg-gold/20 after:content-[''] after:flex-1 after:h-px after:bg-gold/20">
              <span>hoặc tiếp tục với</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={handleGoogle}
                className="inline-flex items-center justify-center gap-2 py-3 px-3.5 bg-ink text-cream border border-gold/40 text-[13px] font-medium cursor-pointer hover:border-gold hover:text-gold-bright transition-all"
              >
                Google
              </button>
              {['Facebook', 'Zalo'].map(s => (
                <button
                  key={s}
                  title="Sắp ra mắt"
                  disabled
                  className="inline-flex items-center justify-center gap-2 py-3 px-3.5 bg-ink text-cream-dim border border-gold/20 text-[13px] font-medium cursor-not-allowed opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="text-center text-[13px] text-cream-dim pt-3 border-t border-gold/20">
              {isLogin ? (
                <>
                  <span>Chưa có tài khoản? </span>
                  <a onClick={() => switchTab('signup')} className="text-gold-bright cursor-pointer font-medium">
                    Khai mở ngay
                  </a>
                </>
              ) : (
                <>
                  <span>Đã có tài khoản? </span>
                  <a onClick={() => switchTab('login')} className="text-gold-bright cursor-pointer font-medium">
                    Thỉnh vào lại
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email hoặc mật khẩu không đúng.';
  if (msg.includes('Email not confirmed')) return 'Vui lòng xác nhận email trước khi đăng nhập.';
  if (msg.includes('User already registered')) return 'Email này đã được đăng ký.';
  if (msg.includes('Password should be at least')) return 'Mật khẩu phải có ít nhất 6 ký tự.';
  if (msg.includes('rate limit')) return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
  return msg;
}
