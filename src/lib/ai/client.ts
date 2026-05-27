import {
  AI_FUNCTION_URL,
  AI_STATUS_URL,
  AI_SYSTEM_PROMPT,
  API_KEY_STORAGE,
  DEFAULT_AI_MODEL,
} from './config';

export type AiServerStatus = 'loading' | 'ready' | 'unconfigured' | 'unavailable';

export async function fetchAiServerStatus(): Promise<{
  status: AiServerStatus;
  model?: string;
}> {
  try {
    const res = await fetch(AI_STATUS_URL, { method: 'GET' });
    if (!res.ok) return { status: 'unavailable' };
    const data = (await res.json()) as { configured?: boolean; model?: string };
    return {
      status: data.configured ? 'ready' : 'unconfigured',
      model: data.model ?? undefined,
    };
  } catch {
    return { status: 'unavailable' };
  }
}

export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE);
}

export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE);
}

async function callOpenAi(
  apiKey: string,
  chartContext: string,
  question?: string,
  model = DEFAULT_AI_MODEL,
): Promise<string> {
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
      model,
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
    throw new Error(err.includes('invalid_api_key') ? 'API key không hợp lệ.' : err.slice(0, 200));
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export async function requestAiInterpretation(
  chartContext: string,
  question?: string,
  personalApiKey?: string | null,
): Promise<{ text: string; via: 'server' | 'browser' }> {
  try {
    const res = await fetch(AI_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chartContext, question }),
    });
    const data = await res.json();
    if (res.ok && data.text) {
      return { text: data.text, via: 'server' };
    }
    if (res.status !== 503) {
      throw new Error(data.error || 'Lỗi luận giải AI');
    }
  } catch (e) {
    if (e instanceof Error && !e.message.includes('fetch')) {
      throw e;
    }
  }

  const key = personalApiKey ?? getStoredApiKey();
  if (!key) {
    throw new Error('NEED_API_KEY');
  }
  const text = await callOpenAi(key, chartContext, question);
  return { text, via: 'browser' };
}
