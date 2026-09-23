import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { studios } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

const projectLinks = [
  { label: "GitHub", href: siteConfig.github },
  { label: "Roadmap", href: `${siteConfig.github}/blob/main/ROADMAP.md` },
  { label: "Changelog", href: `${siteConfig.github}/blob/main/CHANGELOG.md` },
  { label: "Contributing", href: `${siteConfig.github}/blob/main/CONTRIBUTING.md` },
  { label: "Security", href: `${siteConfig.github}/blob/main/SECURITY.md` },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Studios" className="flex flex-col gap-2 text-sm">
          <h2 className="font-sans text-xs font-medium text-subtle-foreground">Studios</h2>
          {studios.map((studio) => (
            <Link key={studio.id} href={studio.href} className="w-fit text-muted-foreground hover:text-foreground">
              {studio.title}
            </Link>
          ))}
        </nav>
        <nav aria-label="Project" className="flex flex-col gap-2 text-sm">
          <h2 className="font-sans text-xs font-medium text-subtle-foreground">Project</h2>
          {projectLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="w-fit text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-subtle-foreground">
          © {new Date().getFullYear()} DesignHub contributors · Released under the MIT License · Made for designers, by
          designers.
        </p>
      </div>
    </footer>
  );
}
