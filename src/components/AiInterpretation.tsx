'use client';

import { useEffect, useState } from 'react';
import { TuViChart } from '@/lib/tuvi/constants';
import { buildChartContextForAi } from '@/lib/ai/chartPrompt';
import {
  clearApiKey,
  fetchAiServerStatus,
  getStoredApiKey,
  requestAiInterpretation,
  saveApiKey,
  type AiServerStatus,
} from '@/lib/ai/client';
import { DEFAULT_AI_MODEL } from '@/lib/ai/config';

interface AiInterpretationProps {
  chart: TuViChart;
}

export default function AiInterpretation({ chart }: AiInterpretationProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [serverStatus, setServerStatus] = useState<AiServerStatus>('loading');
  const [serverModel, setServerModel] = useState<string | null>(null);
  const [lastVia, setLastVia] = useState<'server' | 'browser' | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAiServerStatus().then((r) => {
      if (!cancelled) {
        setServerStatus(r.status);
        setServerModel(r.model ?? null);
        if (r.status === 'unconfigured' && !getStoredApiKey()) {
          setShowKeyInput(true);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const run = async (customQuestion?: string) => {
    setLoading(true);
    setError('');
    const chartContext = buildChartContextForAi(chart);

    try {
      const { text: result, via } = await requestAiInterpretation(
        chartContext,
        customQuestion,
        apiKey || getStoredApiKey(),
      );
      setText(result);
      setLastVia(via);
    } catch (e) {
      if (e instanceof Error && e.message === 'NEED_API_KEY') {
        setShowKeyInput(true);
        setError('Chưa có API key. Cấu hình Netlify (khuyến nghị) hoặc nhập key cá nhân bên dưới.');
      } else {
        setError(e instanceof Error ? e.message : 'Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey);
      setShowKeyInput(false);
      setError('');
    }
  };

  const statusBadge = () => {
    if (serverStatus === 'loading') {
      return <span className="text-xs text-gray-500">Đang kiểm tra server AI…</span>;
    }
    if (serverStatus === 'ready') {
      return (
        <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
          Server AI sẵn sàng ({serverModel ?? DEFAULT_AI_MODEL})
        </span>
      );
    }
    if (serverStatus === 'unconfigured') {
      return (
        <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          Chưa cấu hình OPENAI_API_KEY trên Netlify
        </span>
      );
    }
    return (
      <span className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
        Chạy local: dùng <code className="text-[0.65rem]">npm run dev:ai</code> hoặc API key cá nhân
      </span>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">🤖</span> Luận giải AI
          </h3>
          {statusBadge()}
        </div>

        {serverStatus === 'unconfigured' && (
          <div className="mb-4 p-3 bg-white/80 rounded-lg border border-violet-100 text-sm text-gray-700 space-y-2">
            <p className="font-semibold text-violet-900">Cấu hình AI trên Netlify (một lần)</p>
            <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
              <li>
                Lấy API key tại{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 underline"
                >
                  platform.openai.com/api-keys
                </a>
              </li>
              <li>
                Netlify → Site <strong>tuvi-dau-so-pro</strong> → Site configuration → Environment
                variables
              </li>
              <li>
                Thêm <code className="bg-violet-50 px-1 rounded">OPENAI_API_KEY</code> ={' '}
                <code className="bg-violet-50 px-1 rounded">sk-...</code>
              </li>
              <li>
                (Tùy chọn) <code className="bg-violet-50 px-1 rounded">OPENAI_MODEL</code> ={' '}
                <code className="bg-violet-50 px-1 rounded">gpt-4o-mini</code>
              </li>
              <li>Deploy lại site (hoặc Trigger deploy)</li>
            </ol>
            <p className="text-xs text-gray-500">
              Hoặc CLI:{' '}
              <code className="bg-gray-100 px-1 rounded block mt-1 break-all">
                npx netlify env:set OPENAI_API_KEY &quot;sk-...&quot; --context production
              </code>
            </p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Phân tích lá số bằng OpenAI. Key trên server không lộ ra trình duyệt; key cá nhân chỉ lưu
          localStorage máy bạn.
        </p>

        {showKeyInput && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-violet-100">
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              OpenAI API Key cá nhân (fallback)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-3 py-2 text-sm border rounded-lg"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700"
              >
                Lưu
              </button>
            </div>
            {getStoredApiKey() && (
              <button
                type="button"
                onClick={() => {
                  clearApiKey();
                  setApiKey('');
                }}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Xóa key đã lưu
              </button>
            )}
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
            onKeyDown={(e) => e.key === 'Enter' && question.trim() && !loading && run(question)}
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {lastVia && (
            <p className="text-xs text-gray-400 mb-3">
              {lastVia === 'server' ? 'Qua server Netlify' : 'Qua API key trình duyệt'}
            </p>
          )}
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">{text}</div>
        </div>
      )}
    </div>
  );
}
