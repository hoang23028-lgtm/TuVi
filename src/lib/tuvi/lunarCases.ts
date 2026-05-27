/**
 * Ngày mẫu đối chiếu âm lịch Việt Nam (Tết, tháng nhuận)
 * Nguồn: lịch âm dương phổ biến / timeanddate / amlich
 */
export interface LunarCase {
  id: string;
  solar: { y: number; m: number; d: number };
  lunar: { year: number; month: number; day: number; isLeapMonth?: boolean };
}

export const LUNAR_REFERENCE_CASES: LunarCase[] = [
  { id: 'tet-giap-ty-1984', solar: { y: 1984, m: 2, d: 2 }, lunar: { year: 1984, month: 1, day: 1 } },
  { id: 'tet-canh-ngo-1990', solar: { y: 1990, m: 1, d: 27 }, lunar: { year: 1990, month: 1, day: 1 } },
  { id: 'tet-giap-tuat-1994', solar: { y: 1994, m: 2, d: 10 }, lunar: { year: 1994, month: 1, day: 1 } },
  { id: 'tet-giap-than-2004', solar: { y: 2004, m: 1, d: 22 }, lunar: { year: 2004, month: 1, day: 1 } },
  { id: 'tet-at-dau-2005', solar: { y: 2005, m: 2, d: 9 }, lunar: { year: 2005, month: 1, day: 1 } },
  { id: 'tet-binh-tuat-2006', solar: { y: 2006, m: 1, d: 29 }, lunar: { year: 2006, month: 1, day: 1 } },
  { id: 'tet-giap-thin-2024', solar: { y: 2024, m: 2, d: 10 }, lunar: { year: 2024, month: 1, day: 1 } },
  { id: 'tet-at-ty-2025', solar: { y: 2025, m: 1, d: 29 }, lunar: { year: 2025, month: 1, day: 1 } },
  { id: 'base-1900', solar: { y: 1900, m: 1, d: 31 }, lunar: { year: 1900, month: 1, day: 1 } },
  { id: 'mid-1992', solar: { y: 1992, m: 7, d: 1 }, lunar: { year: 1992, month: 6, day: 2 } },
  { id: 'leap-1995-8', solar: { y: 1995, m: 9, d: 25 }, lunar: { year: 1995, month: 8, day: 2, isLeapMonth: true } },
  { id: 'leap-1995-8-15', solar: { y: 1995, m: 10, d: 24 }, lunar: { year: 1995, month: 9, day: 1 } },
  { id: 'canh-ngo-1990-8', solar: { y: 1990, m: 8, d: 15 }, lunar: { year: 1990, month: 6, day: 25 } },
  { id: 'giap-than-2004-4', solar: { y: 2004, m: 5, d: 27 }, lunar: { year: 2004, month: 4, day: 9 } },
];
