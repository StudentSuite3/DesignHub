"use client";

import { useEffect, useMemo, useState } from "react";

import { useDrawContext } from "@/hooks/use-draw-context";
import { useVariantContext } from "@/hooks/use-variant-context";
import { guidelinePages } from "@/lib/guidelines/registry";
import type { GuidelineContext, GuidelinePage } from "@/lib/guidelines/types";
import { useBrandStore } from "@/store/brand-store";
import { useGuidelinesStore } from "@/store/guidelines-store";
import { useLogoStore } from "@/store/logo-store";

export function useGuidelineContext(): { ctx: GuidelineContext; pages: GuidelinePage[] } {
  const mode = useGuidelinesStore((state) => state.mode);
  const excluded = useGuidelinesStore((state) => state.excluded);
  const voice = useBrandStore((state) => state.profile.voice);
  const clearSpace = useLogoStore((state) => state.clearSpace);
  const draw = useDrawContext(mode);
  const logo = useVariantContext();
  // Set after mount so server and client render the same markup.
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }));
  }, []);

  return useMemo(() => {
    const pages = guidelinePages.filter((page) => !excluded.includes(page.id));
    const contents = pages.map((page, i) => ({ id: page.id, title: page.title, number: i + 1 }));
    return { ctx: { ...draw, voice, logo, clearSpace, date, contents }, pages };
  }, [draw, voice, logo, clearSpace, date, excluded]);
}
