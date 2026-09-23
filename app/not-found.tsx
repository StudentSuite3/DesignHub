import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell>
      <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center">
        <p className="font-mono text-sm text-subtle-foreground">404</p>
        <h1 className="text-3xl font-medium">This page isn’t in the toolkit.</h1>
        <p className="text-muted-foreground">Press ⌘K to search, or head back home.</p>
        <Button asChild>
          <Link href="/">Back to DesignHub</Link>
        </Button>
      </section>
      <SiteFooter />
    </AppShell>
  );
}
