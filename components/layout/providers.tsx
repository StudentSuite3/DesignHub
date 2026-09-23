"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import { CommandPalette } from "@/components/layout/command-palette";
import { ShortcutsDialog } from "@/components/layout/shortcuts-dialog";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        {children}
        <CommandPalette />
        <ShortcutsDialog />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
