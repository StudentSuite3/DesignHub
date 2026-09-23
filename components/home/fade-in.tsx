import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * 200ms rise-in done in CSS so the landing page ships no animation runtime.
 * `prefers-reduced-motion` is handled globally in globals.css.
 */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const style: CSSProperties = { animationDelay: `${delay}s`, animationFillMode: "both" };
  return (
    <div className={cn("animate-rise", className)} style={style}>
      {children}
    </div>
  );
}
