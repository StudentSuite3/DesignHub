"use client";

import { Plus, X } from "lucide-react";

import { FontPicker } from "@/components/typography/font-picker";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFontCatalog } from "@/hooks/use-font-catalog";
import type { BrandDna } from "@/lib/brand-dna/types";
import type { ColorRole } from "@/types/brand";

type Props = { dna: BrandDna; onChange: (dna: BrandDna) => void };

const roles: ColorRole[] = ["primary", "secondary", "neutral"];

export function DnaResultEditor({ dna, onChange }: Props) {
  const { fonts } = useFontCatalog();
  const set = (patch: Partial<BrandDna>) => onChange({ ...dna, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Colors</Label>
        <ul className="flex flex-col gap-1.5" aria-label="Extracted colors">
          {dna.colors.map((color, index) => (
            <li key={index} className="flex items-center gap-2">
              <label className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-md border">
                <span className="absolute inset-0" style={{ background: color.hex }} />
                <input
                  type="color"
                  aria-label={`Color ${index + 1}`}
                  value={color.hex.toLowerCase()}
                  onChange={(event) =>
                    set({
                      colors: dna.colors.map((item, i) => (i === index ? { ...item, hex: event.target.value } : item)),
                    })
                  }
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
              <span className="min-w-0 flex-1 truncate font-mono text-xs uppercase">
                {color.hex}
                <span className="ml-2 text-subtle-foreground">{Math.round(color.weight * 100)}%</span>
              </span>
              <Select
                value={color.role}
                onValueChange={(value) =>
                  set({
                    colors: dna.colors.map((item, i) => (i === index ? { ...item, role: value as ColorRole } : item)),
                  })
                }
              >
                <SelectTrigger size="sm" className="w-28 capitalize" aria-label={`Color ${index + 1} role`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={`Remove color ${index + 1}`}
                disabled={dna.colors.length <= 2}
                onClick={() => set({ colors: dna.colors.filter((_, i) => i !== index) })}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="sm"
          disabled={dna.colors.length >= 10}
          onClick={() => set({ colors: [...dna.colors, { hex: "#94A3B8", weight: 0, role: "neutral" }] })}
        >
          <Plus /> Add color
        </Button>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Heading font</Label>
        <FontPicker label="Heading font" value={dna.heading} fonts={fonts} onChange={(heading) => set({ heading })} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Body font</Label>
        <FontPicker label="Body font" value={dna.body} fonts={fonts} onChange={(body) => set({ body })} />
      </div>
      <SliderField
        label="Border radius"
        value={dna.radius}
        min={0}
        max={32}
        onChange={(radius) => set({ radius })}
        format={(v) => `${v}px`}
      />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dna-personality">Personality</Label>
        <Input
          id="dna-personality"
          key={dna.personality.join("|")}
          defaultValue={dna.personality.join(", ")}
          onBlur={(event) =>
            set({
              personality: event.target.value
                .split(",")
                .map((word) => word.trim())
                .filter(Boolean)
                .slice(0, 4),
            })
          }
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
}
