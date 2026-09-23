import type { ComponentType } from "react";

import { BorderControls } from "@/components/effects/border-controls";
import { GlassControls } from "@/components/effects/glass-controls";
import { GlowControls } from "@/components/effects/glow-controls";
import { GrainControls } from "@/components/effects/grain-controls";
import { NeumorphismControls } from "@/components/effects/neumorphism-controls";
import { ShadowControls } from "@/components/effects/shadow-controls";
import type { EffectKind } from "@/types/effects";

/** Control panels per effect; each effect adds its own entry. */
export const effectControls: Partial<Record<EffectKind, ComponentType>> = {
  glass: GlassControls,
  neumorphism: NeumorphismControls,
  shadow: ShadowControls,
  glow: GlowControls,
  border: BorderControls,
  grain: GrainControls,
};
