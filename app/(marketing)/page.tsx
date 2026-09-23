import { Features } from "@/components/home/features";
import { GithubCta } from "@/components/home/github-cta";
import { Hero } from "@/components/home/hero";
import { ModuleCards } from "@/components/home/module-cards";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ModuleCards />
      <Features />
      <GithubCta />
    </>
  );
}
