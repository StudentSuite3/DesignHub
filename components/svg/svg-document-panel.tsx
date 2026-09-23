"use client";

import { ClipboardPaste, FileCode2, RotateCcw, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { readSvgFile } from "@/lib/svg/read-file";
import { byteLength, formatBytes } from "@/lib/svg-size";
import { useSvgStore } from "@/store/svg-store";

export function SvgDocumentPanel() {
  const name = useSvgStore((state) => state.name);
  const source = useSvgStore((state) => state.source);
  const setDocument = useSvgStore((state) => state.setDocument);
  const setSource = useSvgStore((state) => state.setSource);
  const loadSample = useSvgStore((state) => state.loadSample);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    try {
      setDocument(file.name, await readSvgFile(file));
      toast.success(`Loaded ${file.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that file.");
    }
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.includes("<svg")) throw new Error("The clipboard doesn't contain SVG markup.");
      setDocument("pasted.svg", text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Clipboard unavailable.");
    }
  }

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
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Upload /> Upload
        </Button>
        <Button variant="outline" size="sm" onClick={paste}>
          <ClipboardPaste /> Paste
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="sr-only"
        tabIndex={-1}
        aria-label="SVG file"
        onChange={(event) => {
          void upload(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <label htmlFor="svg-source" className="text-xs font-medium text-muted-foreground">
        Source
      </label>
      <Textarea
        id="svg-source"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        spellCheck={false}
        className="min-h-48 font-mono text-[11px] leading-relaxed scrollbar-thin"
      />
      <p className="text-[11px] text-subtle-foreground">Or drop an .svg file onto the preview.</p>
    </Panel>
  );
}
