"use client";
import { useState } from "react";
import { TemplateItem, AnalysisResult, DashboardRecord } from "@/lib/types";
import { callOpenAI } from "@/lib/openai";
import { buildDummyDataPrompt } from "@/lib/prompts";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#7724EB",
  "#A855F7",
  "#C084FC",
  "#D8B4FE",
  "#059669",
  "#D97706",
  "#DC2626",
  "#3B82F6",
  "#6366F1",
  "#EC4899",
];

interface Props {
  apiKey: string;
  template: TemplateItem[];
  structuredResult: AnalysisResult | null;
  step0Industry: string;
  step0Title: string;
  dashboardData: DashboardRecord[];
  onDashboardDataChange: (data: DashboardRecord[]) => void;
}

export default function Step3Dashboard({
  apiKey,
  template,
  structuredResult,
  step0Industry,
  step0Title,
  dashboardData,
  onDashboardDataChange,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateDashboard = async () => {
    if (!structuredResult) return;
    setLoading(true);
    setError("");
    try {
      const res = await callOpenAI(
        apiKey,
        [
          {
            role: "user",
            content: buildDummyDataPrompt(template, structuredResult, 9),
          },
        ],
        true
      );
      const parsed = JSON.parse(res);
      const dummies: DashboardRecord[] = parsed.records;

      const realRecord: DashboardRecord = {
        id: "real_0",
        title: step0Title,
        industry: step0Industry,
        analysis: structuredResult,
      };
      onDashboardDataChange([realRecord, ...dummies]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (!structuredResult) {
    return (
      <div className="text-center py-20 text-gray-500">
        Step 2で解析を実行してください。
      </div>
    );
  }

  if (dashboardData.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">ダッシュボード</h2>
          <p className="text-sm text-gray-500 mt-1">
            構造化解析が蓄積されたときの分析イメージを表示します。実データ1件 + ダミー9件 = 計10件で描画します。
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={generateDashboard}
            disabled={loading}
            className="bg-[#7724EB] text-white rounded-lg px-8 py-3 font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                ダミーデータ生成中...
              </span>
            ) : (
              "ダッシュボードを生成"
            )}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>
    );
  }

  // Build widgets from template
  const enumItems = template.filter((t) => t.method === "enum");
  const listItems = template.filter((t) => t.method === "list");
  const summaryItems = template.filter((t) => t.method === "summary");

  // KPI
  const totalCount = dashboardData.length;
  const industries = [...new Set(dashboardData.map((d) => d.industry))];

  // Enum chart data
  const enumChartData = enumItems.map((item) => {
    const counts: Record<string, number> = {};
    dashboardData.forEach((d) => {
      const val = String(d.analysis[item.id] || "不明");
      counts[val] = (counts[val] || 0) + 1;
    });
    return {
      item,
      data: Object.entries(counts).map(([name, value]) => ({ name, value })),
    };
  });

  // List frequency data
  const listFreqData = listItems.map((item) => {
    const freq: Record<string, number> = {};
    dashboardData.forEach((d) => {
      const val = d.analysis[item.id];
      const arr = Array.isArray(val) ? val : [];
      arr.forEach((v) => {
        freq[v] = (freq[v] || 0) + 1;
      });
    });
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    return { item, data: sorted };
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">ダッシュボード</h2>
        <p className="text-sm text-gray-500 mt-1">
          構造化解析 {totalCount}件分の集計結果
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-500">総商談数</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-500">業界数</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{industries.length}</p>
        </div>
        {enumChartData.slice(0, 2).map(({ item, data }) => {
          const top = data.sort((a, b) => b.value - a.value)[0];
          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-medium text-gray-500">{item.name}（最多）</p>
              <p className="text-2xl font-bold text-[#7724EB] mt-1">{top?.name || "-"}</p>
              <p className="text-xs text-gray-400">{top ? `${Math.round((top.value / totalCount) * 100)}%` : ""}</p>
            </div>
          );
        })}
      </div>

      {/* Enum Charts */}
      {enumChartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enumChartData.map(({ item, data }) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">{item.name}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}

      {/* List Bar Charts */}
      {listFreqData.length > 0 && (
        <div className="space-y-6">
          {listFreqData.map(({ item, data }) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">{item.name}（頻出ランキング）</h3>
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={Math.max(200, data.length * 36)}>
                  <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7724EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-400">データなし</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary / VoC cards */}
      {summaryItems.length > 0 && (
        <div className="space-y-6">
          {summaryItems.map((item) => (
            <div key={item.id}>
              <h3 className="text-sm font-bold text-gray-900 mb-3">{item.name}（VoC一覧）</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.map((record) => {
                  const val = record.analysis[item.id];
                  return (
                    <div
                      key={record.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-violet-50 text-[#7724EB] rounded-full px-2 py-0.5 text-xs font-medium">
                          {record.industry}
                        </span>
                        <span className="text-xs text-gray-400">{record.title}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {String(val || "-")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
