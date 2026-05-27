import type { Handler, HandlerEvent } from '@netlify/functions';

const SYSTEM_PROMPT = `Bạn là chuyên gia Tử Vi Đẩu Số Việt Nam. Luận giải dựa trên lá số được cung cấp.
Viết bằng tiếng Việt, mạch lạc, chia mục rõ ràng. Tránh mê tín cực đoan; nhấn mạnh đây là tham khảo.
Cấu trúc: 1) Tổng quan 2) Tính cách & Mệnh 3) Sự nghiệp 4) Tài lộc 5) Tình duyên 6) Lời khuyên.`;

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        error: 'Chưa cấu hình OPENAI_API_KEY trên Netlify. Dùng chế độ API key cá nhân trên trang web.',
      }),
    };
  }

  try {
    const { chartContext, question } = JSON.parse(event.body || '{}') as {
      chartContext?: string;
      question?: string;
    };

    if (!chartContext) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Thiếu chartContext' }) };
    }

    const userContent = question
      ? `Lá số:\n${chartContext}\n\nCâu hỏi: ${question}`
      : `Hãy luận giải chi tiết lá số sau:\n${chartContext}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: err }) };
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ text }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e instanceof Error ? e.message : 'Lỗi server' }),
    };
  }
};
