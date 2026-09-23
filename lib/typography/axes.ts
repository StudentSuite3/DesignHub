/** Human-friendly names for registered and common custom variable font axes. */
const axisNames: Record<string, string> = {
  wght: "Weight",
  wdth: "Width",
  opsz: "Optical size",
  ital: "Italic",
  slnt: "Slant",
  GRAD: "Grade",
  SOFT: "Softness",
  WONK: "Wonky",
  CASL: "Casual",
  MONO: "Monospace",
  CRSV: "Cursive",
  XOPQ: "Thick stroke",
  YOPQ: "Thin stroke",
  XTRA: "Counter width",
  YTUC: "Uppercase height",
  YTLC: "Lowercase height",
  YTAS: "Ascender height",
  YTDE: "Descender depth",
  YTFI: "Figure height",
  FILL: "Fill",
  ROND: "Roundness",
  BNCE: "Bounce",
  INFM: "Informality",
  SPAC: "Spacing",
  ELGR: "Element grid",
  ELSH: "Element shape",
  MORF: "Morph",
  HEXP: "Hyper expansion",
};

export function axisName(tag: string): string {
  return axisNames[tag] ?? tag;
}

/** Sensible slider step for an axis range. */
export function axisStep(min: number, max: number): number {
  const span = max - min;
  if (span <= 1) return 0.01;
  if (span <= 20) return 0.1;
  return 1;
}
