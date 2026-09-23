"use client";

import { useMemo } from "react";

import { useDrawContext } from "@/hooks/use-draw-context";
import { resolveSocialContent } from "@/lib/social/content";
import type { SocialContext } from "@/lib/social/types";
import { useSocialStore } from "@/store/social-store";

export function useSocialContext(): SocialContext {
  const mode = useSocialStore((state) => state.mode);
  const content = useSocialStore((state) => state.content);
  const draw = useDrawContext(mode);
  return useMemo(() => ({ ...draw, content: resolveSocialContent(content, draw.brand) }), [draw, content]);
}
