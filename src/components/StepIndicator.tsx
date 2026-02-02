"use client";

const STEPS = [
  { label: "書き起こし生成", short: "Step 0" },
  { label: "テンプレート定義", short: "Step 1" },
  { label: "解析・比較", short: "Step 2" },
  { label: "ダッシュボード", short: "Step 3" },
];

interface Props {
  current: number;
  onNavigate: (step: number) => void;
  completedSteps: Set<number>;
}

export default function StepIndicator({ current, onNavigate, completedSteps }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 py-6">
      {STEPS.map((step, i) => {
        const isActive = i === current;
        const isCompleted = completedSteps.has(i);
        const isClickable = isCompleted || i <= current;

        return (
          <div key={i} className="flex items-center">
            <button
              onClick={() => isClickable && onNavigate(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                isClickable ? "cursor-pointer" : "cursor-default"
              } ${isActive ? "" : "hover:bg-gray-100"}`}
              disabled={!isClickable}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[#7724EB] text-white"
                    : isCompleted
                    ? "bg-[#7724EB] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted && !isActive ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i
                )}
              </span>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isActive ? "text-[#7724EB]" : isCompleted ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  completedSteps.has(i) ? "bg-[#7724EB]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
