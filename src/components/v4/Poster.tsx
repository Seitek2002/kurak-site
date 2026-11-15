"use client";

import { CATEGORIES, FORM, SERVICE_BY_ID, UI, type Lang } from "@/content/kurak";
import type { CategoryId } from "@/content/services";
import { V4, countPieces } from "@/content/v4";
import { useSelection } from "@/store/selection";
import { Piece } from "./Piece";
import s from "./V4.module.css";

/** Порядковый номер услуги во всём меню: от него зависит расцветка детали, она не меняется от соседей */
const ORDER: Record<string, number> = Object.fromEntries(
  CATEGORIES.flatMap((c) => c.services.map((x) => x.id)).map((id, i) => [id, i]),
);
const TONES = ["red", "ink", "fill", "well"] as const;
export const toneOf = (id: string) => TONES[(ORDER[id] ?? 0) % TONES.length];
/** Категория услуги: от неё зависит фигура детали */
export const catOf = (id: string): CategoryId => SERVICE_BY_ID[id]?.category.id ?? "smm";

/** Только известные услуги: в localStorage могли остаться id из старых версий меню */
export function usePicked() {
  const picked = useSelection((st) => st.picked);
  return picked.filter((id) => SERVICE_BY_ID[id]);
}

/** Полотно-плакат: детали выбранных услуг в сетке на четыре колонки, пустые клетки как раскрой */
function Composition({ ids, min = 8, cols = 4, className }: { ids: string[]; min?: number; cols?: number; className?: string }) {
  const slots = Math.max(min, Math.ceil(ids.length / cols) * cols);
  return (
    <div className={`${s.posterGrid} ${className ?? ""}`} aria-hidden="true">
      {Array.from({ length: slots }, (_, i) => {
        const id = ids[i];
        if (!id) {
          const ghost = CATEGORIES[i % CATEGORIES.length]?.id ?? "smm";
          return (
            <span key={`empty-${i}`} className={s.cellEmpty}>
              <Piece cat={ghost} className={s.ghost} />
            </span>
          );
        }
        return (
          <span key={id} className={`${s.cell} ${s.cellIn}`} data-tone={toneOf(id)}>
            <Piece cat={catOf(id)} />
          </span>
        );
      })}
    </div>
  );
}

/** Живой курак рядом с меню услуг: детали ложатся сюда при каждом добавлении */
export function LivePoster({ lang }: { lang: Lang }) {
  const ids = usePicked();
  const clear = useSelection((st) => st.clear);
  return (
    <aside className={s.aside} aria-labelledby="v4-live-title">
      <div className={s.posterHead}>
        <h3 id="v4-live-title" className={s.posterTitle}>
          {V4.poster.title[lang]}
        </h3>
        <p className={s.posterCount} role="status">
          {countPieces(ids.length, lang)}
        </p>
      </div>
      <Composition ids={ids} min={9} cols={3} className={s.posterLive} />
      {ids.length === 0 ? (
        <p className={s.posterEmpty}>{V4.poster.empty[lang]}</p>
      ) : (
        <div className={s.posterActions}>
          <a className="v4-btn v4-btn--line" href="#brief">
            {V4.poster.toBrief[lang]}
          </a>
          <button type="button" className={`v4-link ${s.textBtn}`} onClick={clear}>
            {V4.poster.clear[lang]}
          </button>
        </div>
      )}
    </aside>
  );
}

/** Курак у формы: тот же плакат и список услуг, каждую можно убрать */
export function BriefPoster({ lang }: { lang: Lang }) {
  const ids = usePicked();
  const remove = useSelection((st) => st.remove);
  return (
    <div className={s.briefPoster}>
      <div className={s.posterHead}>
        <h3 className={s.posterTitle}>{FORM.picked[lang]}</h3>
        <p className={s.posterCount}>{countPieces(ids.length, lang)}</p>
      </div>
      <Composition ids={ids} min={4} />
      {ids.length === 0 ? (
        <p className={s.posterEmpty}>
          {FORM.empty[lang]}{" "}
          <a className="v4-link" href="#services">
            {V4.poster.toMenu[lang]}
          </a>
        </p>
      ) : (
        <ul className={s.pickedList} aria-label={V4.poster.list[lang]}>
          {ids.map((id) => {
            const entry = SERVICE_BY_ID[id];
            if (!entry) return null;
            const { service, category } = entry;
            return (
              <li key={id} className={s.pickedItem}>
                <span className={s.pickedTone} data-tone={toneOf(id)} aria-hidden="true">
                  <Piece cat={category.id} />
                </span>
                <span className={s.pickedName}>{service.title[lang]}</span>
                <button
                  type="button"
                  className={s.pickedRemove}
                  onClick={() => remove(id)}
                  aria-label={`${UI.remove[lang]}: ${service.title[lang]}`}
                >
                  {UI.remove[lang]}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Мини-курак для шапки и нижней панели: до шести деталей и счётчик */
export function MiniPoster({ lang, className }: { lang: Lang; className?: string }) {
  const ids = usePicked();
  const shown = ids.slice(-6);
  return (
    <a
      href="#brief"
      className={`${s.mini} ${className ?? ""}`}
      aria-label={`${V4.poster.mini[lang]} ${ids.length}`}
      data-empty={ids.length === 0 || undefined}
    >
      <span className={s.miniRow} aria-hidden="true">
        {shown.length === 0 ? (
          <span className={s.miniEmpty} />
        ) : (
          shown.map((id) => (
            <span key={id} className={`${s.miniCell} ${s.cellIn}`} data-tone={toneOf(id)}>
              <Piece cat={catOf(id)} />
            </span>
          ))
        )}
      </span>
      <span className={s.miniLabel} aria-hidden="true">
        {V4.poster.miniLabel[lang]}
      </span>
      <span className={s.miniCount} aria-hidden="true">
        {ids.length}
      </span>
    </a>
  );
}
