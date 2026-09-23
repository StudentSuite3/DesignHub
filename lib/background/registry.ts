import { aurora } from "@/lib/background/generators/aurora";
import { blobs } from "@/lib/background/generators/blobs";
import { dots } from "@/lib/background/generators/dots";
import { grid } from "@/lib/background/generators/grid";
import { isometric } from "@/lib/background/generators/isometric";
import { mesh } from "@/lib/background/generators/mesh";
import { noise } from "@/lib/background/generators/noise";
import { waves } from "@/lib/background/generators/waves";
import { wrapSvg } from "@/lib/background/svg";
import type { BackgroundDefinition, BackgroundKind, BackgroundSettings } from "@/types/background";

/** Generators register themselves here as they are implemented. */
export const backgroundGenerators: BackgroundDefinition[] = [waves, blobs, mesh, aurora, noise, dots, grid, isometric];

export function getGenerator(kind: BackgroundKind): BackgroundDefinition | undefined {
  return backgroundGenerators.find((generator) => generator.kind === kind);
}

/** Complete SVG document for the current settings. */
export function renderBackgroundSvg(settings: BackgroundSettings): string {
  const generator = getGenerator(settings.kind);
  return generator ? generator.render(settings) : wrapSvg(settings, "");
}
