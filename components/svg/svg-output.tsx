"use client";

import { useMemo } from "react";

import { ExportPanel } from "@/components/export/export-panel";
import { prettyPrint } from "@/lib/svg/serialize";
import { useSvgStore } from "@/store/svg-store";
import type { ExportFormat } from "@/types/export";
import type { SvgNode } from "@/types/svg";

export function SvgOutput({ root }: { root: SvgNode | null }) {
  const name = useSvgStore((state) => state.name);
  const base = name.replace(/\.svg$/i, "");

  const formats = useMemo<ExportFormat[]>(
    () =>
      root
        ? [{ id: "pretty", label: "Pretty", filename: `${base}.svg`, language: "svg", code: `${prettyPrint(root)}\n` }]
        : [],
    [root, base],
  );

  if (!root) return <p className="text-sm text-muted-foreground">Fix the SVG to see the generated code.</p>;
  return <ExportPanel formats={formats} label="SVG output format" />;
}
