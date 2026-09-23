"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { useTypographyStore } from "@/store/typography-store";

export function SpecimenControls() {
  const specimen = useTypographyStore((state) => state.specimen);
  const updateSpecimen = useTypographyStore((state) => state.updateSpecimen);
  const resetSpecimen = useTypographyStore((state) => state.resetSpecimen);

  return (
    <Panel
      title="Preview"
      actions={
        <Button variant="ghost" size="icon" onClick={resetSpecimen} aria-label="Reset preview settings">
          <RotateCcw />
        </Button>
      }
    >
      <SliderField
        label="Size"
        value={specimen.size}
        min={12}
        max={160}
        onChange={(size) => updateSpecimen({ size })}
        format={(value) => `${value}px`}
      />
      <SliderField
        label="Line height"
        value={specimen.lineHeight}
        min={0.8}
        max={2.2}
        step={0.01}
        onChange={(lineHeight) => updateSpecimen({ lineHeight })}
        format={(value) => value.toFixed(2)}
      />
      <SliderField
        label="Letter spacing"
        value={specimen.letterSpacing}
        min={-0.1}
        max={0.3}
        step={0.005}
        onChange={(letterSpacing) => updateSpecimen({ letterSpacing })}
        format={(value) => `${value.toFixed(3)}em`}
      />
    </Panel>
  );
}
