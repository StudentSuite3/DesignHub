import { svgToDataUrl } from "@/lib/icons/svg";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not rasterize SVG"));
    image.src = src;
  });
}

/** Rasterizes an SVG string into a PNG (square unless `height` is given). */
export async function svgToPngBlob(svg: string, size: number, height = size): Promise<Blob> {
  const image = await loadImage(svgToDataUrl(svg));
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available");
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, size, height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG encoding failed"))), "image/png"),
  );
}

export async function svgToPngBytes(svg: string, size: number): Promise<Uint8Array> {
  const blob = await svgToPngBlob(svg, size);
  return new Uint8Array(await blob.arrayBuffer());
}
