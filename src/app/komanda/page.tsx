import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_INDEX } from "@/content/services";
import { SITE, STATS, TEAM, VALUES } from "@/content/site";
import { Portrait } from "@/components/Portrait";
import { Fill } from "@/components/Fill";
import { Patch } from "@/components/Patch";
import s from "./komanda.module.css";

export const metadata: Metadata = {
  title: "Команда",
  description: "Руководители направлений Курака: кто ведёт SMM, PR, ивенты, брендинг и продажи. Ценности агентства и вакансии.",
  alternates: { canonical: "/komanda" },
};

export default function TeamPage() {
  return (
    <>
      <section className={`${s.hero} on-field`} aria-labelledby="team-title">
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <h1 id="team-title" className={s.title}>
              Люди, которые сошьют ваш проект
            </h1>
            <p className={s.lede}>
              Курак по-кыргызски значит лоскутное шитьё: из разных кусков ткани мастерица собирает одно полотно. Мы так же собираем маркетинг.
            </p>
          </div>
          <ul className={s.scene} aria-label="Руководители направлений">
            {TEAM.map((p, i) => (
              <li key={p.role} className={s.sceneItem} style={{ "--i": i } as React.CSSProperties}>
                <Portrait person={p} />
                <span className="visually-hidden">
                  {p.name.draft ? p.role : `${p.name.value}, ${p.role}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="values-title">
        <div className="container">
          <h2 id="values-title" className={`h-section ${s.sectionTitle}`}>
            Во что мы верим
          </h2>
          <ol className={s.values}>
            {VALUES.map((v, i) => (
              <li key={v.title} className={s.value} data-cat={(["smm", "brand", "sales"] as const)[i]}>
                <span className={s.valuePatch} aria-hidden="true">
                  <Patch cat={(["smm", "brand", "sales"] as const)[i]} />
                </span>
                <h3 className={s.valueTitle}>{v.title}</h3>
                <p>{v.text}</p>
                <p className={s.example}>
                  <Fill value={v.example} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="leads-title">
        <div className="container">
          <h2 id="leads-title" className={`h-section ${s.sectionTitle}`}>
            Кто ведёт каждое направление
          </h2>
          <ul className={s.leads}>
            {TEAM.map((p) => (
              <li key={p.role} className={s.lead} data-cat={p.category}>
                <Portrait person={p} />
                <div className={s.leadText}>
                  <p className={s.dir}>{CATEGORY_INDEX[p.category].goal}</p>
                  <h3 className={s.name}>
                    <Fill value={p.name} note="имя" />
                  </h3>
                  <p className={s.role}>{p.role}</p>
                  {p.exp && <p className={s.exp}><Fill value={p.exp} /></p>}
                  <p>{p.line}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className={s.partners}>
            Автоматизацию и приложения делаем с проверенными партнёрами. Отвечаем за результат мы, и общаетесь вы тоже с нами.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="history-title">
        <div className={`container ${s.history}`}>
          <h2 id="history-title" className={`h-section ${s.sectionTitle}`}>
            Как мы росли
          </h2>
          <div className={s.historyBody}>
            <p className={s.story}>
              <Fill note="история">
                Когда и почему появился Курак, почему такое название, первые клиенты и главные повороты. Расскажет собственница.
              </Fill>
            </p>
            <dl className={s.stats}>
              {STATS.map((x) => (
                <div key={x.label}>
                  <dt>{x.label}</dt>
                  <dd><Fill value={x.value} /></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className={`${s.jobs} on-field`} aria-labelledby="jobs-title">
        <div className={`container ${s.jobsGrid}`}>
          <h2 id="jobs-title" className={`h-section ${s.jobsTitle}`}>
            Хотите к&nbsp;нам?
          </h2>
          <div className={s.jobsBody}>
            <p className={s.lede}>
              Ищем людей, которым тесно в одном направлении. Расскажите, что умеете, и пришлите пару работ.
            </p>
            <p className={s.jobsContact}>
              Пишите в Telegram{" "}
              {SITE.contacts.telegramHref ? (
                <a className="link" href={SITE.contacts.telegramHref}>{SITE.contacts.telegram.value}</a>
              ) : (
                <Fill value={SITE.contacts.telegram} />
              )}
            </p>
            <Link href="/#zayavka" className="btn btn--quiet">
              Или обсудим вашу задачу
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
