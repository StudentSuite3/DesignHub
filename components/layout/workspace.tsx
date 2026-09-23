import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Content container for studio pages: 8px rhythm, generous max width. */
export function Workspace({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-8 md:px-8", className)}>
      {children}
    </div>
  );
}
