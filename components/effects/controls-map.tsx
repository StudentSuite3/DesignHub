import type { ComponentType } from "react";

import type { EffectKind } from "@/types/effects";

/** Control panels per effect; each effect adds its own entry. */
export const effectControls: Partial<Record<EffectKind, ComponentType>> = {};
