"use client";

import { useState } from "react";
import { BUNDLES, CATEGORIES, SERVICE_BY_ID, TEAM, UI, dt, type Lang } from "@/content/kurak";
import type { CategoryId } from "@/content/services";
import { V5 } from "@/content/v5";
import { Fill } from "../Fill";
import { AddToggle } from "./AddToggle";
import { IconChevron, Shape } from "./Geometry";
import { CAT_SHAPE, CAT_TONE } from "./data";
import s from "./V5.module.css";


/** Кто ведёт: имя из команды, если оно есть, иначе роль; черновое имя обведено пунктиром */
function Lead({ cat, lang }: { cat: (typeof CATEGORIES)[number]; lang: Lang }) {
  const person = TEAM.find((p) => p.category === cat.id);
  return (
    <p className={s.svcLead}>
      <span className={s.svcLeadLabel}>{UI.leads[lang]}:</span>{" "}
      {cat.lead.name ? (
        <>{cat.lead.name}, </>
      ) : person ? (
        <>
          <Fill value={dt(person.name, lang)} />,{" "}
        </>
      ) : null}
      {cat.lead.role[lang].charAt(0).toLowerCase() + cat.lead.role[lang].slice(1)}
    </p>
  );
}

/**
 * Восемь направлений как лоскуты одного курака. Слева сетка лоскутов, справа открытое направление:
 * услуги раскрываются по одной (с чем приходят, что входит, кнопка «Добавить в заявку»).
 * Без скрипта все панели видны подряд. На телефоне панель стоит сразу под своим лоскутом.
 */
export function Services({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<CategoryId>("smm");
  const [openSvc, setOpenSvc] = useState<string | null>(CATEGORIES[0]?.services[0]?.id ?? null);

  return (
    <div className={s.svc}>
      {CATEGORIES.map((cat, i) => {
        const on = active === cat.id;
        const [shape, turn] = CAT_SHAPE[cat.id];
        return (
          <div key={cat.id} className={s.svcItem}>
            <h3 className={s.svcPatchH} style={{ "--col": (i % 2) + 1, "--row": Math.floor(i / 2) + 1 } as React.CSSProperties}>
              <button
                type="button"
                id={`v5-cat-${cat.id}`}
                className={s.svcPatch}
                data-tone={CAT_TONE[cat.id]}
                aria-expanded={on}
                aria-controls={`v5-svc-${cat.id}`}
                onClick={() => {
                  setActive(cat.id);
                  setOpenSvc(cat.services[0]?.id ?? null);
                }}
              >
                <Shape i={shape} turn={turn} className={s.svcShape} />
                <span className={`${s.svcN} num`}>{cat.n}</span>
                <span className={s.svcGoal}>{cat.goal[lang]}</span>
                <span className={s.svcShort}>{cat.short[lang]}</span>
                <IconChevron />
              </button>
            </h3>
            <div id={`v5-svc-${cat.id}`} role="region" aria-labelledby={`v5-cat-${cat.id}`} className={s.svcPanel} data-active={on}>
              <div className={s.svcPanelHead}>
                <span className={s.svcSwatch} data-tone={CAT_TONE[cat.id]} aria-hidden="true">
                  <Shape i={shape} turn={turn} />
                </span>
                <div>
                  <p className={s.svcPanelTitle}>{cat.goal[lang]}</p>
                  <Lead cat={cat} lang={lang} />
                </div>
              </div>
              <ul className={s.svcList}>
                {cat.services.map((svc) => {
                  const open = openSvc === svc.id;
                  return (
                    <li key={svc.id} className={s.svcRow} data-open={open || undefined}>
                      <h4 className={s.svcRowH}>
                        <button
                          type="button"
                          className={s.svcRowBtn}
                          aria-expanded={open}
                          aria-controls={`v5-svcd-${svc.id}`}
                          onClick={() => setOpenSvc(open ? null : svc.id)}
                        >
                          <span>{svc.title[lang]}</span>
                          <IconChevron />
                        </button>
                      </h4>
                      <div id={`v5-svcd-${svc.id}`} className={s.svcDetail}>
                        <p>
                          <span className={s.svcDetailLabel}>{UI.withTask[lang]}:</span> {svc.ask[lang]}
                        </p>
                        <div>
                          <p className={s.svcDetailLabel}>{UI.includes[lang]}</p>
                          <ul className={s.svcIncludes}>
                            {svc.includes.map((x) => (
                              <li key={x.ru}>{x[lang]}</li>
                            ))}
                          </ul>
                        </div>
                        <AddToggle ids={[svc.id]} add={UI.add[lang]} added={UI.added[lang]} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Готовые наборы: как комбо, без цен. Одна кнопка кладёт в заявку весь набор */
export function Bundles({ lang }: { lang: Lang }) {
  return (
    <div className={s.bundles}>
      <div className={s.bundlesHead}>
        <h3 className={s.bundlesTitle}>{V5.services.bundlesTitle[lang]}</h3>
        <p className={s.bundlesLede}>{V5.services.bundlesLede[lang]}</p>
      </div>
      <ul className={s.bundleList}>
        {BUNDLES.map((b) => (
          <li key={b.id} className={s.bundle}>
            <div className={s.bundleMini} aria-hidden="true">
              {b.services.map((id) => {
                const c = SERVICE_BY_ID[id]?.category;
                return c ? <span key={id} className={s.bundleBit} data-tone={CAT_TONE[c.id]} /> : null;
              })}
            </div>
            <div className={s.bundleText}>
              <h4 className={s.bundleName}>{b.title[lang]}</h4>
              <p className={s.bundleLine}>{b.line[lang]}</p>
              <p className={s.bundleSvcs}>{b.services.map((id) => SERVICE_BY_ID[id]?.service.title[lang]).filter(Boolean).join(", ")}</p>
            </div>
            <AddToggle ids={b.services} add={V5.services.bundleAdd[lang]} added={V5.services.bundleAdded[lang]} className={s.bundleBtn} />
          </li>
        ))}
      </ul>
    </div>
  );
}
