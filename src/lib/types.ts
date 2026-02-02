export type ProcessingMethod = "summary" | "enum" | "list";

export interface TemplateItem {
  id: string;
  name: string;
  method: ProcessingMethod;
  instruction: string;
  options?: string; // comma-separated for enum
}

export interface AnalysisResult {
  [itemId: string]: string | string[];
}

export interface DashboardRecord {
  id: string;
  title: string;
  industry: string;
  analysis: AnalysisResult;
}

export interface Step0Input {
  title: string;
  industry: string;
  product: string;
  salesMembers: string;
  customerMembers: string;
}
