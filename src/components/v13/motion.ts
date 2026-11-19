"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Анимации включаются, только если человек не просил уменьшить движение */
export const MOTION = "(prefers-reduced-motion: no-preference)";

type Lenisish = { scrollTo: (t: number | string | HTMLElement, o?: Record<string, unknown>) => void; stop: () => void; start: () => void };

export function getLenis(): Lenisish | null {
  return (window as unknown as { __v13lenis?: Lenisish }).__v13lenis ?? null;
}

/** Прокрутить к секции: плавно через Lenis, без него родным скроллом (или сразу, если просили меньше движения) */
export function scrollToId(id: string, focusId?: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const l = getLenis();
  if (l && !reduce) l.scrollTo(el, { offset: -88 });
  else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
}
