// Minimal typings for the parts of opentype.js 2.x that DesignHub uses.
declare module "opentype.js" {
  export type LocalizedName = Partial<Record<string, string>>;

  export type FeatureRecord = {
    tag: string;
  };

  export type LayoutTable = {
    features?: FeatureRecord[];
  };

  export type Font = {
    names: {
      fontFamily?: LocalizedName;
      fontSubfamily?: LocalizedName;
      designer?: LocalizedName;
      version?: LocalizedName;
    };
    unitsPerEm: number;
    ascender: number;
    descender: number;
    numGlyphs: number;
    tables: {
      gsub?: LayoutTable;
      gpos?: LayoutTable;
      fvar?: { axes: { tag: string; minValue: number; defaultValue: number; maxValue: number }[] };
    };
  };

  export function parse(buffer: ArrayBuffer): Font;
}
