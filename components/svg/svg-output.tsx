"use client";

import { useMemo } from "react";

import { ExportPanel } from "@/components/export/export-panel";
import { useOptimizedSvg } from "@/hooks/use-optimized-svg";
import { minify, prettyPrint } from "@/lib/svg/serialize";
import { useSvgStore } from "@/store/svg-store";
import type { ExportFormat } from "@/types/export";
import type { SvgNode } from "@/types/svg";

export function SvgOutput({ root }: { root: SvgNode | null }) {
  const name = useSvgStore((state) => state.name);
  const optimized = useOptimizedSvg();
  const base = name.replace(/\.svg$/i, "");

  const formats = useMemo<ExportFormat[]>(() => {
    if (!root || !optimized) return [];
    return [
      { id: "optimized", label: "Optimized", filename: `${base}.min.svg`, language: "svg", code: optimized.svg },
      { id: "pretty", label: "Pretty", filename: `${base}.svg`, language: "svg", code: `${prettyPrint(root)}\n` },
      { id: "minified", label: "Minified", filename: `${base}.svg`, language: "svg", code: minify(root) },
    ];
  }, [root, optimized, base]);

  if (!root) return <p className="text-sm text-muted-foreground">Fix the SVG to see the generated code.</p>;
  return <ExportPanel formats={formats} label="SVG output format" />;
}
