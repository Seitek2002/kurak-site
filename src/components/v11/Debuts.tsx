"use client";

import { useRef, useState } from "react";
import { BUNDLES, SERVICE_BY_ID, type Lang } from "@/content/kurak";
import { V11 } from "@/content/v11";
import { useSelection } from "@/store/selection";
import { HOLES, HOLE_INDEX, type HoleId } from "./data";
import { Strip } from "./Strip";
import s from "./V11.module.css";

/** Ходы дебюта: услуга, её лунка и номер хода */
function movesOf(services: string[]) {
  return services.map((id, k) => {
    const cat = SERVICE_BY_ID[id]?.category.id as HoleId | undefined;
    return { id, k: k + 1, hole: cat ? HOLE_INDEX[cat] : 0 };
  });
}

/**
 * «Дебюты»: готовые начала партии (пакеты). Вкладки по трём дебютам, схема доски с номерами ходов,
 * запись ходов и кнопка «Взять дебют в заявку».
 */
export function Debuts({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const addMany = useSelection((st) => st.addMany);
  const remove = useSelection((st) => st.remove);
  const [cur, setCur] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = BUNDLES.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setCur(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="debuts" className={s.debuts} aria-labelledby="v11-debuts-title">
      <div className="v11-wrap">
        <header className={s.head}>
          <h2 id="v11-debuts-title" className="v11-h2">
            {V11.debuts.title[lang]}
          </h2>
          <p className="v11-lead">{V11.debuts.lead[lang]}</p>
        </header>

        <div className={s.debutTabs} role="tablist" aria-label={V11.debuts.choose[lang]}>
          {BUNDLES.map((b, i) => (
            <button
              key={b.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`v11-debut-tab-${b.id}`}
              aria-selected={cur === i}
              aria-controls={`v11-debut-${b.id}`}
              tabIndex={cur === i ? 0 : -1}
              className={s.debutTab}
              onClick={() => setCur(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className={s.debutTabName}>{b.title[lang]}</span>
              <span className={s.debutTabLine}>{b.line[lang]}</span>
            </button>
          ))}
        </div>

        {BUNDLES.map((b, i) => {
          const moves = movesOf(b.services);
          const counts = HOLES.map((_, h) => moves.filter((m) => m.hole === h).length);
          const marks = HOLES.map((_, h) => moves.filter((m) => m.hole === h).map((m) => m.k));
          const all = b.services.every((id) => picked.includes(id));
          return (
            <div
              key={b.id}
              id={`v11-debut-${b.id}`}
              role="tabpanel"
              aria-labelledby={`v11-debut-tab-${b.id}`}
              className={s.debutPanel}
              data-open={cur === i ? "" : undefined}
              tabIndex={0}
            >
              <div className={s.debutBoard}>
                <Strip
                  key={cur === i ? `on-${b.id}` : b.id}
                  size="l"
                  counts={counts}
                  marks={marks}
                  labels={HOLES.map((h) => h.short[lang])}
                  label={`${b.title[lang]}: ${moves.map((m) => `${m.k}. ${SERVICE_BY_ID[m.id]?.service.title[lang]}`).join("; ")}`}
                />
              </div>
              <div className={s.debutMoves}>
                <p className={s.debutMovesTitle}>{V11.debuts.moves[lang]}</p>
                <ol className={s.moveList}>
                  {moves.map((m) => (
                    <li key={m.id} className={s.move}>
                      <span className={s.moveNo} aria-hidden="true">
                        {m.k}
                      </span>
                      <span className={s.moveText}>
                        {SERVICE_BY_ID[m.id]?.service.title[lang]}
                        <span className={s.moveHole}>{HOLES[m.hole]?.short[lang]}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  className={all ? "v11-btn-line" : "v11-btn"}
                  aria-pressed={all}
                  onClick={() => (all ? b.services.forEach((id) => remove(id)) : addMany(b.services))}
                >
                  {all ? V11.debuts.taken[lang] : V11.debuts.take[lang]}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
