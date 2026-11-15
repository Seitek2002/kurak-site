"use client";

import { CATEGORIES, type Lang } from "@/content/kurak";
import { useSelection } from "@/store/selection";
import s from "./V7Form.module.css";

/** Облако контурных таблеток со всеми услугами, как на референсе. Нажатие кладёт услугу в заявку. */
export function ServiceCloud({ lang, label }: { lang: Lang; label: string }) {
  const picked = useSelection((st) => st.picked);
  const toggle = useSelection((st) => st.toggle);
  return (
    <div className={s.cloud} role="group" aria-label={label}>
      <p className={s.cloudLabel} aria-hidden="true">
        {label}
      </p>
      <ul className={s.cloudList}>
        {CATEGORIES.flatMap((c) =>
          c.services.map((sv) => {
            const on = picked.includes(sv.id);
            return (
              <li key={sv.id}>
                <button type="button" className={s.cloudPill} aria-pressed={on} onClick={() => toggle(sv.id)}>
                  {sv.title[lang]}
                </button>
              </li>
            );
          }),
        )}
      </ul>
    </div>
  );
}
