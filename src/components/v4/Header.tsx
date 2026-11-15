"use client";

import { useEffect, useId, useRef, useState } from "react";
import { KurakLogo } from "@/components/brand/KurakLogo";
import { UI, type Lang } from "@/content/kurak";
import { V4 } from "@/content/v4";
import { LangSwitch } from "./LangSwitch";
import { MiniPoster } from "./Poster";
import s from "./V4.module.css";

const LINKS = [
  { href: "#services", key: "services" },
  { href: "#cases", key: "cases" },
  { href: "#team", key: "team" },
  { href: "#how", key: "process" },
] as const;

/**
 * Шапка: знак, четыре ссылки, Рус/Кыр, мини-курак и «Обсудить задачу».
 * На телефоне ссылки уходят в меню, а главная кнопка живёт в нижней панели.
 */
export function Header({ lang }: { lang: Lang }) {
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
      <div className={`v4-wrap ${s.headerIn}`}>
        <a href="#main" className={s.brand} aria-label={V4.home[lang]}>
          <KurakLogo />
        </a>
        <nav className={s.nav} aria-label={UI.menu[lang]}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={s.navLink}>
              {UI.nav[l.key][lang]}
            </a>
          ))}
        </nav>
        <div className={s.headerEnd}>
          <LangSwitch lang={lang} compact />
          <MiniPoster lang={lang} className={s.headerMini} />
          <a href="#brief" className={`v4-btn v4-btn--sm ${s.headerCta}`}>
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
            <span className={s.menuIcon} aria-hidden="true" />
            <span className={s.menuLabel}>{open ? UI.close[lang] : UI.menu[lang]}</span>
          </button>
        </div>
      </div>
      <nav id={panelId} className={s.menuPanel} hidden={!open} aria-label={UI.menu[lang]}>
        <ul className="v4-wrap">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={s.menuLink} onClick={() => setOpen(false)}>
                {UI.nav[l.key][lang]}
              </a>
            </li>
          ))}
          <li>
            <a href="#contacts" className={s.menuLink} onClick={() => setOpen(false)}>
              {UI.nav.contacts[lang]}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
