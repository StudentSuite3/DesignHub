"use client";

import { useEffect, useState } from "react";

import { scrambleWord } from "@/lib/a11y/readability";

const INTERVAL = 900;

/** Re-shuffles the inside of some words on an interval. Static when the user prefers reduced motion. */
export function ScrambledText({ text }: { text: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), INTERVAL);
    return () => window.clearInterval(timer);
  }, []);

  const words = text.split(/(\s+)/);
  let seed = tick * 9973 + 17;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return (
    <span aria-label={text}>
      <span aria-hidden>
        {words.map((word) => (/\s/.test(word) || random() > 0.45 ? word : scrambleWord(word, random))).join("")}
      </span>
    </span>
  );
}
