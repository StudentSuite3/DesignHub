"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useColorStore } from "@/store/color-store";
import type { ColorFormat } from "@/types/color";

const formats: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" },
];

export function FormatSwitcher() {
  const format = useColorStore((state) => state.format);
  const setFormat = useColorStore((state) => state.setFormat);

  return (
    <ToggleGroup
      type="single"
      value={format}
      onValueChange={(value) => value && setFormat(value as ColorFormat)}
      aria-label="Color format"
    >
      {formats.map((item) => (
        <ToggleGroupItem key={item.value} value={item.value} className="font-mono">
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
