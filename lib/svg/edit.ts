import type { SvgNode } from "@/types/svg";

export function cloneNode(node: SvgNode): SvgNode {
  return structuredClone(node);
}

/** Returns a copy of the root with attributes set (string) or removed (null). */
export function setRootAttributes(root: SvgNode, patch: Record<string, string | null>): SvgNode {
  const next = cloneNode(root);
  for (const [name, value] of Object.entries(patch)) {
    if (value === null) delete next.attributes[name];
    else next.attributes[name] = value;
  }
  return next;
}

export type ViewBox = { x: number; y: number; width: number; height: number };

export function readViewBox(root: SvgNode): ViewBox | null {
  const parts = root.attributes.viewBox
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  if (!parts || parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
  const [x = 0, y = 0, width = 0, height = 0] = parts;
  return { x, y, width, height };
}

export function formatViewBox(box: ViewBox): string {
  return [box.x, box.y, box.width, box.height].map((value) => Math.round(value * 1000) / 1000).join(" ");
}
