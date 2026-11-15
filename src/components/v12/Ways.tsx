"use client";

import { CATEGORIES, TEAM, UI, type Category, type Lang } from "@/content/kurak";
import { PERSON_BY_CATEGORY, SLOT_TEXT, teamPhoto } from "@/content/photos";
import { V12 } from "@/content/v12";
import { useSelection } from "@/store/selection";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { Glyph } from "./Glyph";
import s from "./V12.module.css";

const lcFirst = (x: string) => (/^[A-ZА-ЯЁ]{2}/.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1));

/** Кто ведёт направление: по имени из CATEGORIES, иначе по таблице фото */
function leadPerson(c: Category) {
  const byName = c.lead.name ? TEAM.find((p) => p.name.value.ru === c.lead.name) : undefined;
  return byName?.id ?? PERSON_BY_CATEGORY[c.id];
}

/**
 * Восемь способов, которыми идёт весть. Строка = направление: знак, задача клиента, образ и одна фраза.
 * Раскрывается в услуги (что входит, с чем приходят, «Добавить в заявку»). <details> работает и без JS.
 */
export function Ways({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const toggle = useSelection((st) => st.toggle);

  return (
    <ul className={s.ways}>
      {CATEGORIES.map((c) => {
        const way = V12.ways.list[c.id];
        const inCat = c.services.filter((x) => picked.includes(x.id)).length;
        const person = leadPerson(c);
        const leadName = c.lead.name ?? c.lead.role[lang];
        return (
          <li key={c.id}>
            <details className={s.way} name="v12-ways" id={`way-${c.id}`}>
              <summary className={s.waySum}>
                <Glyph id={c.id} className={s.wayGlyph} />
                <span className={s.wayHead}>
                  <span className={s.wayGoal}>{c.goal[lang]}</span>
                  <span className={s.wayName}>{way.name[lang]}</span>
                </span>
                <span className={s.wayText}>{way.text[lang]}</span>
                <span className={s.wayEnd}>
                  {inCat > 0 && (
                    <span className={s.wayPicked}>
                      {UI.added[lang]}: {inCat}
                    </span>
                  )}
                  <span className={s.wayPlus} aria-hidden="true" />
                </span>
              </summary>

              <div className={s.wayBody}>
                <div className={s.wayLead}>
                  <PhotoSlot
                    kind="person"
                    hideLabel
                    src={teamPhoto(person)}
                    label={`${SLOT_TEXT.portrait[lang]}: ${leadName}`}
                    className={s.wayAvatar}
                  />
                  <span>
                    <span className={s.wayLeadLabel}>{UI.leads[lang]}: </span>
                    {c.lead.name ? (
                      <>
                        <strong>{c.lead.name}</strong>, {lcFirst(c.lead.role[lang])}
                      </>
                    ) : (
                      <strong>{lcFirst(c.lead.role[lang])}</strong>
                    )}
                  </span>
                </div>

                <ul className={s.services} aria-label={`${V12.ways.servicesIn[lang]}: ${c.goal[lang]}`}>
                  {c.services.map((sv) => {
                    const on = picked.includes(sv.id);
                    return (
                      <li key={sv.id} className={s.service} data-on={on || undefined}>
                        <h4 className={s.svTitle}>{sv.title[lang]}</h4>
                        <div className={s.svBlock}>
                          <p className={s.svLabel}>{UI.includes[lang]}</p>
                          <ul className={s.svList}>
                            {sv.includes.map((x) => (
                              <li key={x.ru}>{x[lang]}</li>
                            ))}
                          </ul>
                        </div>
                        <div className={s.svBlock}>
                          <p className={s.svLabel}>{UI.withTask[lang]}</p>
                          <p className={s.svAsk}>{sv.ask[lang]}</p>
                        </div>
                        <button type="button" className={s.addBtn} aria-pressed={on} onClick={() => toggle(sv.id)}>
                          <span className={s.addMark} aria-hidden="true" />
                          {on ? UI.added[lang] : UI.add[lang]}
                          <span className="visually-hidden">: {sv.title[lang]}</span>
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
