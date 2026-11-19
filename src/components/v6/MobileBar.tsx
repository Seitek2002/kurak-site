"use client";

import { useEffect, useState } from "react";
import { UI, type Lang } from "@/content/kurak";
import { V6_UI } from "@/content/v6";
import { useSelection } from "@/store/selection";
import s from "./V6.module.css";

/**
 * Телефон: главная кнопка внизу, под большим пальцем. Появляется только после того,
 * как кнопка первого экрана ушла вверх за край, и прячется, когда на экране сама заявка.
 * Положение проверяется на прокрутке (пассивно, раз в кадр): переход по якорю тоже учитывается.
 * Без скрипта панель видна всегда: это обычная ссылка на #zayavka.
 */
export function MobileBar({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked.length);
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("v6-hero-cta");
    const form = document.getElementById("zayavka");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const h = window.innerHeight;
      const heroPassed = hero ? hero.getBoundingClientRect().bottom < 0 : true;
      const f = form?.getBoundingClientRect();
      const formSeen = f ? f.top < h * 0.8 && f.bottom > 0 : false;
      setShow(heroPassed && !formSeen);
      setReady(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const away = ready && !show;
  return (
    <div className={s.mobileBar} data-away={away || undefined} data-ready={ready || undefined}>
      <a href="#zayavka" className={`v6-btn ${s.mobileCta}`} tabIndex={away ? -1 : undefined} aria-hidden={away || undefined}>
        {UI.apply[lang]}
        {picked > 0 && (
          <span className={s.mobileCount}>
            <span className="visually-hidden">, {V6_UI.inRequest[lang]}: </span>
            {picked}
          </span>
        )}
      </a>
    </div>
  );
}
