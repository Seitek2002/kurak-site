import { BRAND_TEXT, TEAM, dt, type Lang } from "@/content/kurak";
import { SLOT_TEXT, teamPhoto } from "@/content/photos";
import { V13_PEOPLE } from "@/content/v13";
import { Fill } from "../Fill";
import { PhotoSlot } from "../brand/PhotoSlot";
import { Patch } from "./Patch";
import s from "./People.module.css";

/**
 * Команда: проект-менеджер на весь проект крупно, руководители направлений рядом.
 * Портреты пока плейсхолдеры PhotoSlot: фото подставятся из photos.ts во всех вариантах сразу.
 */
export function People({ lang }: { lang: Lang }) {
  const [pm, ...leads] = TEAM;
  return (
    <section id="komanda" className={`v13-section ${s.section}`} aria-labelledby="komanda-title">
      <div className="v13-container">
        <div className={s.head}>
          <h2 id="komanda-title" className="v13-h2">
            {V13_PEOPLE.title[lang]}
          </h2>
          <p className="v13-lead">{V13_PEOPLE.lede[lang]}</p>
        </div>
        <div className={s.grid}>
          {pm && (
            <article className={`${s.person} ${s.pm}`} aria-labelledby={`p-${pm.id}`}>
              <PhotoSlot src={teamPhoto(pm.id)} label={`${SLOT_TEXT.portrait[lang]}: ${pm.name.value[lang]}`} kind="person" className={s.photo} />
              <div className={s.text}>
                <h3 id={`p-${pm.id}`} className={s.name}>
                  <Fill value={dt(pm.name, lang)} />
                </h3>
                <p className={s.role}>{pm.role[lang]}</p>
                {pm.exp && (
                  <p className={s.exp}>
                    <Fill value={dt(pm.exp, lang)} />
                  </p>
                )}
                <p className={s.line}>{pm.line[lang]}</p>
              </div>
            </article>
          )}
          <ul className={s.leads}>
            {leads.map((p) => (
              <li key={p.id}>
                <article className={s.person} aria-labelledby={`p-${p.id}`}>
                  <div className={s.photoWrap}>
                    <PhotoSlot src={teamPhoto(p.id)} label={`${SLOT_TEXT.portrait[lang]}: ${p.role[lang]}`} kind="person" className={s.photo} />
                    <Patch kind={p.category} className={s.tag} />
                  </div>
                  <div className={s.text}>
                    <h3 id={`p-${p.id}`} className={s.nameS}>
                      <Fill value={dt(p.name, lang)} />
                    </h3>
                    <p className={s.role}>{p.role[lang]}</p>
                    {p.exp && (
                      <p className={s.exp}>
                        <Fill value={dt(p.exp, lang)} />
                      </p>
                    )}
                    <p className={s.lineS}>{p.line[lang]}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
        <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
      </div>
    </section>
  );
}
