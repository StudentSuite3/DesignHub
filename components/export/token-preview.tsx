"use client";

import { forwardRef, type CSSProperties } from "react";

import { useGoogleFonts } from "@/hooks/use-google-font";
import { readableTextColor, toHex } from "@/lib/color/color";
import { gradientCss } from "@/lib/color/gradient";
import { fontStack } from "@/lib/typography/css";
import type { DesignTokens } from "@/types/tokens";

type TokenPreviewProps = { tokens: DesignTokens };

/** A tiny UI kit rendered purely from the tokens, so exports can be judged before they ship. */
export const TokenPreview = forwardRef<HTMLDivElement, TokenPreviewProps>(function TokenPreview({ tokens }, ref) {
  useGoogleFonts([tokens.typography?.heading, tokens.typography?.body]);

  const role = (name: string) => tokens.semantic.find((item) => item.name === name)?.value;
  const primary = role("primary");
  const accent = role("accent");
  const foreground = role("foreground");
  const background = role("background");
  const radius = (name: string, fallback: number) => tokens.radius.find((item) => item.name === name)?.px ?? fallback;
  const space = (name: string, fallback: number) => tokens.spacing.find((item) => item.name === name)?.px ?? fallback;
  const size = (name: string, fallback: string) => {
    const step = tokens.typography?.steps.find((item) => item.name === name);
    return step ? `${step.maxPx}px` : fallback;
  };

  const t = tokens.typography;
  const headingStyle: CSSProperties = {
    fontFamily: t ? fontStack(t.heading.family, t.heading.category) : undefined,
    fontWeight: t?.rhythm.headingWeight ?? 600,
    lineHeight: t?.rhythm.headingLineHeight ?? 1.1,
    letterSpacing: t ? `${t.rhythm.headingTracking}em` : undefined,
  };
  const bodyStyle: CSSProperties = {
    fontFamily: t ? fontStack(t.body.family, t.body.category) : undefined,
    lineHeight: t?.rhythm.bodyLineHeight ?? 1.6,
    fontWeight: t?.rhythm.bodyWeight ?? 400,
  };

  const bg = background ? toHex(background) : "#ffffff";
  const fg = foreground ? toHex(foreground) : "#111111";
  const brand = primary ? toHex(primary) : "#6366f1";
  const onBrand = primary ? toHex(readableTextColor(primary)) : "#ffffff";

  return (
    <div
      ref={ref}
      className="flex flex-col overflow-hidden border"
      style={{ background: bg, color: fg, borderRadius: radius("xl", 16), ...bodyStyle }}
    >
      <div
        className="h-28"
        style={{ background: tokens.gradient ? gradientCss(tokens.gradient) : brand }}
        role="img"
        aria-label="Gradient token"
      />
      <div className="flex flex-col" style={{ padding: space("8", 32), gap: space("4", 16) }}>
        <p className="flex items-center gap-2" style={{ ...bodyStyle, fontSize: size("sm", "14px"), fontWeight: 600 }}>
          <span aria-hidden style={{ width: 8, height: 8, borderRadius: 999, background: brand }} />
          {tokens.meta.name}
        </p>
        <h3 style={{ ...headingStyle, fontSize: size("3xl", "40px") }}>Tokens, rendered.</h3>
        <p style={{ fontSize: size("base", "16px"), opacity: 0.75, maxWidth: "60ch" }}>
          Every value on this card comes from the tokens below: colors, fonts, the fluid scale, spacing and radii.
          Change anything in the studios and this updates instantly.
        </p>
        <div className="flex flex-wrap items-center" style={{ gap: space("2", 8) }}>
          <span
            style={{
              background: brand,
              color: onBrand,
              borderRadius: radius("md", 8),
              padding: `${space("2", 8)}px ${space("4", 16)}px`,
              fontSize: size("sm", "14px"),
              fontWeight: 600,
            }}
          >
            Primary action
          </span>
          <span
            style={{
              border: `1px solid ${fg}33`,
              borderRadius: radius("md", 8),
              padding: `${space("2", 8)}px ${space("4", 16)}px`,
              fontSize: size("sm", "14px"),
            }}
          >
            Secondary
          </span>
          {accent ? (
            <span
              style={{
                background: toHex(accent),
                color: toHex(readableTextColor(accent)),
                borderRadius: radius("full", 999),
                padding: `${space("1", 4)}px ${space("3", 12)}px`,
                fontSize: size("xs", "12px"),
                fontWeight: 600,
              }}
            >
              New
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap" style={{ gap: space("2", 8) }}>
          {tokens.colors.map((color) => (
            <span
              key={color.name}
              title={color.name}
              style={{ background: toHex(color.value), width: 40, height: 40, borderRadius: radius("md", 8) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
