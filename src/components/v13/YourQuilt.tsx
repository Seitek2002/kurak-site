"use client";

import { SERVICE_BY_ID, type Lang } from "@/content/kurak";
import { V13_CALC, V13_MENU, V13_QUIZ, servicesCount } from "@/content/v13";
import { useSelection } from "@/store/selection";
import { IconClose } from "./Icons";
import { Patch, type PatchKind } from "./Patch";
import { findTaskLine, setTaskLine } from "./task";
import s from "./YourQuilt.module.css";

const PLAN_MARKS = [V13_QUIZ.mark.ru, V13_QUIZ.mark.ky];
const CALC_MARKS = [V13_CALC.mark.ru, V13_CALC.mark.ky];
const MIN_CELLS = 8;

type Item = { key: string; kind: PatchKind; name: string; sub?: string; onRemove: () => void };

/**
 * «Ваш курак»: всё, что человек отметил на странице, сшивается в одно полотно.
 * Лоскут плана (из опроса), лоскут расчёта (из калькулятора) и по лоскуту на каждую услугу.
 * Лоскут влетает и пришивается стежком, когда появляется (CSS-анимация при монтировании); убрать можно любой. Тот же курак стоит у формы заявки.
 */
/** Лоскуты курака: план, расчёт и услуги подборки, с тем, как каждый убрать */
export function useQuiltItems(lang: Lang) {
  const picked = useSelection((st) => st.picked);
  const task = useSelection((st) => st.draft.task);
  const remove = useSelection((st) => st.remove);

  const plan = findTaskLine(task, PLAN_MARKS);
  const calc = findTaskLine(task, CALC_MARKS);

  const items: Item[] = [];
  if (plan) items.push({ key: "plan", kind: "plan", name: V13_MENU.plan[lang], sub: plan.replace(/^[^:]+:\s*/, ""), onRemove: () => setTaskLine(PLAN_MARKS, null) });
  if (calc) items.push({ key: "calc", kind: "calc", name: V13_MENU.calc[lang], sub: calc.replace(/^[^:]+:\s*/, "").split(". ")[1] ?? "", onRemove: () => setTaskLine(CALC_MARKS, null) });
  picked.forEach((id) => {
    const hit = SERVICE_BY_ID[id];
    if (hit) items.push({ key: id, kind: hit.category.id, name: hit.service.title[lang], sub: hit.category.short[lang], onRemove: () => remove(id) });
  });
  return { items, services: picked.filter((id) => SERVICE_BY_ID[id]).length };
}

export function YourQuilt({ lang, variant, titleId }: { lang: Lang; variant: "menu" | "form"; titleId: string }) {
  const { items, services } = useQuiltItems(lang);
  const empty = Math.max(0, MIN_CELLS - items.length);

  return (
    <div className={s.panel} data-variant={variant}>
      <div className={s.head}>
        <h3 id={titleId} className={s.title}>
          {V13_MENU.quilt[lang]}
        </h3>
        <p className={s.count} aria-live="polite">
          {servicesCount(services, lang)} {V13_MENU.inRequest[lang]}
        </p>
      </div>

      <div className={s.quilt} aria-hidden="true">
        {items.map((it) => (
          <span key={it.key} className={s.cell}>
            <Patch kind={it.kind} stitch className={s.patch} />
          </span>
        ))}
        {Array.from({ length: empty }, (_, i) => (
          <span key={`e${i}`} className={`${s.cell} ${s.empty}`} />
        ))}
      </div>

      {items.length === 0 ? (
        <p className={s.emptyText}>{V13_MENU.quiltEmpty[lang]}</p>
      ) : (
        <ul className={s.list}>
          {items.map((it) => (
            <li key={it.key} className={s.row}>
              <Patch kind={it.kind} className={s.rowPatch} />
              <span className={s.rowText}>
                <span className={s.rowName}>{it.name}</span>
                {it.sub && <span className={s.rowSub}>{it.sub}</span>}
              </span>
              <button type="button" className={s.remove} onClick={it.onRemove} aria-label={V13_MENU.removeItem(it.name)[lang]}>
                <IconClose />
              </button>
            </li>
          ))}
        </ul>
      )}

      {variant === "menu" && (
        <a href="#zayavka" className={`v13-btn v13-btn--quiet ${s.go}`}>
          {V13_MENU.toForm[lang]}
        </a>
      )}
    </div>
  );
}

/**
 * Телефон и планшет: пока человек листает меню, внизу экрана видна полоска его курака,
 * чтобы каждая добавленная услуга пришивалась на глазах. На широком экране курак и так стоит сбоку.
 */
export function QuiltBar({ lang }: { lang: Lang }) {
  const { items, services } = useQuiltItems(lang);
  if (items.length === 0) return null;
  const shown = items.slice(-6);
  return (
    <div className={s.bar}>
      <span className={s.barQuilt} aria-hidden="true">
        {shown.map((it) => (
          <span key={it.key} className={s.barCell}>
            <Patch kind={it.kind} className={s.patch} />
          </span>
        ))}
      </span>
      <span className={s.barText} aria-live="polite">
        {V13_MENU.quilt[lang]}: {servicesCount(services, lang)}
      </span>
      <a href="#zayavka" className={s.barGo}>
        {V13_MENU.toForm[lang]}
      </a>
    </div>
  );
}
