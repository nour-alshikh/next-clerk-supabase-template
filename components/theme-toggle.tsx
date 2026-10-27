"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Switches light/dark with a circle that grows out of the button
// (View Transitions API; the animation itself is CSS in globals.css).
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    // Circle origin = button center; radius = distance to the farthest corner
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-r", `${r}px`);

    document.startViewTransition(() => {
      // Apply the class synchronously so the "new" snapshot has the new theme;
      // next-themes then persists the choice.
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.style.colorScheme = next;
      setTheme(next);
    });
  }

  return (
    <Button variant="ghost" size="icon-sm" aria-label="Toggle theme" onClick={toggle}>
      {/* Icons switch via CSS so server and client markup match */}
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </Button>
  );
}
