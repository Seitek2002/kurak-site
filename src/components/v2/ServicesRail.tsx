import { CATEGORIES } from "@/content/services";
import { Patch } from "../Patch";
import { Fill } from "../Fill";
import { AddButton } from "./AddButton";
import { Scene } from "./Scene";
import s from "./ServicesRail.module.css";

/**
 * Меню услуг лентой: на десктопе секция закрепляется и листается вбок,
 * у каждого направления своя панель цвета лоскута. На телефоне и без движения панели идут столбиком.
 */
export function ServicesRail() {
  return (
    <section id="uslugi" className={s.section} aria-labelledby="uslugi-title">
      <Scene target="uslugi" scene="rail" />
      <div className={s.track} data-track>
        <div className={`${s.panel} ${s.intro}`}>
          <h2 id="uslugi-title" className={s.introTitle}>
            Меню услуг. Берите лоскуты, которые нужны
          </h2>
          <p className={s.introText}>
            Отмечайте услуги в панелях. Подборка соберётся в шапке, сохранится на этом устройстве и уйдёт вместе с заявкой.
          </p>
          <span className={s.hint} aria-hidden="true">
            <svg viewBox="0 0 64 16"><path d="M0 8h60M52 2l8 6-8 6" /></svg>
          </span>
        </div>

        {CATEGORIES.map((c) => (
          <article key={c.id} id={`cat-${c.id}`} className={s.panel} data-cat={c.id} data-panel aria-labelledby={`rail-${c.id}`}>
            <div className={s.art} data-art aria-hidden="true">
              <Patch cat={c.id} plain />
            </div>
            <div className={s.top}>
              <span className={s.num}>{c.n}</span>
              <span className={s.short}>{c.short}</span>
            </div>
            <h3 id={`rail-${c.id}`} className={s.goal} data-goal>
              {c.goal}
            </h3>
            <ul className={s.list}>
              {c.services.map((svc) => (
                <li key={svc.id} className={s.item}>
                  <div className={s.itemText}>
                    <h4 className={s.itemTitle}>{svc.title}</h4>
                    <p className={s.itemInc}>{svc.includes.join(", ")}</p>
                  </div>
                  <AddButton id={svc.id} title={svc.title} className={s.add} iconClass={s.addIcon} />
                </li>
              ))}
            </ul>
            <p className={s.lead}>
              Ведёт: {c.lead.name ? c.lead.name : <Fill note="имя руководителя">Имя</Fill>}, {c.lead.role.charAt(0).toLowerCase() + c.lead.role.slice(1)}
            </p>
          </article>
        ))}
      </div>
      <div className={s.progress} aria-hidden="true">
        <span data-progress />
      </div>
    </section>
  );
}
