"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { V13_NAV, V13_UI, servicesCount } from "@/content/v13";
import { useSelection } from "@/store/selection";
import { KurakLogo } from "../brand/KurakLogo";
import { IconClose, IconMenu } from "./Icons";
import { Patch } from "./Patch";
import s from "./Header.module.css";

/** Липкая шапка: знак, разделы, язык, «Ваш курак» и главная кнопка «Оставить заявку» на любом экране. */
export function Header({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const n = picked.length;
  return (
    <header className={s.header} data-solid={solid || undefined} data-open={open || undefined}>
      <div className={`v13-container ${s.row}`}>
        <Link href={variantPath(13, lang)} className={s.logo} aria-label={V13_UI.home[lang]}>
          <KurakLogo className={s.mark} />
        </Link>

        <nav aria-label={V13_UI.sections[lang]} className={s.nav} id="v13-nav">
          <ul className={s.navList}>
            {V13_NAV.map((i) => (
              <li key={i.href}>
                <a href={i.href} className={s.link} onClick={() => setOpen(false)}>
                  {i.label[lang]}
                </a>
              </li>
            ))}
          </ul>
          <ul className={s.langs} aria-label={UI.langLabel[lang]}>
            {LANGS.map((l) => (
              <li key={l.id}>
                <Link
                  href={variantPath(13, l.id)}
                  className={s.lang}
                  aria-current={l.id === lang ? "page" : undefined}
                  lang={l.id === "ky" ? "ky" : "ru"}
                  aria-label={l.full}
                >
                  {l.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.actions}>
          <a href="#zayavka" className={s.quilt} aria-label={`${V13_UI.quiltLink[lang]}: ${servicesCount(n, lang)}`}>
            <Patch kind={n > 0 ? "smm" : "plan"} className={s.quiltPatch} />
            <span className={s.quiltLabel} aria-hidden="true">
              {V13_UI.quiltLink[lang]}
            </span>
            <span className={s.quiltCount} aria-hidden="true">
              {n}
            </span>
          </a>
          <a href="#zayavka" className={`v13-btn ${s.cta}`}>
            {UI.apply[lang]}
          </a>
          <button
            type="button"
            className={s.burger}
            aria-expanded={open}
            aria-controls="v13-nav"
            aria-label={open ? V13_UI.menuClose[lang] : V13_UI.menuOpen[lang]}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
