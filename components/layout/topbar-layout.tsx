"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { cn } from "cn";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { appNav, isActiveHref } from "@/config/site";
import { LayoutToggle } from "./app-shell";
import { Logo } from "./logo";
import { UserNav } from "./user-nav";

// App shell with nav links in the header (slide-out menu on mobile).
export function TopbarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label="Open menu" className="md:hidden" />}
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>
                <Logo href="/dashboard" />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {appNav.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setMenuOpen(false)} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo href="/dashboard" />

        <nav className="hidden items-center gap-1 md:flex">
          {appNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <LayoutToggle />
          <ThemeToggle />
          <UserNav compact />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: (typeof appNav)[number];
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActiveHref(pathname, item.href);
  return (
    <Button
      variant="ghost"
      size="sm"
      nativeButton={false}
      render={<Link href={item.href} onClick={onNavigate} />}
      aria-current={active ? "page" : undefined}
      className={cn("justify-start", active && "bg-accent text-accent-foreground")}
    >
      <item.icon />
      {item.title}
    </Button>
  );
}
