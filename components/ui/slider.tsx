"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** Paint the track (e.g. a color gradient). Hides the filled range. */
  trackStyle?: React.CSSProperties;
};

function Slider({
  className,
  trackStyle,
  defaultValue,
  value,
  min = 0,
  max = 100,
  "aria-label": ariaLabel,
  ...props
}: SliderProps) {
  const values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50", className)}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative w-full grow overflow-hidden rounded-full bg-muted",
          trackStyle ? "h-3 ring-1 ring-border ring-inset" : "h-1",
        )}
        style={trackStyle}
      >
        {trackStyle ? null : <SliderPrimitive.Range className="absolute h-full bg-foreground/70" />}
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          // Radix puts role="slider" on the thumb, so that's where the accessible name must live.
          aria-label={ariaLabel}
          className="block size-3.5 shrink-0 rounded-full border-2 border-background bg-foreground ring-1 ring-border-strong shadow-sm transition-[box-shadow] duration-150 hover:ring-4 hover:ring-ring/30 focus-visible:ring-4 focus-visible:ring-ring/50 focus-visible:outline-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
