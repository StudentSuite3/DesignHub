import { nestLogo, type Rect } from "@/lib/logo/compose";
import { monochromeSvg } from "@/lib/logo/recolor";
import type { MockupContext } from "@/lib/mockups/types";

export const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Standalone SVG with the brand fonts inlined and `.h` / `.b` classes for heading and body text. */
export function mockupDoc(ctx: MockupContext, width: number, height: number, body: string, defs = ""): string {
  const { heading, headingCategory, body: bodyFont, bodyCategory } = ctx.brand.typography;
  const fallback = (category: string) =>
    category === "serif"
      ? "Georgia, serif"
      : category === "monospace"
        ? "ui-monospace, monospace"
        : "ui-sans-serif, system-ui, sans-serif";
  const style = `${ctx.fontCss}
.h{font-family:'${heading}',${fallback(headingCategory)};font-weight:${ctx.brand.typography.headingWeight}}
.b{font-family:'${bodyFont}',${fallback(bodyCategory)};font-weight:400}
.bb{font-family:'${bodyFont}',${fallback(bodyCategory)};font-weight:600}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><style>${style}</style><defs><filter id="soft" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity=".28"/></filter>${defs}</defs>${body}</svg>`;
}

type TextOptions = {
  size: number;
  fill: string;
  font?: "h" | "b" | "bb";
  anchor?: "start" | "middle" | "end";
  spacing?: number;
  opacity?: number;
};

export function text(x: number, y: number, value: string, options: TextOptions): string {
  const { size, fill, font = "b", anchor = "start", spacing = 0, opacity = 1 } = options;
  return `<text class="${font}" x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ""}${opacity < 1 ? ` fill-opacity="${opacity}"` : ""}>${escapeXml(value)}</text>`;
}

export function logo(ctx: MockupContext, rect: Rect, color?: string, id?: string): string {
  const svg = color ? monochromeSvg(ctx.brand.logo.svg, color) : ctx.brand.logo.svg;
  return nestLogo(svg, rect, id);
}

/** A soft studio backdrop behind printed mockups. */
export function desk(ctx: MockupContext, width: number, height: number): string {
  const top = ctx.mode === "light" ? "#e9e7e3" : "#15161a";
  const bottom = ctx.mode === "light" ? "#d8d5cf" : "#0b0c0f";
  return `<defs><linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#desk)"/>`;
}

export function rotate(degrees: number, cx: number, cy: number, body: string): string {
  return `<g transform="rotate(${degrees} ${cx} ${cy})">${body}</g>`;
}
