"use client";

import { useEffect, useState } from "react";
import { UI, type Lang } from "@/content/kurak";
import { PickedCount } from "./Header";
import s from "./V9.module.css";

/** Телефон: главная кнопка внизу экрана. Прячется, когда на экране уже форма заявки. */
export function MobileBar({ lang }: { lang: Lang }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const form = document.getElementById("form");
    if (!form || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHidden(!!e?.isIntersecting), { rootMargin: "0px 0px -20% 0px" });
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.mbar} data-hidden={hidden || undefined}>
      <a href="#form" className={`${s.btn} ${s.btnRed} ${s.mbarBtn}`} tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined}>
        {UI.discuss[lang]}
        <PickedCount lang={lang} />
      </a>
    </div>
  );
}
