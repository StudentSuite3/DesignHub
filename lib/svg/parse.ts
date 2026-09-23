import { parseSync } from "svgson";

import type { SvgParseResult } from "@/types/svg";

/** Strips the prolog (XML declaration, doctype, leading comments) that svgson doesn't need. */
function stripProlog(source: string): string {
  return source
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .trim();
}

export function parseSvg(source: string): SvgParseResult {
  const input = stripProlog(source);
  if (!input) return { ok: false, error: "Paste, drop or upload an SVG to get started." };
  try {
    const root = parseSync(input);
    if (root?.name !== "svg") return { ok: false, error: "The root element must be <svg>." };
    return { ok: true, root };
  } catch {
    return { ok: false, error: "This doesn't look like valid SVG markup." };
  }
}
