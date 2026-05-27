/**
 * Can Chi năm, Lập xuân, Tuần/Triệt — theo lục giáp tử (六甲旬空) và phương pháp phổ biến
 */

/** Ngày Lập xuân (dương lịch) — xấp xỉ, đủ cho 1900–2099 */
const LAP_XUAN_DAY: Record<number, { month: number; day: number }> = {
  1980: { month: 2, day: 5 }, 1981: { month: 2, day: 4 }, 1982: { month: 2, day: 4 },
  1983: { month: 2, day: 4 }, 1984: { month: 2, day: 4 }, 1985: { month: 2, day: 4 },
  1986: { month: 2, day: 4 }, 1987: { month: 2, day: 4 }, 1988: { month: 2, day: 4 },
  1989: { month: 2, day: 4 }, 1990: { month: 2, day: 4 }, 1991: { month: 2, day: 4 },
  1992: { month: 2, day: 4 }, 1993: { month: 2, day: 4 }, 1994: { month: 2, day: 4 },
  1995: { month: 2, day: 4 }, 1996: { month: 2, day: 4 }, 1997: { month: 2, day: 4 },
  1998: { month: 2, day: 4 }, 1999: { month: 2, day: 4 }, 2000: { month: 2, day: 4 },
  2001: { month: 2, day: 4 }, 2002: { month: 2, day: 4 }, 2003: { month: 2, day: 4 },
  2004: { month: 2, day: 4 }, 2005: { month: 2, day: 4 }, 2006: { month: 2, day: 4 },
  2007: { month: 2, day: 4 }, 2008: { month: 2, day: 4 }, 2009: { month: 2, day: 4 },
  2010: { month: 2, day: 4 }, 2011: { month: 2, day: 4 }, 2012: { month: 2, day: 4 },
  2013: { month: 2, day: 4 }, 2014: { month: 2, day: 4 }, 2015: { month: 2, day: 4 },
  2016: { month: 2, day: 4 }, 2017: { month: 2, day: 4 }, 2018: { month: 2, day: 4 },
  2019: { month: 2, day: 4 }, 2020: { month: 2, day: 4 }, 2021: { month: 2, day: 3 },
  2022: { month: 2, day: 4 }, 2023: { month: 2, day: 4 }, 2024: { month: 2, day: 4 },
  2025: { month: 2, day: 3 }, 2026: { month: 2, day: 4 },
};

const DEFAULT_LAP_XUAN = { month: 2, day: 4 };

export function getLapXuanDate(solarYear: number): { month: number; day: number } {
  return LAP_XUAN_DAY[solarYear] ?? DEFAULT_LAP_XUAN;
}

/** Trước Lập xuân trong năm dương → Can Chi lấy năm trước */
export function isBeforeLapXuan(solarYear: number, solarMonth: number, solarDay: number): boolean {
  const lx = getLapXuanDate(solarYear);
  if (solarMonth < lx.month) return true;
  if (solarMonth === lx.month && solarDay < lx.day) return true;
  return false;
}

export function getSolarYearForCanChi(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  useLapXuan: boolean,
): number {
  if (!useLapXuan) return solarYear;
  return isBeforeLapXuan(solarYear, solarMonth, solarDay) ? solarYear - 1 : solarYear;
}

export function getCanChiYear(year: number): { can: number; chi: number } {
  return {
    can: ((year - 4) % 10 + 10) % 10,
    chi: ((year - 4) % 12 + 12) % 12,
  };
}

/**
 * Tuần (旬空) — theo chênh lệch Can–Chi năm sinh (lục giáp)
 * diff = (chi - can) mod 12 → một trong 6 tuần
 */
const TUAN_THEO_DIFF: Record<number, [number, number]> = {
  0: [10, 11],  // Giáp tý tuần → Tuất, Hợi
  10: [8, 9],   // Giáp tuất tuần → Thân, Dậu
  8: [6, 7],    // Giáp thân tuần → Ngọ, Mùi
  6: [4, 5],    // Giáp ngọ tuần → Thìn, Tỵ
  4: [2, 3],    // Giáp thìn tuần → Dần, Mão
  2: [0, 1],    // Giáp dần tuần → Tý, Sửu
};

export function tinhTuan(can: number, chi: number): [number, number] {
  const diff = ((chi - can) % 12 + 12) % 12;
  return TUAN_THEO_DIFF[diff] ?? [10, 11];
}

/**
 * Triệt — theo Can năm (五虎遁 / phổ biến trong Tử Vi Đẩu Số VN)
 */
const TRIET_THEO_CAN: Record<number, [number, number]> = {
  0: [8, 9], 5: [8, 9],   // Giáp, Kỷ → Thân, Dậu
  1: [6, 7], 6: [6, 7],   // Ất, Canh → Ngọ, Mùi
  2: [4, 5], 7: [4, 5],   // Bính, Tân → Thìn, Tỵ
  3: [2, 3], 8: [2, 3],   // Đinh, Nhâm → Dần, Mão
  4: [0, 1], 9: [0, 1],   // Mậu, Quý → Tý, Sửu
};

export function tinhTriet(can: number): [number, number] {
  return TRIET_THEO_CAN[can] ?? [8, 9];
}
