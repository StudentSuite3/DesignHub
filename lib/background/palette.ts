import { oklch, parseColor, toHex } from "@/lib/color/color";

/** `count` colors evenly interpolated (in OKLCH) through the given stops. */
export function colorRamp(stops: string[], count: number): string[] {
  const parsed = stops.map((stop) => parseColor(stop)).filter((color) => color !== null);
  if (parsed.length === 0) return Array.from({ length: count }, () => "#888888");
  if (parsed.length === 1 || count === 1) return Array.from({ length: count }, () => toHex(parsed[0]!));

  return Array.from({ length: count }, (_, index) => {
    const t = (index / (count - 1)) * (parsed.length - 1);
    const i = Math.min(Math.floor(t), parsed.length - 2);
    const a = parsed[i]!;
    const b = parsed[i + 1]!;
    const local = t - i;
    let hue = b.h - a.h;
    if (hue > 180) hue -= 360;
    if (hue < -180) hue += 360;
    return toHex(oklch(a.l + (b.l - a.l) * local, a.c + (b.c - a.c) * local, a.h + hue * local));
  });
}
