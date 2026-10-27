"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type StaggerProps = {
  children: React.ReactNode;
  as?: "div" | "ul" | "ol" | "section";
  className?: string;
  y?: number;
  /** Seconds between each child. */
  stagger?: number;
  duration?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
};

// Animates its direct children in one after another, once.
// Children added later (e.g. a new list item) appear without animation.
export function Stagger({
  children,
  as = "div",
  className,
  y = 16,
  stagger = 0.08,
  duration = 0.5,
  immediate = false,
}: StaggerProps) {
  // Typed as div for simplicity; the ref works the same for any tag
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      el.dataset.ready = "";
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(el.children, {
          autoAlpha: 0,
          y,
          stagger,
          duration,
          ease: "power2.out",
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-stagger="">
      {children}
    </Tag>
  );
}
