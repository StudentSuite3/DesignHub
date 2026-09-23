"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { useBrandStore } from "@/store/brand-store";
import type { BrandVoice } from "@/types/brand";

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

/** Edits the brand voice in the brand profile; the Voice & Tone page reads it from there. */
export function GuidelineVoicePanel() {
  const voice = useBrandStore((state) => state.profile.voice);
  const updateVoice = useBrandStore((state) => state.updateVoice);

  const listField = (key: "personality" | "dos" | "donts", label: string, hint: string) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`voice-${key}`}>{label}</Label>
      <Input
        id={`voice-${key}`}
        defaultValue={voice[key].join(", ")}
        key={voice[key].join("|")}
        onBlur={(event) => updateVoice({ [key]: toList(event.target.value) } as Partial<BrandVoice>)}
        className="h-8 text-sm"
        aria-describedby={`voice-${key}-hint`}
      />
      <span id={`voice-${key}-hint`} className="text-[11px] text-subtle-foreground">
        {hint}
      </span>
    </div>
  );

  return (
    <Panel title="Voice & tone" description="Saved to the brand profile.">
      {listField("personality", "Personality", "Three or four words, comma separated.")}
      {listField("dos", "Do", "Comma separated.")}
      {listField("donts", "Don't", "Comma separated.")}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="voice-sample">Sample copy</Label>
        <Textarea
          id="voice-sample"
          value={voice.sample}
          maxLength={220}
          onChange={(event) => updateVoice({ sample: event.target.value })}
          className="min-h-20 text-sm"
        />
      </div>
    </Panel>
  );
}
