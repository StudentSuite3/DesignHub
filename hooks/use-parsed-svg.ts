"use client";

import { useMemo } from "react";

import { parseSvg } from "@/lib/svg/parse";
import { useSvgStore } from "@/store/svg-store";

/** The current document, parsed once per edit. */
export function useParsedSvg() {
  const source = useSvgStore((state) => state.source);
  return useMemo(() => parseSvg(source), [source]);
}
