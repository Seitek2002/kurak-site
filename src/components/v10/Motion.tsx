"use client";

import { useEffect } from "react";
import { gsap, MOTION, ScrollTrigger } from "@/lib/motion";

/**
 * Движение на прокрутке, каждое со смыслом:
 * - нити мастеров опускаются от бруса к портретам: человек «держит» свою нить;
 * - нити принципов натягиваются поперёк стеблей: правило связывает направления.
 * Без JS и при «уменьшить движение» всё сразу на месте.
 */
export function Motion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const team = document.querySelector<HTMLElement>("[data-v10-team]");
      if (team) {
        gsap.fromTo(
          team.querySelectorAll("[data-v10-thread]"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", stagger: 0.08, scrollTrigger: { trigger: team, start: "top 85%", end: "top 35%", scrub: 0.6 } },
        );
      }
      document.querySelectorAll<HTMLElement>("[data-v10-cord]").forEach((cord) => {
        gsap.fromTo(
          cord,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: cord, start: "top 92%", end: "top 55%", scrub: 0.6 } },
        );
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => mm.revert();
  }, []);
  return null;
}
