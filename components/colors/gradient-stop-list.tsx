"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseColor, toHex } from "@/lib/color/color";
import { sortedStops } from "@/lib/color/gradient";
import { cn } from "@/lib/utils";
import { useColorStore } from "@/store/color-store";
import type { Gradient, GradientStop } from "@/types/color";

type GradientStopListProps = {
  gradient: Gradient;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (gradient: Gradient) => void;
};

export function GradientStopList({ gradient, selectedId, onSelect, onChange }: GradientStopListProps) {
  const swatches = useColorStore((state) => state.swatches);
  const patch = (id: string, update: Partial<GradientStop>) =>
    onChange({ ...gradient, stops: gradient.stops.map((stop) => (stop.id === id ? { ...stop, ...update } : stop)) });

  return (
    <ul className="flex flex-col gap-2" aria-label="Stops">
      {sortedStops(gradient).map((stop) => (
        <li
          key={stop.id}
          className={cn(
            "flex flex-col gap-2 rounded-md border p-2 transition-colors duration-150",
            stop.id === selectedId && "border-border-strong bg-surface",
          )}
          onFocusCapture={() => onSelect(stop.id)}
        >
          <div className="flex items-center gap-2">
            <label className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-md border">
              <span className="absolute inset-0" style={{ background: toHex(stop.color) }} />
              <input
                type="color"
                aria-label="Stop color"
                value={toHex({ ...stop.color, alpha: 1 })}
                onChange={(event) => {
                  const color = parseColor(event.target.value);
                  if (color) patch(stop.id, { color });
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            <span className="flex-1 font-mono text-xs uppercase">{toHex(stop.color)}</span>
            <Input
              type="number"
              min={0}
              max={100}
              value={Math.round(stop.position)}
              onChange={(event) => patch(stop.id, { position: Math.min(100, Math.max(0, Number(event.target.value))) })}
              aria-label="Stop position (%)"
              className="h-8 w-16 font-mono text-xs"
            />
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Remove stop"
              disabled={gradient.stops.length <= 2}
              onClick={() => onChange({ ...gradient, stops: gradient.stops.filter((item) => item.id !== stop.id) })}
            >
              <Trash2 />
            </Button>
          </div>
          {stop.id === selectedId ? (
            <div className="flex flex-wrap gap-1" aria-label="Use a palette color">
              {swatches.map((swatch) => (
                <button
                  key={swatch.id}
                  type="button"
                  aria-label={`Use ${toHex(swatch.color)}`}
                  onClick={() => patch(stop.id, { color: swatch.color })}
                  className="size-5 rounded-sm border"
                  style={{ background: toHex(swatch.color) }}
                />
              ))}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
