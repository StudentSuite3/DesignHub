"use client";

import { fontStack } from "@/lib/typography/css";
import type { FontFamily } from "@/types/typography";

type PairPreviewProps = {
  heading: FontFamily | undefined;
  body: FontFamily | undefined;
  headingName: string;
  bodyName: string;
};

/** Editorial article layout that shows how two fonts work together. */
export function PairPreview({ heading, body, headingName, bodyName }: PairPreviewProps) {
  const headingStyle = { fontFamily: fontStack(headingName, heading?.category) };
  const bodyStyle = { fontFamily: fontStack(bodyName, body?.category) };

  return (
    <article className="flex flex-col gap-6 rounded-lg border bg-card p-6 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand" style={bodyStyle}>
        Field notes · Issue 04
      </p>
      <h2 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl" style={headingStyle}>
        Good typography is invisible until it isn’t.
      </h2>
      <div className="grid gap-6 md:grid-cols-2" style={bodyStyle}>
        <p className="text-lg leading-relaxed text-foreground">
          Type sets the tone before a single word is read. A confident headline paired with a patient, readable text
          face gives every page a clear voice and a comfortable rhythm.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Contrast is the secret. Pair a serif with a sans, a wide face with a narrow one, or a display font with a
          quiet workhorse. Keep the x-heights close and the moods complementary.
        </p>
      </div>
      <footer className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
        <span>
          Heading <strong className="font-medium text-foreground">{headingName}</strong>
        </span>
        <span>
          Body <strong className="font-medium text-foreground">{bodyName}</strong>
        </span>
      </footer>
    </article>
  );
}
