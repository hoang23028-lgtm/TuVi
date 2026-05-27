# Tử Vi Đẩu Số Pro

Ứng dụng web lập lá số tử vi trọn đời miễn phí — Next.js 14, TypeScript, Tailwind CSS.

## Tính năng

- Lập lá số 12 cung: 14 chính tinh, phụ tinh, Tràng Sinh, Tứ Hóa
- Quy đổi dương lịch → âm lịch (1900–2099, hỗ trợ tháng nhuận)
- Luận giải từng cung, tổng quan (tính cách, sự nghiệp, tài lộc, tình cảm)
- Đại Hạn & Tiểu Hạn theo năm
- Lịch sử xem, chia sẻ link, in lá số
- Giao diện responsive (bàn lá số desktop + danh sách mobile)

## Chạy dự án

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Build & deploy

```bash
npm run build
```

Xuất static (`out/`) — deploy Netlify/Vercel/GitHub Pages. Cấu hình mẫu: `netlify.toml`.

## Cấu trúc

```
src/
  app/           # Trang Next.js (/, /huong-dan)
  components/    # UI: BirthForm, TuViChart, ChartSummary, Faq...
  lib/tuvi/      # Engine: calculator, lunar, interpretation
```

## Lưu ý

Luận giải tự động mang tính tham khảo theo phương pháp truyền thống, không thay thế tư vấn chuyên sâu từ chuyên gia.
