"use client";

import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "@/lib/utils";

function ResizableGroup({ className, ...props }: React.ComponentProps<typeof Group>) {
  return <Group data-slot="resizable-group" className={cn("flex", className)} {...props} />;
}

const ResizablePanel = Panel;

function ResizableHandle({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "group relative flex w-2 shrink-0 items-center justify-center outline-none",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border after:transition-colors after:duration-150",
        "hover:after:bg-border-strong focus-visible:after:w-0.5 focus-visible:after:bg-ring data-[separator=active]:after:bg-brand",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="z-10 h-8 w-1 rounded-full bg-border-strong opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </Separator>
  );
}

export { ResizableGroup, ResizablePanel, ResizableHandle };
