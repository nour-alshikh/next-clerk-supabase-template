import Link from "next/link";
import { cn } from "cn";
import { siteConfig } from "@/config/site";

// Swap the mark for the project's logo.
export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
        {siteConfig.name.charAt(0)}
      </span>
      <span className="truncate group-data-[collapsible=icon]:hidden">{siteConfig.name}</span>
    </Link>
  );
}
