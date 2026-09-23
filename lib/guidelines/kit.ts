import { mockupDoc, text, wrap } from "@/lib/mockups/kit";
import { PAGE_HEIGHT, PAGE_WIDTH, type GuidelineContext } from "@/lib/guidelines/types";

export const MARGIN = 100;
export const CONTENT_TOP = 250;
export const CONTENT_BOTTOM = PAGE_HEIGHT - 110;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/** A standard guideline page: section label, title, optional lead paragraph, body and footer. */
export function guidelinePage(
  ctx: GuidelineContext,
  number: number,
  options: { section: string; title: string; lead?: string },
  body: string,
  defs = "",
): string {
  const { surface, brand } = ctx;
  const lead = options.lead
    ? paragraph(ctx, options.lead, MARGIN, 196, CONTENT_WIDTH * 0.6, 20, surface.muted, 2)
    : "";
  const markup = `<rect width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}" fill="${surface.background}"/>
    <rect x="${MARGIN}" y="64" width="28" height="4" rx="2" fill="${surface.primary}"/>
    ${text(MARGIN + 40, 71, options.section.toUpperCase(), { size: 14, fill: surface.primary, font: "bb", spacing: 3 })}
    ${text(PAGE_WIDTH - MARGIN, 71, String(number).padStart(2, "0"), { size: 14, fill: surface.muted, font: "bb", anchor: "end", spacing: 2 })}
    ${text(MARGIN, 150, options.title, { size: 52, fill: surface.text, font: "h" })}
    ${lead}
    ${body}
    <rect x="${MARGIN}" y="${PAGE_HEIGHT - 72}" width="${CONTENT_WIDTH}" height="1" fill="${surface.border}"/>
    ${text(MARGIN, PAGE_HEIGHT - 40, `${brand.name} brand guidelines`, { size: 14, fill: surface.muted })}
    ${text(PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 40, options.section, { size: 14, fill: surface.muted, anchor: "end" })}`;
  return mockupDoc(ctx, PAGE_WIDTH, PAGE_HEIGHT, markup, defs);
}

/** Wrapped body text. */
export function paragraph(
  ctx: GuidelineContext,
  value: string,
  x: number,
  y: number,
  width: number,
  size: number,
  fill: string,
  maxLines = 6,
): string {
  return wrap(ctx, value, width, size, "b", maxLines)
    .map((line, i) => text(x, y + i * size * 1.5, line, { size, fill }))
    .join("");
}

/** Small uppercase caption. */
export function caption(ctx: GuidelineContext, x: number, y: number, value: string, anchor: "start" | "middle" = "start") {
  return text(x, y, value.toUpperCase(), { size: 13, fill: ctx.surface.muted, font: "bb", spacing: 2, anchor });
}

/** Rounded panel in the surface color. */
export function card(ctx: GuidelineContext, x: number, y: number, width: number, height: number, fill?: string) {
  const r = Math.min(ctx.brand.radius, 16);
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${r}" fill="${fill ?? ctx.surface.surface}" stroke="${ctx.surface.border}"/>`;
}

export function checkIcon(x: number, y: number, color: string, ok: boolean): string {
  const mark = ok
    ? `<path d="M${x - 6} ${y} l4 4 8 -9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M${x - 5} ${y - 5} l10 10 M${x + 5} ${y - 5} l-10 10" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`;
  return `<circle cx="${x}" cy="${y}" r="13" fill="${color}"/>${mark}`;
}

export const GOOD = "#16a34a";
export const BAD = "#dc2626";
