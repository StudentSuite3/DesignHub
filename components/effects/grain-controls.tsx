"use client";

import { SliderField } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffectSettings, useEffectsStore } from "@/store/effects-store";
import type { BlendMode } from "@/types/effects";

const blends: BlendMode[] = ["overlay", "soft-light", "multiply", "screen", "normal"];

export function GrainControls() {
  const s = useEffectSettings("grain");
  const update = useEffectsStore((state) => state.update);
  const set = (patch: Partial<typeof s>) => update("grain", patch);

  return (
    <>
      <SliderField
        label="Scale"
        value={s.scale}
        min={40}
        max={400}
        step={10}
        onChange={(scale) => set({ scale })}
        format={(v) => `${v}px tile`}
      />
      <SliderField
        label="Frequency"
        value={s.frequency}
        min={0.2}
        max={2}
        step={0.05}
        onChange={(frequency) => set({ frequency })}
        format={(v) => v.toFixed(2)}
      />
      <SliderField
        label="Opacity"
        value={s.opacity}
        min={0.02}
        max={1}
        step={0.01}
        onChange={(opacity) => set({ opacity })}
        format={(v) => `${Math.round(v * 100)}%`}
      />
      <div className="flex flex-col gap-2">
        <Label>Blend mode</Label>
        <Select value={s.blend} onValueChange={(value) => set({ blend: value as BlendMode })}>
          <SelectTrigger aria-label="Blend mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {blends.map((blend) => (
              <SelectItem key={blend} value={blend}>
                {blend}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
