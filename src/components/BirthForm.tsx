'use client';

import { useState, useMemo } from 'react';
import { GIO_SINH } from '@/lib/tuvi/constants';
import { solarToLunar, lunarToSolar, getLeapMonthOfYear } from '@/lib/tuvi/lunar';

export type CalendarMode = 'duong' | 'am';

interface BirthFormProps {
  onSubmit: (data: {
    hoTen: string;
    gioiTinh: 'Nam' | 'Nữ';
    ngaySinh: Date;
    gioSinh: number;
    calendarMode: CalendarMode;
    amLich?: { year: number; month: number; day: number; isLeapMonth: boolean };
    dungLapXuan?: boolean;
  }) => void;
}

const THANG_LABELS = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Chạp'];

export default function BirthForm({ onSubmit }: BirthFormProps) {
  const [hoTen, setHoTen] = useState('');
  const [gioiTinh, setGioiTinh] = useState<'Nam' | 'Nữ'>('Nam');
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('duong');
  const [ngaySinh, setNgaySinh] = useState('');
  const [lunarYear, setLunarYear] = useState(1990);
  const [lunarMonth, setLunarMonth] = useState(1);
  const [lunarDay, setLunarDay] = useState(1);
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [gioSinh, setGioSinh] = useState(0);
  const [dungLapXuan, setDungLapXuan] = useState(false);
  const [lunarError, setLunarError] = useState('');

  const leapMonth = useMemo(() => getLeapMonthOfYear(lunarYear), [lunarYear]);

  const lunarPreview = useMemo(() => {
    if (calendarMode !== 'duong' || !ngaySinh) return null;
    const [y, m, d] = ngaySinh.split('-').map(Number);
    if (!y || !m || !d) return null;
    try {
      return solarToLunar(y, m, d);
    } catch {
      return null;
    }
  }, [ngaySinh, calendarMode]);

  const solarPreview = useMemo(() => {
    if (calendarMode !== 'am') return null;
    try {
      return lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth);
    } catch {
      return null;
    }
  }, [calendarMode, lunarYear, lunarMonth, lunarDay, isLeapMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLunarError('');

    if (calendarMode === 'duong') {
      if (!ngaySinh) return;
      const [y, m, d] = ngaySinh.split('-').map(Number);
      onSubmit({
        hoTen: hoTen || 'Chưa nhập tên',
        gioiTinh,
        ngaySinh: new Date(y, m - 1, d),
        gioSinh,
        calendarMode: 'duong',
        dungLapXuan,
      });
      return;
    }

    try {
      const solar = lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth);
      onSubmit({
        hoTen: hoTen || 'Chưa nhập tên',
        gioiTinh,
        ngaySinh: new Date(solar.year, solar.month - 1, solar.day),
        gioSinh,
        calendarMode: 'am',
        amLich: { year: lunarYear, month: lunarMonth, day: lunarDay, isLeapMonth },
        dungLapXuan,
      });
    } catch {
      setLunarError('Ngày âm lịch không hợp lệ. Kiểm tra tháng nhuận và số ngày trong tháng.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-red-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Lập Lá Số Tử Vi</h2>
          <p className="text-gray-500 mt-1 text-sm">Nhập thông tin để xem lá số trọn đời</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên</label>
            <input
              type="text"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              placeholder="Nhập họ tên..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-gray-800 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giới tính</label>
            <div className="flex gap-4">
              {(['Nam', 'Nữ'] as const).map((gt) => (
                <label
                  key={gt}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    gioiTinh === gt
                      ? gt === 'Nam'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="gioiTinh"
                    checked={gioiTinh === gt}
                    onChange={() => setGioiTinh(gt)}
                    className="hidden"
                  />
                  <span className="font-medium">{gt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Loại lịch</label>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setCalendarMode('duong')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  calendarMode === 'duong' ? 'bg-white shadow text-amber-800' : 'text-gray-500'
                }`}
              >
                Dương lịch
              </button>
              <button
                type="button"
                onClick={() => setCalendarMode('am')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  calendarMode === 'am' ? 'bg-white shadow text-amber-800' : 'text-gray-500'
                }`}
              >
                Âm lịch
              </button>
            </div>
          </div>

          {calendarMode === 'duong' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày sinh (Dương lịch)</label>
              <input
                type="date"
                value={ngaySinh}
                onChange={(e) => setNgaySinh(e.target.value)}
                required
                min="1900-01-01"
                max="2099-12-31"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-gray-800 bg-gray-50/50"
              />
              {lunarPreview && (
                <p className="mt-2 text-xs text-amber-800 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                  Âm lịch: <strong>{lunarPreview.day}/{lunarPreview.month}/{lunarPreview.year}</strong>
                  {lunarPreview.isLeapMonth && ' (nhuận)'} · {lunarPreview.lunarYearCanChi}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Ngày sinh (Âm lịch)</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-xs text-gray-500">Năm</span>
                  <input
                    type="number"
                    min={1900}
                    max={2099}
                    value={lunarYear}
                    onChange={(e) => setLunarYear(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-amber-400 outline-none text-gray-800"
                    required
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Tháng</span>
                  <select
                    value={lunarMonth}
                    onChange={(e) => {
                      setLunarMonth(Number(e.target.value));
                      if (Number(e.target.value) !== leapMonth) setIsLeapMonth(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-amber-400 outline-none text-gray-800"
                  >
                    {THANG_LABELS.map((label, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} ({label})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Ngày</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={lunarDay}
                    onChange={(e) => setLunarDay(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-amber-400 outline-none text-gray-800"
                    required
                  />
                </div>
              </div>
              {leapMonth > 0 && lunarMonth === leapMonth && (
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLeapMonth}
                    onChange={(e) => setIsLeapMonth(e.target.checked)}
                    className="rounded border-gray-300 text-amber-600"
                  />
                  Tháng nhuận
                </label>
              )}
              {solarPreview && (
                <p className="text-xs text-blue-800 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                  Dương lịch: <strong>{solarPreview.day}/{solarPreview.month}/{solarPreview.year}</strong>
                </p>
              )}
              {lunarError && <p className="text-xs text-red-600">{lunarError}</p>}
            </div>
          )}

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dungLapXuan}
                onChange={(e) => setDungLapXuan(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-blue-800">Can Chi theo Lập xuân</span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  Sinh trước ~4/2 dương lịch tính Can Chi năm trước (nâng cao, khác mặc định Tết)
                </span>
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giờ sinh</label>
            <select
              value={gioSinh}
              onChange={(e) => setGioSinh(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-gray-800 bg-gray-50/50 appearance-none"
            >
              {GIO_SINH.map((gio) => (
                <option key={gio.value} value={gio.value}>
                  {gio.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
          >
            Lập Lá Số
          </button>
        </div>

        <p className="text-center text-xs text-amber-700/80 mt-6 px-2">
          Lá số tham khảo — có thể khác phương pháp an sao. Không thay tư vấn chuyên gia.
        </p>
      </div>
    </form>
  );
}
