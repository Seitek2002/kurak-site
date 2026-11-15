"use client";

import { useEffect, useRef } from "react";
import s from "./V9.module.css";

/**
 * Переход на скролле: из центра растёт кремовый эллипс и заливает экран, открывая светлую секцию.
 * Высоту и липкую сцену включает CSS (html.js и без «уменьшить движение»), скрипт только пишет прогресс в --p.
 * Без скрипта --p = 1: секция просто кремовая.
 */
export function Reveal({ children, id, labelledBy }: { children: React.ReactNode; id?: string; labelledBy?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let active = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (active && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      active = !!e?.isIntersecting;
      update();
    });
    io.observe(el);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} id={id} className={s.reveal} aria-labelledby={labelledBy}>
      <div className={s.revealStage}>
        <div className={s.ellipse} aria-hidden="true" />
        <div className={s.revealContent}>{children}</div>
      </div>
    </section>
  );
}
