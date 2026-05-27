/** Cấu hình luận giải AI (client + đồng bộ với netlify/functions/shared/aiConfig.ts) */
export const AI_SYSTEM_PROMPT = `Bạn là chuyên gia Tử Vi Đẩu Số Việt Nam. Luận giải dựa trên lá số được cung cấp.
Viết bằng tiếng Việt, mạch lạc, chia mục rõ ràng. Tránh mê tín cực đoan; nhấn mạnh đây là tham khảo.
Cấu trúc: 1) Tổng quan 2) Tính cách & Mệnh 3) Sự nghiệp 4) Tài lộc 5) Tình duyên 6) Lời khuyên.`;

export const DEFAULT_AI_MODEL = 'gpt-4o-mini';
export const API_KEY_STORAGE = 'tuvi_openai_key';

export const AI_FUNCTION_URL = '/.netlify/functions/ai-luan-giai';
export const AI_STATUS_URL = '/.netlify/functions/ai-status';
