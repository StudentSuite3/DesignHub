import type { A11yTypography } from "@/types/a11y";

export type Verdict = "pass" | "warn" | "fail";
export type ReadabilityCheck = { id: string; label: string; value: string; verdict: Verdict; guidance: string };

/** Heuristic English syllable count: vowel groups, minus a silent trailing "e". */
export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  if (clean.length <= 3) return 1;
  const groups = clean
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 1);
}

export type ReadingScore = { words: number; sentences: number; ease: number; grade: number; band: string };

/** Flesch Reading Ease and Flesch–Kincaid grade level. */
export function readingScore(text: string): ReadingScore {
  const words = text.match(/[A-Za-z’']+/g) ?? [];
  const sentences = Math.max(1, (text.match(/[.!?]+(\s|$)/g) ?? []).length);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const w = Math.max(1, words.length);
  const ease = 206.835 - 1.015 * (w / sentences) - 84.6 * (syllables / w);
  const grade = 0.39 * (w / sentences) + 11.8 * (syllables / w) - 15.59;
  const band =
    ease >= 80
      ? "Easy"
      : ease >= 60
        ? "Plain English"
        : ease >= 50
          ? "Fairly difficult"
          : ease >= 30
            ? "Difficult"
            : "Very difficult";
  return {
    words: words.length,
    sentences,
    ease: Math.round(ease),
    grade: Math.max(0, Math.round(grade * 10) / 10),
    band,
  };
}

/** Average glyph advance of the sample in the real font, via canvas. Falls back to 0.5em. */
export function averageCharWidth(typography: A11yTypography, sample: string): number {
  if (typeof document === "undefined") return typography.size * 0.5;
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return typography.size * 0.5;
  context.font = `${typography.weight} ${typography.size}px "${typography.family}", system-ui, sans-serif`;
  const text = sample.slice(0, 400) || "The quick brown fox jumps over the lazy dog";
  const letterSpacing = typography.letterSpacing * typography.size;
  return context.measureText(text).width / text.length + letterSpacing;
}

export function readabilityChecks(
  typography: A11yTypography,
  charsPerLine: number,
  score: ReadingScore,
): ReadabilityCheck[] {
  const { size, lineHeight, letterSpacing, wordSpacing } = typography;
  return [
    {
      id: "size",
      label: "Body font size",
      value: `${size}px`,
      verdict: size >= 16 ? "pass" : size >= 12 ? "warn" : "fail",
      guidance: "16px or more for body copy; never below 12px.",
    },
    {
      id: "line-height",
      label: "Line height",
      value: lineHeight.toFixed(2),
      verdict: lineHeight >= 1.5 ? "pass" : lineHeight >= 1.3 ? "warn" : "fail",
      guidance: "At least 1.5 for paragraphs (WCAG 1.4.12).",
    },
    {
      id: "measure",
      label: "Characters per line",
      value: `≈${Math.round(charsPerLine)}`,
      verdict:
        charsPerLine >= 45 && charsPerLine <= 75 ? "pass" : charsPerLine >= 35 && charsPerLine <= 90 ? "warn" : "fail",
      guidance: "45–75 characters is the comfortable range.",
    },
    {
      id: "spacing",
      label: "Letter / word spacing",
      value: `${letterSpacing}em / ${wordSpacing}em`,
      verdict: letterSpacing >= 0 && letterSpacing <= 0.12 && wordSpacing <= 0.16 ? "pass" : "warn",
      guidance: "Layouts must survive 0.12em letter and 0.16em word spacing (WCAG 1.4.12).",
    },
    {
      id: "reading-ease",
      label: "Reading ease",
      value: `${score.ease} · grade ${score.grade}`,
      verdict: score.ease >= 60 ? "pass" : score.ease >= 40 ? "warn" : "fail",
      guidance: `${score.band}. Aim for 60+ (plain English) for general audiences.`,
    },
  ];
}

/** Keeps first and last letters, shuffles the middle: a common simulation of reading with dyslexia. */
export function scrambleWord(word: string, random: () => number): string {
  if (word.length <= 3) return word;
  const middle = word.slice(1, -1).split("");
  for (let i = middle.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [middle[i], middle[j]] = [middle[j]!, middle[i]!];
  }
  return `${word[0]}${middle.join("")}${word[word.length - 1]}`;
}
