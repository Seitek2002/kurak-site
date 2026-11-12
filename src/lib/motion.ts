"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Анимации включаются только если человек не просил уменьшить движение */
export const MOTION = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

type Lenisish = { scrollTo: (t: number | string | HTMLElement, o?: Record<string, unknown>) => void; stop: () => void; start: () => void };

export function getLenis(): Lenisish | null {
  return (window as unknown as { __lenis?: Lenisish }).__lenis ?? null;
}

/** Плавно (или мгновенно без Lenis) прокрутить окно к позиции */
export function scrollToY(y: number, immediate = false) {
  const l = getLenis();
  if (l) l.scrollTo(y, { immediate, force: true });
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}

/**
 * Обёртка над gsap.matchMedia: всё, что создано в setup, откатывается при размонтировании
 * и при смене медиа-запроса (поворот экрана, включение «уменьшить движение»).
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia, el: HTMLElement) => void,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    setup(mm, el);
    // шрифты и картинки меняют высоты: пересчитываем точки после загрузки
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
