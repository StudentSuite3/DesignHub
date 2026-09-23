import { blobs } from "@/lib/background/generators/blobs";
import { mesh } from "@/lib/background/generators/mesh";
import { waves } from "@/lib/background/generators/waves";
import { wrapSvg } from "@/lib/background/svg";
import type { BackgroundDefinition, BackgroundKind, BackgroundSettings } from "@/types/background";

/** Generators register themselves here as they are implemented. */
export const backgroundGenerators: BackgroundDefinition[] = [waves, blobs, mesh];

export function getGenerator(kind: BackgroundKind): BackgroundDefinition | undefined {
  return backgroundGenerators.find((generator) => generator.kind === kind);
}

/** Complete SVG document for the current settings. */
export function renderBackgroundSvg(settings: BackgroundSettings): string {
  const generator = getGenerator(settings.kind);
  return generator ? generator.render(settings) : wrapSvg(settings, "");
}
