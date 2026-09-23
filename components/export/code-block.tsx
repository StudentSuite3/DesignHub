"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { downloadText } from "@/lib/download";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  filename?: string;
  className?: string;
  maxHeight?: string;
};

export function CodeBlock({ code, filename, className, maxHeight = "28rem" }: CodeBlockProps) {
  return (
    <figure className={cn("flex min-w-0 flex-col overflow-hidden rounded-lg border bg-surface", className)}>
      <figcaption className="flex h-10 items-center justify-between gap-2 border-b px-3">
        <span className="truncate font-mono text-xs text-muted-foreground">{filename ?? "snippet"}</span>
        <span className="flex items-center gap-1">
          {filename ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label={`Download ${filename}`}
              onClick={() => downloadText(code, filename)}
            >
              <Download />
            </Button>
          ) : null}
          <CopyButton value={code} label="Copy code" className="size-7" toastMessage="Code copied" />
        </span>
      </figcaption>
      <pre
        tabIndex={0}
        aria-label={filename ? `${filename} contents` : "Code"}
        className="overflow-auto p-4 font-mono text-[12.5px] leading-relaxed scrollbar-thin"
        style={{ maxHeight }}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
