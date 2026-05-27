/**
 * Hệ thống luận giải Tử Vi
 */

import { Cung, Star, TuViChart, TuHoaType } from './constants';

interface Interpretation {
  overview: string;
  details: string[];
  rating: number; // 1-5
}

// Luận giải chính tinh
const CHINH_TINH_LUAN_GIAI: Record<string, { tinh_cach: string; su_nghiep: string; tai_loc: string; tinh_cam: string }> = {
  'Tử Vi': {
    tinh_cach: 'Người có phong thái đế vương, cao quý, uy nghi, có khả năng lãnh đạo xuất sắc. Tính cách độc lập, tự chủ, đôi khi có phần kiêu ngạo.',
    su_nghiep: 'Thích hợp với vị trí quản lý, lãnh đạo. Có thể thành công lớn trong chính trị, kinh doanh quy mô lớn, hoặc các lĩnh vực đòi hỏi quyền lực.',
    tai_loc: 'Tài lộc dồi dào, có phúc về vật chất. Tiền bạc đến từ quyền lực và vị trí xã hội.',
    tinh_cam: 'Trong tình cảm khá khó tính, đòi hỏi cao. Cần người bạn đời hiểu và tôn trọng.',
  },
  'Thiên Cơ': {
    tinh_cach: 'Thông minh, mưu trí, khéo léo, giỏi tính toán. Tâm tính nhân hậu nhưng hay lo nghĩ, đa mưu túc trí.',
    su_nghiep: 'Phù hợp với công việc cần trí tuệ như nghiên cứu, kỹ thuật, lập kế hoạch, tư vấn chiến lược.',
    tai_loc: 'Tài lộc đến từ trí tuệ và sự khéo léo. Không phải dạng giàu đột biến mà tích lũy dần.',
    tinh_cam: 'Đa cảm, lãng mạn nhưng hay phân tích quá nhiều trong tình cảm.',
  },
  'Thái Dương': {
    tinh_cach: 'Người quang minh, chính đại, hào phóng, thích giúp đỡ người khác. Tính cách cương trực, nóng nảy nhưng hết lòng.',
    su_nghiep: 'Thích hợp với công việc công khai, giao tiếp nhiều. Chính trị, ngoại giao, giáo dục, truyền thông.',
    tai_loc: 'Kiếm tiền chính đáng, không thích lươn lẹo. Tiền vào nhiều nhưng cũng chi tiêu hào phóng.',
    tinh_cam: 'Nồng nhiệt trong tình cảm, trung thành. Nam thì tốt cho sự nghiệp, nữ cần lưu ý chồng.',
  },
  'Vũ Khúc': {
    tinh_cach: 'Quyết đoán, cương nghị, thẳng thắn, có tính cô đơn. Giỏi về tài chính, quản lý tài sản.',
    su_nghiep: 'Kinh doanh, tài chính, ngân hàng, bất động sản. Có tài quản lý tiền bạc và đầu tư.',
    tai_loc: 'Sao tài tinh số một. Có khả năng tạo ra tài sản lớn, giỏi quản lý và sinh lời.',
    tinh_cam: 'Khô khan trong biểu đạt tình cảm, cần học cách mềm mỏng hơn.',
  },
  'Thiên Đồng': {
    tinh_cach: 'Hiền lành, phúc hậu, thích hưởng thụ, lạc quan yêu đời. Có tính trẻ trung, hồn nhiên.',
    su_nghiep: 'Phù hợp với nghệ thuật, giải trí, du lịch, ẩm thực. Công việc nhẹ nhàng, không áp lực.',
    tai_loc: 'Phúc lộc tự nhiên đến, không cần vất vả nhiều. Tuy nhiên khó đạt giàu sang cực lớn.',
    tinh_cam: 'Lãng mạn, dễ yêu, dễ được yêu. Đời tình cảm phong phú.',
  },
  'Liêm Trinh': {
    tinh_cach: 'Phức tạp, đa diện, có thể rất tốt hoặc rất xấu tùy cách cục. Thông minh, quyến rũ, đôi khi lắt léo.',
    su_nghiep: 'Chính trị, pháp luật, điều tra, hoặc nghệ thuật. Có khả năng xử lý tình huống phức tạp.',
    tai_loc: 'Tài lộc bất ổn, có thể rất giàu hoặc rất nghèo tùy cách cục và vận hạn.',
    tinh_cam: 'Đa tình, dễ vướng vào chuyện tình cảm phức tạp. Cần tỉnh táo trong quan hệ.',
  },
  'Thiên Phủ': {
    tinh_cach: 'Đức độ, từ bi, phúc hậu, ôn hòa. Có tính bảo thủ, coi trọng truyền thống.',
    su_nghiep: 'Quản lý, hành chính, giáo dục, y tế. Vị trí ổn định, được kính trọng.',
    tai_loc: 'Kho tài lộc, có phúc về vật chất. Không thiếu thốn, cuộc sống sung túc.',
    tinh_cam: 'Chung thủy, gia đình hạnh phúc. Là người bạn đời đáng tin cậy.',
  },
  'Thái Âm': {
    tinh_cach: 'Dịu dàng, tinh tế, giàu cảm xúc, nghệ sĩ tính. Thích yên tĩnh, suy tư.',
    su_nghiep: 'Nghệ thuật, văn học, bất động sản, công việc ban đêm. Sáng tạo và nhạy cảm.',
    tai_loc: 'Tài lộc liên quan đến bất động sản, đất đai. Thu nhập ổn định từ tài sản.',
    tinh_cam: 'Lãng mạn, sâu sắc, đôi khi đa cảm quá mức. Nữ có sao này rất nữ tính.',
  },
  'Tham Lang': {
    tinh_cach: 'Đa tài đa nghệ, giao thiệp rộng, ham học hỏi, tham vọng. Có thể tham lam nếu không tu dưỡng.',
    su_nghiep: 'Kinh doanh giải trí, ẩm thực, nghệ thuật, ngoại giao. Giỏi giao tiếp và thuyết phục.',
    tai_loc: 'Biết cách kiếm tiền từ nhiều nguồn. Tài lộc phụ thuộc vào khả năng giao tiếp.',
    tinh_cam: 'Đào hoa, quyến rũ, dễ thu hút người khác. Cần cẩn thận với cám dỗ.',
  },
  'Cự Môn': {
    tinh_cach: 'Ăn nói sắc bén, thích tranh luận, có tài hùng biện. Đôi khi gây thị phi, khẩu thiệt.',
    su_nghiep: 'Luật sư, giảng viên, nhà báo, MC, chính trị gia. Mọi nghề liên quan đến miệng lưỡi.',
    tai_loc: 'Kiếm tiền bằng miệng, bằng lời nói. Cần cẩn thận vì miệng cũng là nguồn gây họa.',
    tinh_cam: 'Hay cãi vã, bất đồng. Cần học cách im lặng đúng lúc trong tình yêu.',
  },
  'Thiên Tướng': {
    tinh_cach: 'Chính trực, công bằng, thích giúp đỡ, có duyên quý nhân. Được mọi người quý mến.',
    su_nghiep: 'Chính trị, từ thiện, tôn giáo, công tác xã hội. Luôn được quý nhân phù trợ.',
    tai_loc: 'Tài lộc đến từ sự giúp đỡ của người khác. Không thiếu nhưng cũng không quá dư.',
    tinh_cam: 'Được yêu mến, có duyên lành trong hôn nhân. Gia đình hòa thuận.',
  },
  'Thiên Lương': {
    tinh_cach: 'Đạo đức, từ bi, trí tuệ sâu sắc, có khuynh hướng tôn giáo/triết học. Thích yên tĩnh.',
    su_nghiep: 'Y khoa, giáo dục, tôn giáo, nghiên cứu, tư vấn. Nghề cao quý được kính trọng.',
    tai_loc: 'Không coi trọng vật chất, nhưng cuộc sống đầy đủ. Phúc đức che chở.',
    tinh_cam: 'Chung thủy, sâu sắc, nhưng đôi khi quá lý tưởng hóa tình yêu.',
  },
  'Thất Sát': {
    tinh_cach: 'Dũng cảm, quyết liệt, không sợ khó khăn, có tính chiến đấu cao. Đôi khi quá mạnh bạo.',
    su_nghiep: 'Quân đội, cảnh sát, kinh doanh mạo hiểm, thể thao, đầu tư. Thích thử thách.',
    tai_loc: 'Kiếm tiền bằng sức lực và sự quyết đoán. Có thể giàu nhanh hoặc mất nhanh.',
    tinh_cam: 'Mạnh mẽ trong tình cảm, yêu hết mình. Nhưng cũng dễ gây tổn thương.',
  },
  'Phá Quân': {
    tinh_cach: 'Phá cách, đổi mới, không theo lối mòn, dám làm dám chịu. Tinh thần tiên phong.',
    su_nghiep: 'Khởi nghiệp, cải cách, công nghệ mới, lĩnh vực tiên phong. Không thích ổn định.',
    tai_loc: 'Tài lộc biến động lớn, phải qua nhiều thay đổi mới ổn định. Cuối đời thường khá hơn.',
    tinh_cam: 'Tình cảm nhiều biến động, có thể ly hôn tái hôn. Cần kiên nhẫn.',
  },
};

// Luận giải phụ tinh tốt
const PHU_TINH_TOT: Record<string, string> = {
  'Tả Phù': 'Được quý nhân bên trái phò trợ, có nhiều người giúp đỡ. Thêm lực cho chính tinh.',
  'Hữu Bật': 'Được quý nhân bên phải hỗ trợ, nhiều bạn bè tốt. Gia tăng sức mạnh cho chính tinh.',
  'Văn Xương': 'Thông minh, học giỏi, có tài văn chương, thi cử đỗ đạt. Sao học vấn.',
  'Văn Khúc': 'Tài hoa, khéo léo, giỏi nghệ thuật, có duyên văn chương. Bổ trợ học vấn.',
  'Thiên Khôi': 'Quý nhân phù trợ từ trên, được cấp trên yêu mến, dễ thăng tiến.',
  'Thiên Việt': 'Quý nhân hỗ trợ từ dưới, được thuộc cấp ủng hộ, nhiều cơ hội.',
  'Lộc Tồn': 'Tài lộc bền vững, có của để dành, không lo thiếu thốn vật chất.',
  'Thiên Mã': 'Di chuyển, thay đổi, xuất ngoại. Kết hợp Lộc Tồn thành "Lộc Mã giao trì" - đại phát.',
  'Hồng Loan': 'Duyên lành hôn nhân, hôn sự tốt đẹp, được người yêu mến.',
  'Thiên Hỷ': 'Tin vui, hỷ sự, sinh con, thăng chức. Mọi việc thuận lợi.',
};

// Luận giải phụ tinh xấu
const PHU_TINH_XAU: Record<string, string> = {
  'Kình Dương': 'Tính cương ngạnh, nóng nảy, dễ gây gổ. Nhưng cũng cho sức mạnh chiến đấu nếu biết dùng.',
  'Đà La': 'Trì trệ, chậm chạp, gặp nhiều trở ngại. Nhưng kiên trì sẽ thành công.',
  'Hỏa Tinh': 'Nóng vội, bộc phát, dễ tai nạn. Kết hợp Tham Lang có thể đại phát bất ngờ.',
  'Linh Tinh': 'Âm ỉ, ngầm gây hại, bất ngờ. Kết hợp Tham Lang cũng có thể phát.',
  'Địa Không': 'Trống rỗng, mất mát về vật chất. Nhưng tốt cho tu hành, triết học, nghệ thuật.',
  'Địa Kiếp': 'Cướp đoạt, mất mát đột ngột. Cần cẩn thận với tiền bạc và đầu tư.',
  'Thiên Khốc': 'Buồn rầu, khóc lóc, tang tóc. Ảnh hưởng tinh thần.',
  'Thiên Hư': 'Hư hao, lãng phí, không thực tế. Cần thực tế hơn.',
};

const TU_HOA_LUAN: Record<TuHoaType, string> = {
  Lộc: 'Hóa Lộc — thuận lợi về tài lộc, danh tiếng, cơ hội phát triển.',
  Quyền: 'Hóa Quyền — quyền lực, địa vị, khả năng lãnh đạo và quyết đoán.',
  Khoa: 'Hóa Khoa — danh tiếng học vấn, uy tín, được tôn trọng.',
  Kỵ: 'Hóa Kỵ — trở ngại, thị phi, cần thận trọng và kiên nhẫn.',
};

export interface TongQuanLaSo {
  intro: string;
  tinhCach: string;
  suNghiep: string;
  taiLoc: string;
  tinhCam: string;
  menhThanDongCung: boolean;
  tuHoa: { sao: string; hoa: TuHoaType; moTa: string }[];
}

function layCungTheoTen(chart: TuViChart, ten: string): Cung {
  return chart.cungs.find((c) => c.name === ten) ?? chart.cungs[chart.cungMenhViTri];
}

function moTaCungChinhTinh(cung: Cung, linhVuc: 'tinh_cach' | 'su_nghiep' | 'tai_loc' | 'tinh_cam'): string {
  const chinh = cung.stars.filter((s) => s.type === 'chinh_tinh');
  if (chinh.length === 0) {
    return `Cung ${cung.name} vô chính diệu — nên xem cung đối xứng và tam hợp để bổ sung.`;
  }
  const parts = chinh.map((s) => {
    const info = CHINH_TINH_LUAN_GIAI[s.name];
    const hoa = s.tuHoa ? ` (${TU_HOA_LUAN[s.tuHoa].split('—')[0].trim()})` : '';
    return info ? `${s.name}${hoa}: ${info[linhVuc]}` : `${s.name}${hoa} tại ${cung.name}.`;
  });
  return parts.join(' ');
}

/**
 * Luận giải một cung
 */
export function luanGiaiCung(cung: Cung, cungName: string): Interpretation {
  const details: string[] = [];
  let totalRating = 3;
  let starCount = 0;
  
  // Phân tích chính tinh
  const chinhTinh = cung.stars.filter(s => s.type === 'chinh_tinh');
  const phuTinhTot = cung.stars.filter(s => s.type === 'phu_tinh_tot');
  const phuTinhXau = cung.stars.filter(s => s.type === 'phu_tinh_xau');
  
  // Luận giải từng chính tinh
  for (const star of chinhTinh) {
    const info = CHINH_TINH_LUAN_GIAI[star.name];
    if (star.tuHoa) {
      details.push(`**${star.name}** ${TU_HOA_LUAN[star.tuHoa]}`);
    }
    if (info) {
      switch (cungName) {
        case 'Mệnh':
          details.push(`**${star.name}** tọa Mệnh: ${info.tinh_cach}`);
          break;
        case 'Quan Lộc':
          details.push(`**${star.name}** tọa Quan Lộc: ${info.su_nghiep}`);
          break;
        case 'Tài Bạch':
          details.push(`**${star.name}** tọa Tài Bạch: ${info.tai_loc}`);
          break;
        case 'Phu Thê':
          details.push(`**${star.name}** tọa Phu Thê: ${info.tinh_cam}`);
          break;
        default:
          details.push(`**${star.name}** tọa ${cungName}: ${info.tinh_cach}`);
      }
      starCount++;
    }
  }
  
  // Luận giải phụ tinh tốt
  for (const star of phuTinhTot) {
    const info = PHU_TINH_TOT[star.name];
    if (info) {
      details.push(`**${star.name}**: ${info}`);
      totalRating += 0.3;
    }
  }
  
  // Luận giải phụ tinh xấu
  for (const star of phuTinhXau) {
    const info = PHU_TINH_XAU[star.name];
    if (info) {
      details.push(`**${star.name}**: ${info}`);
      totalRating -= 0.3;
    }
  }
  
  // Tính rating
  totalRating += phuTinhTot.length * 0.2;
  totalRating -= phuTinhXau.length * 0.2;
  totalRating = Math.max(1, Math.min(5, Math.round(totalRating)));
  
  // Overview
  let overview = '';
  if (chinhTinh.length === 0) {
    overview = `Cung ${cungName} không có chính tinh (vô chính diệu), cần xem cung đối xứng để luận giải.`;
  } else {
    const starNames = chinhTinh.map(s => s.name).join(', ');
    if (totalRating >= 4) {
      overview = `Cung ${cungName} có ${starNames} - cách cục tốt đẹp, nhiều thuận lợi.`;
    } else if (totalRating >= 3) {
      overview = `Cung ${cungName} có ${starNames} - cách cục trung bình, có cả thuận lợi và thử thách.`;
    } else {
      overview = `Cung ${cungName} có ${starNames} - cần lưu ý, có thể gặp nhiều thử thách.`;
    }
  }
  
  if (phuTinhTot.length > 0) {
    overview += ` Được ${phuTinhTot.map(s => s.name).join(', ')} hỗ trợ.`;
  }
  if (phuTinhXau.length > 0) {
    overview += ` Có ${phuTinhXau.map(s => s.name).join(', ')} ảnh hưởng.`;
  }
  if (cung.tuan) {
    overview += ' Cung Tuần — khí lực sao giảm, cần xem cung đối xứng.';
    totalRating = Math.max(1, totalRating - 1);
  }
  if (cung.triet) {
    overview += ' Cung Triệt — trở ngại, chậm trễ, nên kiên nhẫn.';
    totalRating = Math.max(1, totalRating - 1);
  }
  
  return { overview, details, rating: totalRating };
}

/**
 * Luận giải tổng quát lá số (4 lĩnh vực chính)
 */
export function luanGiaiTongQuat(chart: TuViChart): TongQuanLaSo {
  const cungMenh = chart.cungs[chart.cungMenhViTri];
  const chinhMenh = cungMenh.stars.filter((s) => s.type === 'chinh_tinh');
  const menhThanDongCung = chart.cungMenhViTri === chart.cungThanViTri;

  const tuHoa: TongQuanLaSo['tuHoa'] = [];
  for (const cung of chart.cungs) {
    for (const sao of cung.stars) {
      if (sao.tuHoa) {
        tuHoa.push({ sao: sao.name, hoa: sao.tuHoa, moTa: TU_HOA_LUAN[sao.tuHoa] });
      }
    }
  }

  let intro = `Sinh năm ${chart.thienCan} ${chart.diaChi} (${chart.conGiap}), mệnh ${chart.nguHanh}, ${chart.amDuong} ${chart.gioiTinh}, Cục ${chart.cuc}. `;
  if (chinhMenh.length > 0) {
    intro += `Cung Mệnh an ${chinhMenh.map((s) => s.name).join(', ')}.`;
  } else {
    intro += 'Cung Mệnh vô chính diệu — vận mệnh biến động theo đại vận và cung đối.';
  }
  if (menhThanDongCung) {
    intro += ' Mệnh Thân đồng cung: tính cách và hành động thống nhất, quyết đoán rõ ràng.';
  }

  return {
    intro,
    tinhCach: moTaCungChinhTinh(layCungTheoTen(chart, 'Mệnh'), 'tinh_cach'),
    suNghiep: moTaCungChinhTinh(layCungTheoTen(chart, 'Quan Lộc'), 'su_nghiep'),
    taiLoc: moTaCungChinhTinh(layCungTheoTen(chart, 'Tài Bạch'), 'tai_loc'),
    tinhCam: moTaCungChinhTinh(layCungTheoTen(chart, 'Phu Thê'), 'tinh_cam'),
    menhThanDongCung,
    tuHoa,
  };
}
