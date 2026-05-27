/** Cấu hình AI dùng chung (function Netlify) */
export const AI_SYSTEM_PROMPT = `Bạn là chuyên gia Tử Vi Đẩu Số Việt Nam. Luận giải dựa trên lá số được cung cấp.
Viết bằng tiếng Việt, mạch lạc, chia mục rõ ràng. Tránh mê tín cực đoan; nhấn mạnh đây là tham khảo.
Cấu trúc: 1) Tổng quan 2) Tính cách & Mệnh 3) Sự nghiệp 4) Tài lộc 5) Tình duyên 6) Lời khuyên.`;

export const DEFAULT_AI_MODEL = 'gpt-4o-mini';

export function getOpenAiConfig(): { apiKey: string; model: string } | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    apiKey,
    model: process.env.OPENAI_MODEL?.trim() || DEFAULT_AI_MODEL,
  };
}
