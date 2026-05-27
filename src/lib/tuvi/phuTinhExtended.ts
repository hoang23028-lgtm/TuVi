import { Cung, Star } from './constants';
import { tinhTuan, tinhTriet } from './canChi';

type StarPlacement = { name: string; position: number; type: Star['type'] };

/** Modulo 0–11 (tránh % âm trong JavaScript) */
function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

export function apDungTuanTriet(canNam: number, chiNam: number, cungs: Cung[]): void {
  const [t1, t2] = tinhTuan(canNam, chiNam);
  const [r1, r2] = tinhTriet(canNam);
  cungs[t1].tuan = true;
  cungs[t2].tuan = true;
  cungs[r1].triet = true;
  cungs[r2].triet = true;
}

export function anPhuTinhMoRong(
  chiNam: number,
  thangAmLich: number,
  gioSinh: number,
  ngayAmLich: number,
  cungMenhViTri: number,
  cungThanViTri: number,
  vanXuong: number,
  vanKhuc: number,
  taPhu: number,
  huuBat: number,
): StarPlacement[] {
  const stars: StarPlacement[] = [];

  stars.push({ name: 'Ân Quang', position: mod12(vanXuong + ngayAmLich - 1), type: 'phu_tinh_tot' });
  stars.push({ name: 'Thiên Quý', position: mod12(vanKhuc - ngayAmLich + 1), type: 'phu_tinh_tot' });

  stars.push({ name: 'Tam Thai', position: mod12(taPhu + ngayAmLich - 1), type: 'phu_tinh_tot' });
  stars.push({ name: 'Bát Tọa', position: mod12(huuBat - ngayAmLich + 1), type: 'phu_tinh_tot' });

  let longTri: number;
  if ([2, 6, 10].includes(chiNam)) longTri = 4;
  else if ([8, 0, 4].includes(chiNam)) longTri = 8;
  else if ([5, 9, 1].includes(chiNam)) longTri = 5;
  else longTri = 11;
  stars.push({ name: 'Long Trì', position: longTri, type: 'phu_tinh_tot' });
  stars.push({ name: 'Phượng Các', position: mod12(longTri + 6), type: 'phu_tinh_tot' });

  const thienGiai = mod12(8 + thangAmLich - 1 + gioSinh);
  stars.push({ name: 'Thiên Giải', position: thienGiai, type: 'phu_tinh_tot' });
  stars.push({ name: 'Địa Giải', position: mod12(thienGiai + 6), type: 'phu_tinh_tot' });

  const coQua: Record<number, [number, number]> = {
    2: [5, 1], 3: [5, 1], 4: [5, 1],
    5: [8, 10], 6: [8, 10], 7: [8, 10],
    8: [11, 3], 9: [11, 3], 10: [11, 3],
    11: [2, 10], 0: [2, 10], 1: [2, 10],
  };
  const [co, qua] = coQua[chiNam] ?? [5, 1];
  stars.push({ name: 'Cô Thần', position: co, type: 'phu_tinh_xau' });
  stars.push({ name: 'Quả Tú', position: qua, type: 'phu_tinh_xau' });

  // Thiên La / Địa Võng — Thiên La tại Thìn, Địa Võng tại Tuất (天罗地网)
  stars.push({ name: 'Thiên La', position: 4, type: 'phu_tinh_xau' });
  stars.push({ name: 'Địa Võng', position: 10, type: 'phu_tinh_xau' });

  // Đẩu Quân: từ Thái Tuế, nghịch đến tháng sinh, thuận đến giờ sinh
  const dauQuan = mod12(chiNam - (thangAmLich - 1) + gioSinh);
  stars.push({ name: 'Đẩu Quân', position: dauQuan, type: 'phu_tinh_trung' });

  stars.push({ name: 'Thai Phụ', position: mod12(10 + ngayAmLich - 1), type: 'phu_tinh_tot' });

  // Thiên Tài: từ cung Mệnh thuận theo Chi năm; Thiên Thọ: từ cung Thân thuận theo Chi năm
  stars.push({ name: 'Thiên Tài', position: mod12(cungMenhViTri + chiNam), type: 'phu_tinh_tot' });
  stars.push({ name: 'Thiên Thọ', position: mod12(cungThanViTri + chiNam), type: 'phu_tinh_tot' });

  stars.push({ name: 'Thái Tuế', position: chiNam, type: 'phu_tinh_xau' });

  const tangMon = mod12(8 + chiNam);
  stars.push({ name: 'Tang Môn', position: tangMon, type: 'phu_tinh_xau' });
  stars.push({ name: 'Bạch Hổ', position: mod12(tangMon + 6), type: 'phu_tinh_xau' });

  const kiepSat: Record<number, number> = {
    0: 3, 4: 3, 8: 3,
    1: 6, 5: 6, 9: 6,
    2: 9, 6: 9, 10: 9,
    3: 0, 7: 0, 11: 0,
  };
  stars.push({ name: 'Kiếp Sát', position: kiepSat[chiNam] ?? 3, type: 'phu_tinh_xau' });

  const hoaCai: Record<number, number> = {
    2: 10, 6: 10, 10: 10,
    8: 4, 0: 4, 4: 4,
    5: 1, 9: 1, 1: 1,
    11: 7, 3: 7, 7: 7,
  };
  stars.push({ name: 'Hoa Cái', position: hoaCai[chiNam] ?? 10, type: 'phu_tinh_trung' });

  stars.push({ name: 'Lưu Hà', position: mod12(chiNam + 6), type: 'phu_tinh_xau' });

  return stars;
}

export function anThienThuongThienSu(cungs: Cung[]): void {
  const noBoc = cungs.find((c) => c.name === 'Nô Bộc');
  const tatAch = cungs.find((c) => c.name === 'Tật Ách');
  if (noBoc) {
    const idx = cungs.findIndex((c) => c === noBoc);
    cungs[idx].stars.push({ name: 'Thiên Thương', type: 'phu_tinh_xau' });
  }
  if (tatAch) {
    const idx = cungs.findIndex((c) => c === tatAch);
    cungs[idx].stars.push({ name: 'Thiên Sứ', type: 'phu_tinh_tot' });
  }
}
