import { BUNDLES, CATEGORIES, SERVICE_BY_ID, UI, type Lang } from "@/content/kurak";
import { V13_MENU, lowerFirst, servicesCount } from "@/content/v13";
import { Fill } from "../Fill";
import { IconPlus } from "./Icons";
import { Patch } from "./Patch";
import { AddToggle, BundleToggle } from "./Toggles";
import { MenuOpener } from "./MenuOpener";
import { QuiltBar, YourQuilt } from "./YourQuilt";
import s from "./Menu.module.css";

/**
 * Меню услуг (концепт варианта 2): восемь направлений, названных задачами клиента. Внутри услуги:
 * что входит, с чем приходят, кто ведёт и «Добавить в заявку». Добавленная услуга пришивается лоскутом
 * к «Вашему кураку» справа. Направления раскрываются через <details>: работает и без скрипта.
 */
export function Menu({ lang }: { lang: Lang }) {
  return (
    <section id="uslugi" className={`v13-section ${s.section}`} aria-labelledby="uslugi-title">
      <MenuOpener />
      <div className={`v13-container ${s.grid}`}>
        <div className={s.head}>
          <h2 id="uslugi-title" className="v13-h2">
            {V13_MENU.title[lang]}
          </h2>
          <p className="v13-lead">{V13_MENU.lede[lang]}</p>
        </div>

        <div className={s.main}>
          <div className={s.cats}>
            {CATEGORIES.map((c) => (
              <details key={c.id} className={s.cat} id={`cat-${c.id}`}>
                <summary className={s.sum}>
                  <Patch kind={c.id} className={s.catPatch} />
                  <span className={s.sumText}>
                    <h3 className={s.goal}>{c.goal[lang]}</h3>
                    <span className={s.short}>
                      {c.short[lang]}, {servicesCount(c.services.length, lang)}
                    </span>
                  </span>
                  <span className={s.plus} aria-hidden="true">
                    <IconPlus />
                  </span>
                </summary>
                <div className={s.body}>
                  <ul className={s.services}>
                    {c.services.map((svc) => (
                      <li key={svc.id} className={s.svc}>
                        <div className={s.svcText}>
                          <h4 className={s.svcTitle}>{svc.title[lang]}</h4>
                          <p className={s.svcInc}>{svc.includes.map((x) => x[lang]).join(", ")}</p>
                          <p className={s.svcAsk}>
                            <span className={s.askLabel}>{UI.withTask[lang]}:</span> {svc.ask[lang]}
                          </p>
                        </div>
                        <AddToggle id={svc.id} title={svc.title[lang]} lang={lang} className={s.add} />
                      </li>
                    ))}
                  </ul>
                  <p className={s.lead}>
                    {UI.leads[lang]}: {c.lead.name ?? <Fill note="имя руководителя">{lang === "ky" ? "Аты" : "Имя"}</Fill>}, {lowerFirst(c.lead.role[lang])}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className={s.bundles}>
            <h3 className={s.bundlesTitle}>{V13_MENU.bundles[lang]}</h3>
            <ul className={s.bundleList}>
              {BUNDLES.map((b) => (
                <li key={b.id} className={s.bundle}>
                  <div className={s.bundleText}>
                    <h4 className={s.bundleName}>{b.title[lang]}</h4>
                    <p className={s.bundleLine}>{b.line[lang]}</p>
                    <p className={s.bundleSvc}>{b.services.map((id) => SERVICE_BY_ID[id]?.service.title[lang]).filter(Boolean).join(", ")}</p>
                  </div>
                  <span className={s.bundleQuilt} aria-hidden="true">
                    {b.services.map((id) => (
                      <Patch key={id} kind={SERVICE_BY_ID[id]!.category.id} className={s.bundlePatch} />
                    ))}
                  </span>
                  <BundleToggle ids={b.services} title={b.title[lang]} lang={lang} className={s.add} />
                </li>
              ))}
            </ul>
          </div>
          <QuiltBar lang={lang} />
        </div>

        <aside className={s.side} aria-labelledby="v13-quilt-menu">
          <YourQuilt lang={lang} variant="menu" titleId="v13-quilt-menu" />
        </aside>
      </div>
    </section>
  );
}
