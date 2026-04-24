export type RitualKind = 'checkin' | 'incense' | 'meditation' | 'fasting';

export type FastingState = 'done' | 'skipped' | null;

export interface RitualState {
  checkin: boolean;
  incense: boolean;
  meditation: boolean;
  /** null = không áp dụng hôm nay; 'done'/'skipped' = đã xử lý */
  fasting: FastingState;
}

export interface UnlockedFeatures {
  extraChart: boolean;
  deepLuanGiai: boolean;
  detailedHours: boolean;
  weddingDate: boolean;
  consultVoucher: boolean;
}

export interface CongDucLogEntry {
  date: string;   // 'DD/MM'
  action: string;
  amount: number; // âm = đã tiêu, dương = đã kiếm
}

export interface CongDucState {
  balance: number;
  totalEarned: number;
  streak: number;
  longestStreak: number;
  lastCheckIn: string | null; // 'YYYY-MM-DD'
  rituals: RitualState;
  log: CongDucLogEntry[];
  unlocked: UnlockedFeatures;
}

export const UNLOCK_LABEL: Record<keyof UnlockedFeatures, string> = {
  extraChart: 'Thêm lá số',
  deepLuanGiai: 'Luận giải vận niên sâu',
  detailedHours: 'Giờ cát hung chi tiết',
  weddingDate: 'Tra ngày tốt sự kiện lớn',
  consultVoucher: 'Voucher tư vấn 1-1',
};

export const UNLOCK_COST: Record<keyof UnlockedFeatures, number> = {
  extraChart: 50,
  deepLuanGiai: 80,
  detailedHours: 60,
  weddingDate: 120,
  consultVoucher: 200,
};

export const DEFAULT_CONG_DUC_STATE: CongDucState = {
  balance: 0,
  totalEarned: 0,
  streak: 0,
  longestStreak: 0,
  lastCheckIn: null,
  rituals: {
    checkin: false,
    incense: false,
    meditation: false,
    fasting: null,
  },
  log: [],
  unlocked: {
    extraChart: false,
    deepLuanGiai: false,
    detailedHours: false,
    weddingDate: false,
    consultVoucher: false,
  },
};
