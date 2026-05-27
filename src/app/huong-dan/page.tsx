import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hướng dẫn lập lá số Tử Vi | Tử Vi Đẩu Số Pro',
  description: 'Cách nhập thông tin, đọc lá số 12 cung, Đại Hạn, Tiểu Hạn và Tứ Hóa trong tử vi Đẩu số.',
};

export default function HuongDanPage() {
  return (
    <main className="min-h-screen py-8 px-4">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hướng dẫn sử dụng</h1>
          <p className="text-gray-500 mb-8">Lập và đọc lá số tử vi Đẩu số trực tuyến</p>

          <section className="mb-8 bg-white rounded-xl border border-amber-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Nhập thông tin</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li><strong>Ngày sinh dương lịch:</strong> Lấy theo giấy khai sinh. Hệ thống tự quy đổi sang âm lịch.</li>
              <li><strong>Giờ sinh:</strong> Chọn một trong 12 canh giờ (mỗi canh 2 tiếng). Nếu không rõ giờ, hỏi người thân hoặc dùng giờ gần nhất.</li>
              <li><strong>Giới tính:</strong> Ảnh hưởng chiều Đại Hạn, Tiểu Hạn và một số sao (Hỏa Tinh, Linh Tinh, Tràng Sinh).</li>
            </ul>
          </section>

          <section className="mb-8 bg-white rounded-xl border border-amber-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Đọc bàn lá số</h2>
            <p className="text-gray-600 text-sm mb-3">
              Lá số gồm 12 cung xếp quanh trung tâm. Mỗi cung có Địa Chi cố định (Tý → Hợi) và tên chức năng (Mệnh, Phụ Mẫu...).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li><span className="text-red-600 font-semibold">Chính tinh</span> (đỏ): 14 sao chính, quyết định tính chất cung.</li>
              <li><span className="text-green-600 font-semibold">Cát tinh</span> (xanh): Tả Phù, Văn Xương, Lộc Tồn...</li>
              <li><span className="text-purple-600 font-semibold">Hung tinh</span> (tím): Kình Dương, Địa Không, Hỏa Tinh...</li>
              <li><span className="text-red-600">★</span> Cung Mệnh — bản thân; <span className="text-blue-600">◆</span> Cung Thân — hậu vận.</li>
            </ul>
          </section>

          <section className="mb-8 bg-white rounded-xl border border-amber-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Các tab luận giải</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li><strong>Lá Số:</strong> Bàn đồ đầy đủ — nhấn từng cung để xem chi tiết.</li>
              <li><strong>Tổng Quan:</strong> Tính cách, sự nghiệp, tài lộc, tình cảm và Tứ Hóa.</li>
              <li><strong>Vận Hạn:</strong> Đại Hạn (10 năm) và Tiểu Hạn theo năm bạn chọn.</li>
            </ul>
          </section>

          <section className="mb-8 bg-white rounded-xl border border-amber-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Chia sẻ & in</h2>
            <p className="text-gray-600 text-sm">
              Sau khi lập lá số, dùng nút <strong>Chia sẻ</strong> để copy link (mở lại trên máy khác) hoặc <strong>In lá số</strong> để lưu PDF.
            </p>
          </section>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Lập lá số ngay
            </Link>
          </div>
        </article>
    </main>
  );
}
