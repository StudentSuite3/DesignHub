"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home } from "lucide-react";

import { GithubIcon } from "@/components/layout/github-icon";

import { Kbd } from "@/components/ui/kbd";
import { studios } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  onNavigate?: () => void;
};

const itemClass =
  "group flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground";

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Studios" className="flex h-full flex-col gap-6 p-3">
      <div className="flex flex-col gap-0.5">
        <Link
          href="/"
          onClick={onNavigate}
          aria-current={pathname === "/" ? "page" : undefined}
          className={cn(itemClass, pathname === "/" && "bg-accent text-foreground")}
        >
          <Home className="size-4" aria-hidden />
          Home
        </Link>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-subtle-foreground">
          Studios
        </p>
        {studios.map((studio) => {
          const active = pathname.startsWith(studio.href);
          const Icon = studio.icon;
          return (
            <Link
              key={studio.id}
              href={studio.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(itemClass, active && "bg-accent text-foreground")}
            >
              <Icon className={cn("size-4", active && "text-brand")} aria-hidden />
              <span className="flex-1 truncate">{studio.title.replace(" Studio", "")}</span>
              <span className="hidden items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 lg:flex">
                <Kbd>G</Kbd>
                <Kbd>{studio.shortcut.toUpperCase()}</Kbd>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-0.5">
        <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-subtle-foreground">
          Resources
        </p>
        <a href={siteConfig.github} target="_blank" rel="noreferrer" className={itemClass}>
          <GithubIcon />
          GitHub
        </a>
        <a href={`${siteConfig.github}/blob/main/ROADMAP.md`} target="_blank" rel="noreferrer" className={itemClass}>
          <BookOpen className="size-4" aria-hidden />
          Roadmap
        </a>
        <p className="px-2 pt-3 text-[11px] text-subtle-foreground">v{siteConfig.version} · MIT</p>
      </div>
    </nav>
  );
}
