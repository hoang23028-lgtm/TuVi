import { solarToLunar, lunarToSolar } from './lunar';
import { LUNAR_REFERENCE_CASES, LunarCase } from './lunarCases';

export interface LunarVerifyResult {
  id: string;
  pass: boolean;
  errors: string[];
}

export function verifyLunarCase(test: LunarCase): LunarVerifyResult {
  const errors: string[] = [];
  const { y, m, d } = test.solar;
  const got = solarToLunar(y, m, d);

  if (got.year !== test.lunar.year) {
    errors.push(`Năm: ${got.year} ≠ ${test.lunar.year}`);
  }
  if (got.month !== test.lunar.month) {
    errors.push(`Tháng: ${got.month} ≠ ${test.lunar.month}`);
  }
  if (got.day !== test.lunar.day) {
    errors.push(`Ngày: ${got.day} ≠ ${test.lunar.day}`);
  }
  const expectLeap = test.lunar.isLeapMonth ?? false;
  if (got.isLeapMonth !== expectLeap) {
    errors.push(`Nhuận: ${got.isLeapMonth} ≠ ${expectLeap}`);
  }

  try {
    const back = lunarToSolar(
      test.lunar.year,
      test.lunar.month,
      test.lunar.day,
      expectLeap,
    );
    if (back.year !== y || back.month !== m || back.day !== d) {
      errors.push(`Round-trip: ${back.day}/${back.month}/${back.year} ≠ ${d}/${m}/${y}`);
    }
  } catch {
    errors.push('lunarToSolar thất bại');
  }

  return { id: test.id, pass: errors.length === 0, errors };
}

export function verifyAllLunarCases(): LunarVerifyResult[] {
  return LUNAR_REFERENCE_CASES.map(verifyLunarCase);
}

export function printLunarReport(): void {
  const results = verifyAllLunarCases();
  const passed = results.filter((r) => r.pass).length;
  console.log(`Âm lịch: ${passed}/${results.length} mẫu đạt`);
  results.filter((r) => !r.pass).forEach((r) => {
    console.warn(r.id, r.errors);
  });
}
