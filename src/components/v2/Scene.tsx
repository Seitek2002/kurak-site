"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { SCENES, type SceneName } from "@/lib/scenes";

let refreshTimer = 0;
/** Сцены создаются в разное время: после всех один раз сортируем точки и пересчитываем */
function scheduleRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 120);
}

/**
 * Островок анимации: сама разметка секции серверная, сюда приходит только id.
 * Сцена подключается, когда браузер освободится после загрузки: первая отрисовка не ждёт GSAP.
 */
export function Scene({ target, scene }: { target: string; scene: SceneName }) {
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    let mm: gsap.MatchMedia | null = null;
    let off: void | (() => void);
    const start = () => {
      mm = gsap.matchMedia(el);
      off = SCENES[scene](el, mm);
      scheduleRefresh();
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const id = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 200);
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
      off?.();
      mm?.revert();
    };
  }, [target, scene]);

  return null;
}
