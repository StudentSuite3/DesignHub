"use client";

import { ColorField, SwitchField } from "@/components/effects/fields";
import { SliderField } from "@/components/ui/field";
import type { ShadowLayer } from "@/types/effects";

type ShadowLayerEditorProps = {
  layer: ShadowLayer;
  onChange: (patch: Partial<ShadowLayer>) => void;
};

export function ShadowLayerEditor({ layer, onChange }: ShadowLayerEditorProps) {
  const pxFormat = (value: number) => `${value}px`;
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-surface p-3">
      <div className="grid grid-cols-2 gap-4">
        <SliderField label="X" value={layer.x} min={-60} max={60} onChange={(x) => onChange({ x })} format={pxFormat} />
        <SliderField label="Y" value={layer.y} min={-60} max={60} onChange={(y) => onChange({ y })} format={pxFormat} />
        <SliderField
          label="Blur"
          value={layer.blur}
          min={0}
          max={120}
          onChange={(blur) => onChange({ blur })}
          format={pxFormat}
        />
        <SliderField
          label="Spread"
          value={layer.spread}
          min={-40}
          max={40}
          onChange={(spread) => onChange({ spread })}
          format={pxFormat}
        />
      </div>
      <ColorField label="Color" value={layer.color} onChange={(color) => onChange({ color })} />
      <SliderField
        label="Opacity"
        value={layer.opacity}
        min={0}
        max={1}
        step={0.01}
        onChange={(opacity) => onChange({ opacity })}
        format={(value) => `${Math.round(value * 100)}%`}
      />
      <SwitchField label="Inset" checked={layer.inset} onChange={(inset) => onChange({ inset })} />
    </div>
  );
}
