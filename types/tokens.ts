import type { ColorFormat, Gradient, Oklch } from "@/types/color";
import type { FontFamily, TextRhythm, TypeScaleStep } from "@/types/typography";

export type ColorToken = {
  name: string;
  value: Oklch;
  shades: { step: number; value: Oklch }[];
};

export type DesignTokens = {
  meta: { name: string; prefix: string; generatedAt: string; colorFormat: ColorFormat };
  colors: ColorToken[];
  /** Semantic aliases mapped onto palette entries (e.g. primary → indigo). */
  semantic: { name: string; ref: string; value: Oklch }[];
  gradient: Gradient | null;
  typography: {
    heading: FontFamily;
    body: FontFamily;
    steps: TypeScaleStep[];
    rhythm: TextRhythm;
  } | null;
  /** Shadow / blur tokens from the Effects Lab. */
  effects: { name: string; value: string }[];
  spacing: { name: string; px: number }[];
  radius: { name: string; px: number }[];
};

export type TokenSections = {
  colors: boolean;
  shades: boolean;
  gradient: boolean;
  typography: boolean;
  spacing: boolean;
  radius: boolean;
  effects: boolean;
};

export type TokenSettings = {
  name: string;
  prefix: string;
  colorFormat: ColorFormat;
  spacingBase: number;
  radiusBase: number;
  sections: TokenSections;
};
