"use client";

import { FileText, ImageDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { downloadBlob } from "@/lib/download";
import { imagesToPdf } from "@/lib/export/pdf";
import { rasterize } from "@/lib/export/raster";
import { slugify } from "@/lib/logo/pack";
import { svgDimensions } from "@/lib/svg-size";
import { useMockupStore } from "@/store/mockup-store";

type Props = { svg: string; name: string; label: string };

export function MockupExportPanel({ svg, name, label }: Props) {
  const scale = useMockupStore((state) => state.scale);
  const setScale = useMockupStore((state) => state.setScale);
  const [busy, setBusy] = useState<"png" | "pdf" | null>(null);
  const { width, height } = svgDimensions(svg);
  const file = `${slugify(name)}-${slugify(label)}`;

  async function run(kind: "png" | "pdf") {
    setBusy(kind);
    try {
      const image = await rasterize(svg, scale);
      if (kind === "png")
        downloadBlob(new Blob([image.bytes.slice().buffer], { type: "image/png" }), `${file}@${scale}x.png`);
      else {
        const pdf = await imagesToPdf([{ image }], { title: `${name} ${label}`, scale });
        downloadBlob(new Blob([pdf.slice().buffer], { type: "application/pdf" }), `${file}.pdf`);
      }
      toast.success("Download ready");
    } catch {
      toast.error("Export failed in this browser.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <h2 className="text-sm font-medium">Export</h2>
      <div className="flex flex-col gap-2">
        <Label>Resolution</Label>
        <ToggleGroup
          type="single"
          value={String(scale)}
          onValueChange={(value) => value && setScale(Number(value))}
          aria-label="Export resolution"
          className="w-full"
        >
          {[1, 2, 3, 4].map((value) => (
            <ToggleGroupItem key={value} value={String(value)} className="flex-1 font-mono">
              {value}×
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="font-mono text-[11px] text-subtle-foreground">
          {Math.round(width * scale)} × {Math.round(height * scale)} px
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => run("png")} disabled={!svg || busy !== null}>
          {busy === "png" ? <Loader2 className="animate-spin" /> : <ImageDown />} PNG
        </Button>
        <Button variant="outline" onClick={() => run("pdf")} disabled={!svg || busy !== null}>
          {busy === "pdf" ? <Loader2 className="animate-spin" /> : <FileText />} PDF
        </Button>
      </div>
    </>
  );
}
