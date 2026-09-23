"use client";

import { useMemo } from "react";

import { useParsedSvg } from "@/hooks/use-parsed-svg";
import { optimizeTree } from "@/lib/svg/optimize";
import { useSvgStore } from "@/store/svg-store";
import type { SvgNode } from "@/types/svg";

export function useOptimizedTree(): SvgNode | null {
  const parsed = useParsedSvg();
  const options = useSvgStore((state) => state.options);
  return useMemo(() => (parsed.ok ? optimizeTree(parsed.root, options) : null), [parsed, options]);
}
