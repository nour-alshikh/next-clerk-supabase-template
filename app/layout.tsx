import type { Metadata } from "next";
import { Geist_Mono, Rubik } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
// Fail fast with a clear message if .env.local is missing or wrong
import "@/lib/env";
import "@/lib/env.server";
import "./globals.css";

// Brand font from the design tokens
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Clerk's shadcn theme reads our CSS variables, so sign-in matches the brand
    <ClerkProvider appearance={{ theme: shadcn }}>
      <html
        lang="en"
        className={`${rubik.variable} ${geistMono.variable} h-full antialiased`}
        // next-themes sets the theme class before hydration
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
