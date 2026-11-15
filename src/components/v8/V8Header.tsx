"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { KurakLogo } from "@/components/brand/KurakLogo";
import { LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { V8 } from "@/content/v8";
import { useSelection } from "@/store/selection";
import { useV8 } from "./ui";
import { IconBag, IconMenu } from "./Icons";
import s from "./V8Header.module.css";

/**
 * Шапка как у Додо: логотип, разделы, язык и таблетка корзины «Заявка | 3» цвета акцента.
 * «Обсудить задачу» всегда в шапке (на телефоне — в меню разделов и в плавающей кнопке внизу).
 */
export function V8Header({ lang }: { lang: Lang }) {
  const count = useSelection((st) => st.picked.length);
  const bump = useV8((st) => st.bump);
  const openCart = useV8((st) => st.openCart);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    { href: "#menu", label: V8.nav.menu[lang] },
    { href: "#about", label: V8.nav.about[lang] },
    { href: "#team", label: V8.nav.team[lang] },
    { href: "#cases", label: V8.nav.cases[lang] },
    { href: "#contacts", label: V8.nav.contacts[lang] },
  ];
  const closeMenu = () => menuRef.current?.removeAttribute("open");
  const cartLabel = count > 0 ? `${V8.cart.label[lang]}: ${count}` : V8.cart.label[lang];

  return (
    <header className={s.header} data-scrolled={scrolled || undefined}>
      <div className={`v8-wrap ${s.row}`}>
        <Link href={variantPath(8, lang)} className={s.logo} aria-label={V8.homeLabel[lang]}>
          <KurakLogo className={s.logoSvg} />
        </Link>

        <nav aria-label={V8.nav.label[lang]} className={s.nav}>
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={s.navLink}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.actions}>
          <nav aria-label={UI.langLabel[lang]} className={s.lang}>
            {LANGS.map((l) => (
              <Link
                key={l.id}
                href={variantPath(8, l.id)}
                hrefLang={l.id === "ky" ? "ky" : "ru"}
                lang={l.id === "ky" ? "ky" : "ru"}
                className={s.langOpt}
                aria-current={l.id === lang ? "page" : undefined}
                title={l.full}
                prefetch={false}
              >
                {l.short}
              </Link>
            ))}
          </nav>

          <a href="#zayavka" className={`v8-btn v8-btn--grey ${s.discuss}`}>
            {UI.discuss[lang]}
          </a>

          <button type="button" className={`v8-btn v8-btn--primary ${s.cart}`} onClick={() => openCart("list")} aria-haspopup="dialog" aria-label={cartLabel}>
            <IconBag />
            <span>{V8.cart.label[lang]}</span>
            {count > 0 ? (
              <>
                <span className={s.sep} aria-hidden="true" />
                <span key={bump} className={s.count} aria-hidden="true">
                  {count}
                </span>
              </>
            ) : null}
          </button>

          <details className={s.more} ref={menuRef}>
            <summary className={s.moreBtn} aria-label={V8.nav.open[lang]}>
              <IconMenu />
            </summary>
            <div className={s.sheet}>
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className={s.sheetLink} onClick={closeMenu}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#zayavka" className="v8-btn v8-btn--primary v8-btn--block" onClick={closeMenu}>
                {UI.discuss[lang]}
              </a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
