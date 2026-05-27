'use client';

import { TuViChart } from '@/lib/tuvi/constants';
import { luanGiaiTongQuat } from '@/lib/tuvi/interpretation';

const SECTIONS = [
  { key: 'tinhCach' as const, title: 'Tính cách', icon: '👤', color: 'from-rose-50 to-pink-50 border-rose-200' },
  { key: 'suNghiep' as const, title: 'Sự nghiệp', icon: '💼', color: 'from-blue-50 to-indigo-50 border-blue-200' },
  { key: 'taiLoc' as const, title: 'Tài lộc', icon: '💰', color: 'from-amber-50 to-yellow-50 border-amber-200' },
  { key: 'tinhCam' as const, title: 'Tình cảm', icon: '❤️', color: 'from-purple-50 to-violet-50 border-purple-200' },
];

const HOA_COLORS: Record<string, string> = {
  Lộc: 'bg-green-100 text-green-800',
  Quyền: 'bg-blue-100 text-blue-800',
  Khoa: 'bg-amber-100 text-amber-800',
  Kỵ: 'bg-red-100 text-red-800',
};

export default function ChartSummary({ chart }: { chart: TuViChart }) {
  const tongQuan = luanGiaiTongQuat(chart);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-r from-amber-50 via-red-50 to-purple-50 rounded-xl p-5 border border-amber-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Tổng quan vận mệnh</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{tongQuan.intro}</p>
      </div>

      {tongQuan.tuHoa.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Tứ Hóa năm sinh</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tongQuan.tuHoa.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-bold flex-shrink-0 ${HOA_COLORS[item.hoa]}`}>
                  Hóa {item.hoa}
                </span>
                <span className="text-gray-600">
                  <strong className="text-gray-800">{item.sao}</strong> — {item.moTa}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map((sec) => (
          <div key={sec.key} className={`bg-gradient-to-br ${sec.color} rounded-xl border p-4`}>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>{sec.icon}</span>
              {sec.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{tongQuan[sec.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
