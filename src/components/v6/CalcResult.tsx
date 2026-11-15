"use client";

import { SERVICE_BY_ID, type Lang } from "@/content/kurak";
import { V6_CALC } from "@/content/v6";
import { useSelection } from "@/store/selection";
import { AddToggle } from "./AddToggle";
import { compact, diagnose, groupDigits, lostLeads, monthLoss, niceScale, prefillText, som, useCalc } from "./calc";
import s from "./V6.module.css";

/**
 * Продолжение расчёта под первым экраном: год крупно, график нарастающих потерь,
 * доля потерянных обращений, диагноз с услугами и кнопка, которая переносит цифры в заявку.
 */
export function CalcResult({ lang }: { lang: Lang }) {
  const leads = useCalc((st) => st.leads);
  const pct = useCalc((st) => st.pct);
  const check = useCalc((st) => st.check);
  const v = { leads, pct, check };
  const month = monthLoss(v);
  const year = month * 12;
  const lost = lostLeads(v);
  const kept = Math.max(0, leads - lost);
  const { top, step } = niceScale(year);
  const ticks: number[] = [];
  for (let x = 0; x <= top + step / 2; x += step) ticks.push(x);
  const diag = diagnose(v);
  const lostShare = leads > 0 ? (lost / leads) * 100 : 0;

  function apply() {
    const sel = useSelection.getState();
    sel.addMany(diag.services);
    const marks = [V6_CALC.prefillMark.ru, V6_CALC.prefillMark.ky];
    const rest = sel.draft.task
      .split("\n")
      .filter((line) => !marks.some((m) => line.startsWith(m)))
      .join("\n")
      .trim();
    const line = prefillText(v, lang);
    sel.setDraft({ task: rest ? `${line}\n${rest}` : line });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("zayavka")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    document.getElementById("v6-name")?.focus({ preventScroll: true });
  }

  return (
    <>
      <div className={s.res}>
        <div className={s.resMain}>
          <h2 id="calc-title" className={s.h2}>
            {V6_CALC.title[lang]}
          </h2>
          <p className={s.year} style={{ "--len": groupDigits(year).length } as React.CSSProperties}>
            <span className={s.yearFig}>
              {groupDigits(year)}
              <span className={s.yearUnit}> {V6_CALC.som[lang]}</span>
            </span>
            <span className={s.yearLabel}>{V6_CALC.year[lang]}</span>
          </p>
          <p className={s.honest}>{V6_CALC.honest[lang]}</p>

          <div className={s.split}>
            <p className={s.splitHead}>
              {V6_CALC.splitOf[lang]}: <span className="v6-num">{groupDigits(leads)}</span>
            </p>
            <div className={s.splitBar} aria-hidden="true">
              <span className={s.splitLost} style={{ "--s": lostShare / 100 } as React.CSSProperties} />
            </div>
            <dl className={s.splitLegend}>
              <div>
                <dt>{V6_CALC.splitKept[lang]}</dt>
                <dd className="v6-num">{groupDigits(kept)}</dd>
              </div>
              <div className={s.splitLegendLost}>
                <dt>{V6_CALC.splitLost[lang]}</dt>
                <dd className="v6-num">{groupDigits(lost)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <figure className={s.chart} aria-labelledby="v6-chart-cap">
          <figcaption id="v6-chart-cap" className={s.chartCap}>
            {V6_CALC.chartTitle[lang]}
          </figcaption>
          <div
            className={s.plot}
            role="img"
            aria-label={V6_CALC.chartAlt(som(month), som(year))[lang]}
          >
            <div className={s.gridLines} aria-hidden="true">
              {ticks.map((x) => (
                <span key={x} className={s.gridLine} style={{ "--y": `${(x / top) * 100}%` } as React.CSSProperties}>
                  <span className={s.gridLabel}>{compact(x, lang)}</span>
                </span>
              ))}
            </div>
            <ol className={s.bars} aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => {
                const val = (i + 1) * month;
                return (
                  <li key={i} className={s.barCol} style={{ "--i": i } as React.CSSProperties}>
                    <span
                      className={i === 11 ? `${s.bar} ${s.barLast}` : s.bar}
                      style={{ "--v": top > 0 ? val / top : 0 } as React.CSSProperties}
                    />
                    <span className={s.barTick}>{i + 1}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className={s.chartAxis} aria-hidden="true">
            {V6_CALC.chartMonths[lang]}
          </p>
        </figure>
      </div>

      <div className={s.diag}>
        <div className={s.diagText}>
          <h3 className={s.h3}>{V6_CALC.diagTitle[lang]}</h3>
          <p>
            {V6_CALC.diag[diag.key][lang]}
            {diag.few && ` ${V6_CALC.diag.few[lang]}`}
          </p>
        </div>
        <ul className={s.diagList}>
          {diag.services.map((id) => {
            const hit = SERVICE_BY_ID[id];
            if (!hit) return null;
            return (
              <li key={id} className={s.diagItem}>
                <span className={s.diagName}>{hit.service.title[lang]}</span>
                <span className={s.diagGoal}>{hit.service.ask[lang]}</span>
                <AddToggle id={id} lang={lang} className={s.diagAdd} />
              </li>
            );
          })}
        </ul>
        <div className={s.diagAct}>
          <button type="button" className="v6-btn" onClick={apply}>
            <span>
              {V6_CALC.ctaMain[lang]}
              <span className={s.ctaTail}>{V6_CALC.ctaTail[lang]}</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
