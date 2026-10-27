import { Suspense } from "react";
import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/app-shell";
import { APP_LAYOUT_COOKIE, siteConfig, type AppLayout } from "@/config/site";

// Signed-in shell: sidebar or top bar. Users switch with the header button
// (saved in a cookie); siteConfig.appLayout is the default.
// Auth is checked in each page with requireUser(), not here.
export default function SignedInLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  const saved = (await cookies()).get(APP_LAYOUT_COOKIE)?.value;
  const layout: AppLayout = saved === "sidebar" || saved === "topbar" ? saved : siteConfig.appLayout;
  return <AppShell initialLayout={layout}>{children}</AppShell>;
}
