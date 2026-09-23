"use client";

import { ImageDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { downloadBlob } from "@/lib/download";
import { rasterize } from "@/lib/export/raster";
import type { GuidelineContext, GuidelinePage } from "@/lib/guidelines/types";
import { slugify } from "@/lib/logo/pack";

type Props = { ctx: GuidelineContext; page: GuidelinePage | undefined; svg: string };

export function GuidelineExportPanel({ ctx, page, svg }: Props) {
  const [busy, setBusy] = useState(false);

  async function downloadPage() {
    if (!page) return;
    setBusy(true);
    try {
      const image = await rasterize(svg, 2);
      downloadBlob(
        new Blob([image.bytes.slice().buffer], { type: "image/png" }),
        `${slugify(ctx.brand.name)}-guidelines-${page.id}.png`,
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
      <p className="text-xs text-muted-foreground">
        {ctx.contents.length} pages. Every page updates live from the brand.
      </p>
      <Button variant="outline" onClick={downloadPage} disabled={!svg || busy}>
        {busy ? <Loader2 className="animate-spin" /> : <ImageDown />} This page (PNG)
      </Button>
    </>
  );
}
