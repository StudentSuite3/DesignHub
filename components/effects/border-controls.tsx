"use client";

import { Plus, X } from "lucide-react";

import { ColorField, SwitchField } from "@/components/effects/fields";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useEffectSettings, useEffectsStore } from "@/store/effects-store";

const MAX_STOPS = 5;

export function BorderControls() {
  const s = useEffectSettings("border");
  const update = useEffectsStore((state) => state.update);
  const set = (patch: Partial<typeof s>) => update("border", patch);
  const setStop = (index: number, color: string) =>
    set({ colors: s.colors.map((item, i) => (i === index ? color : item)) });

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Gradient</Label>
        <div className="flex flex-wrap items-center gap-1.5">
          {s.colors.map((color, index) => (
            <div key={index} className="group relative">
              <label className="relative block size-8 cursor-pointer overflow-hidden rounded-md border">
                <span className="absolute inset-0" style={{ background: color }} />
                <input
                  type="color"
                  aria-label={`Gradient color ${index + 1}`}
                  value={color}
                  onChange={(event) => setStop(index, event.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
              {s.colors.length > 2 ? (
                <button
                  type="button"
                  aria-label={`Remove gradient color ${index + 1}`}
                  onClick={() => set({ colors: s.colors.filter((_, i) => i !== index) })}
                  className="absolute -top-1.5 -right-1.5 hidden size-4 items-center justify-center rounded-full border bg-popover group-focus-within:flex group-hover:flex"
                >
                  <X className="size-2.5" />
                </button>
              ) : null}
            </div>
          ))}
          {s.colors.length < MAX_STOPS ? (
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Add gradient color"
              onClick={() => set({ colors: [...s.colors, s.colors[0] ?? "#6366f1"] })}
            >
              <Plus />
            </Button>
          ) : null}
        </div>
      </div>
      <ColorField label="Fill" value={s.fill} onChange={(fill) => set({ fill })} />
      <SliderField
        label="Thickness"
        value={s.thickness}
        min={1}
        max={12}
        onChange={(thickness) => set({ thickness })}
        format={(v) => `${v}px`}
      />
      <SliderField
        label="Radius"
        value={s.radius}
        min={0}
        max={48}
        onChange={(radius) => set({ radius })}
        format={(v) => `${v}px`}
      />
      {s.animated ? null : (
        <SliderField
          label="Angle"
          value={s.angle}
          min={0}
          max={360}
          onChange={(angle) => set({ angle })}
          format={(v) => `${v}°`}
        />
      )}
      <SwitchField label="Animated" checked={s.animated} onChange={(animated) => set({ animated })} />
      {s.animated ? (
        <SliderField
          label="Speed"
          value={s.speed}
          min={1}
          max={12}
          step={0.5}
          onChange={(speed) => set({ speed })}
          format={(v) => `${v}s / turn`}
        />
      ) : null}
    </>
  );
}
