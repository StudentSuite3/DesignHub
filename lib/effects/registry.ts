import type { EffectCss, EffectKind, EffectSettingsMap } from "@/types/effects";

type EffectGenerator<K extends EffectKind> = (settings: EffectSettingsMap[K]) => EffectCss;

type EffectDefinition<K extends EffectKind> = {
  kind: K;
  label: string;
  description: string;
  generate: EffectGenerator<K>;
};

export type AnyEffectDefinition = { [K in EffectKind]: EffectDefinition<K> }[EffectKind];

/** Effects register here as they are implemented. */
export const effectDefinitions: AnyEffectDefinition[] = [];

export function generateEffect<K extends EffectKind>(kind: K, settings: EffectSettingsMap[K]): EffectCss | null {
  const definition = effectDefinitions.find((item) => item.kind === kind) as EffectDefinition<K> | undefined;
  return definition ? definition.generate(settings) : null;
}

export function defineEffect<K extends EffectKind>(definition: EffectDefinition<K>): EffectDefinition<K> {
  return definition;
}
