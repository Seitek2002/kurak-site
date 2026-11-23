"use client";

import { useEffect, useState } from "react";
import { UI, type Lang } from "@/content/kurak";
import { PickedCount } from "./Header";
import s from "./V9.module.css";

/**
 * Телефон: главная кнопка внизу экрана. Прячется, пока на экране кнопка заявки первого экрана
 * (иначе две одинаковые кнопки рядом) или уже сама форма заявки.
 */
export function MobileBar({ lang }: { lang: Lang }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const els = ["v9-hero-cta", "form"].map((id) => document.getElementById(id)).filter((x): x is HTMLElement => !!x);
    // Без IntersectionObserver панель не показываем: заявка остаётся в первом экране и в меню
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting);
        setHidden([...seen.values()].some(Boolean));
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.mbar} data-hidden={hidden || undefined}>
      <a href="#form" className={`${s.btn} ${s.btnRed} ${s.mbarBtn}`} tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined}>
        {UI.apply[lang]}
        <PickedCount lang={lang} />
      </a>
    </div>
  );
}
