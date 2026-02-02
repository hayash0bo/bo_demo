"use client";
import { useState } from "react";
import { Step0Input } from "@/lib/types";
import { callOpenAI } from "@/lib/openai";
import { buildTranscriptPrompt } from "@/lib/prompts";

interface Props {
  apiKey: string;
  input: Step0Input;
  onInputChange: (input: Step0Input) => void;
  transcript: string;
  onTranscriptChange: (t: string) => void;
  onComplete: () => void;
}

export default function Step0Generate({
  apiKey,
  input,
  onInputChange,
  transcript,
  onTranscriptChange,
  onComplete,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof Step0Input, value: string) => {
    onInputChange({ ...input, [field]: value });
  };

  const isValid =
    input.title && input.industry && input.product && input.salesMembers && input.customerMembers;

  const generate = async () => {
    if (!apiKey) {
      setError("APIキーを入力してください");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const prompt = buildTranscriptPrompt(
        input.title,
        input.industry,
        input.product,
        input.salesMembers,
        input.customerMembers
      );
      const result = await callOpenAI(apiKey, [{ role: "user", content: prompt }]);
      onTranscriptChange(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: keyof Step0Input; label: string; placeholder: string }[] = [
    { key: "title", label: "会議タイトル", placeholder: "例: 製造ライン自動化提案" },
    { key: "industry", label: "業界", placeholder: "例: 自動車製造" },
    { key: "product", label: "商材", placeholder: "例: 産業用ロボットアーム" },
    { key: "salesMembers", label: "営業側参加者", placeholder: "例: 田中太郎, 佐藤花子" },
    { key: "customerMembers", label: "顧客側参加者", placeholder: "例: 山田部長, 鈴木課長" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">サンプル書き起こし生成</h2>
        <p className="text-sm text-gray-500 mt-1">
          デモ用の商談書き起こしテキストをAIで生成します。設定を入力して生成ボタンを押してください。
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
            <input
              type="text"
              value={input[key]}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-[#7724EB]/20 focus:border-[#7724EB] outline-none"
            />
          </div>
        ))}

        <button
          onClick={generate}
          disabled={!isValid || loading}
          className="bg-[#7724EB] text-white rounded-lg px-6 py-2.5 font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              生成中...
            </span>
          ) : (
            "書き起こしを生成"
          )}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {transcript && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-500">生成された書き起こし</h3>
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            rows={20}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-mono leading-relaxed focus:ring-2 focus:ring-[#7724EB]/20 focus:border-[#7724EB] outline-none resize-y"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{transcript.length}文字</span>
            <button
              onClick={onComplete}
              className="bg-[#7724EB] text-white rounded-lg px-6 py-2.5 font-medium hover:bg-violet-700 transition-colors"
            >
              次へ: テンプレート定義
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
