"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { useMemo } from "react";

import { SwatchColumn } from "@/components/colors/swatch-column";
import { paletteNames } from "@/lib/color/names";
import { useColorStore } from "@/store/color-store";

export function PaletteStrip() {
  const swatches = useColorStore((state) => state.swatches);
  const selectedId = useColorStore((state) => state.selectedId);
  const names = useMemo(() => paletteNames(swatches.map((swatch) => swatch.color)), [swatches]);
  const activeId = selectedId ?? swatches[0]?.id;

  return (
    <ul
      aria-label="Palette"
      className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border md:h-[min(56vh,560px)] md:flex-row"
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <AnimatePresence initial={false}>
            {swatches.map((swatch, index) => (
              <SwatchColumn
                key={swatch.id}
                swatch={swatch}
                name={names[index] ?? "color"}
                index={index}
                total={swatches.length}
                selected={swatch.id === activeId}
              />
            ))}
          </AnimatePresence>
        </MotionConfig>
      </LazyMotion>
    </ul>
  );
}
