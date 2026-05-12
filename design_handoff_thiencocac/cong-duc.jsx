// Công Đức — Hệ thống tích đức & mở khóa tính năng
// Exports to window: CongDucProvider, useCongDuc, CongDucSection, CongDucSidebarWidget, IncenseRitual

const { useState, useEffect, useRef, useCallback, useContext, createContext, useMemo } = React;

// ─────────────────────────────────────────────────────────
// STATE + PERSISTENCE
// ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'tcc.congduc.v1';

const DEFAULT_STATE = {
  balance: 128,                    // số dư công đức
  totalEarned: 340,                // tổng đã kiếm
  streak: 4,                        // chuỗi ngày liên tiếp hiện tại
  longestStreak: 11,               // kỷ lục
  lastCheckIn: null,               // YYYY-MM-DD
  rituals: {                        // hôm nay đã làm chưa
    checkin: false,
    incense: false,
    meditation: false,
    fasting: null                  // 'done' | 'skipped' | null (chỉ active ngày Rằm/Mùng 1)
  },
  log: [                            // lịch sử tích đức gần đây
    { date: '23/04', action: 'Đốt nhang buổi sáng',  amount: 15 },
    { date: '23/04', action: 'Điểm danh',            amount: 10 },
    { date: '22/04', action: 'Niệm kinh 15 phút',    amount: 20 },
    { date: '22/04', action: 'Điểm danh',            amount: 10 },
    { date: '21/04', action: 'Đốt nhang buổi sáng',  amount: 15 },
    { date: '20/04', action: 'Thưởng chuỗi 3 ngày',  amount: 30 },
  ],
  unlocked: {                       // đã mở khóa tính năng nào
    extraChart: false,
    deepLuanGiai: true,
    detailedHours: false,
    weddingDate: false,
    consultVoucher: false,
  }
};

const CongDucContext = createContext(null);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { return DEFAULT_STATE; }
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function CongDucProvider({ children }) {
  const [state, setState] = useState(loadState);
  useEffect(() => saveState(state), [state]);

  const earn = useCallback((amount, action) => {
    setState(s => ({
      ...s,
      balance: s.balance + amount,
      totalEarned: s.totalEarned + amount,
      log: [{ date: formatToday(), action, amount }, ...s.log].slice(0, 30),
    }));
  }, []);

  const spend = useCallback((amount, key) => {
    setState(s => {
      if (s.balance < amount) return s;
      return {
        ...s,
        balance: s.balance - amount,
        unlocked: { ...s.unlocked, [key]: true },
        log: [{ date: formatToday(), action: `Mở khóa: ${UNLOCK_LABEL[key] || key}`, amount: -amount }, ...s.log].slice(0, 30),
      };
    });
  }, []);

  const completeRitual = useCallback((kind, reward, label) => {
    setState(s => ({
      ...s,
      rituals: { ...s.rituals, [kind]: kind === 'fasting' ? 'done' : true },
      balance: s.balance + reward,
      totalEarned: s.totalEarned + reward,
      log: [{ date: formatToday(), action: label, amount: reward }, ...s.log].slice(0, 30),
    }));
  }, []);

  const value = useMemo(() => ({ state, earn, spend, completeRitual, setState }), [state, earn, spend, completeRitual]);
  return <CongDucContext.Provider value={value}>{children}</CongDucContext.Provider>;
}

function useCongDuc() {
  const ctx = useContext(CongDucContext);
  if (!ctx) throw new Error('useCongDuc outside provider');
  return ctx;
}

const UNLOCK_LABEL = {
  extraChart: 'Thêm lá số',
  deepLuanGiai: 'Luận giải vận niên sâu',
  detailedHours: 'Giờ cát hung chi tiết',
  weddingDate: 'Tra ngày tốt sự kiện lớn',
  consultVoucher: 'Voucher tư vấn 1-1',
};

function formatToday() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}

// ─────────────────────────────────────────────────────────
// BELL — Web Audio chuông chùa
// ─────────────────────────────────────────────────────────

function playBell() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;

    // Tạo chuông bằng 3 tần số hài hòa (fundamental + overtones)
    const freqs = [196, 392, 587]; // G3, G4, D5 — âm chuông trầm ấm
    const gains = [0.5, 0.3, 0.15];

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g  = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(gains[i], now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 4);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 4);
    });

    setTimeout(() => ctx.close(), 4500);
  } catch (e) {}
}

Object.assign(window, { CongDucProvider, useCongDuc, playBell });
