"use client";

import dynamic from "next/dynamic";

/** Loaded after hydration so the stores it watches never delay first paint. */
export const LazyProjectAutosave = dynamic(
  () => import("@/components/projects/project-autosave").then((m) => m.ProjectAutosave),
  { ssr: false },
);
