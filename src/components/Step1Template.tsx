"use client";
import { TemplateItem, ProcessingMethod } from "@/lib/types";

interface Props {
  template: TemplateItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TemplateItem>) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onComplete: () => void;
}

const METHOD_OPTIONS: { value: ProcessingMethod; label: string }[] = [
  { value: "summary", label: "要約" },
  { value: "enum", label: "Enum" },
  { value: "list", label: "リスト" },
];

export default function Step1Template({
  template,
  onAdd,
  onRemove,
  onUpdate,
  onMove,
  onComplete,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">解析テンプレート定義</h2>
        <p className="text-sm text-gray-500 mt-1">
          書き起こしから抽出する項目と処理方法を定義します。プリセットをカスタマイズできます。
        </p>
      </div>

      <div className="space-y-3">
        {template.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
          >
            <div className="flex items-start gap-3">
              {/* Move buttons */}
              <div className="flex flex-col gap-0.5 pt-1">
                <button
                  onClick={() => onMove(item.id, "up")}
                  disabled={idx === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-0.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => onMove(item.id, "down")}
                  disabled={idx === template.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-0.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">項目名</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7724EB]/20 focus:border-[#7724EB] outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">処理方法</label>
                  <select
                    value={item.method}
                    onChange={(e) =>
                      onUpdate(item.id, { method: e.target.value as ProcessingMethod })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7724EB]/20 focus:border-[#7724EB] outline-none bg-white"
                  >
                    {METHOD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {item.method === "enum" && (
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">選択肢（カンマ区切り）</label>
                    <input
                      type="text"
                      value={item.options || ""}
                      onChange={(e) => onUpdate(item.id, { options: e.target.value })}
                      placeholder="高,中,低"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7724EB]/20 focus:border-[#7724EB] outline-none"
                    />
                  </div>
                )}
                <div className={item.method === "enum" ? "col-span-4" : "col-span-7"}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">処理指示</label>
                  <input
                    type="text"
                    value={item.instruction}
                    onChange={(e) => onUpdate(item.id, { instruction: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7724EB]/20 focus:border-[#7724EB] outline-none"
                  />
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 p-1 mt-5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onAdd}
          className="border border-gray-200 text-gray-700 rounded-lg px-6 py-2.5 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          項目を追加
        </button>
        <button
          onClick={onComplete}
          className="bg-[#7724EB] text-white rounded-lg px-6 py-2.5 font-medium hover:bg-violet-700 transition-colors"
        >
          次へ: 解析実行
        </button>
      </div>
    </div>
  );
}
