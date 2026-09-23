import { iconToHTML, iconToSVG, replaceIDs } from "@iconify/utils";

import type { IconData, IconStyle } from "@/types/icons";

export const defaultIconStyle: IconStyle = {
  size: 128,
  color: "currentColor",
  strokeWidth: null,
  corners: "default",
  rotate: 0,
  flipH: false,
  flipV: false,
  padding: 0,
  background: { shape: "none", color: "#6366f1" },
};

export function usesStroke(icon: IconData): boolean {
  return /stroke-width=|stroke="(?!none)/.test(icon.body);
}

function restyleBody(body: string, style: IconStyle): string {
  let next = body;
  if (style.strokeWidth !== null) {
    next = next.replace(/stroke-width="[^"]*"/g, `stroke-width="${style.strokeWidth}"`);
  }
  if (style.corners !== "default") {
    const cap = style.corners === "rounded" ? "round" : "square";
    const join = style.corners === "rounded" ? "round" : "miter";
    next = next.replace(/stroke-linecap="[^"]*"/g, `stroke-linecap="${cap}"`);
    next = next.replace(/stroke-linejoin="[^"]*"/g, `stroke-linejoin="${join}"`);
  }
  if (style.color !== "currentColor") {
    next = next.replace(/currentColor/g, style.color);
  }
  return next;
}

function backgroundShape(style: IconStyle, size: number): string {
  const { shape, color } = style.background;
  if (shape === "none") return "";
  if (shape === "circle") return `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}"/>`;
  const radius = shape === "rounded" ? size * 0.22 : 0;
  return `<rect width="${size}" height="${size}" rx="${radius}" fill="${color}"/>`;
}

/**
 * Builds a standalone SVG string for an icon with DesignHub styling applied.
 * Geometry is normalised to a square canvas so padding and backgrounds are predictable.
 */
export function buildIconSvg(icon: IconData, style: IconStyle, options: { uniqueIds?: boolean } = {}): string {
  const rendered = iconToSVG(
    { ...icon, body: restyleBody(icon.body, style) },
    { width: "auto", height: "auto", hFlip: style.flipH, vFlip: style.flipV },
  );
  const [minX = 0, minY = 0, width = icon.width, height = icon.height] = rendered.attributes.viewBox
    .split(" ")
    .map(Number);

  const canvas = 1000;
  const inner = canvas * (1 - (style.padding / 100) * 2);
  const scale = inner / Math.max(width, height);
  const offsetX = (canvas - width * scale) / 2 - minX * scale;
  const offsetY = (canvas - height * scale) / 2 - minY * scale;
  const rotate = style.rotate ? ` rotate(${style.rotate} ${canvas / 2} ${canvas / 2})` : "";

  let body = `${backgroundShape(style, canvas)}<g transform="${rotate.trim()} translate(${offsetX} ${offsetY}) scale(${scale})">${rendered.body}</g>`;
  if (options.uniqueIds) body = replaceIDs(body);

  return iconToHTML(body, {
    xmlns: "http://www.w3.org/2000/svg",
    width: String(style.size),
    height: String(style.size),
    viewBox: `0 0 ${canvas} ${canvas}`,
  });
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
