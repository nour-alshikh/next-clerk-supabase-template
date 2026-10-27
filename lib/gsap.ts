"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register plugins once; import gsap/useGSAP from here instead of from "gsap".
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Animations only run when this matches; reduced-motion users see content as-is.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
