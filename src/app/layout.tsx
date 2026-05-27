import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tử Vi Đẩu Số Pro - Lập Lá Số Trọn Đời Miễn Phí',
  description: 'Ứng dụng xem tử vi trực tuyến chuyên nghiệp. Lập lá số tử vi đầy đủ 14 chính tinh, 40+ phụ tinh, Tràng Sinh, Đại Hạn, Tiểu Hạn, luận giải chi tiết theo phương pháp Tử Vi Đẩu Số cổ truyền.',
  keywords: 'tử vi, la so tu vi, xem tu vi, tu vi 2025, lập lá số, tử vi trọn đời, tử vi đẩu số, xem lá số tử vi, tử vi miễn phí',
  authors: [{ name: 'Tử Vi Pro' }],
  openGraph: {
    title: 'Tử Vi Đẩu Số Pro - Lập Lá Số Trọn Đời',
    description: 'Lập lá số tử vi đầy đủ 14 chính tinh, luận giải chi tiết. Miễn phí, chính xác, theo phương pháp cổ truyền.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Tử Vi Pro',
  },
  robots: 'index, follow',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⭐</text></svg>',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#d97706',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
