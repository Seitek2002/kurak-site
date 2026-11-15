"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { SECTIONS, V9 } from "@/content/v9";
import { useSelection } from "@/store/selection";
import { KMark } from "./Shape";
import s from "./V9.module.css";

export function LangSwitch({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <nav aria-label={UI.langLabel[lang]} className={[s.lang, className].filter(Boolean).join(" ")}>
      {LANGS.map((l) => (
        <Link
          key={l.id}
          href={variantPath(9, l.id)}
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
      <span className="visually-hidden">, {V9.inRequest[lang]}: </span>
      {n}
    </span>
  );
}

/**
 * Шапка как у референса: слева знак K (фиксирован), по центру таблетка-анонс, справа меню капсом.
 * При скролле анонс и меню уходят, остаются знак, «Обсудить задачу» и кнопка «Меню».
 */
export function Header({ lang }: { lang: Lang }) {
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 120);
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

  const closeMenu = () => {
    menuRef.current?.close();
  };

  return (
    <header className={s.header} data-scrolled={scrolled || undefined}>
      <div className={s.headRow}>
        <Link href={variantPath(9, lang)} className={s.mark} aria-label={UI.toTop[lang]}>
          <KMark className={s.markSvg} />
        </Link>

        <p className={`${s.announce} ${s.fade}`}>
          <span className={s.dot} aria-hidden="true" />
          {V9.announce[lang]}
        </p>

        <div className={s.headRight}>
          <nav aria-label={V9.navLabel[lang]} className={`${s.nav} ${s.fade}`}>
            <ul>
              {SECTIONS.map((x) => (
                <li key={x.key}>
                  <a href={x.href} className={s.navLink}>
                    {V9.nav[x.key][lang]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <LangSwitch lang={lang} className={s.fade} />
          <a href="#form" className={`${s.btn} ${s.btnS} ${s.headCta}`}>
            {UI.discuss[lang]}
            <PickedCount lang={lang} />
          </a>
          <button
            ref={openerRef}
            type="button"
            className={`${s.btn} ${s.btnS} ${s.menuBtn}`}
            aria-haspopup="dialog"
            onClick={() => menuRef.current?.showModal()}
          >
            {UI.menu[lang]}
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
            <span className={s.menuMark}>
              <KMark className={s.markSvg} />
            </span>
            <button type="button" className={`${s.btn} ${s.btnS}`} onClick={closeMenu}>
              {UI.close[lang]}
            </button>
          </div>
          <nav aria-label={V9.navLabel[lang]}>
            <ul className={s.menuLinks}>
              {SECTIONS.map((x) => (
                <li key={x.key}>
                  <a href={x.href} className={s.menuLink} onClick={closeMenu}>
                    {V9.nav[x.key][lang]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.menuFoot}>
            <LangSwitch lang={lang} />
            <a href="#form" className={`${s.btn} ${s.btnRed}`} onClick={closeMenu}>
              {UI.discuss[lang]}
              <PickedCount lang={lang} />
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
