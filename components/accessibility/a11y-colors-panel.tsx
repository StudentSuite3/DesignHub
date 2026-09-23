"use client";

import { ArrowUpDown } from "lucide-react";

import { ColorField } from "@/components/effects/fields";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useA11yStore } from "@/store/a11y-store";
import type { A11yColors } from "@/types/a11y";

const fields: { key: keyof A11yColors; label: string }[] = [
  { key: "text", label: "Text" },
  { key: "background", label: "Background" },
  { key: "accent", label: "Accent (links, buttons)" },
  { key: "onAccent", label: "Text on accent" },
];

export function A11yColorsPanel() {
  const colors = useA11yStore((state) => state.colors);
  const setColors = useA11yStore((state) => state.setColors);

  return (
    <Panel title="Colors">
      {fields.map((field) => (
        <ColorField
          key={field.key}
          label={field.label}
          value={colors[field.key]}
          onChange={(value) => setColors({ [field.key]: value })}
        />
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setColors({ text: colors.background, background: colors.text })}
      >
        <ArrowUpDown /> Swap text and background
      </Button>
    </Panel>
  );
}
