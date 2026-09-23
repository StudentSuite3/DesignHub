import { create } from "zustand";

import type { OpenTypeSettings, SpecimenSettings, TypeScaleSettings } from "@/types/typography";

export const DEFAULT_SPECIMEN_TEXT = "The quick brown fox jumps over the lazy dog";

export const defaultSpecimen: SpecimenSettings = {
  text: DEFAULT_SPECIMEN_TEXT,
  size: 56,
  weight: 500,
  italic: false,
  letterSpacing: -0.02,
  lineHeight: 1.15,
  axes: {},
};

export const defaultScale: TypeScaleSettings = {
  baseSize: 18,
  ratio: 1.25,
  minBase: 16,
  minRatio: 1.2,
  minViewport: 360,
  maxViewport: 1280,
  stepsUp: 5,
  stepsDown: 2,
};

export const defaultOpenType: OpenTypeSettings = {
  liga: true,
  dlig: false,
  kern: true,
  smcp: false,
  c2sc: false,
  lnum: false,
  onum: false,
  tnum: false,
  pnum: false,
  zero: false,
  frac: false,
  ss01: false,
  ss02: false,
  case: false,
};

export type TypographyTab = "browse" | "pair" | "scale" | "export";

type TypographyState = {
  tab: TypographyTab;
  /** Font currently open in the specimen / playground. */
  activeFont: string;
  headingFont: string;
  bodyFont: string;
  specimen: SpecimenSettings;
  scale: TypeScaleSettings;
  openType: OpenTypeSettings;
  setTab: (tab: TypographyTab) => void;
  setActiveFont: (family: string) => void;
  setPair: (pair: { heading?: string; body?: string }) => void;
  updateSpecimen: (patch: Partial<SpecimenSettings>) => void;
  setAxis: (tag: string, value: number) => void;
  updateScale: (patch: Partial<TypeScaleSettings>) => void;
  toggleFeature: (tag: keyof OpenTypeSettings) => void;
  resetSpecimen: () => void;
};

export const useTypographyStore = create<TypographyState>()((set) => ({
  tab: "browse",
  activeFont: "Inter",
  headingFont: "Space Grotesk",
  bodyFont: "Inter",
  specimen: defaultSpecimen,
  scale: defaultScale,
  openType: defaultOpenType,
  setTab: (tab) => set({ tab }),
  setActiveFont: (family) =>
    set((state) => ({ activeFont: family, specimen: { ...state.specimen, axes: {} } })),
  setPair: ({ heading, body }) =>
    set((state) => ({ headingFont: heading ?? state.headingFont, bodyFont: body ?? state.bodyFont })),
  updateSpecimen: (patch) => set((state) => ({ specimen: { ...state.specimen, ...patch } })),
  setAxis: (tag, value) =>
    set((state) => ({ specimen: { ...state.specimen, axes: { ...state.specimen.axes, [tag]: value } } })),
  updateScale: (patch) => set((state) => ({ scale: { ...state.scale, ...patch } })),
  toggleFeature: (tag) => set((state) => ({ openType: { ...state.openType, [tag]: !state.openType[tag] } })),
  resetSpecimen: () => set({ specimen: defaultSpecimen, openType: defaultOpenType }),
}));
