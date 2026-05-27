import { TuViChart } from '@/lib/tuvi/constants';
import { luanGiaiTongQuat } from '@/lib/tuvi/interpretation';

export function buildChartContextForAi(chart: TuViChart): string {
  const tongQuan = luanGiaiTongQuat(chart);
  const cungLines = chart.cungs.map((c) => {
    const stars = c.stars.map((s) => s.name + (s.tuHoa ? `(Hóa ${s.tuHoa})` : '')).join(', ');
    const flags = [c.tuan && 'Tuần', c.triet && 'Triệt'].filter(Boolean).join(', ');
    return `- ${c.name} (${c.thienCan} ${c.diaChi})${flags ? ` [${flags}]` : ''}: ${stars || '(không sao)'}`;
  });

  return `
Họ tên: ${chart.hoTen}
Giới tính: ${chart.gioiTinh} (${chart.amDuong})
Năm sinh âm lịch: ${chart.ngayAmLich.day}/${chart.ngayAmLich.month}/${chart.ngayAmLich.year}${chart.ngayAmLich.isLeapMonth ? ' (nhuận)' : ''}
Can Chi: ${chart.thienCan} ${chart.diaChi} · Cục: ${chart.cuc} · Mệnh: ${chart.nguHanh}
Mệnh chủ: ${chart.menhChu} · Thân chủ: ${chart.thanChu}

Tổng quan hệ thống:
${tongQuan.intro}
Tính cách: ${tongQuan.tinhCach}
Sự nghiệp: ${tongQuan.suNghiep}
Tài lộc: ${tongQuan.taiLoc}
Tình cảm: ${tongQuan.tinhCam}

12 cung:
${cungLines.join('\n')}
`.trim();
}
