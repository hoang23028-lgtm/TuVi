# Tử Vi Đẩu Số Pro

Ứng dụng web lập lá số tử vi trọn đời miễn phí — Next.js 14, TypeScript, Tailwind CSS.

## Tính năng

- Lập lá số 12 cung: 14 chính tinh, phụ tinh, Tràng Sinh, Tứ Hóa
- Quy đổi dương lịch → âm lịch (thư viện `@baostudio/viet-lunar`, UTC+7, khớp Tết VN)
- Luận giải từng cung, tổng quan (tính cách, sự nghiệp, tài lộc, tình cảm)
- Đại Hạn & Tiểu Hạn theo năm
- Nhập ngày **âm lịch** hoặc dương lịch (hỗ trợ tháng nhuận)
- **Tuần / Triệt** và 20+ phụ tinh bổ sung (Ân Quang, Long Trì, Cô Quả...)
- Xuất **PNG / PDF**, chia sẻ link, in lá số
- **Luận giải AI** (Netlify Function + OpenAI, hoặc API key cá nhân)
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

Xuất static (`out/`) — deploy Netlify. Cấu hình: `netlify.toml`.

### Luận giải AI

**Production (khuyến nghị)** — cấu hình trên Netlify, key không lộ ra người dùng:

1. Tạo key tại [OpenAI API keys](https://platform.openai.com/api-keys)
2. [Netlify → tuvi-dau-so-pro → Environment variables](https://app.netlify.com/projects/tuvi-dau-so-pro/configuration/env)
3. Thêm biến:
   - `OPENAI_API_KEY` = `sk-...`
   - `OPENAI_MODEL` = `gpt-4o-mini` (tùy chọn)
4. **Trigger deploy** lại site

Hoặc dùng CLI (thay `sk-...` bằng key thật):

```bash
npx netlify env:set OPENAI_API_KEY "sk-..." --context production
npx netlify env:set OPENAI_MODEL "gpt-4o-mini" --context production
```

Tab **AI** trên lá số sẽ hiện “Server AI sẵn sàng” khi cấu hình đúng.

**Local** — chạy Next + Netlify Functions:

```bash
cp .env.example .env
# Sửa OPENAI_API_KEY trong .env
npm run dev:ai
```

Mở http://localhost:8888 (không phải port 3000).

**Fallback** — trên tab AI, bấm **API Key** và nhập key OpenAI cá nhân (chỉ lưu trên trình duyệt).

## Cấu trúc

```
src/
  app/           # Trang Next.js (/, /huong-dan)
  components/    # UI: BirthForm, TuViChart, ChartSummary, Faq...
  lib/tuvi/      # Engine: calculator, lunar, interpretation
```

## Lưu ý

Luận giải tự động mang tính tham khảo theo phương pháp truyền thống, không thay thế tư vấn chuyên sâu từ chuyên gia.
