import { create } from "zustand";
import type { Lang } from "@/content/kurak";
import { V6_CALC } from "@/content/v6";

/**
 * Калькулятор потерянных заявок: общее состояние для первого экрана, расчёта и кнопки «Вернуть эти деньги».
 * Не сохраняется: это цифры посетителя на одну сессию. Значения по умолчанию одинаковы на сервере и в браузере,
 * поэтому без скрипта страница показывает тот же расчёт.
 */
export type CalcValues = { leads: number; pct: number; check: number };
type CalcState = CalcValues & {
  touched: boolean;
  /** Прикладывать ли расчёт к заявке (посетитель может убрать строку из «Ваша заявка») */
  included: boolean;
  set: (patch: Partial<CalcValues>) => void;
  setIncluded: (v: boolean) => void;
};

export const CALC_DEFAULTS: CalcValues = { leads: 300, pct: 30, check: 3000 };

/** Границы полей и ползунков. Поле принимает больше, чем ползунок: ползунок для прикидки, поле для точной цифры */
export const CALC_LIMITS: Record<keyof CalcValues, { min: number; max: number; step: number; slider: [number, number] }> = {
  leads: { min: 0, max: 1_000_000, step: 10, slider: [10, 2000] },
  pct: { min: 0, max: 100, step: 5, slider: [0, 80] },
  check: { min: 0, max: 100_000_000, step: 500, slider: [500, 50_000] },
};

export const useCalc = create<CalcState>()((set) => ({
  ...CALC_DEFAULTS,
  touched: false,
  included: true,
  set: (patch) => set({ ...patch, touched: true }),
  setIncluded: (included) => set({ included }),
}));

export const lostLeads = (v: CalcValues) => Math.round((v.leads * v.pct) / 100);
export const monthLoss = (v: CalcValues) => Math.round(((v.leads * v.pct) / 100) * v.check);
export const yearLoss = (v: CalcValues) => monthLoss(v) * 12;

/* ------------------------------------------------------------------ */
/* Числа: группы разрядов неразрывным пробелом, одинаково на сервере и в браузере */
/* ------------------------------------------------------------------ */

export const NBSP = " ";

export function groupDigits(n: number) {
  const s = String(Math.round(Math.abs(n)));
  return (n < 0 ? "−" : "") + s.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

export const som = (n: number) => `${groupDigits(n)}${NBSP}сом`;

/** Подписи оси: 0, 500 тыс, 1 млн, 1,5 млн */
export function compact(n: number, lang: Lang) {
  if (n === 0) return "0";
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${trim(v)}${NBSP}${V6_CALC.million[lang]}`;
  }
  if (n >= 1000) return `${trim(n / 1000)}${NBSP}${V6_CALC.thousand[lang]}`;
  return groupDigits(n);
}
const trim = (v: number) => (Math.round(v * 10) / 10).toString().replace(".", ",");

/** Верх оси и шаг сетки: 3–5 линий с круглыми значениями */
export function niceScale(max: number) {
  if (max <= 0) return { top: 1, step: 1 };
  const rough = max / 3;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? 10 * pow;
  return { top: Math.ceil(max / step) * step, step };
}

/* ------------------------------------------------------------------ */
/* Диагноз: какая дыра и какие услуги её закрывают                     */
/* ------------------------------------------------------------------ */

export type Diagnosis = { key: "high" | "mid" | "low"; few: boolean; services: string[] };

export function diagnose(v: CalcValues): Diagnosis {
  const key = v.pct >= 30 ? "high" : v.pct >= 15 ? "mid" : "low";
  const services = key === "high" ? ["sa-crm", "sa-dept"] : key === "mid" ? ["sa-dept", "sa-crm"] : ["smm-target", "smm-strategy"];
  const few = v.leads < 100 && key !== "low";
  if (few) services.push("smm-target");
  return { key, few, services };
}

/** Есть ли уже строка расчёта в тексте задачи (на любом из двух языков) */
export const hasPrefill = (task: string) => [V6_CALC.prefillMark.ru, V6_CALC.prefillMark.ky].some((m) => task.includes(m));

/** Строка для поля «Задача»: цифры расчёта на языке страницы */
export function prefillText(v: CalcValues, lang: Lang) {
  return V6_CALC.prefill({
    leads: groupDigits(v.leads),
    pct: String(v.pct),
    check: som(v.check),
    month: som(monthLoss(v)),
    year: som(yearLoss(v)),
  })[lang];
}
