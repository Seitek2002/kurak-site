"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION } from "@/lib/motion";
import { useSelection } from "@/store/selection";

/**
 * Плавный скролл Lenis, синхронизированный с ScrollTrigger.
 * При «уменьшить движение» не включается: остаётся родной скролл браузера.
 */
export function SmoothScroll() {
  const drawerOpen = useSelection((s) => s.drawerOpen);

  useEffect(() => {
    if (!window.matchMedia(MOTION).matches) return;
    const lenis = new Lenis({
      lerp: 0.09,
      anchors: { offset: -88 },
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

  // пока открыта подборка, страница под ней не едет
  useEffect(() => {
    const l = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (!l) return;
    if (drawerOpen) l.stop();
    else l.start();
  }, [drawerOpen]);

  return null;
}
