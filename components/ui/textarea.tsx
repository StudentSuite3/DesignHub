import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
