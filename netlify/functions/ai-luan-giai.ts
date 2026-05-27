import type { Handler, HandlerEvent } from '@netlify/functions';
import { AI_SYSTEM_PROMPT, getOpenAiConfig } from './shared/aiConfig';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const cfg = getOpenAiConfig();
  if (!cfg) {
    return {
      statusCode: 503,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Chưa cấu hình OPENAI_API_KEY trên Netlify. Dùng API key cá nhân trên trang web.',
        code: 'NOT_CONFIGURED',
      }),
    };
  }

  try {
    const { chartContext, question } = JSON.parse(event.body || '{}') as {
      chartContext?: string;
      question?: string;
    };

    if (!chartContext) {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Thiếu chartContext' }) };
    }

    const userContent = question
      ? `Lá số:\n${chartContext}\n\nCâu hỏi: ${question}`
      : `Hãy luận giải chi tiết lá số sau:\n${chartContext}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { statusCode: res.status, headers: cors, body: JSON.stringify({ error: err }) };
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: e instanceof Error ? e.message : 'Lỗi server' }),
    };
  }
};
