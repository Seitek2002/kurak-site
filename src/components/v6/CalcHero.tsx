"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Lang } from "@/content/kurak";
import { V6_CALC } from "@/content/v6";
import { CALC_LIMITS, groupDigits, monthLoss, useCalc, type CalcValues } from "./calc";
import s from "./V6.module.css";

type Key = keyof CalcValues;

/**
 * Первый экран: расчёт одной строкой, как формула в отчёте.
 * обращения × доля потерянных × средний чек = сколько уходит мимо кассы в месяц.
 * Поля печатаются с клавиатуры (стрелки вверх и вниз меняют на шаг, с Shift на десять шагов),
 * ползунок под полем для прикидки пальцем. Без скрипта видны значения по умолчанию и их итог.
 */
export function CalcHero({ lang }: { lang: Lang }) {
  const leads = useCalc((st) => st.leads);
  const pct = useCalc((st) => st.pct);
  const check = useCalc((st) => st.check);
  const set = useCalc((st) => st.set);
  const month = monthLoss({ leads, pct, check });

  const terms: { key: Key; value: number; unit?: string; name: string }[] = [
    { key: "leads", value: leads, name: V6_CALC.leads[lang] },
    { key: "pct", value: pct, unit: "%", name: V6_CALC.lost[lang] },
    { key: "check", value: check, unit: V6_CALC.som[lang], name: V6_CALC.check[lang] },
  ];

  return (
    <div className={s.eq} role="group" aria-labelledby="v6-eq-legend">
      <p id="v6-eq-legend" className={s.eqLegend}>
        {V6_CALC.legend[lang]}
      </p>
      <div className={s.eqRow}>
        {terms.map((t, i) => (
          <div key={t.key} className={s.eqCell}>
            {i > 0 && (
              <span className={s.eqOp} aria-hidden="true">
                ×
              </span>
            )}
            <div className={s.term}>
              <div className={s.termFig}>
                <NumField id={`v6-${t.key}`} k={t.key} value={t.value} onChange={(n) => set({ [t.key]: n })} />
                {t.unit && <span className={s.termUnit}>{t.unit}</span>}
              </div>
              <Slider k={t.key} value={t.value} onChange={(n) => set({ [t.key]: n })} />
              <label htmlFor={`v6-${t.key}`} className={s.termLabel}>
                {t.name}
              </label>
            </div>
          </div>
        ))}
        <div className={`${s.eqCell} ${s.eqCellResult}`}>
          <span className={s.eqOp} aria-hidden="true">
            =
          </span>
          <div className={`${s.term} ${s.termResult}`}>
            <output
              id="v6-month"
              htmlFor="v6-leads v6-pct v6-check"
              className={s.termFig}
              style={{ "--len": groupDigits(month).length + 1.5 } as React.CSSProperties}
            >
              <span className={s.resultFig}>{groupDigits(month)}</span>{" "}
              <span className={s.termUnit}>{V6_CALC.som[lang]}</span>
            </output>
            <label htmlFor="v6-month" className={s.termLabel}>
              {V6_CALC.result[lang]}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Числовое поле с группами разрядов. Каретка остаётся после той же цифры, что и до форматирования. */
function NumField({ id, k, value, onChange }: { id: string; k: Key; value: number; onChange: (n: number) => void }) {
  const lim = CALC_LIMITS[k];
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
    const next = clamp(value + dir * lim.step * (e.shiftKey ? 10 : 1));
    setDraft(null);
    onChange(next);
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
        // Клик по цифре выделяет её целиком: новое число просто печатается поверх
        const el = e.currentTarget;
        requestAnimationFrame(() => el.select());
      }}
      onBlur={() => setDraft(null)}
      style={{ "--chars": Math.max(1, digits) + gaps * 0.45 } as React.CSSProperties}
    />
  );
}

/** Ползунок для прикидки. Для клавиатуры есть поле со стрелками, поэтому ползунок вне порядка табуляции. */
function Slider({ k, value, onChange }: { k: Key; value: number; onChange: (n: number) => void }) {
  const lim = CALC_LIMITS[k];
  const [lo, hi] = lim.slider;
  const v = Math.min(hi, Math.max(lo, value));
  const p = ((v - lo) / (hi - lo)) * 100;
  return (
    <input
      type="range"
      className={s.slider}
      min={lo}
      max={hi}
      step={lim.step}
      value={v}
      onChange={(e) => onChange(Number(e.target.value))}
      tabIndex={-1}
      aria-hidden="true"
      style={{ "--p": `${p}%` } as React.CSSProperties}
    />
  );
}
