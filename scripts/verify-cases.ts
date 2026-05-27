import { verifyAllCases } from '../src/lib/tuvi/verify';
import { tinhLaSo } from '../src/lib/tuvi/calculator';
import { VERIFIED_CASES } from '../src/lib/tuvi/verifiedCases';

for (const t of VERIFIED_CASES) {
  const d = new Date(t.solar.y, t.solar.m - 1, t.solar.d);
  const c = tinhLaSo(t.hoTen, t.gioiTinh, d, t.gioSinh, {
    dungLapXuan: t.useLapXuan,
    amLich: t.amLich,
  });
  const tuan = c.cungs.filter((x) => x.tuan).map((x) => x.diaChi);
  const triet = c.cungs.filter((x) => x.triet).map((x) => x.diaChi);
  console.log('---', t.id);
  const menh = c.cungs[c.cungMenhViTri];
  console.log({
    can: c.thienCan,
    chi: c.diaChi,
    cuc: c.cuc,
    menh: `${menh.thienCan} ${menh.diaChi} @${menh.diaChi}`,
    tuan,
    triet,
  });
}

const results = verifyAllCases();
const passed = results.filter((r) => r.pass).length;
console.log(`\nĐối chiếu: ${passed}/${results.length} đạt`);
results.filter((r) => !r.pass).forEach((r) => console.warn('FAIL', r.id, r.errors));

if (passed < results.length) process.exit(1);
