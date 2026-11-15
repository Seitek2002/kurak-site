"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION } from "@/lib/motion";
import { htmlLang, type Lang } from "@/content/kurak";
import { useV11 } from "./store";
import s from "./V11.module.css";

/**
 * Корень страницы варианта 11: стиль доски (data-board) и плавная прокрутка Lenis.
 * Серверные секции приходят детьми. При «уменьшить движение» Lenis не включается.
 */
export function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const board = useV11((st) => st.board);

  useEffect(() => {
    void useV11.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!window.matchMedia(MOTION).matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return (
    <div className={s.root} data-board={board} lang={htmlLang(lang)}>
      {children}
    </div>
  );
}
