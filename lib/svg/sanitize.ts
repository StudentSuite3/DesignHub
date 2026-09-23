import { defaultOptimizeOptions, optimizeTree } from "@/lib/svg/optimize";
import { parseSvg } from "@/lib/svg/parse";
import { minify } from "@/lib/svg/serialize";

const keepEverything = {
  ...defaultOptimizeOptions,
  removeMetadata: false,
  removeEditorData: false,
  removeUnusedIds: false,
  collapseGroups: false,
  optimizePaths: false,
  cleanupNumbers: false,
  shortenColors: false,
  styleToAttributes: false,
  removeDimensions: false,
};

/** Returns a script-free copy of user SVG (structure otherwise untouched), or null if it isn't SVG. */
export function sanitizeSvg(source: string): string | null {
  const parsed = parseSvg(source);
  if (!parsed.ok) return null;
  return minify(optimizeTree(parsed.root, keepEverything));
}
