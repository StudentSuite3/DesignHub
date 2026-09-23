"use client";

import { ImageDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { downloadBlob } from "@/lib/download";
import { rasterize } from "@/lib/export/raster";
import { slugify } from "@/lib/logo/pack";
import type { SocialTemplate } from "@/lib/social/types";
import { useSocialStore } from "@/store/social-store";

type Props = { svg: string; name: string; template: SocialTemplate | undefined };

export function SocialExportPanel({ svg, name, template }: Props) {
  const scale = useSocialStore((state) => state.scale);
  const setScale = useSocialStore((state) => state.setScale);
  const [busy, setBusy] = useState(false);

  async function download() {
    if (!template) return;
    setBusy(true);
    try {
      const image = await rasterize(svg, scale);
      downloadBlob(
        new Blob([image.bytes.slice().buffer], { type: "image/png" }),
        `${slugify(name)}-${template.id}${scale > 1 ? `@${scale}x` : ""}.png`,
      );
      toast.success("Download ready");
    } catch {
      toast.error("Export failed in this browser.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h2 className="text-sm font-medium">Export</h2>
      {template ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
          <dt className="text-muted-foreground">Platform</dt>
          <dd>{template.platform}</dd>
          <dt className="text-muted-foreground">Size</dt>
          <dd className="font-mono">
            {template.width} × {template.height}
          </dd>
        </dl>
      ) : null}
      <div className="flex flex-col gap-2">
        <Label>Resolution</Label>
        <ToggleGroup
          type="single"
          value={String(scale)}
          onValueChange={(value) => value && setScale(Number(value))}
          aria-label="Export resolution"
          className="w-full"
        >
          {[1, 2].map((value) => (
            <ToggleGroupItem key={value} value={String(value)} className="flex-1 font-mono">
              {value}×
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {template ? (
          <p className="font-mono text-[11px] text-subtle-foreground">
            {template.width * scale} × {template.height * scale} px
          </p>
        ) : null}
      </div>
      <Button onClick={download} disabled={!svg || busy}>
        {busy ? <Loader2 className="animate-spin" /> : <ImageDown />} Download PNG
      </Button>
    </>
  );
}
