import Link from "next/link";
import { SITE } from "@/content/site";
import { QuiltHero } from "./QuiltHero";
import s from "./Hero.module.css";

export function Hero() {
  const hasPdf = SITE.portfolioPdf.endsWith(".pdf");
  return (
    <section className={`${s.hero} on-field`} aria-labelledby="hero-title">
      <div className={`container ${s.grid}`}>
        <div className={s.copy}>
          <h1 id="hero-title" className={s.title}>
            Сшиваем маркетинг в&nbsp;одну систему
          </h1>
          <p className={s.lede}>{SITE.promise}</p>
          <div className={s.actions}>
            <Link href="#zayavka" className="btn">
              Обсудить задачу
            </Link>
            <a href={SITE.portfolioPdf} className={`link ${s.pdf}`} {...(hasPdf ? { download: true } : {})}>
              {hasPdf ? "Портфолио в PDF" : "Кейсы с результатами"}
            </a>
          </div>
        </div>
        <QuiltHero />
      </div>
    </section>
  );
}
