export type FontCategory = "sans-serif" | "serif" | "display" | "handwriting" | "monospace";

export type FontAxis = {
  tag: string;
  min: number;
  max: number;
  default: number;
};

export type FontFamily = {
  family: string;
  category: FontCategory;
  /** Available static weights (100–900). */
  weights: number[];
  italic: boolean;
  /** Present for variable fonts. `wght` is always listed first when available. */
  axes?: FontAxis[];
  /** Rough popularity rank, lower is more popular. */
  rank: number;
};

export type OpenTypeFeatureTag =
  | "liga"
  | "dlig"
  | "kern"
  | "smcp"
  | "c2sc"
  | "lnum"
  | "onum"
  | "tnum"
  | "pnum"
  | "zero"
  | "frac"
  | "ss01"
  | "ss02"
  | "case";

export type OpenTypeSettings = Record<OpenTypeFeatureTag, boolean>;

export type TypeScaleSettings = {
  baseSize: number;
  ratio: number;
  /** Scale ratio used at the smallest viewport (fluid scale). */
  minRatio: number;
  minBase: number;
  minViewport: number;
  maxViewport: number;
  stepsUp: number;
  stepsDown: number;
};

export type TypeScaleStep = {
  name: string;
  step: number;
  minPx: number;
  maxPx: number;
  clamp: string;
};

export type SpecimenSettings = {
  text: string;
  size: number;
  weight: number;
  italic: boolean;
  letterSpacing: number;
  lineHeight: number;
  axes: Record<string, number>;
};

/** Global rhythm settings applied to headings and body text in previews and exports. */
export type TextRhythm = {
  headingWeight: number;
  bodyWeight: number;
  headingLineHeight: number;
  bodyLineHeight: number;
  headingTracking: number;
  bodyTracking: number;
};
