'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'Lập lá số tử vi cần những thông tin gì?',
    a: 'Bạn cần họ tên, giới tính, ngày sinh dương lịch (theo giấy khai sinh) và giờ sinh theo 12 canh giờ (Tý, Sửu, Dần...). Giờ sinh càng chính xác, lá số càng đúng.',
  },
  {
    q: 'Tại sao phải dùng ngày âm lịch?',
    a: 'Tử vi Đẩu số an sao theo lịch âm. Hệ thống tự quy đổi ngày dương lịch sang âm lịch (kể cả tháng nhuận) trước khi tính Cung Mệnh, Cục và các sao.',
  },
  {
    q: 'Lá số có lưu lại được không?',
    a: 'Có. Lá số được lưu trong trình duyệt (lịch sử xem) và bạn có thể sao chép link chia sẻ để mở lại bất cứ lúc nào.',
  },
  {
    q: 'Đại Hạn và Tiểu Hạn là gì?',
    a: 'Đại Hạn là chu kỳ 10 năm theo từng cung trên lá số. Tiểu Hạn là vận từng năm — mỗi năm một cung. Tab Vận Hạn giúp bạn xem cả hai theo năm bạn chọn.',
  },
  {
    q: 'Tứ Hóa (Hóa Lộc, Quyền, Khoa, Kỵ) nghĩa là gì?',
    a: 'Tứ Hóa biến hóa tính chất sao theo Thiên Can năm sinh: Hóa Lộc thuận lợi, Hóa Quyền quyền lực, Hóa Khoa danh tiếng, Hóa Kỵ trở ngại. Các sao có Hóa được đánh dấu trên lá số.',
  },
  {
    q: 'Luận giải có thay thế thầy xem không?',
    a: 'Luận giải tự động dựa trên phương pháp truyền thống, giúp bạn hiểu sơ bộ. Để luận sâu về vận hạn cụ thể, nên tham khảo thêm chuyên gia có kinh nghiệm.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full max-w-2xl mt-12">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Câu hỏi thường gặp</h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-white/80 rounded-xl border border-amber-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-amber-50/50 transition-colors"
            >
              <span className="font-semibold text-gray-800 text-sm">{item.q}</span>
              <svg
                className={`w-5 h-5 text-amber-600 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-amber-50 pt-3">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
