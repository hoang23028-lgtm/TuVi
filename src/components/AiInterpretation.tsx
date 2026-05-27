'use client';

import { useState } from 'react';
import { TuViChart } from '@/lib/tuvi/constants';
import { buildChartContextForAi } from '@/lib/ai/chartPrompt';

const API_KEY_STORAGE = 'tuvi_openai_key';

interface AiInterpretationProps {
  chart: TuViChart;
}

async function callOpenAiDirect(apiKey: string, chartContext: string, question?: string): Promise<string> {
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
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Bạn là chuyên gia Tử Vi Đẩu Số Việt Nam. Luận giải bằng tiếng Việt, có cấu trúc, mang tính tham khảo.',
        },
        { role: 'user', content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function callNetlifyFunction(chartContext: string, question?: string): Promise<string> {
  const res = await fetch('/.netlify/functions/ai-luan-giai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chartContext, question }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Lỗi luận giải AI');
  return data.text;
}

export default function AiInterpretation({ chart }: AiInterpretationProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const run = async (customQuestion?: string) => {
    setLoading(true);
    setError('');
    const chartContext = buildChartContextForAi(chart);

    try {
      let result: string;
      try {
        result = await callNetlifyFunction(chartContext, customQuestion);
      } catch {
        const key = apiKey || (typeof window !== 'undefined' ? localStorage.getItem(API_KEY_STORAGE) : null);
        if (!key) {
          setShowKeyInput(true);
          throw new Error(
            'Server AI chưa cấu hình. Nhập OpenAI API key cá nhân bên dưới (chỉ lưu trên trình duyệt).',
          );
        }
        result = await callOpenAiDirect(key, chartContext, customQuestion);
      }
      setText(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
      setShowKeyInput(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
          <span className="text-xl">🤖</span> Luận giải AI
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Phân tích lá số bằng AI dựa trên dữ liệu an sao. Trên Netlify cần biến môi trường{' '}
          <code className="text-xs bg-white px-1 rounded">OPENAI_API_KEY</code>, hoặc dùng API key cá nhân.
        </p>

        {showKeyInput && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-violet-100">
            <label className="text-xs font-semibold text-gray-600 block mb-1">OpenAI API Key (lưu local)</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-3 py-2 text-sm border rounded-lg"
              />
              <button type="button" onClick={saveKey} className="px-3 py-2 bg-violet-600 text-white text-sm rounded-lg">
                Lưu
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={() => run()}
            disabled={loading}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? 'Đang luận giải...' : 'Luận giải tổng quan'}
          </button>
          <button
            type="button"
            onClick={() => setShowKeyInput((v) => !v)}
            className="px-3 py-2 border border-violet-200 text-violet-700 rounded-lg text-sm"
          >
            API Key
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Hỏi thêm: vận năm nay, hôn nhân, sự nghiệp..."
            className="flex-1 px-3 py-2 text-sm border border-violet-100 rounded-lg"
          />
          <button
            type="button"
            onClick={() => run(question || undefined)}
            disabled={loading || !question.trim()}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Hỏi
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>
      )}

      {text && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">{text}</div>
        </div>
      )}
    </div>
  );
}
