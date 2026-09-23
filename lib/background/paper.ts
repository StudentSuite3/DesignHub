import type paperCore from "paper/dist/paper-core";

type PaperScope = typeof paperCore;

let scope: PaperScope | null = null;
let loading: Promise<PaperScope> | null = null;

/**
 * Loads Paper.js (core build, no PaperScript compiler) on first use and sets up a
 * headless project. Kept out of the main bundle; only generators that need it pay for it.
 */
export function loadPaper(): Promise<PaperScope> {
  loading ??= import("paper/dist/paper-core").then((module) => {
    const paper = module.default;
    paper.setup(new paper.Size(1, 1));
    scope = paper;
    return paper;
  });
  return loading;
}

/** Synchronous accessor for renderers; null until `loadPaper()` has resolved (and always on the server). */
export function getPaper(): PaperScope | null {
  return scope;
}
