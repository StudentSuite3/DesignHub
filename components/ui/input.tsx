import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-subtle-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
