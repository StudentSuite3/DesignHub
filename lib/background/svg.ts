import type { BackgroundSettings } from "@/types/background";

/** Smallest scale that keeps a rotated drawing covering the whole canvas. */
function coverScale(width: number, height: number, degrees: number): number {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  return Math.max((width * cos + height * sin) / width, (width * sin + height * cos) / height);
}

/** Wraps generator output in a standalone, rotation-aware SVG document. */
export function wrapSvg(settings: BackgroundSettings, body: string, defs = ""): string {
  const { width, height, rotation, background } = settings;
  const cx = width / 2;
  const cy = height / 2;
  const grow = rotation % 360 === 0 ? 1 : coverScale(width, height, rotation);
  const transform =
    grow === 1 && rotation % 360 === 0
      ? ""
      : ` transform="rotate(${rotation} ${cx} ${cy}) translate(${cx} ${cy}) scale(${Math.round(grow * 1000) / 1000}) translate(${-cx} ${-cy})"`;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">`,
    defs ? `<defs>${defs}</defs>` : "",
    `<rect width="100%" height="100%" fill="${background}"/>`,
    `<g${transform}>${body}</g>`,
    "</svg>",
  ].join("");
}
