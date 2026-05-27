'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BirthForm from '@/components/BirthForm';
import TuViChartComponent from '@/components/TuViChart';
import Faq from '@/components/Faq';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { tinhLaSo, TuViChart } from '@/lib/tuvi';

interface SavedChart {
  hoTen: string;
  gioiTinh: 'Nam' | 'Nữ';
  ngaySinh: string;
  gioSinh: number;
  timestamp: number;
}

function getHistory(): SavedChart[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('tuvi_history') || '[]');
  } catch { return []; }
}

function saveHistory(item: SavedChart) {
  const history = getHistory().filter(
    (h) => !(h.hoTen === item.hoTen && h.ngaySinh === item.ngaySinh && h.gioSinh === item.gioSinh)
  );
  history.unshift(item);
  if (history.length > 10) history.pop();
  localStorage.setItem('tuvi_history', JSON.stringify(history));
}

function removeFromHistory(index: number) {
  const history = getHistory();
  history.splice(index, 1);
  localStorage.setItem('tuvi_history', JSON.stringify(history));
}

function formatDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function HomeContent() {
  const [chart, setChart] = useState<TuViChart | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [history, setHistory] = useState<SavedChart[]>([]);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Auto-load from URL params
  useEffect(() => {
    const name = searchParams.get('n');
    const gender = searchParams.get('g');
    const birth = searchParams.get('b');
    const hour = searchParams.get('h');
    if (name && gender && birth && hour) {
      const parts = birth.split('-').map(Number);
      if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
        handleSubmit({
          hoTen: decodeURIComponent(name),
          gioiTinh: gender === 'Nu' ? 'Nữ' : 'Nam',
          ngaySinh: new Date(parts[0], parts[1] - 1, parts[2]),
          gioSinh: Number(hour),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback((data: {
    hoTen: string;
    gioiTinh: 'Nam' | 'Nữ';
    ngaySinh: Date;
    gioSinh: number;
    calendarMode?: 'duong' | 'am';
    amLich?: { year: number; month: number; day: number; isLeapMonth: boolean };
    dungLapXuan?: boolean;
  }) => {
    setIsCalculating(true);
    setTimeout(() => {
      const result = tinhLaSo(data.hoTen, data.gioiTinh, data.ngaySinh, data.gioSinh, {
        amLich: data.amLich,
        dungLapXuan: data.dungLapXuan,
      });
      setChart(result);
      setShowForm(false);
      setIsCalculating(false);
      // Save to history
      const saved: SavedChart = {
        hoTen: data.hoTen,
        gioiTinh: data.gioiTinh,
        ngaySinh: formatDateLocal(data.ngaySinh),
        gioSinh: data.gioSinh,
        timestamp: Date.now(),
      };
      saveHistory(saved);
      setHistory(getHistory());
    }, 400);
  }, []);

  const handleLoadHistory = (item: SavedChart) => {
    handleSubmit({
      hoTen: item.hoTen,
      gioiTinh: item.gioiTinh,
      ngaySinh: new Date(item.ngaySinh),
      gioSinh: item.gioSinh,
    });
  };

  const getShareUrl = () => {
    if (!chart) return '';
    const params = new URLSearchParams({
      n: chart.hoTen,
      g: chart.gioiTinh === 'Nữ' ? 'Nu' : 'Nam',
      b: formatDateLocal(chart.ngaySinh),
      h: String(chart.gioSinh),
    });
    return `${window.location.origin}?${params.toString()}`;
  };

  const handleShare = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading overlay
  if (isCalculating) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center">
              <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Đang tính lá số...</h2>
          <p className="text-gray-500 mt-1 text-sm">An sao, tính cục, luận giải</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 md:py-8 px-3 md:px-4">
      {/* Header */}
      <header className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
          Tử Vi Đẩu Số
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-lg">Lập lá số trọn đời theo phương pháp cổ truyền</p>
        <div className="max-w-xl mx-auto mt-4 px-2">
          <DisclaimerBanner compact />
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {showForm ? (
          <div className="flex flex-col items-center">
            <BirthForm onSubmit={handleSubmit} />

            {/* History */}
            {history.length > 0 && (
              <div className="mt-8 w-full max-w-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Lịch sử xem</h3>
                <div className="space-y-2">
                  {history.map((item, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <button
                        onClick={() => handleLoadHistory(item)}
                        className="flex-1 flex items-center gap-3 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-amber-100 hover:bg-amber-50 hover:border-amber-200 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {item.hoTen[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{item.hoTen}</p>
                          <p className="text-xs text-gray-400">{item.gioiTinh} · {item.ngaySinh}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(i);
                          setHistory(getHistory());
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Xóa khỏi lịch sử"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Features */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-amber-100 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Tính toán chính xác</h3>
                <p className="text-sm text-gray-500">14 chính tinh, 40+ phụ tinh, Tràng Sinh, Đại Hạn đầy đủ</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-amber-100 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Giao diện trực quan</h3>
                <p className="text-sm text-gray-500">Bàn lá số 12 cung truyền thống, dễ đọc dễ hiểu</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-amber-100 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Luận giải chi tiết</h3>
                <p className="text-sm text-gray-500">Phân tích từng cung, từng sao theo phương pháp truyền thống</p>
              </div>
            </div>

            <Faq />
          </div>
        ) : (
          <div>
            {/* Action bar */}
            <div className="flex flex-wrap gap-2 justify-between items-center mb-4 no-print">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white rounded-lg shadow border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Lập lá số mới
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {copied ? 'Đã copy!' : 'Chia sẻ'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  In lá số
                </button>
              </div>
            </div>

            <div className="mb-4">
              <DisclaimerBanner />
            </div>
            {chart && <TuViChartComponent chart={chart} />}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-10 md:mt-12 py-6 border-t border-amber-100">
        <p className="text-sm text-gray-400">
          Tử Vi Đẩu Số Pro &copy; {new Date().getFullYear()} | Phương pháp tính toán theo Tử Vi truyền thống
        </p>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-gray-500">Đang tải...</p>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
