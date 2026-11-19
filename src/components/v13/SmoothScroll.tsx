"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION } from "./motion";

/**
 * Плавная прокрутка Lenis, синхронизированная с ScrollTrigger (как в варианте 2).
 * При «уменьшить движение» не включается: остаётся родной скролл браузера.
 * На сенсорных экранах Lenis не перехватывает палец, прокрутка остаётся родной.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MOTION).matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -88 } });
    (window as unknown as { __v13lenis?: Lenis }).__v13lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("v13-lenis");
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __v13lenis?: Lenis }).__v13lenis;
      document.documentElement.classList.remove("v13-lenis");
    };
  }, []);
  return null;
}
