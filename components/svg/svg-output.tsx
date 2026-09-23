"use client";

import { useMemo } from "react";

import { SwitchField } from "@/components/effects/fields";
import { ExportPanel } from "@/components/export/export-panel";
import { useOptimizedSvg } from "@/hooks/use-optimized-svg";
import { useOptimizedTree } from "@/hooks/use-optimized-tree";
import { componentNameFromFile, reactComponent, toJsx, withCurrentColor } from "@/lib/svg/jsx";
import { minify, prettyPrint } from "@/lib/svg/serialize";
import { useSvgStore } from "@/store/svg-store";
import type { ExportFormat } from "@/types/export";
import type { SvgNode } from "@/types/svg";

export function SvgOutput({ root }: { root: SvgNode | null }) {
  const name = useSvgStore((state) => state.name);
  const currentColor = useSvgStore((state) => state.currentColor);
  const setCurrentColor = useSvgStore((state) => state.setCurrentColor);
  const optimized = useOptimizedSvg();
  const tree = useOptimizedTree();
  const base = name.replace(/\.svg$/i, "");

  const formats = useMemo<ExportFormat[]>(() => {
    if (!root || !optimized || !tree) return [];
    const codeTree = currentColor ? withCurrentColor(tree) : tree;
    return [
      { id: "optimized", label: "Optimized", filename: `${base}.min.svg`, language: "svg", code: optimized.svg },
      { id: "pretty", label: "Pretty", filename: `${base}.svg`, language: "svg", code: `${prettyPrint(root)}\n` },
      { id: "minified", label: "Minified", filename: `${base}.svg`, language: "svg", code: minify(root) },
      {
        id: "jsx",
        label: "JSX",
        filename: `${base}.jsx`,
        language: "tsx",
        code: `${toJsx(codeTree, { rootSpread: "{...props}" })}\n`,
      },
      {
        id: "react",
        label: "React",
        filename: `${componentNameFromFile(name)}.tsx`,
        language: "tsx",
        code: reactComponent(codeTree, name),
      },
    ];
  }, [root, optimized, tree, currentColor, base, name]);

  if (!root) return <p className="text-sm text-muted-foreground">Fix the SVG to see the generated code.</p>;
  return (
    <>
      <SwitchField label="Use currentColor in JSX / React" checked={currentColor} onChange={setCurrentColor} />
      <ExportPanel formats={formats} label="SVG output format" />
    </>
  );
}
