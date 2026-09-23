"use client";

import { useTheme } from "next-themes";

/** Solid foreground color for rendering icons into images (which can't inherit currentColor). */
export function useForegroundHex(): string {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "light" ? "#18181b" : "#f4f4f5";
}
