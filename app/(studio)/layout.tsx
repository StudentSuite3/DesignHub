import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { LazyProjectAutosave } from "@/components/projects/lazy-autosave";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell withSidebar>
      <LazyProjectAutosave />
      {children}
    </AppShell>
  );
}
