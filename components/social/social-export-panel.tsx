"use client";

import { FileArchive, ImageDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { downloadBlob } from "@/lib/download";
import { rasterize } from "@/lib/export/raster";
import { slugify } from "@/lib/logo/pack";
import { buildSocialPack } from "@/lib/social/pack";
import { socialTemplates } from "@/lib/social/registry";
import { ogMetaTags } from "@/lib/social/templates/open-graph";
import type { SocialContext, SocialTemplate } from "@/lib/social/types";
import { useSocialStore } from "@/store/social-store";

type Props = { svg: string; ctx: SocialContext; template: SocialTemplate | undefined };

export function SocialExportPanel({ svg, ctx, template }: Props) {
  const name = ctx.brand.name;
  const scale = useSocialStore((state) => state.scale);
  const setScale = useSocialStore((state) => state.setScale);
  const [busy, setBusy] = useState(false);
  const [packProgress, setPackProgress] = useState<number | null>(null);

  const file = template ? `${slugify(name)}-${template.id}${scale > 1 ? `@${scale}x` : ""}.png` : "";
  const meta = template?.platform === "Open Graph" ? ogMetaTags(ctx, "og.png") : null;

  async function downloadAll() {
    setPackProgress(0);
    try {
      const zip = await buildSocialPack(ctx, (done, total) => setPackProgress(Math.round((done / total) * 100)));
      downloadBlob(new Blob([zip.slice().buffer], { type: "application/zip" }), `${slugify(name)}-social.zip`);
      toast.success("Social pack ready");
    } catch {
      toast.error("Export failed in this browser.");
    } finally {
      setPackProgress(null);
    }
  }

  async function download() {
    if (!template) return;
    setBusy(true);
    try {
      const image = await rasterize(svg, scale);
      downloadBlob(new Blob([image.bytes.slice().buffer], { type: "image/png" }), file);
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
      <Button variant="outline" onClick={downloadAll} disabled={packProgress !== null}>
        {packProgress !== null ? <Loader2 className="animate-spin" /> : <FileArchive />}
        {packProgress !== null ? `Rendering ${packProgress}%` : `All ${socialTemplates.length} assets (ZIP)`}
      </Button>
      {meta ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Meta tags</Label>
            <CopyButton value={meta} label="Copy meta tags" toastMessage="Meta tags copied" />
          </div>
          <pre className="max-h-56 overflow-auto rounded-md border bg-surface-raised p-2.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {meta}
          </pre>
          <p className="text-[11px] text-subtle-foreground">Upload the PNG as og.png at your site root.</p>
        </div>
      ) : null}
    </>
  );
}
