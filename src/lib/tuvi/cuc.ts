/**
 * Định Cục theo Can–Chi cung Mệnh (纳音五行 → 水二木三金四土五火六)
 * Phương pháp chuẩn trong Tử Vi Đẩu Số / Vân Đính
 */
import { THIEN_CAN, DIA_CHI, NAP_AM, TEN_CUC } from './constants';

const NGU_HANH_TO_CUC: Record<string, number> = {
  Kim: 4,
  Thủy: 2,
  Mộc: 3,
  Thổ: 5,
  Hỏa: 6,
};

/**
 * Cục từ Thiên Can + Địa Chi của cung Mệnh (không chỉ Can năm + chi Mệnh)
 */
export function getCucFromMenhCung(
  thienCanMenh: string,
  diaChiMenh: string,
): { cucNumber: number; cucName: string; nguHanhMenh: string } {
  const key = `${thienCanMenh} ${diaChiMenh}`;
  const nguHanhMenh = NAP_AM[key];
  if (!nguHanhMenh) {
    return { cucNumber: 5, cucName: TEN_CUC[5], nguHanhMenh: 'Thổ' };
  }
  const cucNumber = NGU_HANH_TO_CUC[nguHanhMenh] ?? 5;
  return {
    cucNumber,
    cucName: TEN_CUC[cucNumber] ?? 'Thổ Ngũ Cục',
    nguHanhMenh,
  };
}

/** Ma trận Cục [canNăm][chiMệnh] — đối chiếu với phương pháp nạp âm cung Mệnh */
export function buildBangCucMatrix(): number[][] {
  const matrix: number[][] = [];
  for (let canNam = 0; canNam < 10; canNam++) {
    const row: number[] = [];
    let startCan: number;
    switch (canNam % 5) {
      case 0: startCan = 2; break;
      case 1: startCan = 4; break;
      case 2: startCan = 6; break;
      case 3: startCan = 8; break;
      default: startCan = 0;
    }
    for (let chiMenh = 0; chiMenh < 12; chiMenh++) {
      const canMenh = THIEN_CAN[(startCan + ((chiMenh - 2 + 12) % 12)) % 10];
      const { cucNumber } = getCucFromMenhCung(canMenh, DIA_CHI[chiMenh]);
      row.push(cucNumber);
    }
    matrix.push(row);
  }
  return matrix;
}
