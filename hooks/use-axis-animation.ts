"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CYCLE_MS = 4000;

/**
 * Sweeps a value back and forth between `min` and `max` using requestAnimationFrame.
 * Stops automatically on unmount or when `stop` is called.
 */
export function useAxisAnimation(onFrame: (value: number) => void) {
  const [playing, setPlaying] = useState<string | null>(null);
  const frame = useRef<number | null>(null);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  const stop = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setPlaying(null);
  }, []);

  const play = useCallback(
    (id: string, min: number, max: number) => {
      stop();
      const start = performance.now();
      setPlaying(id);
      const tick = (now: number) => {
        const phase = ((now - start) % CYCLE_MS) / CYCLE_MS;
        // Ease in-out sine wave from min → max → min.
        const eased = (1 - Math.cos(phase * Math.PI * 2)) / 2;
        onFrameRef.current(Math.round((min + (max - min) * eased) * 100) / 100);
        frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [stop],
  );

  useEffect(() => stop, [stop]);

  return { playing, play, stop };
}
