import { svgToPngBlob } from "@/lib/icons/raster";
import { svgDimensions } from "@/lib/svg-size";

export type RasterImage = { bytes: Uint8Array; width: number; height: number; format?: "png" | "jpeg" };

/**
 * Rasterizes an SVG at `scale`× its intrinsic size (capped so huge canvases stay within browser limits).
 * JPEG keeps multi-page documents small; PNG is lossless and keeps transparency.
 */
export async function rasterize(
  svg: string,
  scale = 2,
  maxSide = 8192,
  format: "png" | "jpeg" = "png",
): Promise<RasterImage> {
  const { width, height } = svgDimensions(svg);
  const factor = Math.min(scale, maxSide / Math.max(width, height));
  const w = Math.max(1, Math.round(width * factor));
  const h = Math.max(1, Math.round(height * factor));
  const blob = await svgToPngBlob(svg, w, h, format === "jpeg" ? "image/jpeg" : "image/png");
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width: w, height: h, format };
}
