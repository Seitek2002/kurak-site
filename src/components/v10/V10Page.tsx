import { Fill } from "@/components/Fill";
import { RESPONSE_TIME, STEPS, dt, htmlLang, type Lang } from "@/content/kurak";
import { V10 } from "@/content/v10";
import { Bundles } from "./Bundles";
import { ChiyHero } from "./ChiyHero";
import { ContactSwitch } from "./Contact";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileBar } from "./MobileBar";
import { Motion } from "./Motion";
import { Cases, ChiySection, Principles, Reviews, Team } from "./Sections";
import { Services, WrapDefs } from "./Services";
import { SmoothScroll } from "./SmoothScroll";
import s from "./V10.module.css";

/**
 * Вариант 10 «Чий». Каждый блок выведен из образа чырмалган чия:
 * первый экран — полотно собирается из восьми пучков; услуги — пучки своего цвета; наборы — маленькие готовые чии;
 * кейсы — полотна с кромкой из цветов направлений; команда — мастера на нитях своего цвета;
 * принципы — нити, которые держат стебли; заявка — станок, на который натягиваются выбранные услуги.
 */
export function V10Page({ lang }: { lang: Lang }) {
  return (
    <div lang={htmlLang(lang)}>
      <WrapDefs />
      <SmoothScroll />
      <Motion />
      <Header lang={lang} />
      <main id="main">
        <ChiyHero lang={lang} />
        <ChiySection lang={lang} />

        <section className={s.section} id="services" aria-labelledby="v10-services">
          <div className={s.wrap}>
            <div className={s.head}>
              <h2 id="v10-services" className={s.h2}>
                {V10.services.title[lang]}
              </h2>
              <p className={s.lede}>{V10.services.lede[lang]}</p>
            </div>
            <Services lang={lang} />
          </div>
        </section>

        <section className={s.section} id="bundles" aria-labelledby="v10-bundles">
          <div className={s.wrap}>
            <div className={s.head}>
              <h2 id="v10-bundles" className={s.h2}>
                {V10.bundles.title[lang]}
              </h2>
              <p className={s.lede}>{V10.bundles.lede[lang]}</p>
            </div>
            <Bundles lang={lang} />
          </div>
        </section>

        <Cases lang={lang} />
        <Team lang={lang} />
        <Principles lang={lang} />
        <Reviews lang={lang} />

        <section className={`${s.section} ${s.contact}`} id="contact" aria-labelledby="v10-contact">
          <div className={s.fringe} aria-hidden="true" />
          <div className={s.wrap}>
            <div className={s.contactHead}>
              <h2 id="v10-contact" className={s.h2}>
                {V10.contact.title[lang]}
              </h2>
              <p className={s.lede}>{V10.contact.lede[lang]}</p>
            </div>
            <h3 className="visually-hidden">{V10.contact.stepsTitle[lang]}</h3>
            <ol className={s.stepsRow}>
              {STEPS.map((st, i) => (
                <li key={st.title.ru} className={s.step}>
                  <span className={s.stepTitle}>{st.title[lang]}</span>
                  <span className={s.stepText}>
                    {i === 0 ? (
                      <>
                        <Fill value={dt(RESPONSE_TIME, lang)} />{" "}
                      </>
                    ) : null}
                    {st.text[lang]}
                  </span>
                </li>
              ))}
            </ol>
            <ContactSwitch lang={lang} />
          </div>
        </section>
      </main>
      <Footer lang={lang} />
      <MobileBar lang={lang} />
    </div>
  );
}
