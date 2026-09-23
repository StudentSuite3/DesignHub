"use client";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type ChannelSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  gradient: string;
  display: string;
  onChange: (value: number) => void;
};

export function ChannelSlider({ label, value, min, max, step, gradient, display, onChange }: ChannelSliderProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <output htmlFor={id} className="font-mono text-xs tabular-nums">
          {display}
        </output>
      </div>
      <Slider
        id={id}
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next ?? value)}
        trackStyle={{ background: gradient }}
      />
    </div>
  );
}
