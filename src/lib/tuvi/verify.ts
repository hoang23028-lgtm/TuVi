import { DIA_CHI, THIEN_CAN } from './constants';
import { tinhLaSo } from './calculator';
import { VERIFIED_CASES, VerifiedCase } from './verifiedCases';

export interface VerifyResult {
  id: string;
  pass: boolean;
  errors: string[];
}

export function verifyCase(test: VerifiedCase): VerifyResult {
  const errors: string[] = [];
  const d = new Date(test.solar.y, test.solar.m - 1, test.solar.d);
  const chart = tinhLaSo(test.hoTen, test.gioiTinh, d, test.gioSinh, {
    dungLapXuan: test.useLapXuan,
    amLich: test.amLich
      ? { ...test.amLich, isLeapMonth: test.amLich.isLeapMonth ?? false }
      : undefined,
  });

  if (chart.thienCan !== test.expected.canNam) {
    errors.push(`Can: ${chart.thienCan} ≠ ${test.expected.canNam}`);
  }
  if (chart.diaChi !== test.expected.chiNam) {
    errors.push(`Chi: ${chart.diaChi} ≠ ${test.expected.chiNam}`);
  }
  if (chart.cuc !== test.expected.cuc) {
    errors.push(`Cục: ${chart.cuc} ≠ ${test.expected.cuc}`);
  }
  const menhDc = chart.cungs[chart.cungMenhViTri].diaChi;
  if (menhDc !== test.expected.cungMenhDiaChi) {
    errors.push(`Mệnh Địa Chi: ${menhDc} ≠ ${test.expected.cungMenhDiaChi}`);
  }

  const tuanCungs = chart.cungs.filter((c) => c.tuan).map((c) => c.diaChi);
  for (const t of test.expected.tuan) {
    if (!tuanCungs.includes(t)) errors.push(`Thiếu Tuần tại ${t}`);
  }

  const trietCungs = chart.cungs.filter((c) => c.triet).map((c) => c.diaChi);
  for (const t of test.expected.triet) {
    if (!trietCungs.includes(t)) errors.push(`Thiếu Triệt tại ${t}`);
  }

  return { id: test.id, pass: errors.length === 0, errors };
}

export function verifyAllCases(): VerifyResult[] {
  return VERIFIED_CASES.map(verifyCase);
}

/** Gọi từ console dev để in báo cáo */
export function printVerificationReport(): void {
  const results = verifyAllCases();
  const passed = results.filter((r) => r.pass).length;
  console.log(`Đối chiếu lá số mẫu: ${passed}/${results.length} đạt`);
  results.forEach((r) => {
    if (!r.pass) console.warn(r.id, r.errors);
  });
}
