import { visionMatrices } from "@/lib/color/vision";
import type { VisionMode } from "@/types/a11y";

/** feColorMatrix wants 4×5: each RGB row gets a zero alpha term and zero offset. */
function toFilterMatrix(m: readonly number[]): string {
  const rows = [0, 1, 2].map((row) => `${m[row * 3]} ${m[row * 3 + 1]} ${m[row * 3 + 2]} 0 0`);
  return [...rows, "0 0 0 1 0"].join(" ");
}

const grayscale = "0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0";

/**
 * SVG filters referenced from CSS (`filter: url(#dh-protanopia)`). They run in linearRGB,
 * matching how the Machado 2009 matrices are defined.
 */
export function VisionFilters() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      {(Object.keys(visionMatrices) as (keyof typeof visionMatrices)[]).map((type) => (
        <filter key={type} id={`dh-${type}`} colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={toFilterMatrix(visionMatrices[type])} />
        </filter>
      ))}
      <filter id="dh-grayscale" colorInterpolationFilters="linearRGB">
        <feColorMatrix type="matrix" values={grayscale} />
      </filter>
    </svg>
  );
}

export function visionFilter(mode: VisionMode): string | undefined {
  if (mode === "none") return undefined;
  if (mode === "low-vision") return "blur(1.6px) contrast(0.7) brightness(1.08)";
  return `url(#dh-${mode})`;
}
