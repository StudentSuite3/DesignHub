import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { SiteFooter } from "@/components/layout/site-footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      {children}
      <SiteFooter />
    </AppShell>
  );
}
