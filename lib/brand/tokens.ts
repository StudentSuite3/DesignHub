import { toHex } from "@/lib/color/color";
import { paletteNames } from "@/lib/color/names";
import { gradientCss } from "@/lib/color/gradient";
import { shadowValue } from "@/lib/effects/shadow";
import { generateLogoMark } from "@/lib/brand/logo";
import { generateScale } from "@/lib/typography/scale";
import type { BrandColor, BrandProfile, BrandTokens, ColorRole } from "@/types/brand";
import type { Gradient, Swatch } from "@/types/color";
import type { ShadowLayer } from "@/types/effects";
import type { FontFamily, TextRhythm, TypeScaleSettings } from "@/types/typography";

export type BrandSources = {
  profile: BrandProfile;
  swatches: Swatch[];
  gradient: Gradient;
  headingFont: string;
  bodyFont: string;
  catalog: FontFamily[];
  rhythm: TextRhythm;
  scale: TypeScaleSettings;
  radiusBase: number;
  spacingBase: number;
  shadowLayers: ShadowLayer[];
};

/** Roles the user hasn't set are inferred: the most colorful swatch leads, grays become neutrals. */
export function inferRoles(swatches: Swatch[], explicit: Record<string, ColorRole>): Record<string, ColorRole> {
  const roles: Record<string, ColorRole> = {};
  const chromatic = [...swatches].filter((swatch) => swatch.color.c >= 0.04).sort((a, b) => b.color.c - a.color.c);
  swatches.forEach((swatch) => {
    roles[swatch.id] = explicit[swatch.id] ?? (swatch.color.c < 0.04 ? "neutral" : "secondary");
  });
  const hasPrimary = swatches.some((swatch) => roles[swatch.id] === "primary");
  const leader = chromatic.find((swatch) => !explicit[swatch.id]) ?? chromatic[0] ?? swatches[0];
  if (!hasPrimary && leader) roles[leader.id] = "primary";
  return roles;
}

export function buildBrandTokens(sources: BrandSources): BrandTokens {
  const { profile, swatches, catalog } = sources;
  const roles = inferRoles(swatches, profile.roles);
  const names = paletteNames(swatches.map((swatch) => swatch.color));
  const all: BrandColor[] = swatches.map((swatch, index) => ({
    id: swatch.id,
    name: names[index] ?? `color-${index + 1}`,
    hex: toHex({ ...swatch.color, alpha: 1 }),
    role: roles[swatch.id] ?? "secondary",
  }));
  const byRole = (role: ColorRole) => all.filter((color) => color.role === role).map((color) => color.hex);
  const primary = byRole("primary");
  const secondary = byRole("secondary");
  const heading = catalog.find((font) => font.family === sources.headingFont);
  const body = catalog.find((font) => font.family === sources.bodyFont);

  return {
    name: profile.name.trim() || "Untitled brand",
    description: profile.description,
    logo: profile.logoSvg
      ? { svg: profile.logoSvg, generated: false }
      : {
          svg: generateLogoMark(profile.name, primary[0] ?? "#6366f1", secondary[0] ?? primary[0] ?? "#f472b6"),
          generated: true,
        },
    colors: { all, primary, secondary, neutrals: byRole("neutral") },
    typography: {
      heading: sources.headingFont,
      headingCategory: heading?.category ?? "sans-serif",
      body: sources.bodyFont,
      bodyCategory: body?.category ?? "sans-serif",
      headingWeight: sources.rhythm.headingWeight,
      bodyWeight: sources.rhythm.bodyWeight,
      headingLineHeight: sources.rhythm.headingLineHeight,
      bodyLineHeight: sources.rhythm.bodyLineHeight,
      scale: generateScale(sources.scale),
    },
    radius: sources.radiusBase,
    spacing: sources.spacingBase,
    shadow: shadowValue(sources.shadowLayers),
    shadowLayers: sources.shadowLayers,
    gradient: gradientCss(sources.gradient),
  };
}
