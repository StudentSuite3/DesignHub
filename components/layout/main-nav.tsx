"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { studios } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={cn("hidden items-center gap-1 md:flex", className)}>
      {studios.map((studio) => {
        const active = pathname.startsWith(studio.href);
        return (
          <Link
            key={studio.id}
            href={studio.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground",
              active && "text-foreground",
            )}
          >
            {studio.title.replace(" Studio", "").replace(" Engine", "")}
          </Link>
        );
      })}
    </nav>
  );
}
