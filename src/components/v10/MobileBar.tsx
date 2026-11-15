"use client";

import { useEffect, useState } from "react";
import { UI, type Lang } from "@/content/kurak";
import { PickedCount } from "./Header";
import s from "./Chrome.module.css";

/**
 * Нижняя панель на телефоне: «Обсудить задачу» под пальцем. Появляется после первого экрана
 * (там своя кнопка) и прячется, когда на экране сама заявка.
 */
export function MobileBar({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("v10-hero");
    const contact = document.getElementById("contact");
    if (!hero || !contact || !("IntersectionObserver" in window)) return;
    let heroIn = true;
    let contactIn = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroIn = e.isIntersecting;
        if (e.target === contact) contactIn = e.isIntersecting;
      }
      setShow(!heroIn && !contactIn);
    });
    io.observe(hero);
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.bar} data-show={show || undefined} aria-hidden={!show || undefined} inert={!show || undefined}>
      <a href="#contact" className={s.barCta}>
        {UI.discuss[lang]}
        <PickedCount lang={lang} />
      </a>
    </div>
  );
}
