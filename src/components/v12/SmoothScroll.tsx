"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION } from "@/lib/motion";

/**
 * Плавный скролл Lenis, синхронизированный с ScrollTrigger (история вести на первом экране идёт от прокрутки).
 * При «уменьшить движение» не включается: остаётся родной скролл.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MOTION).matches) return;
    const hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--v12-hdr")) || 68;
    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: -(hdr + 12) },
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
