"use client";

import { Moon, Sun } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { SocialContent } from "@/lib/social/types";
import { useSocialStore } from "@/store/social-store";
import type { BrandMode } from "@/types/brand";

const fields: { key: keyof SocialContent; label: string; derived?: boolean }[] = [
  { key: "headline", label: "Headline", derived: true },
  { key: "subtitle", label: "Subtitle" },
  { key: "cta", label: "Call to action" },
  { key: "handle", label: "Handle", derived: true },
  { key: "website", label: "Website", derived: true },
];

export function SocialContentPanel() {
  const mode = useSocialStore((state) => state.mode);
  const setMode = useSocialStore((state) => state.setMode);
  const content = useSocialStore((state) => state.content);
  const setContent = useSocialStore((state) => state.setContent);
  const safeArea = useSocialStore((state) => state.safeArea);
  const setSafeArea = useSocialStore((state) => state.setSafeArea);

  return (
    <Panel title="Content">
      <div className="flex flex-col gap-2">
        <Label>Theme</Label>
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => value && setMode(value as BrandMode)}
          aria-label="Asset theme"
          className="w-full"
        >
          <ToggleGroupItem value="light" className="flex-1">
            <Sun /> Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className="flex-1">
            <Moon /> Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="social-safe-area">Show safe area</Label>
        <Switch id="social-safe-area" checked={safeArea} onCheckedChange={setSafeArea} />
      </div>
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-1.5">
          <Label htmlFor={`social-${field.key}`}>{field.label}</Label>
          <Input
            id={`social-${field.key}`}
            value={content[field.key]}
            maxLength={90}
            placeholder={field.derived ? "From your brand" : undefined}
            onChange={(event) => setContent({ [field.key]: event.target.value })}
            className="h-8 text-sm"
          />
        </div>
      ))}
    </Panel>
  );
}
