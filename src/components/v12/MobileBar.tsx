"use client";

import { useEffect, useState } from "react";
import { UI, type Lang } from "@/content/kurak";
import { PickedCount } from "./Header";
import s from "./V12.module.css";

/** Телефон: «Обсудить задачу» всегда под пальцем. Прячется, когда на экране уже блок заявки. */
export function MobileBar({ lang }: { lang: Lang }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHidden(!!e?.isIntersecting), { rootMargin: "0px 0px -30% 0px" });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.mbar} data-hidden={hidden || undefined}>
      <a href="#contact" className={`${s.btn} ${s.mbarBtn}`} tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined}>
        {UI.discuss[lang]}
        <PickedCount lang={lang} />
      </a>
    </div>
  );
}
