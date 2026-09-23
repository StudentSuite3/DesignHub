"use client";

import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { shadowPresets } from "@/lib/effects/shadow";
import { useEffectsStore } from "@/store/effects-store";
import { useTokensStore } from "@/store/tokens-store";

export function BrandScaleFields() {
  const radius = useTokensStore((state) => state.settings.radiusBase);
  const spacing = useTokensStore((state) => state.settings.spacingBase);
  const updateTokens = useTokensStore((state) => state.update);
  const updateEffect = useEffectsStore((state) => state.update);

  return (
    <>
      <SliderField
        label="Border radius"
        value={radius}
        min={0}
        max={32}
        onChange={(radiusBase) => updateTokens({ radiusBase })}
        format={(v) => `${v}px`}
      />
      <SliderField
        label="Spacing base"
        value={spacing}
        min={2}
        max={12}
        onChange={(spacingBase) => updateTokens({ spacingBase })}
        format={(v) => `${v}px`}
      />
      <div className="flex flex-col gap-2">
        <Label>Shadow preset</Label>
        <div className="flex flex-wrap gap-1.5">
          {shadowPresets.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              onClick={() => updateEffect("shadow", { layers: preset.layers() })}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
