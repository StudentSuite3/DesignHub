/** Deterministic PRNG (mulberry32): the same seed always draws the same background. */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 999_999) + 1;
}

export function range(random: () => number, min: number, max: number): number {
  return min + (max - min) * random();
}

export function pick<T>(random: () => number, items: readonly T[]): T {
  const item = items[Math.floor(random() * items.length)];
  if (item === undefined) throw new Error("pick() needs a non-empty list");
  return item;
}

/** Rounds coordinates so exported SVG stays compact. */
export const r1 = (value: number) => Math.round(value * 10) / 10;
