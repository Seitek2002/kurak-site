"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICE_BY_ID, UI, type Lang } from "@/content/kurak";
import { MONTHS, MONTHS_SHORT, SEASONS, SEASON_NOW, V5, type Season, type SeasonId } from "@/content/v5";
import { AddToggle } from "./AddToggle";
import { CAT_TONE } from "./data";
import { Shape, Thread } from "./Geometry";
import s from "./V5.module.css";

const isSeason = (x: string): x is SeasonId => SEASONS.some((se) => se.id === x);

/** Лента года: двенадцать клеток, праздник красным, подготовка охрой. Подпись для чтеца собрана из тех же данных */
function Ribbon({ season, lang }: { season: Season; lang: Lang }) {
  const months = (list: number[]) => list.map((m) => MONTHS[m]?.[lang].toLowerCase() ?? "").join(", ");
  const label = season.lunar
    ? `${V5.calendar.ribbon[lang]}: ${season.when[lang]}`
    : `${V5.calendar.ribbon[lang]}. ${V5.calendar.legendPrep[lang]}: ${months(season.prep)}. ${V5.calendar.legendEvent[lang]}: ${months(season.event)}.`;
  return (
    <div className={s.ribbon} role="img" aria-label={label} data-lunar={season.lunar || undefined}>
      <ol className={s.ribbonRow} aria-hidden="true">
        {MONTHS_SHORT.map((m, i) => (
          <li
            key={m.ru}
            className={s.ribbonCell}
            data-kind={season.event.includes(i) ? "event" : season.prep.includes(i) ? "prep" : undefined}
          >
            <span className={s.ribbonBar} />
            <span className={s.ribbonMonth}>{m[lang]}</span>
          </li>
        ))}
      </ol>
      {season.lunar ? (
        <p className={s.ribbonMoon} aria-hidden="true">
          <Shape i={1} className={s.ribbonMoonShape} />
          {V5.calendar.lunar[lang]}
        </p>
      ) : (
        <ul className={s.ribbonLegend} aria-hidden="true">
          <li>
            <span className={s.ribbonKey} />
            {V5.calendar.legendEvent[lang]}
          </li>
          <li>
            <span className={s.ribbonKey} data-kind="prep" />
            {V5.calendar.legendPrep[lang]}
          </li>
        </ul>
      )}
    </div>
  );
}

/**
 * Календарь продаж Кыргызстана: сезоны года слева, открытый сезон справа.
 * В открытом сезоне лента года, когда начинать, кому важно, три дела и кнопка «Добавить в заявку».
 * Сезон «сейчас» выбирается по дате посетителя после загрузки. Без скрипта все сезоны видны подряд.
 */
export function Calendar({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<SeasonId>("march8");
  const [now, setNow] = useState<SeasonId | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const list = useRef<HTMLDivElement>(null);

  // На телефоне сезоны идут лентой со своим скроллом: держим выбранный в поле зрения, страницу не двигаем
  useEffect(() => {
    const row = list.current;
    const tab = tabs.current[active];
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: Math.max(0, tab.offsetLeft - row.offsetLeft - 16) });
  }, [active]);

  useEffect(() => {
    const current: SeasonId = SEASON_NOW[new Date().getMonth()] ?? "newyear";
    const fromHash = window.location.hash.replace("#s-", "");
    /* eslint-disable react-hooks/set-state-in-effect -- дата и адрес известны только в браузере */
    setNow(current);
    setActive(isSeason(fromHash) ? fromHash : current);
    /* eslint-enable react-hooks/set-state-in-effect */

    const show = (id: SeasonId) => {
      setActive(id);
      requestAnimationFrame(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        root.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        tabs.current[id]?.focus({ preventScroll: true });
      });
    };
    const onSeason = (e: Event) => show((e as CustomEvent<SeasonId>).detail);
    const onHash = () => {
      const id = window.location.hash.replace("#s-", "");
      if (isSeason(id)) show(id);
    };
    window.addEventListener("v5:season", onSeason);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("v5:season", onSeason);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let next: number | null = step ? (i + step + SEASONS.length) % SEASONS.length : null;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = SEASONS.length - 1;
    if (next === null) return;
    e.preventDefault();
    const id = SEASONS[next]?.id;
    if (!id) return;
    setActive(id);
    tabs.current[id]?.focus();
  };

  return (
    <div className={s.cal} ref={root}>
      <div ref={list} role="tablist" aria-label={V5.calendar.list[lang]} aria-orientation="vertical" className={s.calTabs}>
        {SEASONS.map((se, i) => {
          const on = se.id === active;
          return (
            <button
              key={se.id}
              ref={(el) => {
                tabs.current[se.id] = el;
              }}
              type="button"
              role="tab"
              id={`v5-tab-${se.id}`}
              aria-selected={on}
              aria-controls={`s-${se.id}`}
              tabIndex={on ? 0 : -1}
              className={s.calTab}
              onClick={() => setActive(se.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className={s.calTabName}>{se.name[lang]}</span>
              {now === se.id && <span className={s.calNow}>{V5.hero.now[lang]}</span>}
            </button>
          );
        })}
      </div>

      {SEASONS.map((se) => (
        <section
          key={se.id}
          id={`s-${se.id}`}
          role="tabpanel"
          aria-labelledby={`v5-tab-${se.id}`}
          className={s.calPanel}
          data-active={se.id === active}
          tabIndex={-1}
        >
          <Thread id={`v5-thread-${se.id}`} className={s.calThread} />
          <div className={s.calPanelHead}>
            <h3 className={s.calName}>{se.name[lang]}</h3>
            <Ribbon season={se} lang={lang} />
          </div>
          <div className={s.calBody}>
            <dl className={s.calFacts}>
              <div>
                <dt>{V5.calendar.when[lang]}</dt>
                <dd>{se.when[lang]}</dd>
              </div>
              <div>
                <dt>{V5.calendar.start[lang]}</dt>
                <dd>{se.start[lang]}</dd>
              </div>
              <div>
                <dt>{V5.calendar.who[lang]}</dt>
                <dd>{se.who[lang]}</dd>
              </div>
            </dl>
            <div className={s.calTodo}>
              <h4 className={s.calTodoH}>{V5.calendar.todo[lang]}</h4>
              <ol className={s.calTodoList}>
                {se.todo.map((t) => (
                  <li key={t.ru}>{t[lang]}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className={s.calFoot}>
            <ul className={s.calSvcs} aria-label={V5.calendar.services[lang]}>
              {se.services.map((id) => {
                const hit = SERVICE_BY_ID[id];
                return hit ? (
                  <li key={id} className={s.calSvc}>
                    <span className={s.calSvcBit} data-tone={CAT_TONE[hit.category.id]} aria-hidden="true" />
                    {hit.service.title[lang]}
                  </li>
                ) : null;
              })}
            </ul>
            <AddToggle ids={se.services} add={UI.add[lang]} added={UI.added[lang]} />
          </div>
        </section>
      ))}
    </div>
  );
}
