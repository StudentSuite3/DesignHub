import { parseSvg } from "@/lib/svg/parse";
import { minify } from "@/lib/svg/serialize";
import { svgDimensions } from "@/lib/svg-size";

export type Rect = { x: number; y: number; width: number; height: number };

export function logoAspect(svg: string): number {
  const { width, height } = svgDimensions(svg);
  return width > 0 && height > 0 ? width / height : 1;
}

/**
 * Places a logo inside a larger drawing as a nested <svg>, so it stays vector and
 * keeps its own coordinate system. Returns "" if the logo can't be parsed.
 */
export function nestLogo(svg: string, rect: Rect, idPrefix?: string): string {
  const parsed = parseSvg(svg);
  if (!parsed.ok) return "";
  const root = structuredClone(parsed.root);
  const { width, height } = svgDimensions(svg);
  root.attributes.viewBox ??= `0 0 ${width} ${height}`;
  root.attributes.x = String(rect.x);
  root.attributes.y = String(rect.y);
  root.attributes.width = String(rect.width);
  root.attributes.height = String(rect.height);
  root.attributes.preserveAspectRatio = "xMidYMid meet";
  if (idPrefix) {
    // Several copies of one logo in a sheet must not share gradient ids.
    const markup = minify(root);
    return markup
      .replace(/\bid="([^"]+)"/g, `id="${idPrefix}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}-$1)`)
      .replace(/href="#([^"]+)"/g, `href="#${idPrefix}-$1"`);
  }
  return minify(root);
}

export type GuideOptions = {
  grid: boolean;
  clearSpace: boolean;
  safeArea: boolean;
  /** Clear space as a fraction of the logo height. */
  clearSpaceRatio: number;
  background: string | null;
};

const GUIDE = "#ff3ea5";
const SAFE = "#22d3ee";

/** The logo on a canvas with optional construction grid, clear space and safe area overlays. */
export function composeLogoWithGuides(svg: string, options: GuideOptions): string {
  const logoHeight = 240;
  const logoWidth = Math.round(logoHeight * logoAspect(svg));
  const unit = logoHeight * options.clearSpaceRatio;
  const margin = unit + 48;
  const width = logoWidth + margin * 2;
  const height = logoHeight + margin * 2;
  const box: Rect = { x: margin, y: margin, width: logoWidth, height: logoHeight };
  const parts: string[] = [];

  if (options.background) parts.push(`<rect width="${width}" height="${height}" fill="${options.background}"/>`);
  parts.push(nestLogo(svg, box));

  if (options.grid) {
    const lines: string[] = [];
    for (let i = 0; i <= 8; i += 1) {
      const x = box.x + (box.width * i) / 8;
      const y = box.y + (box.height * i) / 8;
      lines.push(
        `<line x1="${x}" y1="${box.y}" x2="${x}" y2="${box.y + box.height}"/>`,
        `<line x1="${box.x}" y1="${y}" x2="${box.x + box.width}" y2="${y}"/>`,
      );
    }
    const r = Math.min(box.width, box.height) / 2;
    lines.push(
      `<circle cx="${box.x + box.width / 2}" cy="${box.y + box.height / 2}" r="${r}"/>`,
      `<line x1="${box.x}" y1="${box.y}" x2="${box.x + box.width}" y2="${box.y + box.height}"/>`,
      `<line x1="${box.x + box.width}" y1="${box.y}" x2="${box.x}" y2="${box.y + box.height}"/>`,
    );
    parts.push(`<g fill="none" stroke="${GUIDE}" stroke-opacity=".45" stroke-width="1">${lines.join("")}</g>`);
  }

  if (options.clearSpace) {
    const outer: Rect = {
      x: box.x - unit,
      y: box.y - unit,
      width: box.width + unit * 2,
      height: box.height + unit * 2,
    };
    const markers = [
      [outer.x, box.y],
      [box.x + box.width, box.y],
      [box.x, outer.y],
      [box.x, box.y + box.height],
    ]
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="${unit}" height="${unit}" fill="${GUIDE}" fill-opacity=".12"/>`)
      .join("");
    parts.push(
      `<g stroke="${GUIDE}" stroke-width="1.5" fill="none"><rect x="${outer.x}" y="${outer.y}" width="${outer.width}" height="${outer.height}" stroke-dasharray="6 4"/><rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" stroke-opacity=".6"/></g>${markers}`,
      `<text x="${outer.x}" y="${outer.y - 10}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13" fill="${GUIDE}">Clear space: ${Math.round(options.clearSpaceRatio * 100)}% of logo height</text>`,
    );
  }

  if (options.safeArea) {
    const inset = Math.min(box.width, box.height) * 0.1;
    parts.push(
      `<rect x="${box.x + inset}" y="${box.y + inset}" width="${box.width - inset * 2}" height="${box.height - inset * 2}" fill="none" stroke="${SAFE}" stroke-width="1.5" stroke-dasharray="3 3"/>`,
      `<text x="${box.x + inset}" y="${box.y + box.height + 28}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13" fill="${SAFE}">Safe area: keep key detail inside 80%</text>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join("")}</svg>`;
}
