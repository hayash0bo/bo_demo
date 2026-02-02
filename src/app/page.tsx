"use client";
import { useMemo } from "react";
import { useAppState } from "@/hooks/useAppState";
import ApiKeyInput from "@/components/ApiKeyInput";
import StepIndicator from "@/components/StepIndicator";
import Step0Generate from "@/components/Step0Generate";
import Step1Template from "@/components/Step1Template";
import Step2Analysis from "@/components/Step2Analysis";
import Step3Dashboard from "@/components/Step3Dashboard";

export default function Home() {
  const state = useAppState();

  const completedSteps = useMemo(() => {
    const s = new Set<number>();
    if (state.transcript) s.add(0);
    if (state.template.length > 0 && state.transcript) s.add(1);
    if (state.structuredResult) s.add(2);
    if (state.dashboardData.length > 0) s.add(3);
    return s;
  }, [state.transcript, state.template, state.structuredResult, state.dashboardData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BRING OUT" className="h-7" />
          </div>
          <ApiKeyInput apiKey={state.apiKey} onChange={state.setApiKey} />
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-6xl mx-auto px-6">
        <StepIndicator
          current={state.currentStep}
          onNavigate={state.setCurrentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        {state.currentStep === 0 && (
          <Step0Generate
            apiKey={state.apiKey}
            input={state.step0Input}
            onInputChange={state.setStep0Input}
            transcript={state.transcript}
            onTranscriptChange={state.setTranscript}
            onComplete={() => state.setCurrentStep(1)}
          />
        )}
        {state.currentStep === 1 && (
          <Step1Template
            template={state.template}
            onAdd={state.addTemplateItem}
            onRemove={state.removeTemplateItem}
            onUpdate={state.updateTemplateItem}
            onMove={state.moveTemplateItem}
            onComplete={() => state.setCurrentStep(2)}
          />
        )}
        {state.currentStep === 2 && (
          <Step2Analysis
            apiKey={state.apiKey}
            transcript={state.transcript}
            template={state.template}
            simpleSummary={state.simpleSummary}
            onSimpleSummaryChange={state.setSimpleSummary}
            structuredResult={state.structuredResult}
            onStructuredResultChange={state.setStructuredResult}
            onComplete={() => state.setCurrentStep(3)}
          />
        )}
        {state.currentStep === 3 && (
          <Step3Dashboard
            apiKey={state.apiKey}
            template={state.template}
            structuredResult={state.structuredResult}
            step0Industry={state.step0Input.industry}
            step0Title={state.step0Input.title}
            dashboardData={state.dashboardData}
            onDashboardDataChange={state.setDashboardData}
          />
        )}
      </main>
    </div>
  );
}
