"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/** 200ms rise-in. Respects reduced motion. */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay, ease: [0.25, 1, 0.5, 1] }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
