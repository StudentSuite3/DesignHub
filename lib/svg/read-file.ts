export const MAX_SVG_BYTES = 2 * 1024 * 1024;

export function isSvgFile(file: File): boolean {
  return file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
}

/** Reads a dropped/uploaded SVG as text, rejecting non-SVG and oversized files. */
export async function readSvgFile(file: File): Promise<string> {
  if (!isSvgFile(file)) throw new Error("Only .svg files are supported.");
  if (file.size > MAX_SVG_BYTES) throw new Error("That file is larger than 2 MB.");
  return file.text();
}
