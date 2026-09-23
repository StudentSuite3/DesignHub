import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/home/fade-in";
import { HeroSearch } from "@/components/home/hero-search";
import { GithubIcon } from "@/components/layout/github-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const stats = [
  { value: "4", label: "studios" },
  { value: "200k+", label: "open source icons" },
  { value: "0", label: "accounts required" },
  { value: "100%", label: "runs in your browser" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pt-20 pb-16 text-center md:pt-28 md:pb-24">
        <FadeIn>
          <Badge variant="outline" className="h-7 gap-2 rounded-full px-3 text-xs">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            v{siteConfig.version} · MIT licensed · Local first
          </Badge>
        </FadeIn>
        <FadeIn delay={0.03} className="flex flex-col items-center gap-4">
          <h1 id="hero-title" className="max-w-4xl text-4xl leading-[1.05] font-medium sm:text-5xl md:text-7xl">
            Everything a designer needs.{" "}
            <span className="text-muted-foreground">Open source.</span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            {siteConfig.tagline} Typography, color, icons and design tokens — no login, no backend, works offline.
          </p>
        </FadeIn>
        <FadeIn delay={0.06} className="flex w-full flex-col items-center gap-4">
          <HeroSearch />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="lg">
              <Link href="/typography">
                Start designing <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={siteConfig.github} target="_blank" rel="noreferrer">
                <GithubIcon /> Star on GitHub
              </a>
            </Button>
          </div>
        </FadeIn>
        <FadeIn delay={0.09}>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5">
                <dt className="order-2 text-xs text-subtle-foreground">{stat.label}</dt>
                <dd className="order-1 font-display text-xl font-medium">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
