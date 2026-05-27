// Thiên Can (Heavenly Stems)
export const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;

// Địa Chi (Earthly Branches)
export const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;

// Con giáp
export const CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'] as const;

// 12 Cung trong lá số
export const CUNG_VI_TRI = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'] as const;

// Ngũ Hành
export const NGU_HANH = ['Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc'] as const;

// Ngũ Hành Cục
export const NGU_HANH_CUC = {
  'Thủy Nhị Cục': 2,
  'Mộc Tam Cục': 3,
  'Kim Tứ Cục': 4,
  'Thổ Ngũ Cục': 5,
  'Hỏa Lục Cục': 6,
} as const;

// Ngũ hành nạp âm theo Thiên Can + Địa Chi
export const NAP_AM: Record<string, string> = {
  'Giáp Tý': 'Kim', 'Ất Sửu': 'Kim',
  'Bính Dần': 'Hỏa', 'Đinh Mão': 'Hỏa',
  'Mậu Thìn': 'Mộc', 'Kỷ Tỵ': 'Mộc',
  'Canh Ngọ': 'Thổ', 'Tân Mùi': 'Thổ',
  'Nhâm Thân': 'Kim', 'Quý Dậu': 'Kim',
  'Giáp Tuất': 'Hỏa', 'Ất Hợi': 'Hỏa',
  'Bính Tý': 'Thủy', 'Đinh Sửu': 'Thủy',
  'Mậu Dần': 'Thổ', 'Kỷ Mão': 'Thổ',
  'Canh Thìn': 'Kim', 'Tân Tỵ': 'Kim',
  'Nhâm Ngọ': 'Mộc', 'Quý Mùi': 'Mộc',
  'Giáp Thân': 'Thủy', 'Ất Dậu': 'Thủy',
  'Bính Tuất': 'Thổ', 'Đinh Hợi': 'Thổ',
  'Mậu Tý': 'Hỏa', 'Kỷ Sửu': 'Hỏa',
  'Canh Dần': 'Mộc', 'Tân Mão': 'Mộc',
  'Nhâm Thìn': 'Thủy', 'Quý Tỵ': 'Thủy',
  'Giáp Ngọ': 'Kim', 'Ất Mùi': 'Kim',
  'Bính Thân': 'Hỏa', 'Đinh Dậu': 'Hỏa',
  'Mậu Tuất': 'Mộc', 'Kỷ Hợi': 'Mộc',
  'Canh Tý': 'Thổ', 'Tân Sửu': 'Thổ',
  'Nhâm Dần': 'Kim', 'Quý Mão': 'Kim',
  'Giáp Thìn': 'Hỏa', 'Ất Tỵ': 'Hỏa',
  'Bính Ngọ': 'Thủy', 'Đinh Mùi': 'Thủy',
  'Mậu Thân': 'Thổ', 'Kỷ Dậu': 'Thổ',
  'Canh Tuất': 'Kim', 'Tân Hợi': 'Kim',
  'Nhâm Tý': 'Mộc', 'Quý Sửu': 'Mộc',
  'Giáp Dần': 'Thủy', 'Ất Mão': 'Thủy',
  'Bính Thìn': 'Thổ', 'Đinh Tỵ': 'Thổ',
  'Mậu Ngọ': 'Hỏa', 'Kỷ Mùi': 'Hỏa',
  'Canh Thân': 'Mộc', 'Tân Dậu': 'Mộc',
  'Nhâm Tuất': 'Thủy', 'Quý Hợi': 'Thủy',
};

// Bảng tra Cục theo Can năm và Cung Mệnh
// Index: [canIndex][cungMenhDiaChi]
// Can: 0=Giáp,1=Ất,...9=Quý
// Cung: 0=Tý,1=Sửu,...11=Hợi
// Cục = Nạp Âm Ngũ Hành của Can-Chi Cung Mệnh (Ngũ Hổ Độn)
// Mỗi 2 cung liền kề có cùng Cục; Tuất-Hợi lấy theo Dần-Mão
export const BANG_CUC: number[][] = [
  // Giáp/Kỷ: Thủy-Hỏa-Mộc-Thổ-Kim (Tuất Hợi=Hỏa)
  [2, 2, 6, 6, 3, 3, 5, 5, 4, 4, 6, 6], // Giáp
  [6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 5, 5], // Ất
  [5, 5, 3, 3, 2, 2, 4, 4, 6, 6, 3, 3], // Bính
  [3, 3, 4, 4, 6, 6, 2, 2, 5, 5, 4, 4], // Đinh
  [4, 4, 2, 2, 5, 5, 6, 6, 3, 3, 2, 2], // Mậu
  [2, 2, 6, 6, 3, 3, 5, 5, 4, 4, 6, 6], // Kỷ
  [6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 5, 5], // Canh
  [5, 5, 3, 3, 2, 2, 4, 4, 6, 6, 3, 3], // Tân
  [3, 3, 4, 4, 6, 6, 2, 2, 5, 5, 4, 4], // Nhâm
  [4, 4, 2, 2, 5, 5, 6, 6, 3, 3, 2, 2], // Quý
];

// Tên Cục theo số
export const TEN_CUC: Record<number, string> = {
  2: 'Thủy Nhị Cục',
  3: 'Mộc Tam Cục',
  4: 'Kim Tứ Cục',
  5: 'Thổ Ngũ Cục',
  6: 'Hỏa Lục Cục',
};

// 14 Chính Tinh
export const CHINH_TINH = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh',
  'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'
] as const;

// Giờ sinh (12 canh giờ)
export const GIO_SINH = [
  { label: 'Tý (23h-1h)', value: 0 },
  { label: 'Sửu (1h-3h)', value: 1 },
  { label: 'Dần (3h-5h)', value: 2 },
  { label: 'Mão (5h-7h)', value: 3 },
  { label: 'Thìn (7h-9h)', value: 4 },
  { label: 'Tỵ (9h-11h)', value: 5 },
  { label: 'Ngọ (11h-13h)', value: 6 },
  { label: 'Mùi (13h-15h)', value: 7 },
  { label: 'Thân (15h-17h)', value: 8 },
  { label: 'Dậu (17h-19h)', value: 9 },
  { label: 'Tuất (19h-21h)', value: 10 },
  { label: 'Hợi (21h-23h)', value: 11 },
] as const;

// Loại sao
export type StarType = 'chinh_tinh' | 'phu_tinh_tot' | 'phu_tinh_xau' | 'phu_tinh_trung';

export type TuHoaType = 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';

export interface Star {
  name: string;
  type: StarType;
  mieuDia?: string; // Miếu, Vượng, Đắc, Bình, Hãm
  tuHoa?: TuHoaType;
}

export interface Cung {
  name: string;         // Tên cung (Mệnh, Phụ Mẫu, ...)
  diaChi: string;       // Địa chi của cung (Tý, Sửu, ...)
  thienCan: string;     // Thiên can của cung
  stars: Star[];        // Các sao trong cung
  daiHan: string;       // Đại hạn
  tieuHan: number[];    // Các năm Tiểu Hạn rơi vào cung này
}

export interface TuViChart {
  hoTen: string;
  gioiTinh: 'Nam' | 'Nữ';
  ngaySinh: Date;
  ngayAmLich: { day: number; month: number; year: number; isLeapMonth: boolean };
  gioSinh: number;      // 0-11
  thienCan: string;
  diaChi: string;
  conGiap: string;
  cuc: string;
  cucNumber: number;
  menhChu: string;
  thanChu: string;
  amDuong: string;
  nguHanh: string;
  cungMenhViTri: number; // Vị trí Địa Chi của cung Mệnh (0=Tý)
  cungThanViTri: number; // Vị trí Địa Chi của cung Thân
  cungs: Cung[];
}

// Tính vị trí sao Tử Vi theo Cục và ngày sinh âm lịch
// Thuật toán: khởi từ Dần, tăng vị trí mỗi khi accum tăng thêm Cục
// Sai lệch chẵn → tiến, lẻ → lùi
export function getTuViPosition(cuc: number, ngay: number): number {
  let pos = 2; // 0-indexed Dần
  let accum = cuc;
  while (accum < ngay) {
    accum += cuc;
    pos += 1;
  }
  let saiLech = accum - ngay;
  if (saiLech % 2 === 1) {
    saiLech = -saiLech;
  }
  const rawResult = pos + saiLech;
  return ((rawResult % 12) + 12) % 12;
}

// Vị trí các sao nhóm Tử Vi (tính từ vị trí Tử Vi)
// offset từ Tử Vi (theo chiều nghịch - lùi)
export const NHOM_TU_VI_OFFSET: Record<string, number> = {
  'Tử Vi': 0,
  'Thiên Cơ': -1,
  'Thái Dương': -3,
  'Vũ Khúc': -4,
  'Thiên Đồng': -5,
  'Liêm Trinh': -8,
};

// Vị trí các sao nhóm Thiên Phủ (tính từ vị trí Thiên Phủ)
// Thiên Phủ đối xứng với Tử Vi qua trục Dần-Thân
export const NHOM_THIEN_PHU_OFFSET: Record<string, number> = {
  'Thiên Phủ': 0,
  'Thái Âm': 1,
  'Tham Lang': 2,
  'Cự Môn': 3,
  'Thiên Tướng': 4,
  'Thiên Lương': 5,
  'Thất Sát': 6,
  'Phá Quân': 10,
};
