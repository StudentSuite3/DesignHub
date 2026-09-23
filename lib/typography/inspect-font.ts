export type FontInspection = {
  family: string;
  subfamily: string;
  designer?: string;
  version?: string;
  glyphs: number;
  unitsPerEm: number;
  features: string[];
  axes: { tag: string; min: number; max: number; default: number }[];
};

const SUPPORTED = /\.(otf|ttf|woff)$/i;

export function isInspectableFont(file: File): boolean {
  return SUPPORTED.test(file.name);
}

/** Parses a local font file with opentype.js (loaded on demand) and lists its layout features. */
export async function inspectFont(buffer: ArrayBuffer, fallbackName: string): Promise<FontInspection> {
  const { parse } = await import("opentype.js");
  const font = parse(buffer);
  const tags = [...(font.tables.gsub?.features ?? []), ...(font.tables.gpos?.features ?? [])].map((f) => f.tag);

  return {
    family: font.names.fontFamily?.en ?? fallbackName,
    subfamily: font.names.fontSubfamily?.en ?? "Regular",
    designer: font.names.designer?.en,
    version: font.names.version?.en,
    glyphs: font.numGlyphs,
    unitsPerEm: font.unitsPerEm,
    features: [...new Set(tags)].sort(),
    axes: (font.tables.fvar?.axes ?? []).map((axis) => ({
      tag: axis.tag,
      min: axis.minValue,
      max: axis.maxValue,
      default: axis.defaultValue,
    })),
  };
}

/** Registers the file with the browser so it can be previewed like any web font. */
export async function registerLocalFont(buffer: ArrayBuffer, family: string): Promise<void> {
  const face = new FontFace(family, buffer);
  await face.load();
  document.fonts.add(face);
}
