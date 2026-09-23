"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type SliderFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  className?: string;
};

/** Labelled slider with a live value readout. */
function SliderField({ label, value, min, max, step = 1, onChange, format, className }: SliderFieldProps) {
  const id = React.useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <output htmlFor={id} className="font-mono text-xs tabular-nums text-foreground">
          {format ? format(value) : value}
        </output>
      </div>
      <Slider
        id={id}
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0] ?? value)}
      />
    </div>
  );
}

export { SliderField };
