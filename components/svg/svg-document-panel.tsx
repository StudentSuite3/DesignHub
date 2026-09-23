"use client";

import { FileCode2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { byteLength, formatBytes } from "@/lib/svg-size";
import { useSvgStore } from "@/store/svg-store";

export function SvgDocumentPanel() {
  const name = useSvgStore((state) => state.name);
  const source = useSvgStore((state) => state.source);
  const loadSample = useSvgStore((state) => state.loadSample);

  return (
    <Panel
      title="Document"
      actions={
        <Button variant="ghost" size="icon" aria-label="Load sample SVG" title="Load sample SVG" onClick={loadSample}>
          <RotateCcw />
        </Button>
      }
    >
      <div className="flex items-center gap-2 rounded-md border bg-surface px-3 py-2">
        <FileCode2 className="size-4 text-brand" aria-hidden />
        <span className="min-w-0 flex-1 truncate font-mono text-xs">{name}</span>
        <span className="font-mono text-[11px] text-subtle-foreground">{formatBytes(byteLength(source))}</span>
      </div>
    </Panel>
  );
}
