import { FAQ, PRINCIPLES, RESPONSE_TIME, STEPS, dt, type Lang } from "@/content/kurak";
import { V13_HOW } from "@/content/v13";
import { Fill } from "../Fill";
import { IconPlus } from "./Icons";
import s from "./How.module.css";

/** Как работаем: четыре правила, три шага после заявки и ответы на частые вопросы. */
export function How({ lang }: { lang: Lang }) {
  return (
    <section id="kak" className={`v13-section ${s.section}`} aria-labelledby="kak-title">
      <div className="v13-container">
        <h2 id="kak-title" className={`v13-h2 ${s.title}`}>
          {V13_HOW.title[lang]}
        </h2>

        <ol className={s.principles}>
          {PRINCIPLES.map((p) => (
            <li key={p.title.ru} className={s.principle}>
              <h3 className={s.pTitle}>{p.title[lang]}</h3>
              <p className={s.pText}>{p.text[lang]}</p>
            </li>
          ))}
        </ol>

        <div className={s.after}>
          <h3 className={s.afterTitle}>{V13_HOW.after[lang]}</h3>
          <ol className={s.steps}>
            {STEPS.map((st, i) => (
              <li key={st.title.ru} className={s.step}>
                <span className={s.stepNum} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={s.stepTitle}>{st.title[lang]}</span>
                <span className={s.stepText}>{st.text[lang]}</span>
                {i === 0 && (
                  <span className={s.stepTime}>
                    {V13_HOW.answer[lang]} <Fill value={dt(RESPONSE_TIME, lang)} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className={s.faq} id="voprosy">
          <h3 className={s.faqTitle}>{V13_HOW.faqTitle[lang]}</h3>
          <div className={s.qs}>
            {/* «Что нужно, чтобы начать?» повторяет шаги выше: здесь его не дублируем */}
            {FAQ.slice(0, -1).map((f) => (
              <details key={f.q.ru} className={s.qa}>
                <summary className={s.q}>
                  <span>{f.q[lang]}</span>
                  <span className={s.plus} aria-hidden="true">
                    <IconPlus />
                  </span>
                </summary>
                <p className={s.a}>{f.a[lang]}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
