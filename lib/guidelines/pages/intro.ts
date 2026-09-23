import { logo, mockupDoc, onPrimaryLarge, text } from "@/lib/mockups/kit";
import {
  BAD,
  card,
  caption,
  checkIcon,
  CONTENT_TOP,
  CONTENT_WIDTH,
  GOOD,
  guidelinePage,
  MARGIN,
  paragraph,
} from "@/lib/guidelines/kit";
import { PAGE_HEIGHT, PAGE_WIDTH, type GuidelinePage } from "@/lib/guidelines/types";

export const coverPage: GuidelinePage = {
  id: "cover",
  title: "Cover",
  description: "Logo, name and edition.",
  render(ctx) {
    const { surface, brand } = ctx;
    const on = onPrimaryLarge(ctx);
    const W = PAGE_WIDTH;
    const H = PAGE_HEIGHT;
    const body = `<defs><linearGradient id="cover" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${surface.primary}"/><stop offset="1" stop-color="${surface.secondary}"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#cover)"/>
      <circle cx="${W}" cy="0" r="620" fill="none" stroke="${on}" stroke-opacity=".12" stroke-width="28"/>
      <circle cx="${W}" cy="0" r="420" fill="none" stroke="${on}" stroke-opacity=".12" stroke-width="28"/>
      ${logo(ctx, { x: 120, y: 120, width: 120, height: 120 }, on, "cover")}
      ${text(120, 640, brand.name, { size: 150, fill: on, font: "h" })}
      ${text(126, 720, "Brand guidelines", { size: 44, fill: on, opacity: 0.9 })}
      <rect x="120" y="${H - 150}" width="${W - 240}" height="1.5" fill="${on}" fill-opacity=".4"/>
      ${text(120, H - 100, ctx.date ? `Version 1.0  ·  ${ctx.date}` : "Version 1.0", { size: 20, fill: on, opacity: 0.85 })}
      ${text(W - 120, H - 100, brand.description, { size: 20, fill: on, anchor: "end", opacity: 0.85 })}`;
    return mockupDoc(ctx, W, H, body);
  },
};

export const introductionPage: GuidelinePage = {
  id: "introduction",
  title: "Introduction",
  description: "Who the brand is, its personality and what this book covers.",
  render(ctx, number) {
    const { surface, brand, voice } = ctx;
    const left = MARGIN;
    const colW = CONTENT_WIDTH * 0.52;
    const personality = voice.personality.slice(0, 4);
    const chipY = CONTENT_TOP + 300;
    let chipX = left;
    const chips = personality
      .map((word) => {
        const w = ctx.measure(word, brand.typography.heading, brand.typography.headingWeight, 30) + 56;
        const out = `<rect x="${chipX}" y="${chipY}" width="${w}" height="64" rx="32" fill="${surface.primary}" fill-opacity=".12"/>
          ${text(chipX + w / 2, chipY + 42, word, { size: 30, fill: surface.text, font: "h", anchor: "middle" })}`;
        chipX += w + 16;
        return out;
      })
      .join("");

    const tocX = left + colW + 80;
    const tocW = PAGE_WIDTH - MARGIN - tocX;
    const entries = ctx.contents.filter((entry) => entry.id !== "cover");
    const rowH = Math.min(44, 560 / Math.max(1, entries.length));
    const toc = entries
      .map((entry, i) => {
        const y = CONTENT_TOP + 70 + i * rowH;
        return `${text(tocX + 32, y, String(entry.number).padStart(2, "0"), { size: 16, fill: surface.primary, font: "bb" })}
          ${text(tocX + 80, y, entry.title, { size: 18, fill: entry.id === "introduction" ? surface.muted : surface.text })}`;
      })
      .join("");

    const body = `${caption(ctx, left, CONTENT_TOP, `About ${brand.name}`)}
      ${text(left, CONTENT_TOP + 70, brand.description, { size: 34, fill: surface.text, font: "h" })}
      ${paragraph(ctx, voice.sample, left, CONTENT_TOP + 140, colW, 22, surface.muted, 4)}
      ${caption(ctx, left, chipY - 30, "Personality")}
      ${chips}
      ${paragraph(
        ctx,
        `This book explains how to use the ${brand.name} identity consistently: the logo, colors, type, components and voice. Every value comes from one shared token set.`,
        left,
        chipY + 130,
        colW,
        18,
        surface.muted,
        3,
      )}
      ${card(ctx, tocX, CONTENT_TOP - 10, tocW, 640)}
      ${caption(ctx, tocX + 32, CONTENT_TOP + 28, "Contents")}
      ${toc}`;
    return guidelinePage(ctx, number, { section: "Introduction", title: `Welcome to ${brand.name}` }, body);
  },
};

export const voicePage: GuidelinePage = {
  id: "voice",
  title: "Voice & Tone",
  description: "Personality, do and don't, and a sample of the voice.",
  render(ctx, number) {
    const { surface, voice, brand } = ctx;
    const pillars = voice.personality.slice(0, 3);
    const pw = (CONTENT_WIDTH - 48) / 3;
    const pillarCards = pillars
      .map((word, i) => {
        const x = MARGIN + i * (pw + 24);
        return `${card(ctx, x, CONTENT_TOP, pw, 150)}
          ${text(x + 32, CONTENT_TOP + 50, String(i + 1).padStart(2, "0"), { size: 16, fill: surface.primary, font: "bb" })}
          ${text(x + 32, CONTENT_TOP + 108, word, { size: 40, fill: surface.text, font: "h" })}`;
      })
      .join("");

    const listY = CONTENT_TOP + 210;
    const colW = (CONTENT_WIDTH - 24) / 2;
    const list = (items: string[], x: number, ok: boolean) =>
      items
        .slice(0, 4)
        .map(
          (item, i) =>
            `${checkIcon(x + 34, listY + 76 + i * 50, ok ? GOOD : BAD, ok)}${text(x + 62, listY + 83 + i * 50, item, { size: 20, fill: surface.text })}`,
        )
        .join("");
    const lists = `${card(ctx, MARGIN, listY, colW, 290)}
      ${caption(ctx, MARGIN + 32, listY + 40, "Do")}
      ${list(voice.dos, MARGIN, true)}
      ${card(ctx, MARGIN + colW + 24, listY, colW, 290)}
      ${caption(ctx, MARGIN + colW + 56, listY + 40, "Don't")}
      ${list(voice.donts, MARGIN + colW + 24, false)}`;

    const sampleY = listY + 320;
    const sample = `<rect x="${MARGIN}" y="${sampleY}" width="6" height="96" rx="3" fill="${surface.primary}"/>
      ${caption(ctx, MARGIN + 30, sampleY + 18, "Sounds like")}
      ${paragraph(ctx, `"${voice.sample}"`, MARGIN + 30, sampleY + 60, CONTENT_WIDTH - 60, 24, surface.text, 2)}`;

    return guidelinePage(
      ctx,
      number,
      {
        section: "Voice & Tone",
        title: `How ${brand.name} sounds`,
      },
      `${pillarCards}${lists}${sample}`,
    );
  },
};

