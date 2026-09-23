import type { AnyEffectDefinition, EffectDefinition } from "@/lib/effects/define";
import { glass } from "@/lib/effects/glass";
import { glow } from "@/lib/effects/glow";
import { neumorphism } from "@/lib/effects/neumorphism";
import { shadow } from "@/lib/effects/shadow";
import type { EffectCss, EffectKind, EffectSettingsMap } from "@/types/effects";

/** Effects register here as they are implemented. */
export const effectDefinitions: AnyEffectDefinition[] = [glass, neumorphism, shadow, glow];

export function generateEffect<K extends EffectKind>(kind: K, settings: EffectSettingsMap[K]): EffectCss | null {
  const definition = effectDefinitions.find((item) => item.kind === kind) as EffectDefinition<K> | undefined;
  return definition ? definition.generate(settings) : null;
}
