export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;

export type Can = (typeof CAN)[number];
export type Chi = (typeof CHI)[number];
export type NguHanhElement = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

// Bảng nạp âm 60 hoa giáp — (năm - 4) mod 60 làm index
const NAP_AM: readonly string[] = [
  'Hải Trung Kim',    'Hải Trung Kim',    // Giáp Tý,   Ất Sửu
  'Lư Trung Hỏa',    'Lư Trung Hỏa',     // Bính Dần,  Đinh Mão
  'Đại Lâm Mộc',     'Đại Lâm Mộc',      // Mậu Thìn,  Kỷ Tỵ
  'Lộ Bàng Thổ',     'Lộ Bàng Thổ',      // Canh Ngọ,  Tân Mùi
  'Kiếm Phong Kim',  'Kiếm Phong Kim',   // Nhâm Thân, Quý Dậu
  'Sơn Đầu Hỏa',     'Sơn Đầu Hỏa',      // Giáp Tuất, Ất Hợi
  'Giản Hạ Thủy',    'Giản Hạ Thủy',     // Bính Tý,   Đinh Sửu
  'Thành Đầu Thổ',   'Thành Đầu Thổ',    // Mậu Dần,   Kỷ Mão
  'Bạch Lạp Kim',    'Bạch Lạp Kim',     // Canh Thìn, Tân Tỵ
  'Dương Liễu Mộc',  'Dương Liễu Mộc',   // Nhâm Ngọ,  Quý Mùi
  'Tuyền Trung Thủy','Tuyền Trung Thủy', // Giáp Thân, Ất Dậu
  'Ốc Thượng Thổ',   'Ốc Thượng Thổ',    // Bính Tuất, Đinh Hợi
  'Tích Lịch Hỏa',   'Tích Lịch Hỏa',    // Mậu Tý,    Kỷ Sửu
  'Tùng Bách Mộc',   'Tùng Bách Mộc',    // Canh Dần,  Tân Mão
  'Trường Lưu Thủy', 'Trường Lưu Thủy',  // Nhâm Thìn, Quý Tỵ
  'Sa Trung Kim',    'Sa Trung Kim',      // Giáp Ngọ,  Ất Mùi
  'Sơn Hạ Hỏa',      'Sơn Hạ Hỏa',       // Bính Thân, Đinh Dậu
  'Bình Địa Mộc',    'Bình Địa Mộc',     // Mậu Tuất,  Kỷ Hợi
  'Bích Thượng Thổ', 'Bích Thượng Thổ',  // Canh Tý,   Tân Sửu
  'Kim Bạch Kim',    'Kim Bạch Kim',      // Nhâm Dần,  Quý Mão
  'Phú Đăng Hỏa',    'Phú Đăng Hỏa',     // Giáp Thìn, Ất Tỵ
  'Thiên Hà Thủy',   'Thiên Hà Thủy',    // Bính Ngọ,  Đinh Mùi
  'Đại Trạch Thổ',   'Đại Trạch Thổ',    // Mậu Thân,  Kỷ Dậu
  'Thoa Xuyến Kim',  'Thoa Xuyến Kim',   // Canh Tuất, Tân Hợi
  'Tang Đố Mộc',     'Tang Đố Mộc',      // Nhâm Tý,   Quý Sửu
  'Đại Khê Thủy',    'Đại Khê Thủy',     // Giáp Dần,  Ất Mão
  'Sa Trung Thổ',    'Sa Trung Thổ',     // Bính Thìn, Đinh Tỵ
  'Thiên Thượng Hỏa','Thiên Thượng Hỏa', // Mậu Ngọ,   Kỷ Mùi
  'Thạch Lựu Mộc',   'Thạch Lựu Mộc',    // Canh Thân, Tân Dậu
  'Đại Hải Thủy',    'Đại Hải Thủy',     // Nhâm Tuất, Quý Hợi
];

// Tương sinh: Kim→Thủy→Mộc→Hỏa→Thổ→Kim
const SINH: Record<NguHanhElement, NguHanhElement> = {
  Kim: 'Thủy', Thủy: 'Mộc', Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim',
};
// Tương khắc: Kim→Mộc→Thổ→Thủy→Hỏa→Kim
const KHAC: Record<NguHanhElement, NguHanhElement> = {
  Kim: 'Mộc', Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim',
};

const DUOC_SINH = Object.fromEntries(
  Object.entries(SINH).map(([k, v]) => [v, k])
) as Record<NguHanhElement, NguHanhElement>;

const BI_KHAC = Object.fromEntries(
  Object.entries(KHAC).map(([k, v]) => [v, k])
) as Record<NguHanhElement, NguHanhElement>;

export interface ElementMeta {
  color: string;
  bg: string;
  symbol: string;
  desc: string;
  luckyColors: string[];
  unluckyColors: string[];
}

export const ELEMENT_META: Record<NguHanhElement, ElementMeta> = {
  Kim: {
    color: '#d4a24b', bg: '#2a1f10', symbol: '金',
    desc: 'Kim loại — cứng cỏi, quyết đoán, tài lộc. Hợp ngành tài chính, cơ khí, kim hoàn.',
    luckyColors: ['Vàng kim', 'Trắng', 'Bạc'],
    unluckyColors: ['Đỏ', 'Hồng', 'Tím'],
  },
  Mộc: {
    color: '#3d7a4e', bg: '#0f1e14', symbol: '木',
    desc: 'Cây cối — sinh sôi, nhân hậu, sáng tạo. Hợp giáo dục, xuất bản, nông nghiệp.',
    luckyColors: ['Xanh lá', 'Xanh đen', 'Đen'],
    unluckyColors: ['Trắng', 'Vàng kim', 'Bạc'],
  },
  Thủy: {
    color: '#2d5a8a', bg: '#0a1624', symbol: '水',
    desc: 'Nước — mềm mại, linh hoạt, trí tuệ. Hợp truyền thông, du lịch, vận tải.',
    luckyColors: ['Đen', 'Xanh dương', 'Trắng'],
    unluckyColors: ['Vàng đất', 'Nâu'],
  },
  Hỏa: {
    color: '#a02828', bg: '#1f0808', symbol: '火',
    desc: 'Lửa — nhiệt huyết, lễ nghi, danh vọng. Hợp nghệ thuật, ẩm thực, điện tử.',
    luckyColors: ['Đỏ', 'Cam', 'Hồng', 'Xanh lá'],
    unluckyColors: ['Đen', 'Xanh dương'],
  },
  Thổ: {
    color: '#8a6a3a', bg: '#1a140a', symbol: '土',
    desc: 'Đất — vững chãi, trung tín, bền bỉ. Hợp bất động sản, xây dựng, nông sản.',
    luckyColors: ['Vàng đất', 'Nâu', 'Đỏ'],
    unluckyColors: ['Xanh lá', 'Xanh đen'],
  },
};

export interface YearAdvice {
  overall: string;
  do: string[];
  avoid: string[];
  luckyMonths: number[];
  direction: string;
}

const YEAR_ADVICE: Record<NguHanhElement, YearAdvice> = {
  Kim: {
    overall: 'Năm tài lộc vững — nên đầu tư dài hạn, ký kết hợp đồng.',
    do: ['Mở rộng kinh doanh quý II', 'Đeo trang sức vàng/bạc', 'Đặt bàn làm việc hướng Tây'],
    avoid: ['Đầu tư mạo hiểm tháng 5', 'Cãi cọ đầu tháng âm'],
    luckyMonths: [2, 7, 10], direction: 'Tây · Tây Bắc',
  },
  Mộc: {
    overall: 'Năm sáng tạo bừng nở — phát triển dự án mới, học thêm.',
    do: ['Khởi sự tháng 3 âm', 'Trồng cây xanh trong nhà', 'Mặc xanh lá vào ngày quan trọng'],
    avoid: ['Chặt cây lớn', 'Quyết định vội tháng 7'],
    luckyMonths: [3, 6, 11], direction: 'Đông · Đông Nam',
  },
  Thủy: {
    overall: 'Năm dòng chảy thuận — giao tiếp, truyền thông, di chuyển đều tốt.',
    do: ['Đặt hồ cá phía Bắc', 'Du lịch xa quý III', 'Mở rộng mối quan hệ'],
    avoid: ['Ký giấy tờ tháng 4', 'Xung đột nơi đông người'],
    luckyMonths: [1, 8, 12], direction: 'Bắc · Đông Bắc',
  },
  Hỏa: {
    overall: 'Năm danh tiếng lên cao — thăng chức, ra mắt, truyền thông thuận lợi.',
    do: ['Ra mắt sản phẩm tháng 5', 'Bàn thờ/đèn phía Nam', 'Giữ lửa bếp ổn định'],
    avoid: ['Đầu tư nước/thủy sản', 'Nóng giận tháng 11'],
    luckyMonths: [4, 5, 9], direction: 'Nam · Đông Nam',
  },
  Thổ: {
    overall: 'Năm vững chãi — củng cố nền tảng, mua nhà, tiết kiệm, hôn sự.',
    do: ['Mua bất động sản quý IV', 'Bày đá phong thủy Đông Bắc', 'Ký hợp đồng dài hạn'],
    avoid: ['Chuyển nhà tháng 2', 'Vay nợ lớn đầu năm'],
    luckyMonths: [6, 9, 12], direction: 'Trung cung · Đông Bắc · Tây Nam',
  },
};

function getNapAmElement(napAm: string): NguHanhElement {
  if (napAm.includes('Kim')) return 'Kim';
  if (napAm.includes('Mộc')) return 'Mộc';
  if (napAm.includes('Thủy')) return 'Thủy';
  if (napAm.includes('Hỏa')) return 'Hỏa';
  return 'Thổ';
}

export interface CanChiResult {
  can: Can;
  chi: Chi;
  full: string;
  idx: number;
}

export function getCanChi(year: number): CanChiResult {
  const idx = ((year - 4) % 60 + 60) % 60;
  return {
    can: CAN[idx % 10],
    chi: CHI[idx % 12],
    full: `${CAN[idx % 10]} ${CHI[idx % 12]}`,
    idx,
  };
}

export interface MenhResult extends CanChiResult {
  napAm: string;
  element: NguHanhElement;
  meta: ElementMeta;
  sinhRa: NguHanhElement;    // mình sinh ra (mình giúp)
  khacDi: NguHanhElement;    // mình khắc
  duocSinh: NguHanhElement;  // quý nhân sinh mình
  biKhac: NguHanhElement;    // bị khắc bởi
}

export function getMenh(year: number): MenhResult {
  const base = getCanChi(year);
  const napAm = NAP_AM[base.idx];
  const element = getNapAmElement(napAm);
  return {
    ...base,
    napAm,
    element,
    meta: ELEMENT_META[element],
    sinhRa: SINH[element],
    khacDi: KHAC[element],
    duocSinh: DUOC_SINH[element],
    biKhac: BI_KHAC[element],
  };
}

export function getYearAdvice(element: NguHanhElement): YearAdvice {
  return YEAR_ADVICE[element];
}
