"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, MOTION } from "./motion";

/**
 * Где лежит каждый лоскут до шитья: россыпь на столе. Слот, над которым он лежит (перемешано),
 * сдвиг по вертикали в единицах знака (высота 93) и поворот.
 */
const PILE: [number, number, number][] = [
  [3, -34, -18], [6, 30, 14], [0, 26, 22], [5, -30, -12],
  [1, -26, 16], [7, -38, -24], [2, 34, -10], [4, 32, 20],
];
const STRIP = 443 / 8;

/**
 * Сцена лоскутной истории. Разметка серверная (Story.tsx), здесь только движение:
 * закрепляем сцену на время прокрутки, лоскуты встают в полосу, из полосы проступает знак,
 * в списке подсвечивается текущее направление. Всё созданное в matchMedia откатывается само.
 */
export function StoryScene({ target }: { target: string }) {
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    let mm: gsap.MatchMedia | null = null;

    const start = () => {
      mm = gsap.matchMedia(el);
      mm.add(MOTION, () => {
        el.dataset.live = "true";
        const goals = Array.from(el.querySelectorAll<HTMLElement>("[data-goal-i]"));
        const strips = Array.from(el.querySelectorAll<SVGRectElement>("[data-strip]"));
        const placed = Array.from(el.querySelectorAll<SVGRectElement>("[data-placed]"));
        let active = -2;
        const mark = (n: number) => {
          if (n === active) return;
          active = n;
          goals.forEach((g, i) => {
            g.toggleAttribute("data-on", i <= n);
            g.toggleAttribute("data-current", i === n);
          });
        };
        mark(-1);

        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
            pin: el.querySelector<HTMLElement>("[data-stage]"),
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // восемь лоскутов занимают первые ~80 % прокрутки
              const n = Math.min(7, Math.floor((self.progress / 0.8) * 8.4) - 1);
              mark(n);
            },
          },
        });

        // сначала лоскуты лежат россыпью, потом по одному встают в полосу
        strips.forEach((r, i) => {
          const [slot, y, rot] = PILE[i]!;
          const at = 0.3 + i * 0.9;
          tl.from(r, { x: (slot - i) * STRIP, y, rotation: rot, scale: 0.6, transformOrigin: "50% 50%", ease: "power2.inOut" }, at);
          // долетел: пришитая копия встаёт поверх россыпи
          tl.fromTo(placed[i]!, { opacity: 0 }, { opacity: 1, duration: 0.01, ease: "none" }, at + 1);
        });
        const done = 0.3 + 7 * 0.9 + 1;
        tl.fromTo(el.querySelector("[data-sign]"), { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.inOut" }, done);
        tl.fromTo(el.querySelector("[data-ghost]"), { opacity: 1 }, { opacity: 0, duration: 1, ease: "power2.inOut" }, done);
        tl.from(el.querySelector("[data-finale]"), { y: 24, opacity: 0, duration: 0.8 }, done + 0.6);
        tl.to({}, { duration: 0.6 });

        return () => {
          delete el.dataset.live;
          goals.forEach((g) => {
            g.removeAttribute("data-on");
            g.removeAttribute("data-current");
          });
        };
      });
      window.setTimeout(() => ScrollTrigger.refresh(), 60);
    };

    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const id = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 200);
    const onFonts = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(onFonts).catch(() => {});
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
      mm?.revert();
    };
  }, [target]);

  return null;
}
