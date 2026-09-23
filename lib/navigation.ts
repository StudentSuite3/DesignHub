import {
  Accessibility,
  BadgeCheck,
  Braces,
  Palette,
  PenTool,
  Shapes,
  Sparkles,
  Type,
  Wallpaper,
  type LucideIcon,
} from "lucide-react";

export type StudioId =
  "brand" | "typography" | "colors" | "icons" | "backgrounds" | "effects" | "svg" | "accessibility" | "export";

export type StudioGroup = "Brand" | "Design" | "Tools";

export const studioGroups: readonly StudioGroup[] = ["Brand", "Design", "Tools"];

export type StudioNavItem = {
  id: StudioId;
  title: string;
  href: `/${string}`;
  description: string;
  icon: LucideIcon;
  /** Single-key shortcut used after pressing `g` (e.g. `g t`). */
  shortcut: string;
  group: StudioGroup;
};

export const studios: readonly StudioNavItem[] = [
  {
    id: "brand",
    title: "Brand Studio",
    href: "/brand",
    description: "The hub of your identity: name, logo, colors, type, radius, spacing and shadows, synced everywhere.",
    icon: BadgeCheck,
    shortcut: "r",
    group: "Brand",
  },
  {
    id: "typography",
    title: "Typography Studio",
    href: "/typography",
    description: "Browse Google Fonts, pair typefaces and generate fluid type scales.",
    icon: Type,
    shortcut: "t",
    group: "Design",
  },
  {
    id: "colors",
    title: "Color Studio",
    href: "/colors",
    description: "Generate palettes, shades and gradients. Check contrast in OKLCH.",
    icon: Palette,
    shortcut: "c",
    group: "Design",
  },
  {
    id: "icons",
    title: "Icon Studio",
    href: "/icons",
    description: "Search 200,000+ open source icons. Restyle and export to SVG, React, PNG or ICO.",
    icon: Shapes,
    shortcut: "i",
    group: "Design",
  },
  {
    id: "backgrounds",
    title: "Background Studio",
    href: "/backgrounds",
    description: "Procedural waves, blobs, mesh gradients, aurora, noise and patterns. Export SVG, PNG or CSS.",
    icon: Wallpaper,
    shortcut: "b",
    group: "Design",
  },
  {
    id: "effects",
    title: "Effects Lab",
    href: "/effects",
    description: "Glass, neumorphism, layered shadows, glows, gradient borders and grain — as CSS and Tailwind.",
    icon: Sparkles,
    shortcut: "f",
    group: "Design",
  },
  {
    id: "svg",
    title: "SVG Playground",
    href: "/svg",
    description: "Inspect, edit and optimize SVG. Convert to JSX, React, React Native or a sprite sheet.",
    icon: PenTool,
    shortcut: "s",
    group: "Tools",
  },
  {
    id: "accessibility",
    title: "Accessibility Lab",
    href: "/accessibility",
    description: "WCAG contrast, color vision simulation, readability, dyslexia preview and touch-target checks.",
    icon: Accessibility,
    shortcut: "a",
    group: "Tools",
  },
  {
    id: "export",
    title: "Export Engine",
    href: "/export",
    description: "Turn your choices into design tokens for CSS, SCSS, Tailwind, React and JSON.",
    icon: Braces,
    shortcut: "e",
    group: "Tools",
  },
] as const;

export function getStudio(id: StudioId): StudioNavItem {
  const studio = studios.find((item) => item.id === id);
  if (!studio) throw new Error(`Unknown studio: ${id}`);
  return studio;
}

/** Exact match or a child route, so "/brand" doesn't also light up "/brand-dna". */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
