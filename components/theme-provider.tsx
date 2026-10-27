"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Adds .dark / .light to <html>; dark is the brand default.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
