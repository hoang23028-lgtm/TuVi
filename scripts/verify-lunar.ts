import { verifyAllLunarCases } from '../src/lib/tuvi/lunarVerify';
import { solarToLunar } from '../src/lib/tuvi/lunar';
import { LUNAR_REFERENCE_CASES } from '../src/lib/tuvi/lunarCases';

for (const t of LUNAR_REFERENCE_CASES) {
  const g = solarToLunar(t.solar.y, t.solar.m, t.solar.d);
  console.log(
    t.id,
    `${t.solar.d}/${t.solar.m}/${t.solar.y}`,
    '→',
    `${g.day}/${g.month}/${g.year}${g.isLeapMonth ? ' (nhuận)' : ''}`,
    '| expected',
    `${t.lunar.day}/${t.lunar.month}/${t.lunar.year}${t.lunar.isLeapMonth ? ' (nhuận)' : ''}`,
  );
}

const results = verifyAllLunarCases();
const passed = results.filter((r) => r.pass).length;
console.log(`\nKết quả: ${passed}/${results.length}`);
results.filter((r) => !r.pass).forEach((r) => console.warn('FAIL', r.id, r.errors));
if (passed < results.length) process.exit(1);
