import { r1 } from "@/lib/background/random";

export type Point = [number, number];

/**
 * Catmull-Rom spline through the points, emitted as cubic Béziers.
 * `tension` 0 = straight lines, 1 = very round.
 */
export function smoothPath(points: Point[], closed = false, tension = 1): string {
  if (points.length < 2) return "";
  const at = (index: number): Point => {
    if (closed) return points[(index + points.length) % points.length]!;
    return points[Math.max(0, Math.min(points.length - 1, index))]!;
  };
  const [x0, y0] = at(0);
  let d = `M${r1(x0)} ${r1(y0)}`;
  const segments = closed ? points.length : points.length - 1;
  for (let i = 0; i < segments; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Point = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: Point = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}
