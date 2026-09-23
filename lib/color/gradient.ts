import { formatColor, oklch, toHex } from "@/lib/color/color";
import { randomColor } from "@/lib/color/generate";
import { createId } from "@/lib/id";
import type { Gradient, GradientStop, Oklch } from "@/types/color";

export function createStop(color: Oklch, position: number): GradientStop {
  return { id: createId("stop"), color, position };
}

export const defaultGradient: Gradient = {
  type: "linear",
  angle: 135,
  x: 50,
  y: 50,
  interpolation: "oklch",
  stops: [
    createStop(oklch(0.62, 0.2, 277), 0),
    createStop(oklch(0.72, 0.17, 350), 50),
    createStop(oklch(0.85, 0.15, 85), 100),
  ],
};

export function sortedStops(gradient: Gradient): GradientStop[] {
  return [...gradient.stops].sort((a, b) => a.position - b.position);
}

function stopList(gradient: Gradient, useModern: boolean): string {
  return sortedStops(gradient)
    .map((stop) => `${useModern ? formatColor(stop.color, "oklch") : toHex(stop.color)} ${Math.round(stop.position)}%`)
    .join(", ");
}

function prefix(gradient: Gradient, interpolation: string): string {
  const space = interpolation ? `in ${interpolation}` : "";
  switch (gradient.type) {
    case "linear":
      return [space, `${Math.round(gradient.angle)}deg`].filter(Boolean).join(" ");
    case "radial":
      return [`circle at ${gradient.x}% ${gradient.y}%`, space].filter(Boolean).join(" ");
    case "conic":
      return [`from ${Math.round(gradient.angle)}deg at ${gradient.x}% ${gradient.y}%`, space]
        .filter(Boolean)
        .join(" ");
  }
}

/** Modern CSS with an explicit interpolation color space (CSS Color 4). */
export function gradientCss(gradient: Gradient): string {
  const interpolation = gradient.interpolation === "srgb" ? "" : gradient.interpolation;
  return `${gradient.type}-gradient(${prefix(gradient, interpolation)}, ${stopList(gradient, true)})`;
}

/** sRGB hex fallback for older browsers. */
export function gradientCssFallback(gradient: Gradient): string {
  return `${gradient.type}-gradient(${prefix(gradient, "")}, ${stopList(gradient, false)})`;
}

export function gradientFromColors(colors: Oklch[], base: Gradient): Gradient {
  const count = Math.max(colors.length, 2);
  return {
    ...base,
    stops: colors.slice(0, 6).map((color, index) => createStop(color, (index / (Math.min(count, 6) - 1)) * 100)),
  };
}

export function randomGradient(base: Gradient, random: () => number = Math.random): Gradient {
  const hue = random() * 360;
  const count = 2 + Math.floor(random() * 2);
  const colors = Array.from({ length: count }, (_, index) => randomColor(random, hue + index * (40 + random() * 60)));
  return { ...gradientFromColors(colors, base), angle: Math.round(random() * 36) * 10 };
}

/** Color at a position (0–100) by interpolating neighbouring stops in OKLCH. */
export function colorAt(gradient: Gradient, position: number): Oklch {
  const stops = sortedStops(gradient);
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) return oklch(0.5, 0, 0);
  if (position <= first.position) return first.color;
  if (position >= last.position) return last.color;
  const index = stops.findIndex((stop) => stop.position >= position);
  const right = stops[index] ?? last;
  const left = stops[index - 1] ?? first;
  const t = (position - left.position) / Math.max(right.position - left.position, 0.0001);
  let hueDelta = right.color.h - left.color.h;
  if (hueDelta > 180) hueDelta -= 360;
  if (hueDelta < -180) hueDelta += 360;
  return oklch(
    left.color.l + (right.color.l - left.color.l) * t,
    left.color.c + (right.color.c - left.color.c) * t,
    left.color.h + hueDelta * t,
    left.color.alpha + (right.color.alpha - left.color.alpha) * t,
  );
}
