"use client";

import { useEffect, useState } from "react";
import { MONTHS, QUILT, QUILT_MOON, SEASONS, V5, type Lang, type SeasonId } from "@/content/v5";
import { Shape } from "./Geometry";
import s from "./V5.module.css";

/** Открыть сезон в календаре: календарь слушает это событие и прокручивает к себе */
export function openSeason(id: SeasonId) {
  window.dispatchEvent(new CustomEvent<SeasonId>("v5:season", { detail: id }));
}

/**
 * Курак года: двенадцать лоскутов-месяцев и лунный лоскут айтов, пришитый к краю.
 * Каждый лоскут ведёт к своему сезону в календаре продаж (без скрипта работает как якорь).
 * Текущий месяц отмечается после загрузки: сервер не знает дату посетителя.
 */
export function YearQuilt({ lang }: { lang: Lang }) {
  const [month, setMonth] = useState<number | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- дата посетителя известна только в браузере
  useEffect(() => setMonth(new Date().getMonth()), []);

  const go = (id: SeasonId) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    history.replaceState(null, "", `#s-${id}`);
    openSeason(id);
  };
  const seasonName = (id: SeasonId) => SEASONS.find((x) => x.id === id)?.name[lang] ?? "";

  return (
    <figure className={s.quiltWrap}>
      <div className={s.quiltFrame}>
        <ul className={s.quilt} aria-label={V5.hero.quiltLabel[lang]}>
          {QUILT.map((p, i) => {
            const now = month === i;
            const inner = (
              <>
                <Shape i={p.shape} turn={p.turn} className={s.patchShape} />
                <span className={s.patchTop}>
                  <span className={s.patchMonth}>{MONTHS[i]?.[lang]}</span>
                  {now && <span className={s.patchNow}>{V5.hero.now[lang]}</span>}
                </span>
                {p.label && <span className={s.patchLabel}>{p.label[lang]}</span>}
              </>
            );
            return (
              <li key={i} className={s.patch} data-tone={p.tone} data-now={now || undefined} style={{ "--i": i } as React.CSSProperties}>
                {p.season ? (
                  <a
                    href={`#s-${p.season}`}
                    className={s.patchLink}
                    onClick={go(p.season)}
                    aria-label={`${MONTHS[i]?.[lang]}: ${p.label?.[lang] ?? ""}. ${seasonName(p.season)}`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={s.patchLink}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
        <a
          href={`#s-${QUILT_MOON.season}`}
          className={s.moon}
          onClick={go(QUILT_MOON.season)}
          aria-label={`${seasonName(QUILT_MOON.season)}: ${QUILT_MOON.note[lang]}`}
        >
          <Shape i={1} className={s.moonShape} />
          <span className={s.moonText}>
            <span className={s.moonName}>{QUILT_MOON.label[lang]}</span>
            <span className={s.moonNote}>{QUILT_MOON.note[lang]}</span>
          </span>
        </a>
      </div>
      <figcaption className={s.quiltCaption}>{V5.hero.quiltCaption[lang]}</figcaption>
    </figure>
  );
}
