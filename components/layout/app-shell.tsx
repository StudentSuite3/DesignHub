import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";

type AppShellProps = {
  sidebar?: ReactNode;
  headerLeading?: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
};

/**
 * Two-row shell: sticky header on top, optional sidebar + scrollable main below.
 * On small screens the sidebar collapses and the main column takes the full width.
 */
export function AppShell({ sidebar, headerLeading, headerActions, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader leading={headerLeading}>{headerActions}</SiteHeader>
      <div className="flex flex-1">
        {sidebar ? (
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 border-r lg:block">
            {sidebar}
          </aside>
        ) : null}
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
