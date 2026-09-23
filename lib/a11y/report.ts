import type { A11yColors, A11yTypography, TouchTarget } from "@/types/a11y";

export type A11yReportInput = {
  colors: A11yColors;
  typography: A11yTypography;
  targets: TouchTarget[];
  targetGap: number;
};

export type A11yReport = {
  tool: "DesignHub Accessibility Lab";
  /** Stamped at download time so server and client renders stay identical. */
  generatedAt?: string;
  settings: A11yReportInput;
  sections: Record<string, unknown>;
};

/** Collects every check into one JSON document. Sections are contributed by each tool. */
export function buildReport(input: A11yReportInput, sections: Record<string, unknown>): A11yReport {
  return { tool: "DesignHub Accessibility Lab", settings: input, sections };
}

export function stampReport(report: A11yReport): string {
  return `${JSON.stringify({ ...report, generatedAt: new Date().toISOString() }, null, 2)}\n`;
}
