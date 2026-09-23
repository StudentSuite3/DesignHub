"use client";

import { useMemo } from "react";

import { useDrawContext } from "@/hooks/use-draw-context";
import { brandDomain } from "@/lib/brand/domain";
import type { MockupContext } from "@/lib/mockups/types";
import { useMockupStore } from "@/store/mockup-store";

/** The live brand, surface colors, copy and embedded fonts every mockup is drawn from. */
export function useMockupContext(): MockupContext {
  const mode = useMockupStore((state) => state.mode);
  const content = useMockupStore((state) => state.content);
  const draw = useDrawContext(mode);

  return useMemo(() => {
    const { brand } = draw;
    const domain = brandDomain(brand.name);
    const first = content.person.split(" ")[0]?.toLowerCase() || "hello";
    const resolved = {
      ...content,
      website: content.website || domain,
      email: content.email || `${first}@${domain}`,
      headline: content.headline || brand.description || brand.name,
    };
    return { ...draw, content: resolved };
  }, [draw, content]);
}
