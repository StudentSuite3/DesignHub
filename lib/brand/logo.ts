import { createRandom } from "@/lib/background/random";

/** Stable 32-bit hash so a brand name always produces the same mark. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * A simple geometric mark derived from the brand name. It never depends on fonts,
 * so it renders identically in the app, in PNG exports and in PDFs.
 */
export function generateLogoMark(name: string, primary: string, secondary: string): string {
  const random = createRandom(hashString(name.trim().toLowerCase() || "brand"));
  const variant = Math.floor(random() * 4);
  const shapes = [
    // Rounded square with an inset circle.
    `<rect width="96" height="96" rx="26" fill="${primary}"/><circle cx="60" cy="36" r="14" fill="${secondary}"/>`,
    // Two overlapping circles.
    `<circle cx="38" cy="48" r="30" fill="${primary}"/><circle cx="60" cy="48" r="30" fill="${secondary}" fill-opacity="0.85"/>`,
    // Split diamond.
    `<path d="M48 4 92 48 48 92 4 48Z" fill="${primary}"/><path d="M48 4 92 48H4Z" fill="${secondary}"/>`,
    // Arc over a bar.
    `<path d="M12 58a36 36 0 0 1 72 0Z" fill="${primary}"/><rect x="12" y="66" width="72" height="18" rx="9" fill="${secondary}"/>`,
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">${shapes[variant]}</svg>`;
}
