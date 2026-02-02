"use client";
import { useState, useCallback } from "react";
import { TemplateItem, AnalysisResult, DashboardRecord, Step0Input } from "@/lib/types";

const DEFAULT_TEMPLATE: TemplateItem[] = [
  {
    id: "temperature",
    name: "顧客の温度感",
    method: "enum",
    instruction: "顧客の購買意欲・関心度を判定",
    options: "高,中,低",
  },
  {
    id: "phase",
    name: "商談フェーズ",
    method: "enum",
    instruction: "商談の段階を判定",
    options: "初回接触,ニーズ把握,提案,交渉,クロージング",
  },
  {
    id: "competitors",
    name: "言及された競合",
    method: "list",
    instruction: "会話中に言及された競合企業・競合製品を列挙",
  },
  {
    id: "next_actions",
    name: "次のアクション",
    method: "list",
    instruction: "合意された次のステップを列挙",
  },
  {
    id: "concerns",
    name: "顧客の懸念点",
    method: "list",
    instruction: "顧客が表明した懸念・不安・課題を列挙",
  },
  {
    id: "topics",
    name: "主要な議論トピック",
    method: "list",
    instruction: "会議で議論された主要トピックを列挙",
  },
  {
    id: "summary",
    name: "商談要約",
    method: "summary",
    instruction: "商談内容を3〜5文で要約",
  },
];

export function useAppState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKey, setApiKey] = useState(
    process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""
  );

  // Step 0
  const [step0Input, setStep0Input] = useState<Step0Input>({
    title: "",
    industry: "",
    product: "",
    salesMembers: "",
    customerMembers: "",
  });
  const [transcript, setTranscript] = useState("");

  // Step 1
  const [template, setTemplate] = useState<TemplateItem[]>(DEFAULT_TEMPLATE);

  // Step 2
  const [simpleSummary, setSimpleSummary] = useState("");
  const [structuredResult, setStructuredResult] = useState<AnalysisResult | null>(null);

  // Step 3
  const [dashboardData, setDashboardData] = useState<DashboardRecord[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);

  const addTemplateItem = useCallback(() => {
    setTemplate((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        name: "",
        method: "list",
        instruction: "",
      },
    ]);
  }, []);

  const removeTemplateItem = useCallback((id: string) => {
    setTemplate((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateTemplateItem = useCallback(
    (id: string, updates: Partial<TemplateItem>) => {
      setTemplate((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const moveTemplateItem = useCallback((id: string, direction: "up" | "down") => {
    setTemplate((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }, []);

  return {
    currentStep,
    setCurrentStep,
    apiKey,
    setApiKey,
    step0Input,
    setStep0Input,
    transcript,
    setTranscript,
    template,
    setTemplate,
    addTemplateItem,
    removeTemplateItem,
    updateTemplateItem,
    moveTemplateItem,
    simpleSummary,
    setSimpleSummary,
    structuredResult,
    setStructuredResult,
    dashboardData,
    setDashboardData,
    loading,
    setLoading,
  };
}
