"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { SERVICE_BY_ID, type Lang } from "@/content/kurak";
import { V13_CALC } from "@/content/v13";
import { useSelection } from "@/store/selection";
import { scrollToId } from "./motion";
import { setTaskLine } from "./task";
import { AddToggle } from "./Toggles";
import s from "./Calc.module.css";

/**
 * Калькулятор (концепт варианта 6): обращения × доля потерянных × средний чек = сом мимо кассы в месяц и за год.
 * Под расчётом понятный диагноз и услуги, которые закрывают дыру. «Вернуть эти деньги» пришивает расчёт
 * строкой в поле «Задача», услуги диагноза в подборку и ведёт к форме.
 * Без скрипта видны значения по умолчанию и их итог.
 */
type Values = { leads: number; pct: number; check: number };
type Key = keyof Values;

const DEFAULTS: Values = { leads: 300, pct: 30, check: 3000 };
const LIMITS: Record<Key, { min: number; max: number; step: number; slider: [number, number] }> = {
  leads: { min: 0, max: 1_000_000, step: 10, slider: [10, 2000] },
  pct: { min: 0, max: 100, step: 5, slider: [0, 80] },
  check: { min: 0, max: 100_000_000, step: 500, slider: [500, 50_000] },
};
const MARKS = [V13_CALC.mark.ru, V13_CALC.mark.ky];
const NBSP = " ";

export const groupDigits = (n: number) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
const som = (n: number, lang: Lang) => `${groupDigits(n)}${NBSP}${V13_CALC.som[lang]}`;

function diagnose(v: Values) {
  const key = v.pct >= 30 ? "high" : v.pct >= 15 ? "mid" : "low";
  const services = key === "high" ? ["sa-crm", "sa-dept"] : key === "mid" ? ["sa-dept", "sa-crm"] : ["smm-target", "smm-strategy"];
  const few = v.leads < 100 && key !== "low";
  if (few) services.push("smm-target");
  return { key, few, services } as const;
}

export function Calc({ lang }: { lang: Lang }) {
  const [v, setV] = useState<Values>(DEFAULTS);
  const set = (patch: Partial<Values>) => setV((cur) => ({ ...cur, ...patch }));
  const lost = Math.round((v.leads * v.pct) / 100);
  const month = lost * v.check;
  const year = month * 12;
  const kept = Math.max(0, v.leads - lost);
  const share = v.leads > 0 ? lost / v.leads : 0;
  const diag = diagnose(v);

  function apply() {
    useSelection.getState().addMany(diag.services);
    setTaskLine(
      MARKS,
      V13_CALC.line({ leads: groupDigits(v.leads), pct: String(v.pct), check: som(v.check, lang), month: som(month, lang), year: som(year, lang) })[lang],
    );
    scrollToId("zayavka", "v13-name");
  }

  const terms: { key: Key; unit?: string; name: string }[] = [
    { key: "leads", name: V13_CALC.leads[lang] },
    { key: "pct", unit: "%", name: V13_CALC.lost[lang] },
    { key: "check", unit: V13_CALC.som[lang], name: V13_CALC.check[lang] },
  ];

  return (
    <div className={s.calc}>
      <div className={s.eq} role="group" aria-labelledby="raschet-title">
        {terms.map((t, i) => (
          <div key={t.key} className={s.cell}>
            {i > 0 && (
              <span className={s.op} aria-hidden="true">
                ×
              </span>
            )}
            <div className={s.term}>
              <div className={s.fig}>
                <NumField id={`v13-${t.key}`} k={t.key} value={v[t.key]} onChange={(n) => set({ [t.key]: n })} />
                {t.unit && <span className={s.unit}>{t.unit}</span>}
              </div>
              <Slider k={t.key} value={v[t.key]} onChange={(n) => set({ [t.key]: n })} />
              <label htmlFor={`v13-${t.key}`} className={s.label}>
                {t.name}
              </label>
            </div>
          </div>
        ))}
        <div className={`${s.cell} ${s.cellResult}`}>
          <span className={s.op} aria-hidden="true">
            =
          </span>
          <div className={s.term}>
            <output id="v13-month" htmlFor="v13-leads v13-pct v13-check" className={s.result} aria-live="polite">
              <span className={s.resultFig}>{groupDigits(month)}</span> <span className={s.resultUnit}>{V13_CALC.som[lang]}</span>
            </output>
            <label htmlFor="v13-month" className={s.label}>
              {V13_CALC.month[lang]}
            </label>
          </div>
        </div>
      </div>

      <div className={s.below}>
        <div className={s.yearBlock}>
          <p className={s.year}>
            <span className={s.yearFig}>
              {groupDigits(year)}
              <span className={s.yearUnit}>
                {NBSP}
                {V13_CALC.som[lang]}
              </span>
            </span>
            <span className={s.yearLabel}>{V13_CALC.year[lang]}</span>
          </p>
          <div className={s.split}>
            <p className={s.splitHead}>
              {V13_CALC.splitOf[lang]}: <b>{groupDigits(v.leads)}</b>
            </p>
            <div className={s.bar} aria-hidden="true">
              <span className={s.barLost} style={{ "--s": share } as React.CSSProperties} />
            </div>
            <dl className={s.legend}>
              <div>
                <dt>{V13_CALC.kept[lang]}</dt>
                <dd>{groupDigits(kept)}</dd>
              </div>
              <div className={s.legendLost}>
                <dt>{V13_CALC.lostShort[lang]}</dt>
                <dd>{groupDigits(lost)}</dd>
              </div>
            </dl>
          </div>
          <p className={s.honest}>{V13_CALC.honest[lang]}</p>
        </div>

        <div className={s.diag}>
          <h3 className={s.diagTitle}>{V13_CALC.diagTitle[lang]}</h3>
          <p className={s.diagText}>
            {V13_CALC.diag[diag.key][lang]}
            {diag.few && ` ${V13_CALC.diag.few[lang]}`}
          </p>
          <ul className={s.diagList}>
            {diag.services.map((id) => {
              const hit = SERVICE_BY_ID[id];
              if (!hit) return null;
              return (
                <li key={id} className={s.diagItem}>
                  <span className={s.diagName}>{hit.service.title[lang]}</span>
                  <AddToggle id={id} title={hit.service.title[lang]} lang={lang} className={s.add} />
                </li>
              );
            })}
          </ul>
          <div className={s.cta}>
            <button type="button" className="v13-btn" onClick={apply}>
              {V13_CALC.cta[lang]}
              <span className={s.tail}>{V13_CALC.ctaTail[lang]}</span>
            </button>
            <p className={s.ctaNote}>{V13_CALC.ctaNote[lang]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Числовое поле с группами разрядов: стрелки вверх и вниз меняют на шаг, с Shift на десять шагов */
function NumField({ id, k, value, onChange }: { id: string; k: Key; value: number; onChange: (n: number) => void }) {
  const lim = LIMITS[k];
  const ref = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? groupDigits(value);

  useLayoutEffect(() => {
    if (caret.current !== null && ref.current) {
      ref.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  });

  const clamp = (n: number) => Math.min(lim.max, Math.max(lim.min, n));

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const pos = e.target.selectionStart ?? raw.length;
    const before = raw.slice(0, pos).replace(/\D/g, "").length;
    const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 9);
    const n = digits === "" ? 0 : clamp(Number(digits));
    const text = digits === "" ? "" : groupDigits(n);
    let c = 0;
    for (let seen = 0; c < text.length && seen < before; c++) if (/\d/.test(text[c]!)) seen++;
    caret.current = c;
    setDraft(text);
    onChange(n);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const dir = e.key === "ArrowUp" ? 1 : -1;
    setDraft(null);
    onChange(clamp(value + dir * lim.step * (e.shiftKey ? 10 : 1)));
  }

  const digits = shown.replace(/\D/g, "").length;
  const gaps = shown.length - digits;
  return (
    <input
      ref={ref}
      id={id}
      name={k}
      className={s.num}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      value={shown}
      onChange={onInput}
      onKeyDown={onKeyDown}
      onFocus={(e) => {
        const el = e.currentTarget;
        requestAnimationFrame(() => el.select());
      }}
      onBlur={() => setDraft(null)}
      style={{ "--chars": Math.max(1, digits) + gaps * 0.4 } as React.CSSProperties}
    />
  );
}

/** Ползунок для прикидки пальцем. Для клавиатуры есть поле со стрелками, поэтому ползунок вне порядка табуляции */
function Slider({ k, value, onChange }: { k: Key; value: number; onChange: (n: number) => void }) {
  const [lo, hi] = LIMITS[k].slider;
  const v = Math.min(hi, Math.max(lo, value));
  const p = ((v - lo) / (hi - lo)) * 100;
  return (
    <input
      type="range"
      className={s.slider}
      min={lo}
      max={hi}
      step={LIMITS[k].step}
      value={v}
      onChange={(e) => onChange(Number(e.target.value))}
      tabIndex={-1}
      aria-hidden="true"
      style={{ "--p": `${p}%` } as React.CSSProperties}
    />
  );
}
