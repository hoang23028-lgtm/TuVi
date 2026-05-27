'use client';

import { useState } from 'react';
import { exportChartAsPng, exportChartAsPdf } from '@/lib/exportChart';

interface ExportButtonsProps {
  targetRef: React.RefObject<HTMLElement | null>;
  fileName: string;
}

export default function ExportButtons({ targetRef, fileName }: ExportButtonsProps) {
  const [loading, setLoading] = useState<'png' | 'pdf' | null>(null);

  const run = async (type: 'png' | 'pdf') => {
    const el = targetRef.current;
    if (!el) return;
    setLoading(type);
    try {
      if (type === 'png') await exportChartAsPng(el, fileName);
      else await exportChartAsPdf(el, fileName);
    } catch (e) {
      console.error(e);
      alert('Không xuất được file. Thử thu nhỏ màn hình hoặc dùng nút In.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2 no-print">
      <button
        type="button"
        onClick={() => run('png')}
        disabled={!!loading}
        className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition-colors text-sm disabled:opacity-60"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {loading === 'png' ? 'Đang tạo...' : 'Ảnh PNG'}
      </button>
      <button
        type="button"
        onClick={() => run('pdf')}
        disabled={!!loading}
        className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition-colors text-sm disabled:opacity-60"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        {loading === 'pdf' ? 'Đang tạo...' : 'PDF'}
      </button>
    </div>
  );
}
