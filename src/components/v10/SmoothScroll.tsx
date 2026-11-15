"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION } from "@/lib/motion";

/**
 * Плавная прокрутка Lenis, синхронизированная с ScrollTrigger. Якоря (#services, #contact) Lenis
 * докручивает сам с отступом под шапку. При «уменьшить движение» не включается.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MOTION).matches) return;
    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: -72 },
      prevent: (node) => node.closest("dialog") !== null,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("has-lenis");
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      document.documentElement.classList.remove("has-lenis");
    };
  }, []);
  return null;
}
