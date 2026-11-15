"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KurakLogo } from "../brand/KurakLogo";
import { LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { V5 } from "@/content/v5";
import { useSelection } from "@/store/selection";
import { IconClose, IconMenu } from "./Geometry";
import { SECTIONS } from "./data";
import s from "./V5.module.css";

/** Переключатель Рус / Кыр: ведёт на пару этой же страницы */
export function LangSwitch({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <nav aria-label={UI.langLabel[lang]} className={[s.lang, className].filter(Boolean).join(" ")}>
      {LANGS.map((l) => (
        <Link
          key={l.id}
          href={variantPath(5, l.id)}
          hrefLang={l.id === "ky" ? "ky" : "ru"}
          lang={l.id === "ky" ? "ky" : "ru"}
          prefetch={false}
          className={s.langOpt}
          aria-current={l.id === lang ? "page" : undefined}
          title={l.full}
        >
          {l.short}
        </Link>
      ))}
    </nav>
  );
}

/** Шапка: войлочная полоса, знак, пять разделов, язык и одна красная кнопка с числом услуг в заявке */
export function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const count = useSelection((st) => st.picked.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`${s.header} v5-felt`}>
      <div className={`container ${s.headerRow}`}>
        <Link href={variantPath(5, lang)} className={s.logo} aria-label={V5.home[lang]}>
          <KurakLogo className={s.logoSvg} />
        </Link>
        <nav id="v5-nav" aria-label={V5.nav.label[lang]} className={s.nav} data-open={open || undefined}>
          <ul className={s.navList}>
            {SECTIONS.map((x) => (
              <li key={x.href}>
                <a href={x.href} className={s.navLink} onClick={() => setOpen(false)}>
                  {V5.nav[x.key][lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.headEnd}>
          <LangSwitch lang={lang} />
          <a href="#zayavka" className={`v5-btn ${s.headCta}`}>
            {UI.discuss[lang]}
            {count > 0 && (
              <span className={s.count}>
                <span className="visually-hidden">{V5.nav.picked[lang]}: </span>
                {count}
              </span>
            )}
          </a>
          <button
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="v5-nav"
            aria-label={open ? V5.nav.menuClose[lang] : V5.nav.menuOpen[lang]}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}

/** Нижняя панель на телефоне: главная кнопка всегда под пальцем, прячется у формы заявки */
export function MobileBar({ lang }: { lang: Lang }) {
  const count = useSelection((st) => st.picked.length);
  // Пока видна кнопка первого экрана или форма, панель не нужна: одна красная кнопка на экране
  const [seen, setSeen] = useState({ hero: true, form: false });
  const hidden = seen.hero || seen.form;

  useEffect(() => {
    const hero = document.getElementById("v5-hero-cta");
    const form = document.getElementById("zayavka");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        setSeen((prev) => {
          const next = { ...prev };
          for (const e of entries) {
            if (e.target === hero) next.hero = e.isIntersecting;
            if (e.target === form) next.form = e.isIntersecting;
          }
          return next;
        }),
      { rootMargin: "0px 0px -20% 0px" },
    );
    if (hero) io.observe(hero);
    if (form) io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${s.mobileBar} v5-felt`} data-hidden={hidden || undefined} aria-hidden={hidden || undefined}>
      <a href="#zayavka" className={`v5-btn ${s.mobileCta}`} tabIndex={hidden ? -1 : undefined}>
        {UI.discuss[lang]}
        {count > 0 && (
          <span className={s.count}>
            <span className="visually-hidden">{V5.nav.picked[lang]}: </span>
            {count}
          </span>
        )}
      </a>
    </div>
  );
}
