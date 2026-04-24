// Chuyển đổi dương lịch → âm lịch theo thuật toán của Hồ Ngọc Đức (2004).
// Dùng múi giờ UTC+7 (Việt Nam) để tính ngày.
// Ref: https://www.informatik.uni-leipzig.de/~duc/amlich/

const TIME_ZONE = 7; // UTC+7

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  if (jd < 2299161) {
    jd =
      dd +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      32083;
  }
  return jd;
}

function newMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3;
  Jd1 +=
    0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr =
    306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F =
    21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
    0.0021 * Math.sin(2 * dr * M);
  C1 =
    C1 -
    0.4068 * Math.sin(Mpr * dr) +
    0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 =
    C1 +
    0.0104 * Math.sin(dr * 2 * F) -
    0.0051 * Math.sin(dr * (M + Mpr));
  C1 =
    C1 -
    0.0074 * Math.sin(dr * (M - Mpr)) +
    0.0004 * Math.sin(dr * (2 * F + M));
  C1 =
    C1 -
    0.0004 * Math.sin(dr * (2 * F - M)) -
    0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 =
    C1 +
    0.001 * Math.sin(dr * (2 * F - Mpr)) +
    0.0005 * Math.sin(dr * (M + 2 * Mpr));
  let deltat: number;
  if (T < -11) {
    deltat =
      0.001 +
      0.000839 * T +
      0.0002261 * T2 -
      0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

function sunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M =
    357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
  let DL =
    1.9146 - 0.004817 * T - 0.000014 * T2;
  DL = DL * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M);
  DL = DL + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return Math.floor((L / Math.PI) * 6);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = newMoonDay(k, timeZone);
  const sunLong = sunLongitude(nm, timeZone);
  if (sunLong >= 9) nm = newMoonDay(k - 1, timeZone);
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = sunLongitude(newMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = sunLongitude(newMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
}

export function toLunarDate(dd: number, mm: number, yy: number): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = newMoonDay(k + 1, TIME_ZONE);
  if (monthStart > dayNumber) monthStart = newMoonDay(k, TIME_ZONE);

  let a11 = getLunarMonth11(yy, TIME_ZONE);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, TIME_ZONE);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, TIME_ZONE);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let leapMonth = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapOffset = getLeapMonthOffset(a11, TIME_ZONE);
    const leapMonthNum = leapOffset - 2;
    if (diff >= leapOffset - 1) {
      lunarMonth = diff + 10;
      if (diff === leapOffset - 1) leapMonth = true;
    }
    void leapMonthNum; // used implicitly via leapMonth flag
  }

  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: leapMonth, jd: dayNumber };
}

/** Trả về true nếu ngày dương lịch đã cho là Rằm (15) âm lịch */
export function isRam(date: Date = new Date()): boolean {
  const lunar = toLunarDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
  return lunar.day === 15;
}

/** Trả về true nếu ngày dương lịch đã cho là Mùng 1 âm lịch */
export function isMungMot(date: Date = new Date()): boolean {
  const lunar = toLunarDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
  return lunar.day === 1;
}

/** Trả về true nếu hôm nay là ngày ăn chay (Rằm hoặc Mùng 1) */
export function isFastingDay(date: Date = new Date()): boolean {
  return isRam(date) || isMungMot(date);
}
