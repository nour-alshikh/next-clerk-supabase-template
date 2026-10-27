"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Hero({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-animate]", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      });
    },
    { scope: container },
  );

  return (
    <div ref={container} className="flex flex-col items-center gap-4 text-center">
      {children}
    </div>
  );
}
