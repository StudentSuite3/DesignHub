import { svgToPngBlob } from "@/lib/icons/raster";
import { svgDimensions } from "@/lib/svg-size";

export type RasterImage = { bytes: Uint8Array; width: number; height: number };

/** Rasterizes an SVG at `scale`× its intrinsic size (capped so huge canvases stay within browser limits). */
export async function rasterize(svg: string, scale = 2, maxSide = 8192): Promise<RasterImage> {
  const { width, height } = svgDimensions(svg);
  const factor = Math.min(scale, maxSide / Math.max(width, height));
  const w = Math.max(1, Math.round(width * factor));
  const h = Math.max(1, Math.round(height * factor));
  const blob = await svgToPngBlob(svg, w, h);
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width: w, height: h };
}
