import { contrastRatio, parseColor } from "@/lib/color/color";
import { simulateVision, type VisionType } from "@/lib/color/vision";
import type { A11yColors, VisionMode } from "@/types/a11y";

export const visionModes: { value: VisionMode; label: string; description: string }[] = [
  { value: "none", label: "Typical vision", description: "No simulation." },
  { value: "protanopia", label: "Protanopia", description: "No red cones. ~1% of men." },
  { value: "deuteranopia", label: "Deuteranopia", description: "No green cones. ~1% of men; the most common." },
  { value: "tritanopia", label: "Tritanopia", description: "No blue cones. Very rare." },
  { value: "grayscale", label: "Grayscale", description: "Achromatopsia, or a grayscale display." },
  {
    value: "low-vision",
    label: "Low vision",
    description: "Blur and reduced contrast, e.g. cataracts or a dim screen.",
  },
];

const simulationType: Partial<Record<VisionMode, VisionType>> = {
  protanopia: "protanopia",
  deuteranopia: "deuteranopia",
  tritanopia: "tritanopia",
  grayscale: "achromatopsia",
};

/** Contrast as a person with each deficiency would perceive it. Catches pairs that only differ in hue. */
export function visionSection(colors: A11yColors) {
  const pairs: [string, string, string][] = [
    ["Body text", colors.text, colors.background],
    ["Links", colors.accent, colors.background],
    ["Button label", colors.onAccent, colors.accent],
  ];
  return Object.entries(simulationType).map(([mode, type]) => ({
    mode,
    pairs: pairs.map(([label, fg, bg]) => {
      const foreground = parseColor(fg);
      const background = parseColor(bg);
      const ratio =
        foreground && background && type
          ? contrastRatio(simulateVision(foreground, type), simulateVision(background, type))
          : 0;
      return { check: label, ratio: Math.floor(ratio * 100) / 100, passAA: ratio >= 4.5 };
    }),
  }));
}
