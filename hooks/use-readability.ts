"use client";

import { useEffect, useMemo, useState } from "react";

import { averageCharWidth, readabilityChecks, readingScore } from "@/lib/a11y/readability";
import { useA11yStore } from "@/store/a11y-store";

export function useReadability() {
  const typography = useA11yStore((state) => state.typography);
  const sample = useA11yStore((state) => state.sample);
  // Glyph widths change once the web font arrives, so re-measure then.
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => active && setFontsReady((count) => count + 1));
    return () => {
      active = false;
    };
  }, [typography.family]);

  return useMemo(() => {
    // Measure only after mount (fontsReady > 0) so the server and first client render agree.
    const charWidth = fontsReady > 0 ? averageCharWidth(typography, sample) : typography.size * 0.5;
    const charsPerLine = typography.measure / charWidth;
    const score = readingScore(sample);
    return { charsPerLine, score, checks: readabilityChecks(typography, charsPerLine, score) };
  }, [typography, sample, fontsReady]);
}
