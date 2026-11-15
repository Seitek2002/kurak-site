"use client";

import { Fragment, useEffect, useState } from "react";
import { UI, dt, type Lang } from "@/content/kurak";
import { V11 } from "@/content/v11";
import { useSelection } from "@/store/selection";
import { Fill } from "../Fill";
import { HOLES, HOLE_INDEX, countsFor, korgoolSpots, lcFirst, type HoleId } from "./data";
import { useV11 } from "./store";
import s from "./V11.module.css";

function IconPlus() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Кнопка «Добавить в заявку»: коргоол ложится в лунку */
export function AddToggle({ on, onToggle, lang, name }: { on: boolean; onToggle: () => void; lang: Lang; name: string }) {
  return (
    <button type="button" className={`v11-btn-line ${s.add}`} aria-pressed={on} onClick={onToggle} aria-label={`${on ? UI.added[lang] : UI.add[lang]}: ${name}`}>
      {on ? <IconCheck /> : <IconPlus />}
      {on ? UI.added[lang] : UI.add[lang]}
    </button>
  );
}

/**
 * «Девять лунок»: восемь направлений и стратегия. Лунка открывает подпункты,
 * отмеченная услуга ложится в лунку коргоолом. На широком экране панель под рядом лунок, на телефоне сразу под лункой.
 */
export function Holes({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const toggle = useSelection((st) => st.toggle);
  const strategy = useV11((st) => st.strategy);
  const toggleStrategy = useV11((st) => st.toggleStrategy);
  const [open, setOpen] = useState(1);
  const counts = countsFor(picked, strategy);

  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#hole-([\w-]+)$/);
      const i = m ? HOLE_INDEX[m[1] as HoleId] : undefined;
      if (i !== undefined) setOpen(i);
    };
    const onHole = (e: Event) => {
      const i = HOLE_INDEX[(e as CustomEvent<string>).detail as HoleId];
      if (i !== undefined) setOpen(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("v11:hole", onHole);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("v11:hole", onHole);
    };
  }, []);

  return (
    <section id="holes" className={s.holes} aria-labelledby="v11-holes-title">
      <div className="v11-wrap">
        <header className={s.head}>
          <h2 id="v11-holes-title" className="v11-h2">
            {V11.holes.title[lang]}
          </h2>
          <p className="v11-lead">{V11.holes.lead[lang]}</p>
        </header>

        <div className={s.holeGrid}>
          {HOLES.map((h, i) => {
            const isOpen = open === i;
            const n = counts[i] ?? 0;
            return (
              <Fragment key={h.id}>
                <button
                  type="button"
                  id={`hole-${h.id}`}
                  className={s.holeBtn}
                  style={{ "--col": i + 1 } as React.CSSProperties}
                  aria-expanded={isOpen}
                  aria-controls={`v11-panel-${h.id}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className={s.pit} aria-hidden="true" data-count={n}>
                    {korgoolSpots(Math.min(n, 6)).map((p, k) => (
                      <span key={k} className={s.korgool} style={{ left: `${p.x}%`, top: `${p.y}%` }} />
                    ))}
                  </span>
                  <span className={s.holeText}>
                    <span className={s.holeShort}>{h.short[lang]}</span>
                    <span className={s.holeGoal}>{h.goal[lang]}</span>
                    {n > 0 ? (
                      <span className={s.holeCount}>
                        {n} {V11.holes.picked[lang]}
                      </span>
                    ) : null}
                  </span>
                </button>

                <div id={`v11-panel-${h.id}`} role="region" aria-labelledby={`hole-${h.id}`} className={s.panel} data-open={isOpen ? "" : undefined}>
                  <div className={s.panelHead}>
                    <h3 className={s.panelTitle}>{h.goal[lang]}</h3>
                    <p className={s.panelLead}>
                      {UI.leads[lang]}:{" "}
                      {h.category ? (
                        <>
                          {h.category.lead.name ? `${h.category.lead.name}, ` : ""}
                          {lcFirst(h.category.lead.role[lang])}
                        </>
                      ) : (
                        <Fill value={dt(V11.strategy.lead, lang)} />
                      )}
                    </p>
                  </div>
                  <ul className={s.services}>
                    {h.category
                      ? h.category.services.map((sv) => (
                          <li key={sv.id} className={s.service}>
                            <h4 className={s.serviceTitle}>{sv.title[lang]}</h4>
                            <p className={s.ask}>
                              <span className={s.askLabel}>{UI.withTask[lang]}</span>
                              {sv.ask[lang]}
                            </p>
                            <p className={s.incLabel}>{UI.includes[lang]}</p>
                            <ul className={s.includes}>
                              {sv.includes.map((inc) => (
                                <li key={inc.ru}>{inc[lang]}</li>
                              ))}
                            </ul>
                            <AddToggle on={picked.includes(sv.id)} onToggle={() => toggle(sv.id)} lang={lang} name={sv.title[lang]} />
                          </li>
                        ))
                      : (
                          <li className={s.service}>
                            <h4 className={s.serviceTitle}>{V11.strategy.title[lang]}</h4>
                            <p className={s.ask}>
                              <span className={s.askLabel}>{UI.withTask[lang]}</span>
                              {V11.strategy.ask[lang]}
                            </p>
                            <p className={s.incLabel}>{UI.includes[lang]}</p>
                            <ul className={s.includes}>
                              {V11.strategy.includes.map((inc) => (
                                <li key={inc.value.ru}>
                                  <Fill value={dt(inc, lang)} />
                                </li>
                              ))}
                            </ul>
                            <AddToggle on={strategy} onToggle={toggleStrategy} lang={lang} name={V11.strategy.title[lang]} />
                          </li>
                        )}
                  </ul>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
