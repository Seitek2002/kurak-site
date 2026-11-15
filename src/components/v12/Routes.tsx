"use client";

import { BUNDLES, SERVICE_BY_ID, type Lang } from "@/content/kurak";
import { V12 } from "@/content/v12";
import { useSelection } from "@/store/selection";
import { Glyph } from "./Glyph";
import s from "./V12.module.css";

/**
 * Готовые пакеты как маршруты вести: остановки = услуги. Добавили маршрут, и остановки загораются по очереди:
 * все направления подключились к одной дороге.
 */
export function Routes({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const addMany = useSelection((st) => st.addMany);
  const remove = useSelection((st) => st.remove);

  return (
    <ul className={s.routes}>
      {BUNDLES.map((b) => {
        const all = b.services.every((id) => picked.includes(id));
        return (
          <li key={b.id} className={s.route} data-on={all || undefined}>
            <h3 className={s.routeTitle}>{b.title[lang]}</h3>
            <p className={s.routeLine}>{b.line[lang]}</p>
            <ol className={s.stops} aria-label={V12.routes.stops[lang]}>
              {b.services.map((id, i) => {
                const hit = SERVICE_BY_ID[id];
                if (!hit) return null;
                const on = picked.includes(id);
                return (
                  <li key={id} className={s.stop} data-on={on || undefined} style={{ "--i": i } as React.CSSProperties}>
                    <Glyph id={hit.category.id} className={s.stopGlyph} />
                    <span className={s.stopText}>
                      <span className={s.stopName}>{hit.service.title[lang]}</span>
                      <span className={s.stopWay}>{V12.ways.list[hit.category.id].name[lang]}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              className={`${s.btn} ${all ? s.btnDone : ""} ${s.routeBtn}`}
              aria-pressed={all}
              onClick={() => (all ? b.services.forEach((id) => remove(id)) : addMany(b.services))}
            >
              {all ? V12.routes.added[lang] : V12.routes.add[lang]}
              <span className="visually-hidden">: {b.title[lang]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
