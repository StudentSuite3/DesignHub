"use client";

import { useMemo } from "react";

import { useParsedSvg } from "@/hooks/use-parsed-svg";
import { optimizeSvg, type OptimizeResult } from "@/lib/svg/optimize";
import { useSvgStore } from "@/store/svg-store";

export function useOptimizedSvg(): OptimizeResult | null {
  const parsed = useParsedSvg();
  const source = useSvgStore((state) => state.source);
  const options = useSvgStore((state) => state.options);
  return useMemo(() => (parsed.ok ? optimizeSvg(parsed.root, source, options) : null), [parsed, source, options]);
}
