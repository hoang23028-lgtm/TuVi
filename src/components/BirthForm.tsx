'use client';

import { useState, useMemo } from 'react';
import { GIO_SINH } from '@/lib/tuvi/constants';
import { solarToLunar } from '@/lib/tuvi/lunar';

interface BirthFormProps {
  onSubmit: (data: {
    hoTen: string;
    gioiTinh: 'Nam' | 'Nữ';
    ngaySinh: Date;
    gioSinh: number;
  }) => void;
}

export default function BirthForm({ onSubmit }: BirthFormProps) {
  const [hoTen, setHoTen] = useState('');
  const [gioiTinh, setGioiTinh] = useState<'Nam' | 'Nữ'>('Nam');
  const [ngaySinh, setNgaySinh] = useState('');
  const [gioSinh, setGioSinh] = useState(0);

  const lunarPreview = useMemo(() => {
    if (!ngaySinh) return null;
    const [y, m, d] = ngaySinh.split('-').map(Number);
    if (!y || !m || !d) return null;
    try {
      return solarToLunar(y, m, d);
    } catch {
      return null;
    }
  }, [ngaySinh]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngaySinh) return;
    
    const [y, m, d] = ngaySinh.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    onSubmit({ hoTen: hoTen || 'Chưa nhập tên', gioiTinh, ngaySinh: date, gioSinh });
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
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Họ và tên
            </label>
            <input
              type="text"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              placeholder="Nhập họ tên..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-gray-800 bg-gray-50/50"
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Giới tính
            </label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                gioiTinh === 'Nam' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="Nam"
                  checked={gioiTinh === 'Nam'}
                  onChange={() => setGioiTinh('Nam')}
                  className="hidden"
                />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M5.5 21c0-3.5 2.9-6.5 6.5-6.5s6.5 3 6.5 6.5" />
                </svg>
                <span className="font-medium">Nam</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                gioiTinh === 'Nữ' 
                  ? 'border-pink-500 bg-pink-50 text-pink-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="Nữ"
                  checked={gioiTinh === 'Nữ'}
                  onChange={() => setGioiTinh('Nữ')}
                  className="hidden"
                />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M5.5 21c0-3.5 2.9-6.5 6.5-6.5s6.5 3 6.5 6.5" />
                </svg>
                <span className="font-medium">Nữ</span>
              </label>
            </div>
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ngày sinh (Dương lịch)
            </label>
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
                {lunarPreview.isLeapMonth && ' (tháng nhuận)'}
                {' · '}
                {lunarPreview.lunarYearCanChi}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">Nhập theo giấy khai sinh (GMT+7). Hệ thống tự quy đổi âm lịch.</p>
          </div>

          {/* Giờ sinh */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Giờ sinh
            </label>
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
          >
            Lập Lá Số
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Hệ thống tính toán theo phương pháp Tử Vi Đẩu Số truyền thống
        </p>
      </div>
    </form>
  );
}
