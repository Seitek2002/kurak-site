"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { KurakLogo } from "@/components/brand/KurakLogo";
import { CATEGORIES, LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { V7 } from "@/content/v7";
import { openCategory, PickedCount } from "./Interactive";
import s from "./V7Header.module.css";

/**
 * Шапка как на референсе: слева знак, по центру плавающая серая таблетка меню, справа отдельная красная таблетка
 * «Обсудить задачу». «Услуги» раскрывают все восемь направлений. На узких экранах меню уходит в лист (dialog).
 */
export function V7Header({ lang }: { lang: Lang }) {
  const uid = useId();
  const [svcOpen, setSvcOpen] = useState(false);
  const svcRef = useRef<HTMLLIElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);

  const links = [
    { href: "#cases", label: UI.nav.cases[lang] },
    { href: "#otzyvy", label: UI.nav.reviews[lang] },
    { href: "#komanda", label: UI.nav.team[lang] },
    { href: "#voprosy", label: UI.nav.faq[lang] },
    { href: "#kontakty", label: UI.nav.contacts[lang] },
  ];

  useEffect(() => {
    if (!svcOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!svcRef.current?.contains(e.target as Node)) setSvcOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSvcOpen(false);
        svcRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [svcOpen]);

  const pickCategory = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setSvcOpen(false);
    sheetRef.current?.close();
    openCategory(id);
  };

  const closeSheet = () => sheetRef.current?.close();

  const langSwitch = (cls?: string) => (
    <nav aria-label={UI.langLabel[lang]} className={cls}>
      {LANGS.map((l) => (
        <Link
          key={l.id}
          href={variantPath(7, l.id)}
          hrefLang={l.id === "ky" ? "ky" : "ru"}
          lang={l.id === "ky" ? "ky" : "ru"}
          aria-current={l.id === lang ? "page" : undefined}
          className={s.langOpt}
          prefetch={false}
        >
          <span aria-hidden="true">{l.short}</span>
          <span className="visually-hidden">{l.full}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <header className={s.header}>
      <div className={s.row}>
        <Link href={variantPath(7, lang)} className={s.logo} aria-label={UI.toTop[lang]}>
          <KurakLogo className={s.logoSvg} />
        </Link>

        <nav aria-label={V7.nav.label[lang]} className={s.pill}>
          <ul className={s.pillList}>
            <li ref={svcRef} className={s.svcItem}>
              <button
                type="button"
                className={s.pillLink}
                aria-expanded={svcOpen}
                aria-controls={`${uid}-svc`}
                onClick={() => setSvcOpen((v) => !v)}
              >
                {UI.nav.services[lang]}
                <span className={s.caret} aria-hidden="true" />
              </button>
              <div id={`${uid}-svc`} className={s.dropdown} hidden={!svcOpen}>
                <ul className={s.dropList}>
                  {CATEGORIES.map((c) => (
                    <li key={c.id}>
                      <a href={`#usluga-${c.id}`} className={s.dropLink} onClick={(e) => pickCategory(e, c.id)}>
                        <span className={s.dropGoal}>{c.goal[lang]}</span>
                        <span className={s.dropShort}>{c.short[lang]}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className={s.dropFoot}>
                  <a href="#uslugi" className={s.dropMore} onClick={() => setSvcOpen(false)}>
                    {V7.nav.servicesAll[lang]}
                  </a>
                  <a href="#nabory" className={s.dropMore} onClick={() => setSvcOpen(false)}>
                    {V7.nav.bundles[lang]}
                  </a>
                </div>
              </div>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={s.pillLink}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.actions}>
          {langSwitch(s.lang)}
          <a href="#zayavka" className={`v7-btn ${s.cta}`}>
            {UI.discuss[lang]}
            <PickedCount className={s.count} label={V7.mobile.picked[lang]} />
          </a>
          <button type="button" className={s.burger} aria-haspopup="dialog" aria-controls={`${uid}-sheet`} onClick={() => sheetRef.current?.showModal()}>
            <span className={s.burgerLines} aria-hidden="true" />
            <span className="visually-hidden">{V7.nav.openMenu[lang]}</span>
          </button>
        </div>
      </div>

      <dialog id={`${uid}-sheet`} ref={sheetRef} className={s.sheet} aria-label={UI.menu[lang]} onClick={(e) => e.target === e.currentTarget && closeSheet()}>
        <div className={s.sheetInner}>
          <div className={s.sheetTop}>
            <KurakLogo className={s.sheetLogo} />
            <button type="button" className={s.close} onClick={closeSheet}>
              <span aria-hidden="true" className={s.closeX} />
              <span className="visually-hidden">{V7.nav.closeMenu[lang]}</span>
            </button>
          </div>
          <p className={s.sheetLabel}>{UI.nav.services[lang]}</p>
          <ul className={s.sheetCats}>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <a href={`#usluga-${c.id}`} className={s.sheetCat} onClick={(e) => pickCategory(e, c.id)}>
                  {c.goal[lang]}
                  <span>{c.short[lang]}</span>
                </a>
              </li>
            ))}
          </ul>
          <ul className={s.sheetLinks}>
            {[{ href: "#nabory", label: V7.nav.bundles[lang] }, ...links].map((l) => (
              <li key={l.href}>
                <a href={l.href} className={s.sheetLink} onClick={closeSheet}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={s.sheetFoot}>
            {langSwitch(s.lang)}
            <a href="#zayavka" className="v7-btn" onClick={closeSheet}>
              {UI.discuss[lang]}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
