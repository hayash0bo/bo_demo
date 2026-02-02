"use client";
import { useState } from "react";
import { TemplateItem, AnalysisResult } from "@/lib/types";
import { callOpenAI } from "@/lib/openai";
import { buildSimpleSummaryPrompt, buildStructuredAnalysisPrompt } from "@/lib/prompts";

interface Props {
  apiKey: string;
  transcript: string;
  template: TemplateItem[];
  simpleSummary: string;
  onSimpleSummaryChange: (s: string) => void;
  structuredResult: AnalysisResult | null;
  onStructuredResultChange: (r: AnalysisResult) => void;
  onComplete: () => void;
}

export default function Step2Analysis({
  apiKey,
  transcript,
  template,
  simpleSummary,
  onSimpleSummaryChange,
  structuredResult,
  onStructuredResultChange,
  onComplete,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!apiKey) {
      setError("APIキーを入力してください");
      return;
    }
    if (!transcript) {
      setError("書き起こしテキストがありません。Step 0に戻ってください。");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [summaryRes, structuredRes] = await Promise.all([
        callOpenAI(apiKey, [
          { role: "user", content: buildSimpleSummaryPrompt(transcript) },
        ]),
        callOpenAI(
          apiKey,
          [
            {
              role: "user",
              content: buildStructuredAnalysisPrompt(transcript, template),
            },
          ],
          true
        ),
      ]);
      onSimpleSummaryChange(summaryRes);
      onStructuredResultChange(JSON.parse(structuredRes));
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (item: TemplateItem, value: unknown) => {
    if (!value) return <span className="text-gray-400 text-sm">-</span>;

    if (item.method === "enum") {
      return (
        <span className="inline-block bg-violet-50 text-[#7724EB] rounded-full px-3 py-1 text-sm font-medium">
          {String(value)}
        </span>
      );
    }
    if (item.method === "list" && Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((v, i) => (
            <li key={i} className="text-sm text-gray-700">{v}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-sm text-gray-700 leading-relaxed">{String(value)}</p>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">解析実行・結果比較</h2>
        <p className="text-sm text-gray-500 mt-1">
          「通常の要約」と「構造化解析」の違いを比較します。
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={analyze}
          disabled={loading}
          className="bg-[#7724EB] text-white rounded-lg px-8 py-3 font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              解析中...
            </span>
          ) : (
            "解析を実行"
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      {(simpleSummary || structuredResult) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Simple Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-medium">
                従来の方法
              </span>
              <h3 className="text-base font-bold text-gray-900">通常の要約</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {simpleSummary || "生成中..."}
            </p>
          </div>

          {/* Right: Structured Analysis */}
          <div className="bg-white rounded-xl border-2 border-[#7724EB]/30 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-violet-50 text-[#7724EB] rounded-full px-3 py-1 text-xs font-medium">
                BRING OUT
              </span>
              <h3 className="text-base font-bold text-gray-900">構造化解析</h3>
            </div>
            {structuredResult &&
              template.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">{item.name}</p>
                  {renderValue(item, structuredResult[item.id])}
                </div>
              ))}
          </div>
        </div>
      )}

      {structuredResult && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="bg-[#7724EB] text-white rounded-lg px-6 py-2.5 font-medium hover:bg-violet-700 transition-colors"
          >
            次へ: ダッシュボード
          </button>
        </div>
      )}
    </div>
  );
}
