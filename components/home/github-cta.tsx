import { ArrowRight } from "lucide-react";

import { GithubIcon } from "@/components/layout/github-icon";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function GithubCta() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="flex flex-col items-start gap-8 rounded-2xl border bg-card p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 id="cta-title" className="text-2xl font-medium md:text-3xl">
            Built in the open. Shaped by designers.
          </h2>
          <p className="text-muted-foreground">
            DesignHub is community driven. Star the repo, open an issue, or ship the next studio on the roadmap.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="lg">
            <a href={siteConfig.github} target="_blank" rel="noreferrer">
              <GithubIcon /> Star on GitHub
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={`${siteConfig.github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
              Contribute <ArrowRight />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
