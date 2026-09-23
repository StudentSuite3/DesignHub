"use client";

import { ArrowLeftRight, Palette, Shuffle } from "lucide-react";
import { useState } from "react";

import { GradientStopList } from "@/components/colors/gradient-stop-list";
import { GradientStopsBar } from "@/components/colors/gradient-stops-bar";
import { CodeBlock } from "@/components/export/code-block";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { gradientCss, gradientCssFallback, gradientFromColors, randomGradient } from "@/lib/color/gradient";
import { useColorStore } from "@/store/color-store";
import type { Gradient, GradientType } from "@/types/color";

export function GradientStudio() {
  const gradient = useColorStore((state) => state.gradient);
  const setGradient = useColorStore((state) => state.setGradient);
  const updateGradient = useColorStore((state) => state.updateGradient);
  const swatches = useColorStore((state) => state.swatches);
  const [selectedStop, setSelectedStop] = useState<string | null>(gradient.stops[0]?.id ?? null);

  const css = gradientCss(gradient);
  const snippet = `.gradient {\n  background: ${gradientCssFallback(gradient)};\n  background: ${css};\n}\n`;
  const usesAngle = gradient.type !== "radial";
  const usesCenter = gradient.type !== "linear";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-4">
        <div
          role="img"
          aria-label={`${gradient.type} gradient preview`}
          className="aspect-[16/9] w-full rounded-xl border"
          style={{ background: css }}
        />
        <GradientStopsBar
          gradient={gradient}
          selectedId={selectedStop}
          onSelect={setSelectedStop}
          onChange={setGradient}
        />
        <CodeBlock code={snippet} filename="gradient.css" />
      </div>

      <div className="flex flex-col gap-4">
        <Panel title="Gradient">
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <ToggleGroup
              type="single"
              value={gradient.type}
              onValueChange={(value) => value && updateGradient({ type: value as GradientType })}
              aria-label="Gradient type"
              className="w-full"
            >
              {(["linear", "radial", "conic"] as const).map((type) => (
                <ToggleGroupItem key={type} value={type} className="flex-1 capitalize">
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          {usesAngle ? (
            <SliderField
              label="Angle"
              value={gradient.angle}
              min={0}
              max={360}
              onChange={(angle) => updateGradient({ angle })}
              format={(value) => `${value}°`}
            />
          ) : null}
          {usesCenter ? (
            <div className="grid grid-cols-2 gap-4">
              <SliderField
                label="Center X"
                value={gradient.x}
                min={0}
                max={100}
                onChange={(x) => updateGradient({ x })}
                format={(v) => `${v}%`}
              />
              <SliderField
                label="Center Y"
                value={gradient.y}
                min={0}
                max={100}
                onChange={(y) => updateGradient({ y })}
                format={(v) => `${v}%`}
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <Label>Interpolation</Label>
            <ToggleGroup
              type="single"
              value={gradient.interpolation}
              onValueChange={(value) => value && updateGradient({ interpolation: value as Gradient["interpolation"] })}
              aria-label="Interpolation color space"
              className="w-full"
            >
              {(["oklch", "oklab", "srgb"] as const).map((space) => (
                <ToggleGroupItem key={space} value={space} className="flex-1 font-mono uppercase">
                  {space}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => setGradient(randomGradient(gradient))}>
              <Shuffle /> Random
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setGradient(
                  gradientFromColors(
                    swatches.map((swatch) => swatch.color),
                    gradient,
                  ),
                )
              }
            >
              <Palette /> Palette
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setGradient({
                  ...gradient,
                  stops: gradient.stops.map((stop) => ({ ...stop, position: 100 - stop.position })),
                })
              }
            >
              <ArrowLeftRight /> Reverse
            </Button>
          </div>
        </Panel>
        <Panel title="Stops" description="Up to 8 stops.">
          <GradientStopList
            gradient={gradient}
            selectedId={selectedStop}
            onSelect={setSelectedStop}
            onChange={setGradient}
          />
        </Panel>
      </div>
    </div>
  );
}
