import type { IconifyIcon } from "@iconify/types";

/** Fully qualified Iconify name, e.g. "lucide:house". */
export type IconId = `${string}:${string}`;

export type IconData = Required<Pick<IconifyIcon, "body" | "width" | "height">> & Pick<IconifyIcon, "left" | "top">;

export type IconCollection = {
  prefix: string;
  name: string;
  total: number;
  author?: { name: string; url?: string };
  license?: { title: string; spdx?: string; url?: string };
  samples?: string[];
  category?: string;
  palette?: boolean;
  height?: number | number[];
};

export type IconCorners = "default" | "rounded" | "sharp";

export type IconBackground = {
  shape: "none" | "circle" | "rounded" | "square";
  color: string;
};

export type IconStyle = {
  size: number;
  color: string;
  /** null keeps the icon's original stroke width. */
  strokeWidth: number | null;
  corners: IconCorners;
  rotate: number;
  flipH: boolean;
  flipV: boolean;
  /** Padding around the glyph, as % of the canvas. */
  padding: number;
  background: IconBackground;
};
