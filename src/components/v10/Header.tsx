"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { KurakLogo } from "@/components/brand/KurakLogo";
import { LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { SECTIONS, V10 } from "@/content/v10";
import { useSelection } from "@/store/selection";
import { StyleSwitch } from "./StyleSwitch";
import s from "./Chrome.module.css";

export function LangSwitch({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <nav aria-label={UI.langLabel[lang]} className={[s.lang, className].filter(Boolean).join(" ")}>
      {LANGS.map((l) => (
        <Link
          key={l.id}
          href={variantPath(10, l.id)}
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

/** Счётчик услуг в заявке. До подъёма подборки из localStorage picked = [], поэтому SSR и первый рендер совпадают. */
export function PickedCount({ lang }: { lang: Lang }) {
  const n = useSelection((st) => st.picked.length);
  if (!n) return null;
  return (
    <span className={s.count}>
      <span className="visually-hidden">, {V10.inRequest[lang]}: </span>
      {n}
    </span>
  );
}

const NAV_LABEL = {
  services: UI.nav.services,
  cases: UI.nav.cases,
  team: UI.nav.team,
  contacts: UI.nav.contacts,
} as const;

/** Шапка: знак KURAK, разделы, язык, «Обсудить задачу» всегда на виду. На телефоне разделы в меню. */
export function Header({ lang }: { lang: Lang }) {
  const [solid, setSolid] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setSolid(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const closeMenu = () => menuRef.current?.close();

  return (
    <header className={s.header} data-solid={solid || undefined}>
      <div className={s.headRow}>
        <Link href={variantPath(10, lang)} className={s.logo} aria-label={UI.toTop[lang]}>
          <KurakLogo className={s.logoSvg} />
        </Link>

        <nav aria-label={V10.navLabel[lang]} className={s.nav}>
          <ul>
            {SECTIONS.map((x) => (
              <li key={x.key}>
                <a href={x.href} className={s.navLink}>
                  {NAV_LABEL[x.key][lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.headEnd}>
          <LangSwitch lang={lang} className={s.headLang} />
          <a href="#contact" className={s.headCta}>
            {UI.discuss[lang]}
            <PickedCount lang={lang} />
          </a>
          <button
            ref={openerRef}
            type="button"
            className={s.menuBtn}
            aria-haspopup="dialog"
            onClick={() => menuRef.current?.showModal()}
          >
            <span className={s.menuIcon} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="visually-hidden">{UI.menu[lang]}</span>
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        className={s.menu}
        aria-label={UI.menu[lang]}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
        onClose={() => openerRef.current?.focus()}
      >
        <div className={s.menuInner}>
          <div className={s.menuTop}>
            <KurakLogo className={s.logoSvg} />
            <button type="button" className={s.menuClose} onClick={closeMenu}>
              {UI.close[lang]}
            </button>
          </div>
          <nav aria-label={V10.navLabel[lang]}>
            <ul className={s.menuLinks}>
              {SECTIONS.map((x, i) => (
                <li key={x.key} style={{ "--w": `var(--v10-w${i * 2 + 1})` } as React.CSSProperties}>
                  <a href={x.href} className={s.menuLink} onClick={closeMenu}>
                    {NAV_LABEL[x.key][lang]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <StyleSwitch lang={lang} className={s.menuStyle} />
          <div className={s.menuFoot}>
            <LangSwitch lang={lang} />
            <a href="#contact" className={s.menuCta} onClick={closeMenu}>
              {UI.discuss[lang]}
              <PickedCount lang={lang} />
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
