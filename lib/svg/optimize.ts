import { cloneNode } from "@/lib/svg/edit";
import { formatNumber, optimizePathData } from "@/lib/svg/path-optimize";
import { minify, prettyPrint } from "@/lib/svg/serialize";
import { byteLength } from "@/lib/svg-size";
import type { SvgNode } from "@/types/svg";

export type SvgOptimizeOptions = {
  precision: number;
  removeMetadata: boolean;
  removeEditorData: boolean;
  removeUnusedIds: boolean;
  collapseGroups: boolean;
  optimizePaths: boolean;
  cleanupNumbers: boolean;
  shortenColors: boolean;
  styleToAttributes: boolean;
  removeDimensions: boolean;
  pretty: boolean;
};

export const defaultOptimizeOptions: SvgOptimizeOptions = {
  precision: 2,
  removeMetadata: true,
  removeEditorData: true,
  removeUnusedIds: true,
  collapseGroups: true,
  optimizePaths: true,
  cleanupNumbers: true,
  shortenColors: true,
  styleToAttributes: true,
  removeDimensions: false,
  pretty: false,
};

const EDITOR_PREFIXES = ["inkscape:", "sodipodi:", "sketch:", "figma:", "serif:", "i:", "x:", "graph:", "adobe:"];
const METADATA_TAGS = new Set(["metadata", "desc"]);
const UNSAFE_TAGS = new Set(["script", "foreignObject"]);
const NUMERIC_ATTRIBUTES = new Set([
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "width",
  "height",
  "stroke-width",
  "offset",
  "opacity",
  "fill-opacity",
  "stroke-opacity",
  "stop-opacity",
  "font-size",
]);
const PRESENTATION = new Set([
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-dasharray",
  "stroke-opacity",
  "fill-opacity",
  "fill-rule",
  "clip-rule",
  "opacity",
  "stop-color",
  "stop-opacity",
  "display",
  "visibility",
  "font-family",
  "font-size",
  "font-weight",
]);
/**
 * Values equal to the default that are safe to drop. Only non-inherited properties are listed:
 * removing e.g. stroke-width="1" from a child would let a parent's stroke-width take over.
 */
const DEFAULTS: Record<string, string> = { opacity: "1", version: "1.1" };

function walk(node: SvgNode, visit: (node: SvgNode) => void): void {
  visit(node);
  node.children.forEach((child) => walk(child, visit));
}

/** Always on: nothing executable survives an optimisation pass. */
function sanitize(node: SvgNode): void {
  node.children = node.children.filter((child) => !UNSAFE_TAGS.has(child.name));
  for (const name of Object.keys(node.attributes)) {
    const value = node.attributes[name] ?? "";
    if (/^on/i.test(name) || /^\s*javascript:/i.test(value)) delete node.attributes[name];
  }
  node.children.forEach(sanitize);
}

function shortColor(value: string): string {
  const match = value.trim().match(/^#([\da-f])\1([\da-f])\2([\da-f])\3$/i);
  if (match) return `#${match[1]}${match[2]}${match[3]}`.toLowerCase();
  return /^#[\da-f]{6}$/i.test(value.trim()) ? value.trim().toLowerCase() : value;
}

function referencedIds(root: SvgNode): Set<string> {
  const ids = new Set<string>();
  walk(root, (node) => {
    for (const [name, value] of Object.entries(node.attributes)) {
      for (const match of value.matchAll(/url\(\s*['"]?#([^'")\s]+)/g)) ids.add(match[1] ?? "");
      if ((name === "href" || name === "xlink:href") && value.startsWith("#")) ids.add(value.slice(1));
    }
  });
  return ids;
}

function cleanAttributes(node: SvgNode, options: SvgOptimizeOptions, used: Set<string>): void {
  const attributes = node.attributes;
  if (options.styleToAttributes && attributes.style) {
    const leftover: string[] = [];
    for (const rule of attributes.style.split(";")) {
      const [property = "", ...rest] = rule.split(":");
      const key = property.trim();
      const value = rest.join(":").trim();
      if (!key || !value) continue;
      if (PRESENTATION.has(key) && attributes[key] === undefined) attributes[key] = value;
      else leftover.push(`${key}:${value}`);
    }
    if (leftover.length) attributes.style = leftover.join(";");
    else delete attributes.style;
  }

  for (const [name, raw] of Object.entries(attributes)) {
    let value = raw;
    if (
      options.removeEditorData &&
      (EDITOR_PREFIXES.some((prefix) => name.startsWith(prefix)) ||
        /^xmlns:(inkscape|sodipodi|sketch|figma|serif|x|i|graph)$/.test(name) ||
        name === "data-name")
    ) {
      delete attributes[name];
      continue;
    }
    if (options.removeUnusedIds && name === "id" && !used.has(value)) {
      delete attributes[name];
      continue;
    }
    if (DEFAULTS[name] === value.trim()) {
      delete attributes[name];
      continue;
    }
    if (options.cleanupNumbers && NUMERIC_ATTRIBUTES.has(name) && /^-?\d*\.?\d+(e-?\d+)?(px)?$/.test(value.trim())) {
      value = formatNumber(Number.parseFloat(value), options.precision);
    }
    if (options.cleanupNumbers && (name === "viewBox" || name === "points")) {
      value = value
        .trim()
        .split(/[\s,]+/)
        .map((part) => formatNumber(Number(part), options.precision))
        .join(" ");
    }
    if (options.optimizePaths && name === "d") value = optimizePathData(value, options.precision);
    if (options.shortenColors && (name === "fill" || name === "stroke" || name === "stop-color"))
      value = shortColor(value);
    attributes[name] = value;
  }
}

/** Unwraps attribute-less <g> elements and drops empty ones. */
function collapse(node: SvgNode): void {
  node.children.forEach(collapse);
  node.children = node.children.flatMap((child) => {
    if (child.name !== "g") return [child];
    if (child.children.length === 0) return [];
    return Object.keys(child.attributes).length === 0 ? child.children : [child];
  });
}

export type OptimizeResult = { svg: string; before: number; after: number; saved: number };

/** The optimized (and always sanitized) tree, for converters that need structure rather than text. */
export function optimizeTree(root: SvgNode, options: SvgOptimizeOptions): SvgNode {
  const tree = cloneNode(root);
  sanitize(tree);
  const used = referencedIds(tree);

  walk(tree, (node) => {
    if (options.removeMetadata) node.children = node.children.filter((child) => !METADATA_TAGS.has(child.name));
    if (options.removeEditorData)
      node.children = node.children.filter((child) => !EDITOR_PREFIXES.some((prefix) => child.name.startsWith(prefix)));
    cleanAttributes(node, options, used);
  });
  if (options.collapseGroups) collapse(tree);
  if (options.removeDimensions && tree.attributes.viewBox) {
    delete tree.attributes.width;
    delete tree.attributes.height;
  }
  return tree;
}

export function optimizeSvg(root: SvgNode, source: string, options: SvgOptimizeOptions): OptimizeResult {
  const tree = optimizeTree(root, options);
  const svg = options.pretty ? `${prettyPrint(tree)}\n` : minify(tree);
  const before = byteLength(source);
  const after = byteLength(svg);
  return { svg, before, after, saved: before ? Math.max(0, 1 - after / before) : 0 };
}
