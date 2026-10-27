"use client";

import { createContext, use, useState } from "react";
import { PanelLeftIcon, PanelTopIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_LAYOUT_COOKIE, type AppLayout } from "@/config/site";
import { SidebarLayout } from "./sidebar-layout";
import { TopbarLayout } from "./topbar-layout";

const AppLayoutContext = createContext<{ layout: AppLayout; setLayout: (layout: AppLayout) => void } | null>(
  null,
);

// Renders the sidebar or top bar shell. The choice is saved in a cookie so the
// server renders the same shell on the next visit (no flash).
export function AppShell({ initialLayout, children }: { initialLayout: AppLayout; children: React.ReactNode }) {
  const [layout, setLayoutState] = useState(initialLayout);

  function setLayout(next: AppLayout) {
    document.cookie = `${APP_LAYOUT_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setLayoutState(next);
  }

  const Shell = layout === "sidebar" ? SidebarLayout : TopbarLayout;
  return (
    <AppLayoutContext value={{ layout, setLayout }}>
      <Shell>{children}</Shell>
    </AppLayoutContext>
  );
}

// Header button that switches between the two shells.
export function LayoutToggle() {
  const ctx = use(AppLayoutContext);
  if (!ctx) return null;

  const next: AppLayout = ctx.layout === "sidebar" ? "topbar" : "sidebar";
  const label = next === "sidebar" ? "Switch to sidebar layout" : "Switch to top bar layout";
  const Icon = next === "sidebar" ? PanelLeftIcon : PanelTopIcon;

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={label} onClick={() => ctx.setLayout(next)} />}
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
