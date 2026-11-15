"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { KurakLogo } from "@/components/brand/KurakLogo";
import { LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { V6_N, V6_NAV, V6_UI } from "@/content/v6";
import { useSelection } from "@/store/selection";
import { IconClose, IconMenu } from "./Icons";
import s from "./V6.module.css";

/**
 * Шапка: знак, разделы, язык и одна кнопка «Обсудить задачу», закреплена сверху.
 * Уже 75rem разделы уходят в меню; на телефоне главная кнопка живёт в нижней панели (MobileBar).
 */
export function V6Header({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked.length);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={s.header}>
      <div className={`container ${s.headRow}`}>
        <Link href={variantPath(V6_N, lang)} className={s.logo} aria-label={V6_UI.home[lang]}>
          <KurakLogo className={s.logoSvg} />
        </Link>

        <nav aria-label={V6_UI.sections[lang]} className={s.nav}>
          <ul>
            {V6_NAV.map((x) => (
              <li key={x.href}>
                <a href={x.href} className={s.navLink}>
                  {x.label[lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.headEnd}>
          <LangSwitch lang={lang} />
          {picked > 0 && (
            <a href="#zayavka" className={s.headPicked}>
              {V6_UI.inRequest[lang]}: <span className="v6-num">{picked}</span>
            </a>
          )}
          <a href="#zayavka" className={`v6-btn v6-btn--s ${s.headCta}`}>
            {UI.discuss[lang]}
          </a>
          <button
            ref={btnRef}
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
            <span>{open ? UI.close[lang] : V6_UI.menu[lang]}</span>
          </button>
        </div>
      </div>

      <div id={panelId} className={s.menuPanel} hidden={!open}>
        <nav aria-label={V6_UI.sections[lang]} className="container">
          <ul>
            {V6_NAV.map((x) => (
              <li key={x.href}>
                <a href={x.href} className={s.menuLink} onClick={() => setOpen(false)}>
                  {x.label[lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

/** Рус / Кыр: ссылки на пару страницы этого варианта */
export function LangSwitch({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <nav aria-label={UI.langLabel[lang]} className={[s.lang, className].filter(Boolean).join(" ")}>
      {LANGS.map((l) => (
        <Link
          key={l.id}
          href={variantPath(V6_N, l.id)}
          prefetch={false}
          hrefLang={l.id === "ky" ? "ky" : "ru"}
          lang={l.id === "ky" ? "ky" : "ru"}
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
