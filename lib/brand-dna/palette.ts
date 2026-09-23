import { colorDistance, fromHex, toHex } from "@/lib/color/color";
import type { Oklch } from "@/types/color";

export type WeightedColor = { color: Oklch; weight: number };

/**
 * Dominant colors by bucketing pixels (5 bits per channel), then keeping the most
 * common buckets that are perceptually distinct. Fast enough to run on every upload.
 */
export function extractPalette(pixels: Uint8ClampedArray, count = 5): WeightedColor[] {
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3] ?? 0;
    if (alpha < 128) continue;
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
    } else buckets.set(key, { r, g, b, n: 1 });
    total += 1;
  }
  if (total === 0) return [];

  const ranked = [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, 256)
    .map((bucket) => {
      const hex = `#${[bucket.r, bucket.g, bucket.b]
        .map((sum) =>
          Math.round(sum / bucket.n)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")}`;
      return { color: fromHex(hex), weight: bucket.n / total };
    });

  const picked: WeightedColor[] = [];
  for (const candidate of ranked) {
    const near = picked.find((item) => colorDistance(item.color, candidate.color) < 0.12);
    if (near) near.weight += candidate.weight;
    else if (picked.length < count) picked.push({ ...candidate });
  }
  // A logo on white is mostly white; make sure the colorful part is represented.
  const vivid = ranked.find(
    (item) => item.color.c > 0.08 && !picked.some((p) => colorDistance(p.color, item.color) < 0.12),
  );
  if (vivid && !picked.some((item) => item.color.c > 0.08)) picked[picked.length - 1] = vivid;
  return picked.sort((a, b) => b.weight - a.weight);
}

export const hexOf = (color: Oklch) => toHex({ ...color, alpha: 1 });
