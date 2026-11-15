"use client";

import { useId } from "react";
import type { Lang } from "@/content/kurak";
import { CHIY_STYLES, V10, styleTitle } from "@/content/v10";
import { setChiyStyle, useChiyStyle } from "./useChiyStyle";
import s from "./Hero.module.css";

/**
 * «Стиль полотна: Шерсть / Тушь / Неон». Обычные радиокнопки одной группы: работают стрелками с клавиатуры,
 * читаются скринридером. Меняют палитру страницы и манеру отрисовки чия на холсте.
 */
export function StyleSwitch({ lang, className }: { lang: Lang; className?: string }) {
  const uid = useId();
  const current = useChiyStyle();
  return (
    <div role="radiogroup" aria-labelledby={`${uid}-l`} className={[s.styles, className].filter(Boolean).join(" ")}>
      <span id={`${uid}-l`} className={s.stylesLabel}>
        {V10.style.label[lang]}
      </span>
      <div className={s.stylesRow}>
        {CHIY_STYLES.map((st) => (
          <label key={st} className={s.styleOpt} title={styleTitle(st, lang)} data-style={st}>
            <input
              type="radio"
              name={`${uid}-style`}
              value={st}
              checked={current === st}
              onChange={() => setChiyStyle(st)}
              className={s.styleInput}
            />
            <span className={s.swatch} aria-hidden="true" />
            <span className={s.styleName}>{V10.style.names[st][lang]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
