import { LayoutDashboardIcon, NotebookPenIcon, SettingsIcon, type LucideIcon } from "lucide-react";

export type AppLayout = "sidebar" | "topbar";

/** Cookie that remembers the user's layout choice (header toggle). */
export const APP_LAYOUT_COOKIE = "app-layout";

/** How a module's "Create" button works: a side drawer, or a separate /new page. */
export type CreateMode = "drawer" | "page";

export const siteConfig = {
  name: "Next Template",
  description: "Next.js template",
  /** Default signed-in layout: "sidebar" (collapsible side menu) or "topbar" (links in the header). Users can switch from the header. */
  appLayout: "sidebar" as AppLayout,
};

export type NavItem = { title: string; href: string; icon: LucideIcon };

// Links for the signed-in area; used by both layouts. Add a module's page here.
export const appNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Notes", href: "/notes", icon: NotebookPenIcon },
  { title: "Settings", href: "/settings", icon: SettingsIcon },
];

export function isActiveHref(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
