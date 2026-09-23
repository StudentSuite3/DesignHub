"use client";

import { FileJson } from "lucide-react";

import { CodeBlock } from "@/components/export/code-block";
import { Button } from "@/components/ui/button";
import { downloadText } from "@/lib/download";
import { stampReport, type A11yReport } from "@/lib/a11y/report";

export function A11yReportPanel({ report }: { report: A11yReport }) {
  const json = `${JSON.stringify(report, null, 2)}\n`;
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Report</h2>
        <Button size="sm" onClick={() => downloadText(stampReport(report), "accessibility-report.json")}>
          <FileJson /> Download JSON
        </Button>
      </div>
      <CodeBlock code={json} filename="accessibility-report.json" maxHeight="32rem" />
    </>
  );
}
