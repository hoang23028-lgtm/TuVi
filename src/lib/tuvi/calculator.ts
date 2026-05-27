import {
  THIEN_CAN, DIA_CHI, CON_GIAP, CUNG_VI_TRI,
  NAP_AM,
  getTuViPosition, NHOM_TU_VI_OFFSET, NHOM_THIEN_PHU_OFFSET,
  Star, Cung, TuViChart, TuHoaType,
} from './constants';
import { solarToLunar, LunarDate } from './lunar';
import { getCanChiYear, getSolarYearForCanChi, isBeforeLapXuan } from './canChi';
import { getCucFromMenhCung } from './cuc';
import { anPhuTinhMoRong, apDungTuanTriet, anThienThuongThienSu } from './phuTinhExtended';

const TU_HOA_THEO_CAN: Record<number, Record<TuHoaType, string>> = {
  0: { Lộc: 'Liêm Trinh', Quyền: 'Phá Quân', Khoa: 'Vũ Khúc', Kỵ: 'Thái Dương' },
  1: { Lộc: 'Thiên Cơ', Quyền: 'Thiên Lương', Khoa: 'Tử Vi', Kỵ: 'Thái Âm' },
  2: { Lộc: 'Thiên Đồng', Quyền: 'Thiên Cơ', Khoa: 'Văn Xương', Kỵ: 'Liêm Trinh' },
  3: { Lộc: 'Thái Âm', Quyền: 'Thiên Đồng', Khoa: 'Thiên Cơ', Kỵ: 'Cự Môn' },
  4: { Lộc: 'Tham Lang', Quyền: 'Thái Âm', Khoa: 'Hữu Bật', Kỵ: 'Thiên Cơ' },
  5: { Lộc: 'Vũ Khúc', Quyền: 'Tham Lang', Khoa: 'Thiên Lương', Kỵ: 'Văn Khúc' },
  6: { Lộc: 'Thái Dương', Quyền: 'Vũ Khúc', Khoa: 'Thái Âm', Kỵ: 'Thiên Đồng' },
  7: { Lộc: 'Cự Môn', Quyền: 'Thái Dương', Khoa: 'Văn Khúc', Kỵ: 'Văn Xương' },
  8: { Lộc: 'Thiên Lương', Quyền: 'Tử Vi', Khoa: 'Tả Phù', Kỵ: 'Vũ Khúc' },
  9: { Lộc: 'Phá Quân', Quyền: 'Cự Môn', Khoa: 'Thái Âm', Kỵ: 'Tham Lang' },
};

function apDungTuHoa(canNam: number, cungs: Cung[]): void {
  const bang = TU_HOA_THEO_CAN[canNam];
  if (!bang) return;
  (Object.entries(bang) as [TuHoaType, string][]).forEach(([hoa, tenSao]) => {
    for (const cung of cungs) {
      const sao = cung.stars.find((s) => s.name === tenSao);
      if (sao) sao.tuHoa = hoa;
    }
  });
}

/**
 * Xác định vị trí Cung Mệnh
 * Từ cung Dần (index 2), đếm thuận theo tháng, đếm nghịch theo giờ
 */
function getCungMenhViTri(thangAmLich: number, gioSinh: number): number {
  // Bắt đầu từ Dần (index 2)
  // Tháng Giêng an tại Dần, tháng 2 tại Mão, ... (thuận)
  // Rồi từ đó, đếm ngược theo giờ sinh
  // Giờ Tý đếm ngược 0, Sửu đếm ngược 1, ...
  const viTriThang = (2 + thangAmLich - 1) % 12;
  const viTriMenh = (viTriThang - gioSinh + 12) % 12;
  return viTriMenh;
}

/**
 * Xác định vị trí Cung Thân
 * Từ cung Dần, đếm thuận theo tháng, đếm thuận theo giờ
 */
function getCungThanViTri(thangAmLich: number, gioSinh: number): number {
  const viTriThang = (2 + thangAmLich - 1) % 12;
  const viTriThan = (viTriThang + gioSinh) % 12;
  return viTriThan;
}

/**
 * An Thiên Can cho 12 cung
 * Dựa vào Can năm sinh
 */
function anThienCanCung(canNam: number): string[] {
  const result: string[] = new Array(12);
  // Quy tắc: Giáp-Kỷ khởi Bính Dần, Ất-Canh khởi Mậu Dần, ...
  let startCan: number;
  switch (canNam % 5) {
    case 0: startCan = 2; break; // Giáp/Kỷ -> Bính
    case 1: startCan = 4; break; // Ất/Canh -> Mậu
    case 2: startCan = 6; break; // Bính/Tân -> Canh
    case 3: startCan = 8; break; // Đinh/Nhâm -> Nhâm
    case 4: startCan = 0; break; // Mậu/Quý -> Giáp
    default: startCan = 0;
  }
  
  // An từ cung Dần (index 2) đi thuận
  for (let i = 0; i < 12; i++) {
    const cungIndex = (2 + i) % 12;
    result[cungIndex] = THIEN_CAN[(startCan + i) % 10];
  }
  return result;
}

/**
 * Tìm vị trí sao Tử Vi
 */
function getViTriTuVi(cuc: number, ngayAmLich: number): number {
  return getTuViPosition(cuc, ngayAmLich);
}

/**
 * Tìm vị trí sao Thiên Phủ (đối xứng với Tử Vi qua trục Dần-Thân)
 */
function getViTriThienPhu(viTriTuVi: number): number {
  // Thiên Phủ đối xứng với Tử Vi qua cung Dần (index 2)
  // Công thức: Thiên Phủ = (4 - tuVi + 12) % 12 ... 
  // Thực tế: Tử Vi ở cung nào thì Thiên Phủ đối xứng qua trục
  // Trục đối xứng: Dần(2) - Thân(8)
  // Nếu Tử Vi ở vị trí x, Thiên Phủ ở vị trí (4 - x + 12) % 12
  return (4 - viTriTuVi + 12) % 12;
}

/**
 * An các sao phụ tinh
 */
function anPhuTinh(
  canNam: number, chiNam: number, 
  thangAmLich: number, gioSinh: number,
  ngayAmLich: number, gioiTinh: 'Nam' | 'Nữ'
): { name: string; position: number; type: Star['type'] }[] {
  const stars: { name: string; position: number; type: Star['type'] }[] = [];
  
  // === Văn Xương, Văn Khúc (theo giờ sinh) ===
  // Văn Xương: Từ Tuất đếm nghịch theo giờ
  const vanXuong = (10 - gioSinh + 12) % 12;
  stars.push({ name: 'Văn Xương', position: vanXuong, type: 'phu_tinh_tot' });
  
  // Văn Khúc: Từ Thìn đếm thuận theo giờ
  const vanKhuc = (4 + gioSinh) % 12;
  stars.push({ name: 'Văn Khúc', position: vanKhuc, type: 'phu_tinh_tot' });
  
  // === Tả Phù, Hữu Bật (theo tháng sinh) ===
  // Tả Phù: Từ Thìn đếm thuận theo tháng
  const taPhu = (4 + thangAmLich - 1) % 12;
  stars.push({ name: 'Tả Phù', position: taPhu, type: 'phu_tinh_tot' });
  
  // Hữu Bật: Từ Tuất đếm nghịch theo tháng
  const huuBat = (10 - thangAmLich + 1 + 12) % 12;
  stars.push({ name: 'Hữu Bật', position: huuBat, type: 'phu_tinh_tot' });
  
  // === Thiên Khôi, Thiên Việt (theo Can năm) ===
  const khoiViet: Record<number, [number, number]> = {
    0: [1, 7],  // Giáp: Khôi ở Sửu, Việt ở Mùi
    1: [0, 8],  // Ất: Khôi ở Tý, Việt ở Thân
    2: [11, 9], // Bính: Khôi ở Hợi, Việt ở Dậu
    3: [11, 9], // Đinh: Khôi ở Hợi, Việt ở Dậu
    4: [1, 7],  // Mậu: Khôi ở Sửu, Việt ở Mùi
    5: [0, 8],  // Kỷ: Khôi ở Tý, Việt ở Thân
    6: [6, 2],  // Canh: Khôi ở Ngọ, Việt ở Dần
    7: [6, 2],  // Tân: Khôi ở Ngọ, Việt ở Dần
    8: [3, 5],  // Nhâm: Khôi ở Mão, Việt ở Tỵ
    9: [3, 5],  // Quý: Khôi ở Mão, Việt ở Tỵ
  };
  const [khoiPos, vietPos] = khoiViet[canNam];
  stars.push({ name: 'Thiên Khôi', position: khoiPos, type: 'phu_tinh_tot' });
  stars.push({ name: 'Thiên Việt', position: vietPos, type: 'phu_tinh_tot' });
  
  // === Lộc Tồn (theo Can năm) ===
  const locTon: Record<number, number> = {
    0: 2,  // Giáp -> Dần
    1: 3,  // Ất -> Mão
    2: 5,  // Bính -> Tỵ
    3: 6,  // Đinh -> Ngọ
    4: 5,  // Mậu -> Tỵ
    5: 6,  // Kỷ -> Ngọ
    6: 8,  // Canh -> Thân
    7: 9,  // Tân -> Dậu
    8: 11, // Nhâm -> Hợi
    9: 0,  // Quý -> Tý
  };
  stars.push({ name: 'Lộc Tồn', position: locTon[canNam], type: 'phu_tinh_tot' });
  
  // === Kình Dương, Đà La (cạnh Lộc Tồn) ===
  const kinhDuong = (locTon[canNam] + 1) % 12;
  const daLa = (locTon[canNam] - 1 + 12) % 12;
  stars.push({ name: 'Kình Dương', position: kinhDuong, type: 'phu_tinh_xau' });
  stars.push({ name: 'Đà La', position: daLa, type: 'phu_tinh_xau' });
  
  // === Hỏa Tinh, Linh Tinh (theo Chi năm, giờ sinh, giới tính/âm dương) ===
  // Dương Nam, Âm Nữ: Hỏa thuận, Linh nghịch
  // Âm Nam, Dương Nữ: Hỏa nghịch, Linh thuận
  const canNamAmDuong = canNam % 2 === 0 ? 'Dương' : 'Âm';
  const isHoaThuan = (canNamAmDuong === 'Dương' && gioiTinh === 'Nam') || (canNamAmDuong === 'Âm' && gioiTinh === 'Nữ');
  
  // Hỏa Tinh
  let hoaTinhStart: number;
  if ([2, 6, 10].includes(chiNam)) { // Dần, Ngọ, Tuất
    hoaTinhStart = 1; // Sửu
  } else if ([8, 0, 4].includes(chiNam)) { // Thân, Tý, Thìn
    hoaTinhStart = 2; // Dần
  } else if ([5, 9, 1].includes(chiNam)) { // Tỵ, Dậu, Sửu
    hoaTinhStart = 3; // Mão
  } else { // Hợi, Mão, Mùi
    hoaTinhStart = 9; // Dậu
  }
  const hoaTinh = isHoaThuan 
    ? (hoaTinhStart + gioSinh) % 12 
    : (hoaTinhStart - gioSinh + 12) % 12;
  stars.push({ name: 'Hỏa Tinh', position: hoaTinh, type: 'phu_tinh_xau' });
  
  // Linh Tinh
  let linhTinhStart: number;
  if ([2, 6, 10].includes(chiNam)) {
    linhTinhStart = 3; // Mão
  } else if ([8, 0, 4].includes(chiNam)) {
    linhTinhStart = 10; // Tuất
  } else if ([5, 9, 1].includes(chiNam)) {
    linhTinhStart = 10; // Tuất
  } else {
    linhTinhStart = 10; // Tuất
  }
  const linhTinh = isHoaThuan 
    ? (linhTinhStart - gioSinh + 12) % 12 
    : (linhTinhStart + gioSinh) % 12;
  stars.push({ name: 'Linh Tinh', position: linhTinh, type: 'phu_tinh_xau' });
  
  // === Địa Không, Địa Kiếp (theo giờ sinh) ===
  const diaKhong = (11 - gioSinh + 12) % 12;
  const diaKiep = (11 + gioSinh) % 12;
  stars.push({ name: 'Địa Không', position: diaKhong, type: 'phu_tinh_xau' });
  stars.push({ name: 'Địa Kiếp', position: diaKiep, type: 'phu_tinh_xau' });
  
  // === Thiên Mã (theo Chi năm) ===
  const thienMa: Record<number, number> = {
    0: 2, 1: 11, 2: 8, 3: 5, 4: 2, 5: 11,
    6: 8, 7: 5, 8: 2, 9: 11, 10: 8, 11: 5,
  };
  stars.push({ name: 'Thiên Mã', position: thienMa[chiNam], type: 'phu_tinh_tot' });
  
  // === Đào Hoa (theo Chi năm) ===
  const daoHoa: Record<number, number> = {
    0: 9, 1: 6, 2: 3, 3: 0, 4: 9, 5: 6,
    6: 3, 7: 0, 8: 9, 9: 6, 10: 3, 11: 0,
  };
  stars.push({ name: 'Đào Hoa', position: daoHoa[chiNam], type: 'phu_tinh_trung' });
  
  // === Hồng Loan, Thiên Hỷ (theo Chi năm) ===
  const hongLoan = (3 - chiNam + 12) % 12;
  const thienHy = (hongLoan + 6) % 12;
  stars.push({ name: 'Hồng Loan', position: hongLoan, type: 'phu_tinh_tot' });
  stars.push({ name: 'Thiên Hỷ', position: thienHy, type: 'phu_tinh_tot' });
  
  // === Thai, Tọa (Trường Sinh 12 vị theo Ngũ Hành Cục) ===
  // Simplified - Tràng Sinh theo giờ
  
  // === Thiên Khốc, Thiên Hư (theo Chi năm) ===
  const thienKhoc = (6 + chiNam) % 12;
  const thienHu = (6 - chiNam + 12) % 12;
  stars.push({ name: 'Thiên Khốc', position: thienKhoc, type: 'phu_tinh_xau' });
  stars.push({ name: 'Thiên Hư', position: thienHu, type: 'phu_tinh_xau' });
  
  return stars;
}

/**
 * An sao Tràng Sinh (12 vị)
 */
function anTrangSinh(cuc: number, gioiTinh: 'Nam' | 'Nữ', amDuong: string): { name: string; position: number; type: Star['type'] }[] {
  const stars: { name: string; position: number; type: Star['type'] }[] = [];
  
  // Vị trí khởi đầu Tràng Sinh theo Cục
  // Thủy Nhị Cục: khởi Thân (8)
  // Mộc Tam Cục: khởi Hợi (11)
  // Kim Tứ Cục: khởi Tỵ (5)
  // Thổ Ngũ Cục: khởi Thân (8)
  // Hỏa Lục Cục: khởi Dần (2)
  const trangSinhStart: Record<number, number> = {
    2: 8,  // Thủy -> Thân
    3: 11, // Mộc -> Hợi
    4: 5,  // Kim -> Tỵ
    5: 8,  // Thổ -> Thân
    6: 2,  // Hỏa -> Dần
  };
  
  const tenVi = ['Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
  
  const start = trangSinhStart[cuc] || 2;
  
  // Dương Nam, Âm Nữ: thuận; Âm Nam, Dương Nữ: nghịch
  const isThuan = (amDuong === 'Dương' && gioiTinh === 'Nam') || (amDuong === 'Âm' && gioiTinh === 'Nữ');
  
  for (let i = 0; i < 12; i++) {
    const pos = isThuan ? (start + i) % 12 : (start - i + 12) % 12;
    stars.push({ name: tenVi[i], position: pos, type: 'phu_tinh_trung' });
  }
  
  return stars;
}

/**
 * Xác định Mệnh Chủ theo Cung Mệnh
 */
function getMenhChu(cungMenhDiaChi: number): string {
  const menhChu: Record<number, string> = {
    0: 'Tham Lang',  // Tý
    1: 'Cự Môn',    // Sửu
    2: 'Lộc Tồn',   // Dần
    3: 'Văn Khúc',   // Mão
    4: 'Liêm Trinh', // Thìn
    5: 'Vũ Khúc',    // Tỵ
    6: 'Phá Quân',   // Ngọ
    7: 'Vũ Khúc',    // Mùi
    8: 'Liêm Trinh', // Thân
    9: 'Văn Khúc',   // Dậu
    10: 'Lộc Tồn',  // Tuất
    11: 'Cự Môn',   // Hợi
  };
  return menhChu[cungMenhDiaChi] || '';
}

/**
 * Xác định Thân Chủ theo Chi năm
 */
function getThanChu(chiNam: number): string {
  const thanChu: Record<number, string> = {
    0: 'Linh Tinh',   // Tý
    1: 'Thiên Tướng', // Sửu
    2: 'Thiên Lương', // Dần
    3: 'Thiên Đồng',  // Mão
    4: 'Văn Xương',   // Thìn
    5: 'Thiên Cơ',    // Tỵ
    6: 'Hỏa Tinh',    // Ngọ
    7: 'Thiên Tướng', // Mùi
    8: 'Thiên Lương', // Thân
    9: 'Thiên Đồng',  // Dậu
    10: 'Văn Xương', // Tuất
    11: 'Thiên Cơ',  // Hợi
  };
  return thanChu[chiNam] || '';
}

/**
 * Tính toán lá số Tử Vi đầy đủ
 */
export interface TinhLaSoOptions {
  /** Nhập trực tiếp âm lịch (bỏ qua quy đổi từ ngày dương) */
  amLich?: Pick<LunarDate, 'year' | 'month' | 'day' | 'isLeapMonth'>;
  /** Can Chi năm theo Lập xuân (trước ~4/2 dương = năm trước) */
  dungLapXuan?: boolean;
}

export function tinhLaSo(
  hoTen: string,
  gioiTinh: 'Nam' | 'Nữ',
  ngaySinh: Date,
  gioSinh: number,
  options?: TinhLaSoOptions,
): TuViChart {
  const lunar = options?.amLich
    ? {
        day: options.amLich.day,
        month: options.amLich.month,
        year: options.amLich.year,
        isLeapMonth: options.amLich.isLeapMonth ?? false,
        lunarYearCanChi: '',
      }
    : solarToLunar(
        ngaySinh.getFullYear(),
        ngaySinh.getMonth() + 1,
        ngaySinh.getDate(),
      );
  
  const solarY = ngaySinh.getFullYear();
  const solarM = ngaySinh.getMonth() + 1;
  const solarD = ngaySinh.getDate();
  const dungLapXuan = options?.dungLapXuan ?? false;

  const yearForCanChi = dungLapXuan
    ? getSolarYearForCanChi(solarY, solarM, solarD, true)
    : lunar.year;

  const { can: canNam, chi: chiNam } = getCanChiYear(yearForCanChi);
  const amDuong = canNam % 2 === 0 ? 'Dương' : 'Âm';

  const truocLapXuan = dungLapXuan && isBeforeLapXuan(solarY, solarM, solarD);
  const ghiChuCanChi = dungLapXuan
    ? truocLapXuan
      ? `Can Chi theo Lập xuân (trước 4/2: năm ${yearForCanChi})`
      : `Can Chi theo Lập xuân (năm ${yearForCanChi})`
    : `Can Chi theo năm âm lịch (${lunar.year})`;

  const cungMenhViTri = getCungMenhViTri(lunar.month, gioSinh);
  const cungThanViTri = getCungThanViTri(lunar.month, gioSinh);

  const thienCanCung = anThienCanCung(canNam);
  const thienCanMenh = thienCanCung[cungMenhViTri];
  const diaChiMenh = DIA_CHI[cungMenhViTri];
  const { cucNumber, cucName } = getCucFromMenhCung(thienCanMenh, diaChiMenh);

  const canChiNam = `${THIEN_CAN[canNam]} ${DIA_CHI[chiNam]}`;
  const nguHanh = NAP_AM[canChiNam] || 'Kim';
  
  // 8. An chính tinh
  const viTriTuVi = getViTriTuVi(cucNumber, lunar.day);
  const viTriThienPhu = getViTriThienPhu(viTriTuVi);
  
  // 9. Khởi tạo 12 cung
  const cungs: Cung[] = [];
  for (let i = 0; i < 12; i++) {
    // Tên cung: từ Mệnh đếm thuận theo địa chi (Mệnh tại menh → Phụ Mẫu tại menh+1, …)
    const cungIndex = (i - cungMenhViTri + 12) % 12;
    cungs.push({
      name: CUNG_VI_TRI[cungIndex],
      diaChi: DIA_CHI[i],
      thienCan: thienCanCung[i],
      stars: [],
      daiHan: '',
      tieuHan: [],
    });
  }
  
  // 10. Đặt sao nhóm Tử Vi
  for (const [starName, offset] of Object.entries(NHOM_TU_VI_OFFSET)) {
    const pos = (viTriTuVi + offset + 12) % 12;
    cungs[pos].stars.push({ name: starName, type: 'chinh_tinh' });
  }
  
  // 11. Đặt sao nhóm Thiên Phủ
  for (const [starName, offset] of Object.entries(NHOM_THIEN_PHU_OFFSET)) {
    const pos = (viTriThienPhu + offset) % 12;
    cungs[pos].stars.push({ name: starName, type: 'chinh_tinh' });
  }
  
  // 12. An phụ tinh
  const phuTinh = anPhuTinh(canNam, chiNam, lunar.month, gioSinh, lunar.day, gioiTinh);
  for (const star of phuTinh) {
    cungs[star.position].stars.push({ name: star.name, type: star.type });
  }

  const vanXuong = (10 - gioSinh + 12) % 12;
  const vanKhuc = (4 + gioSinh) % 12;
  const taPhu = (4 + lunar.month - 1) % 12;
  const huuBat = (10 - lunar.month + 1 + 12) % 12;
  const phuMoRong = anPhuTinhMoRong(
    chiNam, lunar.month, gioSinh, lunar.day,
    cungMenhViTri, cungThanViTri,
    vanXuong, vanKhuc, taPhu, huuBat,
  );
  for (const star of phuMoRong) {
    cungs[star.position].stars.push({ name: star.name, type: star.type });
  }
  anThienThuongThienSu(cungs);
  apDungTuanTriet(canNam, chiNam, cungs);
  
  // 13. An Tràng Sinh
  const trangSinh = anTrangSinh(cucNumber, gioiTinh, amDuong);
  for (const star of trangSinh) {
    cungs[star.position].stars.push({ name: star.name, type: star.type });
  }

  // 14. Tứ Hóa theo Can năm
  apDungTuHoa(canNam, cungs);
  
  // 15. Tính Đại Hạn
  const startAge = cucNumber; // Đại hạn bắt đầu từ tuổi = Cục số
  const isThuan = (amDuong === 'Dương' && gioiTinh === 'Nam') || (amDuong === 'Âm' && gioiTinh === 'Nữ');
  
  for (let i = 0; i < 12; i++) {
    const cungDaiHan = isThuan ? (cungMenhViTri + i) % 12 : (cungMenhViTri - i + 12) % 12;
    const tuoiStart = startAge + i * 10;
    const tuoiEnd = tuoiStart + 9;
    cungs[cungDaiHan].daiHan = `${tuoiStart}-${tuoiEnd}`;
  }
  
  // 16. Tiểu Hạn — cùng chiều thuận/nghịch với Đại Hạn (âm dương + giới)
  const tieuHanStart = (2 + chiNam) % 12;
  const birthYear = lunar.year;

  for (let tuoi = 1; tuoi <= 100; tuoi++) {
    const namDuongLich = birthYear + tuoi - 1;
    const offset = (tuoi - 1) % 12;
    const tieuHanPos = isThuan
      ? (tieuHanStart + offset) % 12
      : (tieuHanStart - offset + 12) % 12;
    cungs[tieuHanPos].tieuHan.push(namDuongLich);
  }

  return {
    hoTen,
    gioiTinh,
    ngaySinh,
    ngayAmLich: {
      day: lunar.day,
      month: lunar.month,
      year: lunar.year,
      isLeapMonth: lunar.isLeapMonth,
    },
    gioSinh,
    thienCan: THIEN_CAN[canNam],
    diaChi: DIA_CHI[chiNam],
    conGiap: CON_GIAP[chiNam],
    cuc: cucName,
    cucNumber,
    menhChu: getMenhChu(cungMenhViTri),
    thanChu: getThanChu(chiNam),
    amDuong,
    nguHanh,
    cungMenhViTri,
    cungThanViTri,
    cungs,
    dungLapXuan: dungLapXuan || undefined,
    ghiChuCanChi,
  };
}
