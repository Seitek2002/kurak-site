"use client";

import { useEffect, useState } from "react";
import { UI, type Lang } from "@/content/kurak";
import { MiniPoster } from "./Poster";
import s from "./V4.module.css";

/**
 * Нижняя панель на телефоне: мини-курак и «Обсудить задачу» с любого экрана.
 * Прячется, пока видна кнопка первого экрана или сама заявка: там кнопка уже есть.
 */
export function MobileBar({ lang }: { lang: Lang }) {
  const [seen, setSeen] = useState({ hero: false, brief: false });
  // Плавный уход включается после первого замера, чтобы панель не уезжала на глазах при загрузке
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const watch = (el: Element | null, key: "hero" | "brief", margin: string) => {
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => setSeen((x) => ({ ...x, [key]: !!e?.isIntersecting })), { rootMargin: margin });
      io.observe(el);
      return io;
    };
    const obs = [
      watch(document.querySelector("main section a.v4-btn"), "hero", "0px"),
      watch(document.getElementById("brief"), "brief", "0px 0px -30% 0px"),
    ];
    const t = window.setTimeout(() => setReady(true), 300);
    return () => {
      window.clearTimeout(t);
      obs.forEach((o) => o?.disconnect());
    };
  }, []);

  const away = seen.hero || seen.brief;
  return (
    <div className={s.mbar} data-away={away || undefined} data-ready={ready || undefined} inert={away}>
      <MiniPoster lang={lang} className={s.mbarMini} />
      <a href="#brief" className={`v4-btn ${s.mbarCta}`}>
        {UI.discuss[lang]}
      </a>
    </div>
  );
}
