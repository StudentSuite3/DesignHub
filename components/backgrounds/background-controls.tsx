"use client";

import { Dices, RotateCcw } from "lucide-react";

import { ColorList } from "@/components/backgrounds/color-list";
import { GeneratorPicker } from "@/components/backgrounds/generator-picker";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHotkey } from "@/hooks/use-hotkeys";
import { useBackgroundStore } from "@/store/background-store";

const sizes = [
  { id: "1600x900", label: "Desktop · 1600×900" },
  { id: "1920x1080", label: "Full HD · 1920×1080" },
  { id: "1200x630", label: "Open Graph · 1200×630" },
  { id: "1080x1080", label: "Square · 1080×1080" },
  { id: "1080x1920", label: "Story · 1080×1920" },
];

export function BackgroundControls() {
  const settings = useBackgroundStore((state) => state.settings);
  const update = useBackgroundStore((state) => state.update);
  const randomize = useBackgroundStore((state) => state.randomize);
  const reset = useBackgroundStore((state) => state.reset);
  useHotkey("space", randomize);

  return (
    <>
      <Panel title="Generator">
        <GeneratorPicker />
      </Panel>
      <Panel
        title="Controls"
        actions={
          <Button variant="ghost" size="icon" aria-label="Reset background" onClick={reset}>
            <RotateCcw />
          </Button>
        }
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="bg-seed">Seed</Label>
          <div className="flex gap-2">
            <Input
              id="bg-seed"
              type="number"
              min={1}
              value={settings.seed}
              onChange={(event) => update({ seed: Math.max(1, Number(event.target.value) || 1) })}
              className="min-w-0 flex-1 font-mono tabular-nums"
            />
            <Button variant="outline" onClick={randomize} className="shrink-0" title="Randomize · Space">
              <Dices /> Randomize
            </Button>
          </div>
        </div>
        <p className="-mt-2 text-[11px] text-subtle-foreground">
          Press <Kbd>Space</Kbd> for a new seed.
        </p>
        <ColorList />
        <SliderField
          label="Density"
          value={settings.density}
          min={0}
          max={100}
          onChange={(density) => update({ density })}
        />
        <SliderField
          label="Scale"
          value={settings.scale}
          min={0.25}
          max={4}
          step={0.05}
          onChange={(scale) => update({ scale })}
          format={(value) => `${value.toFixed(2)}×`}
        />
        <SliderField
          label="Rotation"
          value={settings.rotation}
          min={0}
          max={360}
          onChange={(rotation) => update({ rotation })}
          format={(value) => `${value}°`}
        />
        <div className="flex flex-col gap-2">
          <Label>Canvas</Label>
          <Select
            value={`${settings.width}x${settings.height}`}
            onValueChange={(value) => {
              const [width, height] = value.split("x").map(Number);
              if (width && height) update({ width, height });
            }}
          >
            <SelectTrigger aria-label="Canvas size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Panel>
    </>
  );
}
