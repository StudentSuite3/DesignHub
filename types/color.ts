/** OKLCH is DesignHub's source of truth: perceptually uniform and wide-gamut ready. */
export type Oklch = {
  /** Lightness, 0–1. */
  l: number;
  /** Chroma, 0–~0.37. */
  c: number;
  /** Hue in degrees, 0–360. */
  h: number;
  /** Alpha, 0–1. */
  alpha: number;
};

export type Swatch = {
  id: string;
  color: Oklch;
  locked: boolean;
};

export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

export type HarmonyMode =
  "random" | "analogous" | "complementary" | "split-complementary" | "triadic" | "tetradic" | "monochromatic";

export type GradientType = "linear" | "radial" | "conic";

export type GradientStop = {
  id: string;
  color: Oklch;
  /** Position 0–100 (%). */
  position: number;
};

export type Gradient = {
  type: GradientType;
  angle: number;
  /** Center for radial and conic gradients, in % of the box. */
  x: number;
  y: number;
  interpolation: "oklch" | "oklab" | "srgb";
  stops: GradientStop[];
};

export type Shade = {
  step: number;
  color: Oklch;
};
