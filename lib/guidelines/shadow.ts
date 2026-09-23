import type { ShadowLayer } from "@/types/effects";

/** The brand's outer shadow layers as an SVG filter (spread and inset layers are approximated). */
export function shadowFilter(id: string, layers: ShadowLayer[]): string {
  const outer = layers.filter((layer) => !layer.inset);
  if (outer.length === 0) return `<filter id="${id}"><feOffset/></filter>`;
  // Each layer shadows the source on its own, then they are merged like stacked CSS shadows.
  const drops = outer
    .map(
      (layer, i) =>
        `<feDropShadow in="SourceGraphic" result="s${i}" dx="${layer.x}" dy="${layer.y}" stdDeviation="${Math.max(0, layer.blur / 2)}" flood-color="${layer.color}" flood-opacity="${layer.opacity}"/>`,
    )
    .join("");
  const merge = outer.map((_, i) => `<feMergeNode in="s${i}"/>`).reverse().join("");
  return `<filter id="${id}" x="-30%" y="-30%" width="160%" height="180%">${drops}<feMerge>${merge}</feMerge></filter>`;
}
