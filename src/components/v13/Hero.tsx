import { UI, type Lang } from "@/content/kurak";
import { V13_HERO, V13_UI } from "@/content/v13";
import { Contacts } from "./Contacts";
import { Quiz } from "./Quiz";
import { PortfolioShare } from "./Share";
import s from "./Hero.module.css";

/**
 * Первый экран по требованиям заказчицы: кто мы и где (фраза в H1), что делаем, «Оставить заявку»,
 * контакты, «Скачать портфолио (PDF)» с «Поделиться». Справа опрос: три вопроса и персональный план.
 */
export function Hero({ lang }: { lang: Lang }) {
  return (
    <section className={s.hero} aria-labelledby="v13-title">
      <div className={`v13-container ${s.grid}`}>
        <h1 id="v13-title" className={s.title}>
          {V13_HERO.title[lang]}
        </h1>
        <div className={s.copy}>
          <p className={s.lede}>{V13_HERO.lede[lang]}</p>
          <div className={s.act}>
            <a href="#zayavka" className={`v13-btn ${s.apply}`}>
              {UI.apply[lang]}
            </a>
            <PortfolioShare lang={lang} className={s.pf} linkClass={s.pfLink} shareClass={s.share} statusClass={s.shareStatus} />
          </div>
          <div className={s.reach}>
            <h2 className={s.reachTitle}>{V13_UI.contacts[lang]}</h2>
            <Contacts lang={lang} className={s.contacts} itemClass={s.contact} labelClass={s.cLabel} valueClass={s.cValue} />
          </div>
        </div>
        <div className={s.quiz}>
          <Quiz lang={lang} />
        </div>
      </div>
    </section>
  );
}
