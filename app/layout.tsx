import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Providers } from "@/components/layout/providers";
import { inter, spaceGrotesk } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, spaceGrotesk.variable)}>
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
