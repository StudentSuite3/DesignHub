import { Braces, Palette, Shapes, Sparkles, Type, Wallpaper, type LucideIcon } from "lucide-react";

export type StudioId = "typography" | "colors" | "icons" | "backgrounds" | "effects" | "export";

export type StudioNavItem = {
  id: StudioId;
  title: string;
  href: `/${string}`;
  description: string;
  icon: LucideIcon;
  /** Single-key shortcut used after pressing `g` (e.g. `g t`). */
  shortcut: string;
};

export const studios: readonly StudioNavItem[] = [
  {
    id: "typography",
    title: "Typography Studio",
    href: "/typography",
    description: "Browse Google Fonts, pair typefaces and generate fluid type scales.",
    icon: Type,
    shortcut: "t",
  },
  {
    id: "colors",
    title: "Color Studio",
    href: "/colors",
    description: "Generate palettes, shades and gradients. Check contrast in OKLCH.",
    icon: Palette,
    shortcut: "c",
  },
  {
    id: "icons",
    title: "Icon Studio",
    href: "/icons",
    description: "Search 200,000+ open source icons. Restyle and export to SVG, React, PNG or ICO.",
    icon: Shapes,
    shortcut: "i",
  },
  {
    id: "backgrounds",
    title: "Background Studio",
    href: "/backgrounds",
    description: "Procedural waves, blobs, mesh gradients, aurora, noise and patterns. Export SVG, PNG or CSS.",
    icon: Wallpaper,
    shortcut: "b",
  },
  {
    id: "effects",
    title: "Effects Lab",
    href: "/effects",
    description: "Glass, neumorphism, layered shadows, glows, gradient borders and grain — as CSS and Tailwind.",
    icon: Sparkles,
    shortcut: "f",
  },
  {
    id: "export",
    title: "Export Engine",
    href: "/export",
    description: "Turn your choices into design tokens for CSS, SCSS, Tailwind, React and JSON.",
    icon: Braces,
    shortcut: "e",
  },
] as const;

export function getStudio(id: StudioId): StudioNavItem {
  const studio = studios.find((item) => item.id === id);
  if (!studio) throw new Error(`Unknown studio: ${id}`);
  return studio;
}
