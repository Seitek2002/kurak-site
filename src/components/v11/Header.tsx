"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { V11, type BoardStyle } from "@/content/v11";
import { useSelection } from "@/store/selection";
import { KurakLogo } from "../brand/KurakLogo";
import { useV11 } from "./store";
import s from "./V11.module.css";

const STYLES: BoardStyle[] = ["wood", "ink", "night"];
const NAV = [
  { href: "#holes", key: "holes" },
  { href: "#debuts", key: "debuts" },
  { href: "#games", key: "games" },
  { href: "#players", key: "players" },
  { href: "#rules", key: "rules" },
] as const;

/** Сколько всего коргоолов в заявке: услуги из подборки и стратегия */
export function usePickedCount() {
  const picked = useSelection((st) => st.picked);
  const strategy = useV11((st) => st.strategy);
  return picked.length + (strategy ? 1 : 0);
}

/** Переключатель стиля доски: три настоящих радиокнопки, стрелки работают сами */
export function StyleSwitch({ lang, compact }: { lang: Lang; compact?: boolean }) {
  const board = useV11((st) => st.board);
  const setBoard = useV11((st) => st.setBoard);
  const uid = useId();
  return (
    <fieldset className={s.styleSwitch} data-compact={compact ? "" : undefined}>
      <legend className={s.styleLegend}>{V11.style.label[lang]}</legend>
      {STYLES.map((id) => (
        <label key={id} className={s.styleOpt} title={V11.style.names[id][lang]}>
          <input type="radio" name={`v11-board-${uid}`} value={id} checked={board === id} onChange={() => setBoard(id)} className={s.styleInput} />
          <span className={s.swatch} data-swatch={id} aria-hidden="true" />
          <span className={s.styleName}>{V11.style.names[id][lang]}</span>
        </label>
      ))}
    </fieldset>
  );
}

export function LangSwitch({ lang }: { lang: Lang }) {
  return (
    <nav className={s.lang} aria-label={UI.langLabel[lang]}>
      {LANGS.map((l) => (
        <Link key={l.id} href={variantPath(11, l.id)} prefetch={false} hrefLang={l.id === "ky" ? "ky" : "ru"} lang={l.id === "ky" ? "ky" : "ru"} aria-current={l.id === lang ? "page" : undefined} className={s.langLink} title={l.full}>
          {l.short}
        </Link>
      ))}
    </nav>
  );
}

/** Шапка: знак KURAK, разделы, стиль доски, язык и главная кнопка с числом коргоолов в заявке */
export function Header({ lang }: { lang: Lang }) {
  const count = usePickedCount();
  return (
    <header className={`${s.header} v11-surface`}>
      <div className={s.headerIn}>
        <a href="#main" className={s.brand} aria-label={`KURAK, ${UI.toTop[lang]}`}>
          <KurakLogo className={s.brandLogo} />
        </a>
        <nav className={s.nav} aria-label={UI.menu[lang]}>
          {NAV.map((n) => (
            <a key={n.key} href={n.href} className={s.navLink}>
              {V11.nav[n.key][lang]}
            </a>
          ))}
        </nav>
        <div className={s.headerTools}>
          <StyleSwitch lang={lang} compact />
          <LangSwitch lang={lang} />
          <a href="#contact" className={`v11-btn ${s.headerCta}`}>
            {UI.discuss[lang]}
            {count > 0 ? (
              <span className={s.badge}>
                <span className="visually-hidden">, {V11.bar.picked[lang]}: </span>
                {count}
              </span>
            ) : null}
          </a>
        </div>
      </div>
    </header>
  );
}

/** Нижняя панель на телефоне: главная кнопка всегда под пальцем, прячется, когда заявка уже на экране */
export function MobileBar({ lang }: { lang: Lang }) {
  const count = usePickedCount();
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHide(!!e?.isIntersecting), { rootMargin: "0px 0px -20% 0px" });
    io.observe(target);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`${s.bar} v11-surface`} data-hide={hide ? "" : undefined}>
      <a href="#contact" className={`v11-btn ${s.barBtn}`} tabIndex={hide ? -1 : undefined}>
        {UI.discuss[lang]}
        {count > 0 ? (
          <span className={s.badge}>
            <span className="visually-hidden">, {V11.bar.picked[lang]}: </span>
            {count}
          </span>
        ) : null}
      </a>
    </div>
  );
}
