import type { EffectCss, EffectKind, EffectSettingsMap } from "@/types/effects";

export type EffectDefinition<K extends EffectKind> = {
  kind: K;
  label: string;
  description: string;
  generate: (settings: EffectSettingsMap[K]) => EffectCss;
};

export type AnyEffectDefinition = { [K in EffectKind]: EffectDefinition<K> }[EffectKind];

export function defineEffect<K extends EffectKind>(definition: EffectDefinition<K>): EffectDefinition<K> {
  return definition;
}
