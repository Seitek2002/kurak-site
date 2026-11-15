"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { V12 } from "@/content/v12";
import { KurakLogo, KURAK_TAGLINE } from "@/components/brand/KurakLogo";
import { useSelection } from "@/store/selection";
import s from "./V12.module.css";

export function LangSwitch({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <nav aria-label={UI.langLabel[lang]} className={[s.lang, className].filter(Boolean).join(" ")}>
      {LANGS.map((l) => (
        <Link
          key={l.id}
          href={variantPath(12, l.id)}
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

/** Сколько услуг в заявке. До подъёма подборки из localStorage picked = [], поэтому SSR и первый рендер совпадают */
export function PickedCount({ lang }: { lang: Lang }) {
  const n = useSelection((st) => st.picked.length);
  const last = useSelection((st) => st.lastAdded);
  if (!n) return null;
  return (
    <span className={s.count1} key={last ?? "n"}>
      <span className="visually-hidden">, {V12.inRequest[lang]}: </span>
      {n}
    </span>
  );
}

/** Шапка: знак KURAK, четыре раздела, язык и главная кнопка. На телефоне разделы в диалоге «Меню». */
export function Header({ lang }: { lang: Lang }) {
  const menuRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = menuRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <header className={s.header}>
      <div className={s.headRow}>
        <Link href={variantPath(12, lang)} className={s.brand} aria-label={UI.toTop[lang]}>
          <KurakLogo className={s.brandLogo} />
          <span className={s.brandTag} aria-hidden="true">
            {KURAK_TAGLINE}
          </span>
        </Link>

        <nav aria-label={V12.navLabel[lang]} className={s.nav}>
          <ul>
            {V12.nav.map((x) => (
              <li key={x.href}>
                <a href={x.href} className={s.navLink}>
                  {x.label[lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.headRight}>
          <LangSwitch lang={lang} className={s.headLang} />
          <a href="#contact" className={`${s.btn} ${s.btnS} ${s.headCta}`}>
            {UI.discuss[lang]}
            <PickedCount lang={lang} />
          </a>
          <button ref={openerRef} type="button" className={`${s.btn} ${s.btnS} ${s.btnGhost} ${s.menuBtn}`} aria-haspopup="dialog" onClick={() => setOpen(true)}>
            {UI.menu[lang]}
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        className={s.menu}
        aria-label={UI.menu[lang]}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
          openerRef.current?.focus();
        }}
      >
        <div className={s.menuInner}>
          <div className={s.menuTop}>
            <KurakLogo className={s.brandLogo} />
            <button type="button" className={`${s.btn} ${s.btnS} ${s.btnGhost}`} onClick={() => setOpen(false)}>
              {UI.close[lang]}
            </button>
          </div>
          <nav aria-label={V12.navLabel[lang]}>
            <ul className={s.menuLinks}>
              {V12.nav.map((x) => (
                <li key={x.href}>
                  <a href={x.href} className={s.menuLink} onClick={() => setOpen(false)}>
                    {x.label[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.menuFoot}>
            <LangSwitch lang={lang} />
            <a href="#contact" className={s.btn} onClick={() => setOpen(false)}>
              {UI.discuss[lang]}
              <PickedCount lang={lang} />
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
