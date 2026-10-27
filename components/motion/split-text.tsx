"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText as GsapSplitText, useGSAP } from "@/lib/gsap";

type SplitTextProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** Animate per word, line or character. */
  by?: "words" | "lines" | "chars";
  stagger?: number;
  duration?: number;
  delay?: number;
};

// Headline that slides in word by word (or line/char) from behind a mask.
export function SplitText({
  children,
  as = "h1",
  className,
  by = "words",
  stagger = 0.06,
  duration = 0.8,
  delay = 0,
}: SplitTextProps) {
  // Typed as div for simplicity; the ref works the same for any tag
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      el.dataset.ready = "";
      gsap.matchMedia().add(MOTION_OK, () => {
        GsapSplitText.create(el, {
          type: by,
          mask: by,
          // Re-splits when fonts load or the width changes
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self[by], {
              yPercent: 110,
              autoAlpha: 0,
              stagger,
              duration,
              delay,
              ease: "power3.out",
            }),
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-split="">
      {children}
    </Tag>
  );
}
