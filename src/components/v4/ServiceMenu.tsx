"use client";

import { CATEGORIES, UI, type Category, type Lang } from "@/content/kurak";
import { V4 } from "@/content/v4";
import { useSelection } from "@/store/selection";
import { Piece } from "./Piece";
import { toneOf, usePicked } from "./Poster";
import s from "./V4.module.css";

/** «Ведёт: Бибинур, руководитель ивент-отдела»; если имени ещё нет, только роль */
function leadText(c: Category, lang: Lang) {
  const role = c.lead.role[lang];
  if (!c.lead.name) return role;
  return `${c.lead.name}, ${role.charAt(0).toLowerCase()}${role.slice(1)}`;
}

/**
 * Меню услуг: восемь категорий, названных задачами клиента. Каждая строка раскрывается (<details>,
 * работает и без скрипта): что входит, с чем приходят, кто ведёт и «Добавить в заявку».
 */
export function ServiceMenu({ lang }: { lang: Lang }) {
  const picked = usePicked();
  const toggle = useSelection((st) => st.toggle);

  return (
    <ul className={s.menu}>
      {CATEGORIES.map((c) => {
        const inBrief = c.services.filter((x) => picked.includes(x.id)).length;
        return (
          <li key={c.id} className={s.row} id={`v4-cat-${c.id}`}>
            <details className={s.det}>
              <summary className={s.rowBtn}>
                <Piece cat={c.id} className={s.rowPiece} />
                <h3 className={s.rowGoal}>{c.goal[lang]}</h3>
                <span className={s.rowMeta}>
                  <span>{c.short[lang]}</span>
                  {inBrief > 0 ? (
                    <span className={s.rowCount}>
                      {inBrief} {V4.services.inBrief[lang]}
                    </span>
                  ) : null}
                </span>
                <span className={s.rowToggle} aria-hidden="true" />
              </summary>
              <div className={s.panel}>
                <p className={s.panelLead}>
                  <span className={s.panelLeadLabel}>{UI.leads[lang]}</span> {leadText(c, lang)}
                </p>
                <ul className={s.svcList} data-count={c.services.length}>
                  {c.services.map((sv) => {
                    const added = picked.includes(sv.id);
                    return (
                      <li key={sv.id} className={s.svc}>
                        <h4 className={s.svcTitle}>{sv.title[lang]}</h4>
                        <dl className={s.svcDl}>
                          <dt>{UI.withTask[lang]}</dt>
                          <dd>{sv.ask[lang]}</dd>
                          <dt>{UI.includes[lang]}</dt>
                          <dd>
                            <ul className={s.inc}>
                              {sv.includes.map((x, i) => (
                                <li key={i}>{x[lang]}</li>
                              ))}
                            </ul>
                          </dd>
                        </dl>
                        <button
                          type="button"
                          className={`v4-btn v4-btn--line v4-btn--sm ${s.addBtn}`}
                          aria-pressed={added}
                          onClick={() => toggle(sv.id)}
                        >
                          <span className={s.addMark} data-tone={toneOf(sv.id)} aria-hidden="true">
                            <Piece cat={c.id} />
                          </span>
                          {added ? UI.added[lang] : UI.add[lang]}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
