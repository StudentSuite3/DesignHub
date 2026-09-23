/** Reads the intrinsic size of an SVG document from width/height or its viewBox. */
export function svgDimensions(svg: string): { width: number; height: number } {
  const tag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? "";
  const attr = (name: string) => tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1];
  const numeric = (value: string | undefined) => {
    const parsed = value && !value.trim().endsWith("%") ? Number.parseFloat(value) : Number.NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  };
  const viewBox = attr("viewBox")
    ?.split(/[\s,]+/)
    .map(Number);
  const vbWidth = viewBox && viewBox.length === 4 ? viewBox[2] : undefined;
  const vbHeight = viewBox && viewBox.length === 4 ? viewBox[3] : undefined;
  return {
    width: numeric(attr("width")) ?? vbWidth ?? 300,
    height: numeric(attr("height")) ?? vbHeight ?? 150,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}
