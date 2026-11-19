import { type Lang } from "@/content/kurak";
import { V13_FORM } from "@/content/v13";
import { RequestForm } from "./RequestForm";
import { YourQuilt } from "./YourQuilt";
import s from "./Request.module.css";

/** Заявка на поле марены: слева «Ваш курак» (план, услуги, расчёт), справа три поля и кнопка. */
export function Request({ lang }: { lang: Lang }) {
  return (
    <section id="zayavka" className={s.section} aria-labelledby="zayavka-title">
      <div className={`v13-container ${s.grid}`}>
        <div className={s.side}>
          <div className={s.head}>
            <h2 id="zayavka-title" className="v13-h2">
              {V13_FORM.title[lang]}
            </h2>
            <p className={s.lede}>{V13_FORM.lede[lang]}</p>
          </div>
          <YourQuilt lang={lang} variant="form" titleId="v13-quilt-form" />
        </div>
        <div className={s.card}>
          <RequestForm lang={lang} />
        </div>
      </div>
    </section>
  );
}
