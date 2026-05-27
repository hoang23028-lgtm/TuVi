/**
 * Âm lịch Việt Nam — chuyển đổi dương ↔ âm
 * Dùng @baostudio/viet-lunar (UTC+7, khớp Tết & tháng nhuận VN)
 */
import {
  solarToLunar as vnSolarToLunar,
  lunarToSolar as vnLunarToSolar,
  getLeapMonth,
} from '@baostudio/viet-lunar';
import { getCanChiYear } from './canChi';

export { getCanChiYear, getSolarYearForCanChi, isBeforeLapXuan, getLapXuanDate } from './canChi';

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  lunarYearCanChi: string;
}

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

function canChiLabel(lunarYear: number): string {
  const { can, chi } = getCanChiYear(lunarYear);
  return `${CAN[can]} ${CHI[chi]}`;
}

export function solarToLunar(solarYear: number, solarMonth: number, solarDay: number): LunarDate {
  const r = vnSolarToLunar({ year: solarYear, month: solarMonth, day: solarDay });
  return {
    day: r.day,
    month: r.month,
    year: r.year,
    isLeapMonth: r.leapMonth,
    lunarYearCanChi: canChiLabel(r.year),
  };
}

export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth = false,
): { year: number; month: number; day: number } {
  return vnLunarToSolar({
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    leapMonth: isLeapMonth,
  });
}

export function getCanMonth(yearCan: number, lunarMonth: number): number {
  const startCan = (yearCan * 2 + 2) % 10;
  return (startCan + lunarMonth - 1) % 10;
}

/** Tháng nhuận của năm âm lịch (0 = không nhuận) */
export function getLeapMonthOfYear(lunarYear: number): number {
  const leap = getLeapMonth(lunarYear);
  return leap < 0 ? 0 : leap;
}
