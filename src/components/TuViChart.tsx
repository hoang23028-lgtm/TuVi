'use client';

import { useState, useMemo } from 'react';
import { TuViChart as TuViChartType, Cung, Star, GIO_SINH, CUNG_VI_TRI } from '@/lib/tuvi/constants';
import { luanGiaiCung } from '@/lib/tuvi/interpretation';
import ChartSummary from '@/components/ChartSummary';

const HOA_BADGE: Record<string, string> = {
  Lộc: 'bg-green-600',
  Quyền: 'bg-blue-600',
  Khoa: 'bg-amber-600',
  Kỵ: 'bg-red-600',
};

function StarLabel({ star, className }: { star: Star; className: string }) {
  return (
    <span className={className}>
      {star.name}
      {star.tuHoa && (
        <sup className={`ml-0.5 text-[0.55rem] text-white px-0.5 rounded ${HOA_BADGE[star.tuHoa]}`}>
          {star.tuHoa}
        </sup>
      )}
    </span>
  );
}

interface TuViChartProps {
  chart: TuViChartType;
}

const currentYear = new Date().getFullYear();

function CungCell({ cung, isActive, isMenh, isThan, isCurrentTieuHan, onClick }: {
  cung: Cung;
  isActive: boolean;
  isMenh: boolean;
  isThan: boolean;
  isCurrentTieuHan: boolean;
  onClick: () => void;
}) {
  const chinhTinh = cung.stars.filter(s => s.type === 'chinh_tinh');
  const phuTinhTot = cung.stars.filter(s => s.type === 'phu_tinh_tot');
  const phuTinhXau = cung.stars.filter(s => s.type === 'phu_tinh_xau');
  const phuTinhTrung = cung.stars.filter(s => s.type === 'phu_tinh_trung');

  return (
    <div 
      className={`tuvi-cung cursor-pointer ${isActive ? 'active' : ''} ${isCurrentTieuHan ? 'tieu-han-current' : ''}`}
      onClick={onClick}
    >
      {/* Header: Tên cung + Địa chi */}
      <div className="flex justify-between items-start mb-1">
        <span className="cung-name">
          {cung.name}
          {isMenh && <span className="text-red-600 ml-0.5">★</span>}
          {isThan && <span className="text-blue-600 ml-0.5">◆</span>}
        </span>
        <span className="cung-diachi">{cung.thienCan} {cung.diaChi}</span>
      </div>

      {/* Chính tinh */}
      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mb-1">
        {chinhTinh.map((star, i) => (
          <StarLabel key={i} star={star} className="star-chinh" />
        ))}
      </div>

      {/* Phụ tinh tốt */}
      <div className="flex flex-wrap gap-x-1 gap-y-0.5">
        {phuTinhTot.map((star, i) => (
          <StarLabel key={i} star={star} className="star-tot" />
        ))}
      </div>

      {/* Phụ tinh xấu */}
      <div className="flex flex-wrap gap-x-1 gap-y-0.5">
        {phuTinhXau.map((star, i) => (
          <StarLabel key={i} star={star} className="star-xau" />
        ))}
      </div>

      {/* Phụ tinh trung tính */}
      <div className="flex flex-wrap gap-x-1 gap-y-0.5 mt-auto">
        {phuTinhTrung.slice(0, 4).map((star, i) => (
          <span key={i} className="star-trung">{star.name}</span>
        ))}
        {phuTinhTrung.length > 4 && (
          <span className="star-trung opacity-60">+{phuTinhTrung.length - 4}</span>
        )}
      </div>

      {/* Footer: Đại hạn + Tiểu hạn */}
      <div className="flex justify-between items-end mt-1">
        {isCurrentTieuHan && (
          <span className="text-[0.6rem] font-bold text-orange-600 bg-orange-50 px-1 rounded">
            TH {currentYear}
          </span>
        )}
        {cung.daiHan && <span className="dai-han">{cung.daiHan}</span>}
      </div>
    </div>
  );
}

type TabType = 'chart' | 'overview' | 'yearly';

export default function TuViChartComponent({ chart }: TuViChartProps) {
  const [activeCung, setActiveCung] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('chart');
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const gridPositions = useMemo(() => [
    { row: 0, col: 0, diaChiIndex: 5 },
    { row: 0, col: 1, diaChiIndex: 6 },
    { row: 0, col: 2, diaChiIndex: 7 },
    { row: 0, col: 3, diaChiIndex: 8 },
    { row: 1, col: 3, diaChiIndex: 9 },
    { row: 2, col: 3, diaChiIndex: 10 },
    { row: 3, col: 3, diaChiIndex: 11 },
    { row: 3, col: 2, diaChiIndex: 0 },
    { row: 3, col: 1, diaChiIndex: 1 },
    { row: 3, col: 0, diaChiIndex: 2 },
    { row: 2, col: 0, diaChiIndex: 3 },
    { row: 1, col: 0, diaChiIndex: 4 },
  ], []);

  // Find cung with current year Tiểu Hạn
  const currentTieuHanCung = useMemo(() => {
    return chart.cungs.findIndex(c => c.tieuHan.includes(selectedYear));
  }, [chart.cungs, selectedYear]);

  const activeInterpretation = activeCung !== null 
    ? luanGiaiCung(chart.cungs[activeCung], chart.cungs[activeCung].name) 
    : null;

  // All 12 cung interpretations for overview
  const allInterpretations = useMemo(() => {
    return chart.cungs.map((cung, idx) => ({
      cungIndex: idx,
      cung,
      interpretation: luanGiaiCung(cung, cung.name),
    }));
  }, [chart.cungs]);

  // Year range for Tiểu Hạn selector
  const birthYear = chart.ngayAmLich.year;
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = birthYear; y <= birthYear + 99; y++) {
      years.push(y);
    }
    return years;
  }, [birthYear]);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'chart', label: 'Lá Số', icon: '⬡' },
    { id: 'overview', label: 'Tổng Quan', icon: '📋' },
    { id: 'yearly', label: 'Vận Hạn', icon: '📅' },
  ];

  return (
    <div className="w-full animate-fade-in">
      {/* Thông tin tổng quan */}
      <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-xl p-4 mb-4 border border-amber-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Họ tên:</span>
            <p className="font-bold text-gray-800">{chart.hoTen}</p>
          </div>
          <div>
            <span className="text-gray-500">Giới tính:</span>
            <p className="font-bold text-gray-800">{chart.gioiTinh} ({chart.amDuong})</p>
          </div>
          <div>
            <span className="text-gray-500">Ngày sinh (ÂL):</span>
            <p className="font-bold text-gray-800">
              {chart.ngayAmLich.day}/{chart.ngayAmLich.month}/{chart.ngayAmLich.year}
              {chart.ngayAmLich.isLeapMonth && ' (nhuận)'}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Giờ sinh:</span>
            <p className="font-bold text-gray-800">{GIO_SINH[chart.gioSinh].label}</p>
          </div>
          <div>
            <span className="text-gray-500">Năm:</span>
            <p className="font-bold text-gray-800">{chart.thienCan} {chart.diaChi} (tuổi {chart.conGiap})</p>
          </div>
          <div>
            <span className="text-gray-500">Ngũ Hành:</span>
            <p className="font-bold text-gray-800">{chart.nguHanh}</p>
          </div>
          <div>
            <span className="text-gray-500">Cục:</span>
            <p className="font-bold text-amber-700">{chart.cuc}</p>
          </div>
          <div>
            <span className="text-gray-500">Mệnh/Thân chủ:</span>
            <p className="font-bold text-gray-800">{chart.menhChu} / {chart.thanChu}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white/60 p-1 rounded-xl border border-gray-200 no-print">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Lá Số */}
      {activeTab === 'chart' && (
        <>
          {/* Bàn lá số - Desktop */}
          <div className="hidden md:grid tuvi-chart mb-4" style={{ gridTemplateAreas: `"c5 c6 c7 c8" "c4 center center c9" "c3 center center c10" "c2 c1 c0 c11"` }}>
            <div className="tuvi-center" style={{ gridArea: 'center' }}>
              <h3 className="text-xl font-bold mb-2">TỬ VI ĐẨU SỐ</h3>
              <div className="text-sm opacity-90 space-y-1">
                <p className="font-semibold">{chart.hoTen}</p>
                <p>{chart.thienCan} {chart.diaChi} - {chart.gioiTinh}</p>
                <p className="text-amber-300 font-semibold">{chart.cuc}</p>
                <p className="text-xs mt-2 opacity-70">
                  DL: {chart.ngaySinh.toLocaleDateString('vi-VN')}
                </p>
                <p className="text-xs opacity-70">
                  ÂL: {chart.ngayAmLich.day}/{chart.ngayAmLich.month}/{chart.ngayAmLich.year}
                </p>
                <p className="text-xs opacity-70">
                  {GIO_SINH[chart.gioSinh].label}
                </p>
              </div>
            </div>
            {gridPositions.map((pos) => {
              const cungIndex = pos.diaChiIndex;
              const cung = chart.cungs[cungIndex];
              return (
                <div key={cungIndex} style={{ gridArea: `c${cungIndex}` }}>
                  <CungCell
                    cung={cung}
                    isActive={activeCung === cungIndex}
                    isMenh={cungIndex === chart.cungMenhViTri}
                    isThan={cungIndex === chart.cungThanViTri}
                    isCurrentTieuHan={cungIndex === currentTieuHanCung}
                    onClick={() => setActiveCung(activeCung === cungIndex ? null : cungIndex)}
                  />
                </div>
              );
            })}
          </div>

          {/* Bàn lá số - Mobile (list view) */}
          <div className="md:hidden mb-4 space-y-2">
            {/* Cung order for mobile: Mệnh first, then clockwise */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((idx) => {
              const cung = chart.cungs[idx];
              const isMenh = idx === chart.cungMenhViTri;
              const isThan = idx === chart.cungThanViTri;
              const isTieuHan = idx === currentTieuHanCung;
              const isActive = activeCung === idx;
              const chinhTinh = cung.stars.filter(s => s.type === 'chinh_tinh');
              const phuTot = cung.stars.filter(s => s.type === 'phu_tinh_tot');
              const phuXau = cung.stars.filter(s => s.type === 'phu_tinh_xau');

              return (
                <button
                  key={idx}
                  onClick={() => setActiveCung(isActive ? null : idx)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${
                    isActive
                      ? 'bg-amber-50 border-amber-300 shadow-md'
                      : isMenh
                        ? 'bg-red-50/50 border-red-200 hover:bg-red-50'
                        : isThan
                          ? 'bg-blue-50/50 border-blue-200 hover:bg-blue-50'
                          : 'bg-white/70 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">
                        {cung.name}
                        {isMenh && <span className="text-red-600 ml-1">★</span>}
                        {isThan && <span className="text-blue-600 ml-1">◆</span>}
                      </span>
                      <span className="text-xs text-gray-400">{cung.thienCan} {cung.diaChi}</span>
                      {isTieuHan && (
                        <span className="text-[0.6rem] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">TH {currentYear}</span>
                      )}
                    </div>
                    {cung.daiHan && <span className="text-xs text-orange-600 font-medium">{cung.daiHan} tuổi</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {chinhTinh.map((s, i) => (
                      <span key={i} className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">{s.name}</span>
                    ))}
                    {phuTot.map((s, i) => (
                      <span key={`t${i}`} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{s.name}</span>
                    ))}
                    {phuXau.map((s, i) => (
                      <span key={`x${i}`} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{s.name}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1.5 text-xs mb-4 px-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>Chính tinh</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
              <span>Cát tinh</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>Hung tinh</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Trung tính</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-red-600 text-sm">★</span>
              <span>Cung Mệnh</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-600 text-sm">◆</span>
              <span>Cung Thân</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-orange-600 text-[0.65rem] font-bold bg-orange-50 px-1 rounded">TH</span>
              <span>Tiểu Hạn năm nay</span>
            </span>
            <span className="flex items-center gap-1">
              <sup className="text-[0.55rem] text-white bg-green-600 px-0.5 rounded">Lộc</sup>
              <span>Tứ Hóa</span>
            </span>
          </div>

          {/* Luận giải cung đã chọn */}
          {activeInterpretation && activeCung !== null && (
            <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Luận giải: {chart.cungs[activeCung].name}
                </h3>
                <button onClick={() => setActiveCung(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-1 mb-3">
                <span className="text-sm text-gray-500 mr-2">Đánh giá:</span>
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className={`w-4 h-4 ${i <= activeInterpretation.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Star list */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {chart.cungs[activeCung].stars.map((star, i) => (
                  <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    star.type === 'chinh_tinh' ? 'bg-red-100 text-red-700' :
                    star.type === 'phu_tinh_tot' ? 'bg-green-100 text-green-700' :
                    star.type === 'phu_tinh_xau' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {star.name}
                  </span>
                ))}
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{activeInterpretation.overview}</p>
              
              {activeInterpretation.details.length > 0 && (
                <div className="space-y-2.5 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Chi tiết:</h4>
                  {activeInterpretation.details.map((detail, i) => (
                    <p key={i} className="text-sm text-gray-600 leading-relaxed pl-3 border-l-2 border-amber-200"
                       dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>') }}
                    />
                  ))}
                </div>
              )}

              {/* Đại hạn info */}
              {chart.cungs[activeCung].daiHan && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    <strong className="text-amber-700">Đại Hạn:</strong> {chart.cungs[activeCung].daiHan} tuổi
                  </p>
                </div>
              )}

              {/* Tiểu Hạn years */}
              {chart.cungs[activeCung].tieuHan.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">
                    <strong className="text-orange-600">Tiểu Hạn các năm:</strong>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {chart.cungs[activeCung].tieuHan
                      .filter(y => y >= currentYear - 5 && y <= currentYear + 15)
                      .map(y => (
                        <span key={y} className={`text-xs px-1.5 py-0.5 rounded ${
                          y === currentYear 
                            ? 'bg-orange-500 text-white font-bold' 
                            : y < currentYear 
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-orange-50 text-orange-700'
                        }`}>
                          {y}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeCung === null && (
            <div className="text-center py-6 text-gray-400 text-sm bg-white/50 rounded-xl border border-dashed border-gray-200">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <p>Nhấn vào từng cung trên lá số để xem luận giải chi tiết</p>
            </div>
          )}
        </>
      )}

      {/* Tab Content: Tổng Quan */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          <ChartSummary chart={chart} />
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pt-2">Luận giải 12 cung</h3>
          {/* Overview for each important cung */}
          {[0, 6, 8, 4, 10, 9, 7, 1, 2, 3, 5, 11].map(offset => {
            const cungDiaChiIdx = chart.cungs.findIndex(c => c.name === CUNG_VI_TRI[offset]);
            if (cungDiaChiIdx === -1) return null;
            const entry = allInterpretations[cungDiaChiIdx];
            if (!entry) return null;

            const importantCungs = ['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Phu Thê', 'Thiên Di'];
            const isImportant = importantCungs.includes(entry.cung.name);

            return (
              <div key={offset} className={`bg-white rounded-xl border p-5 ${isImportant ? 'border-amber-200 shadow-sm' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    {entry.cung.name}
                    <span className="text-xs text-gray-400 font-normal">({entry.cung.thienCan} {entry.cung.diaChi})</span>
                    {isImportant && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Quan trọng</span>}
                  </h3>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} className={`w-3.5 h-3.5 ${i <= entry.interpretation.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {entry.cung.stars.filter(s => s.type === 'chinh_tinh').map((star, i) => (
                    <span key={i} className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-medium">{star.name}</span>
                  ))}
                  {entry.cung.stars.filter(s => s.type === 'phu_tinh_tot').map((star, i) => (
                    <span key={`t${i}`} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{star.name}</span>
                  ))}
                  {entry.cung.stars.filter(s => s.type === 'phu_tinh_xau').map((star, i) => (
                    <span key={`x${i}`} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{star.name}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{entry.interpretation.overview}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Vận Hạn */}
      {activeTab === 'yearly' && (
        <div className="animate-fade-in space-y-4">
          {/* Year selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-gray-800 mb-3">Xem vận hạn theo năm</h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedYear(y => Math.max(birthYear, y - 1))}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <select 
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-center font-bold text-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>
                    {y} {y === currentYear ? '(Năm nay)' : ''} - {y - birthYear + 1} tuổi
                  </option>
                ))}
              </select>
              <button 
                onClick={() => setSelectedYear(y => Math.min(birthYear + 99, y + 1))}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Đại Hạn for selected year */}
          {(() => {
            const tuoi = selectedYear - birthYear + 1;
            const daiHanCung = chart.cungs.find(c => {
              if (!c.daiHan) return false;
              const [start, end] = c.daiHan.split('-').map(Number);
              return tuoi >= start && tuoi <= end;
            });
            const tieuHanCung = chart.cungs.find(c => c.tieuHan.includes(selectedYear));

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Đại Hạn */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                  <h4 className="text-sm font-semibold text-amber-700 mb-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ĐẠI HẠN ({tuoi} tuổi)
                  </h4>
                  {daiHanCung ? (
                    <>
                      <p className="text-lg font-bold text-gray-800 mb-2">
                        Cung {daiHanCung.name} ({daiHanCung.thienCan} {daiHanCung.diaChi})
                      </p>
                      <p className="text-sm text-gray-500 mb-2">Giai đoạn: {daiHanCung.daiHan} tuổi</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {daiHanCung.stars.filter(s => s.type === 'chinh_tinh').map((star, i) => (
                          <span key={i} className="text-xs bg-white/80 text-red-700 px-1.5 py-0.5 rounded font-medium">{star.name}</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {luanGiaiCung(daiHanCung, daiHanCung.name).overview}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">Không xác định</p>
                  )}
                </div>

                {/* Tiểu Hạn */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
                  <h4 className="text-sm font-semibold text-blue-700 mb-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    TIỂU HẠN NĂM {selectedYear}
                  </h4>
                  {tieuHanCung ? (
                    <>
                      <p className="text-lg font-bold text-gray-800 mb-2">
                        Cung {tieuHanCung.name} ({tieuHanCung.thienCan} {tieuHanCung.diaChi})
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {tieuHanCung.stars.filter(s => s.type === 'chinh_tinh').map((star, i) => (
                          <span key={i} className="text-xs bg-white/80 text-red-700 px-1.5 py-0.5 rounded font-medium">{star.name}</span>
                        ))}
                        {tieuHanCung.stars.filter(s => s.type === 'phu_tinh_tot').map((star, i) => (
                          <span key={`t${i}`} className="text-xs bg-white/80 text-green-700 px-1.5 py-0.5 rounded">{star.name}</span>
                        ))}
                        {tieuHanCung.stars.filter(s => s.type === 'phu_tinh_xau').map((star, i) => (
                          <span key={`x${i}`} className="text-xs bg-white/80 text-purple-700 px-1.5 py-0.5 rounded">{star.name}</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {luanGiaiCung(tieuHanCung, tieuHanCung.name).overview}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">Không xác định</p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Quick year navigation */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Chọn nhanh:</h4>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 20 }, (_, i) => currentYear - 5 + i).map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                    y === selectedYear
                      ? 'bg-amber-500 text-white font-bold shadow'
                      : y === currentYear
                        ? 'bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
