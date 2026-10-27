"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: React.ReactNode;
  as?: "div" | "section" | "article" | "header" | "footer" | "li" | "span";
  className?: string;
  /** Start offset in px. Negative = from above. */
  y?: number;
  x?: number;
  delay?: number;
  duration?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** Replay when scrolling back up past it. */
  repeat?: boolean;
};

// Fades/slides its content in when it scrolls into view.
export function Reveal({
  children,
  as = "div",
  className,
  y = 24,
  x = 0,
  delay = 0,
  duration = 0.7,
  immediate = false,
  repeat = false,
}: RevealProps) {
  // Typed as div for simplicity; the ref works the same for any tag
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      // Lift the CSS pre-hide (globals.css) before GSAP records end values
      el.dataset.ready = "";
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(el, {
          autoAlpha: 0,
          y,
          x,
          delay,
          duration,
          ease: "power2.out",
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: el,
                start: "top 85%",
                toggleActions: repeat ? "play none none reverse" : "play none none none",
              },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
