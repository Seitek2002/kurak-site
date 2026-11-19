"use client";

import { useSelection } from "@/store/selection";

/**
 * Строки в поле «Задача», которые пришивают к заявке план из опроса и расчёт из калькулятора.
 * Каждая строка начинается с метки («План с сайта:», «Расчёт с сайта:» на любом из двух языков),
 * по ней строку можно заменить, убрать и показать лоскутом в «Вашем кураке».
 */
export function setTaskLine(marks: string[], line: string | null) {
  const sel = useSelection.getState();
  const rest = sel.draft.task
    .split("\n")
    .filter((l) => !marks.some((m) => l.startsWith(m)))
    .join("\n")
    .trim();
  sel.setDraft({ task: line ? (rest ? `${line}\n${rest}` : line) : rest });
}

export function findTaskLine(task: string, marks: string[]) {
  return task.split("\n").find((l) => marks.some((m) => l.startsWith(m))) ?? null;
}
