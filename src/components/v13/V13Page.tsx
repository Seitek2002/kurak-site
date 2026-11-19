import { htmlLang, type Lang } from "@/content/kurak";
import { V13_CALC } from "@/content/v13";
import { Calc } from "./Calc";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { How } from "./How";
import { Menu } from "./Menu";
import { PatchDefs } from "./Patch";
import { People } from "./People";
import { Proof } from "./Proof";
import { Request } from "./Request";
import { SmoothScroll } from "./SmoothScroll";
import { Story } from "./Story";
import s from "./Page.module.css";

/**
 * Вариант 13 «Сборка»: одна история «кто мы → подберём план → как мы шьём → посчитайте → кейсы и люди → заявка».
 * Опрос (вариант 3), лоскутная история и меню-подборка (вариант 2), калькулятор (вариант 6) в цветах логотипа.
 */
export function V13Page({ lang }: { lang: Lang }) {
  return (
    <div lang={htmlLang(lang)} className={s.page}>
      <PatchDefs />
      <SmoothScroll />
      <Header lang={lang} />
      <main id="main">
        <Hero lang={lang} />
        <Story lang={lang} />
        <Menu lang={lang} />
        <section id="raschet" className={`v13-section ${s.calc}`} aria-labelledby="raschet-title">
          <div className="v13-container">
            <div className={s.calcHead}>
              <h2 id="raschet-title" className="v13-h2">
                {V13_CALC.title[lang]}
              </h2>
              <p className="v13-lead">{V13_CALC.legend[lang]}</p>
            </div>
            <Calc lang={lang} />
          </div>
        </section>
        <Proof lang={lang} />
        <People lang={lang} />
        <How lang={lang} />
        <Request lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
