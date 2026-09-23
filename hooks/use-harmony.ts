"use client";

import { useCallback } from "react";

import { randomColor } from "@/lib/color/generate";
import { harmonyPalette } from "@/lib/color/harmony";
import { useColorStore } from "@/store/color-store";
import type { Oklch } from "@/types/color";

/**
 * Returns a generator for the current harmony mode. The anchor is the first
 * locked swatch, otherwise a fresh random color (so every press explores).
 */
export function useHarmonyGenerator(): () => Oklch[] {
  return useCallback(() => {
    const { swatches, harmony } = useColorStore.getState();
    const anchorIndex = swatches.findIndex((swatch) => swatch.locked);
    const anchor = swatches[anchorIndex]?.color ?? randomColor();
    return harmonyPalette(harmony, anchor, swatches.length, Math.random, Math.max(anchorIndex, 0));
  }, []);
}
