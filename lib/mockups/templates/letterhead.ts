import { desk, lines, logo, mockupDoc, text } from "@/lib/mockups/kit";
import type { MockupTemplate } from "@/lib/mockups/types";

const PW = 1000;
const PH = 1414;

export const letterhead: MockupTemplate = {
  id: "letterhead",
  label: "Letterhead",
  category: "Print",
  description: "A4 letter with header, signature and footer.",
  render(ctx) {
    const { surface, content, brand } = ctx;
    const pad = 88;
    const date = "September 23, 2026";
    const page = `<rect width="${PW}" height="${PH}" fill="${surface.background}" filter="url(#soft)"/>
      <rect width="${PW}" height="10" fill="${surface.primary}"/>
      ${logo(ctx, { x: pad, y: 78, width: 64, height: 64 }, undefined, "lh")}
      ${text(pad + 84, 122, brand.name, { size: 30, fill: surface.text, font: "h" })}
      ${text(PW - pad, 100, content.website, { size: 15, fill: surface.primaryText, font: "bb", anchor: "end" })}
      ${text(PW - pad, 124, content.email, { size: 15, fill: surface.muted, anchor: "end" })}
      ${text(PW - pad, 148, content.phone, { size: 15, fill: surface.muted, anchor: "end" })}
      <rect x="${pad}" y="196" width="${PW - pad * 2}" height="1.5" fill="${surface.border}"/>
      ${text(pad, 280, date, { size: 17, fill: surface.muted })}
      ${text(pad, 350, "Dear Alex,", { size: 19, fill: surface.text })}
      ${lines(pad, 396, PW - pad * 2, 6, 34, surface.border)}
      ${lines(pad, 632, PW - pad * 2, 5, 34, surface.border)}
      ${lines(pad, 834, PW - pad * 2, 4, 34, surface.border)}
      ${text(pad, 1030, "Kind regards,", { size: 19, fill: surface.text })}
      ${text(pad, 1100, content.person, { size: 22, fill: surface.text, font: "bb" })}
      ${text(pad, 1130, `${content.role}, ${brand.name}`, { size: 16, fill: surface.muted })}
      <rect y="${PH - 96}" width="${PW}" height="96" fill="${surface.surface}"/>
      ${text(pad, PH - 42, content.address, { size: 15, fill: surface.muted })}
      ${text(PW - pad, PH - 42, content.website, { size: 15, fill: surface.primaryText, font: "bb", anchor: "end" })}`;

    const width = 1400;
    const height = 1800;
    return mockupDoc(
      ctx,
      width,
      height,
      `${desk(ctx, width, height)}<g transform="translate(${(width - PW) / 2} ${(height - PH) / 2})">${page}</g>`,
    );
  },
};
