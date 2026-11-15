"use client";

import { BUNDLES, CATEGORIES, SERVICE_BY_ID, type Lang } from "@/content/kurak";
import { V4 } from "@/content/v4";
import { useSelection } from "@/store/selection";
import { Piece } from "./Piece";
import { catOf, toneOf, usePicked } from "./Poster";
import s from "./V4.module.css";

/**
 * Готовые наборы, как комбо: деталь каждой услуги набора, название, одна строка и «Добавить набор».
 * Ширина набора по сетке пропорциональна числу деталей (6, 5, 4 из 12 колонок: 5, 4, 3).
 */
export function Bundles({ lang }: { lang: Lang }) {
  const picked = usePicked();
  const addMany = useSelection((st) => st.addMany);
  return (
    <section className={s.bundles} aria-labelledby="v4-bundles-title">
      <div className={s.bundlesHead}>
        <h3 id="v4-bundles-title" className={s.h3}>
          {V4.bundles.title[lang]}
        </h3>
        <p className={s.bundlesIntro}>{V4.bundles.intro[lang]}</p>
      </div>
      <ul className={s.bundleRow}>
        {BUNDLES.map((b) => {
          const ids = b.services.filter((id) => SERVICE_BY_ID[id]);
          const all = ids.every((id) => picked.includes(id));
          const cats = CATEGORIES.filter((c) => ids.some((id) => catOf(id) === c.id));
          return (
            <li key={b.id} className={s.bundle} style={{ ["--n" as string]: ids.length }}>
              <div className={s.bundleArt} aria-hidden="true">
                {ids.map((id) => (
                  <span key={id} className={s.cell} data-tone={toneOf(id)}>
                    <Piece cat={catOf(id)} />
                  </span>
                ))}
              </div>
              <h4 className={s.bundleTitle}>{b.title[lang]}</h4>
              <p className={s.bundleLine}>{b.line[lang]}</p>
              <p className={s.bundleCats}>{cats.map((c) => c.short[lang]).join(", ")}</p>
              <button
                type="button"
                className={`v4-btn v4-btn--line v4-btn--sm ${s.bundleBtn}`}
                onClick={() => addMany(ids)}
                disabled={all}
              >
                {all ? V4.bundles.added[lang] : V4.bundles.add[lang]}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
