import {
  ADDRESS,
  BRAND_TEXT,
  CASES,
  CATEGORIES,
  CHANNELS,
  CLIENT_LOGOS,
  EMAIL,
  PORTFOLIO_HREF,
  PRINCIPLES,
  RESPONSE_TIME,
  REVIEWS,
  STATS,
  STEPS,
  TEAM,
  UI,
  VALUES,
  dt,
  htmlLang,
  type Lang,
} from "@/content/kurak";
import type { CategoryId } from "@/content/services";
import { V5 } from "@/content/v5";
import { KurakLogo, KURAK_TAGLINE } from "../brand/KurakLogo";
import { Fill } from "../Fill";
import { Calendar } from "./Calendar";
import { Shape, Teeth, Thread } from "./Geometry";
import { CAT_SHAPE, CAT_TONE, SECTIONS } from "./data";
import { Header, LangSwitch, MobileBar } from "./Header";
import { LeadForm } from "./LeadForm";
import { Portrait } from "./Portrait";
import { Bundles, Services } from "./Services";
import { YearQuilt } from "./YearQuilt";
import s from "./V5.module.css";

const CAT_SHORT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.short])) as Record<CategoryId, { ru: string; ky: string }>;
const PERSON_TONE: Record<string, string> = { oksana: "felt", bibinur: "ochre", nurchik: "wine", "smm-lead": "red", "pr-lead": "sand" };

/** Курак из восьми направлений: лоскуты по кругу, в центре красная K логотипа */
const RING: CategoryId[] = ["smm", "pr", "events", "sales", "digital", "team", "invest", "brand"];
const RING_POS = [0, 1, 2, 5, 8, 7, 6, 3];
function KurakBlock({ lang }: { lang: Lang }) {
  const cells: (CategoryId | null)[] = Array(9).fill(null);
  RING.forEach((id, i) => (cells[RING_POS[i] ?? 4] = id));
  return (
    <div className={s.kurak} role="img" aria-label={V5.craft.kurakLabel[lang]}>
      {cells.map((id, i) =>
        id ? (
          <span key={id} className={s.kurakCell} data-tone={CAT_TONE[id]} aria-hidden="true">
            <Shape i={CAT_SHAPE[id][0]} turn={CAT_SHAPE[id][1]} className={s.kurakShape} />
            <span className={s.kurakName}>{CAT_SHORT[id][lang]}</span>
          </span>
        ) : (
          <span key={`c${i}`} className={`${s.kurakCell} ${s.kurakCore}`} aria-hidden="true">
            <Shape i={0} className={s.kurakK} />
          </span>
        ),
      )}
    </div>
  );
}

/**
 * Вариант 5 «Кут»: Курак как ремесло. Маркетинг шьют, как шырдак и курак: из частей в прочную вещь на годы.
 * Войлочные секции (марена) чередуются с кремовыми, орнамент только из пяти фигур логотипа и золотой нити.
 * Одна разметка для русской и кыргызской страниц, язык приходит пропсом.
 */
export function V5Page({ lang }: { lang: Lang }) {
  return (
    <div lang={htmlLang(lang)} id="v5-top" className={s.page}>
      <Header lang={lang} />

      <main id="main">
        {/* 1. Первый экран: заголовок и одна кнопка на войлоке, справа курак года */}
        <section className={`${s.hero} v5-felt`} aria-labelledby="v5-title">
          <div className={`container ${s.heroGrid}`}>
            <div className={s.heroCopy}>
              <h1 id="v5-title" className={s.heroTitle}>
                {V5.hero.title[lang]}
              </h1>
              <p className={s.heroLede}>{BRAND_TEXT.promise[lang]}</p>
              <div className={s.heroActions}>
                <a href="#zayavka" id="v5-hero-cta" className="v5-btn">
                  {UI.discuss[lang]}
                </a>
                <a href={PORTFOLIO_HREF} className={`v5-link ${s.heroPdf}`}>
                  {UI.portfolio[lang]}
                </a>
              </div>
            </div>
            <YearQuilt lang={lang} />
          </div>
        </section>
        <div className={s.seam} data-edge="felt">
          <Teeth id="v5-seam-1" />
        </div>

        {/* 2. Услуги: восемь лоскутов, готовые наборы */}
        <section id="uslugi" className={`${s.section} ${s.sectionTop}`} aria-labelledby="v5-svc-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="v5-svc-title" className={s.h2}>
                {V5.services.title[lang]}
              </h2>
              <p className={s.lede}>{V5.services.lede[lang]}</p>
            </div>
            <Services lang={lang} />
            <Bundles lang={lang} />
          </div>
        </section>

        {/* 3. Календарь продаж Кыргызстана: фирменный блок */}
        <div className={s.seam} data-edge="paper">
          <Teeth id="v5-seam-2" size={20} />
        </div>
        <section id="kalendar" className={`${s.section} v5-felt`} aria-labelledby="v5-cal-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="v5-cal-title" className={s.h2}>
                {V5.calendar.title[lang]}
              </h2>
              <p className={s.lede}>{V5.calendar.lede[lang]}</p>
            </div>
            <Calendar lang={lang} />
          </div>
        </section>

        {/* 4. Кейсы и цифры: результат стоит в заголовке */}
        <section id="cases" className={s.section} aria-labelledby="v5-cases-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="v5-cases-title" className={s.h2}>
                {V5.cases.title[lang]}
              </h2>
              <p className={s.lede}>{UI.nda[lang]}</p>
            </div>
            <dl className={s.stats} aria-label={V5.cases.stats[lang]}>
              {STATS.map((st) => (
                <div key={st.label.ru} className={s.stat}>
                  <dt className={s.statLabel}>{st.label[lang]}</dt>
                  <dd className={`${s.statValue} num`}>
                    <Fill value={dt(st.value, lang)} />
                  </dd>
                </div>
              ))}
            </dl>
            <ol className={s.cases}>
              {CASES.map((c) => (
                <li key={c.id} className={s.case}>
                  <h3 className={s.caseH}>
                    <span className={`${s.caseFig} num`}>
                      <Fill value={dt(c.result, lang)} />
                    </span>
                    <span className={s.caseLabel}>{c.resultLabel[lang]}</span>
                  </h3>
                  <div className={s.caseBody}>
                    <p className={s.caseClient}>
                      {c.client[lang]}
                      <span className={s.caseSince}>
                        <Fill value={dt(V5.cases.since, lang)} />
                      </span>
                    </p>
                    <dl className={s.caseDl}>
                      <div>
                        <dt>{V5.cases.task[lang]}</dt>
                        <dd>{c.task[lang]}</dd>
                      </div>
                      <div>
                        <dt>{V5.cases.did[lang]}</dt>
                        <dd>{c.did[lang]}</dd>
                      </div>
                    </dl>
                    <ul className={s.caseCats}>
                      {c.categories.map((id) => (
                        <li key={id}>
                          <span className={s.calSvcBit} data-tone={CAT_TONE[id]} aria-hidden="true" />
                          {CAT_SHORT[id][lang]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
            <p className={s.note}>{UI.draftNote[lang]}</p>
          </div>
        </section>

        {/* 5. Ремесло: история названия, ценности, как работаем */}
        <section id="remeslo" className={`${s.section} v5-felt`} aria-labelledby="v5-craft-title">
          <div className="container">
            <div className={s.craftTop}>
              <div className={s.craftStory}>
                <h2 id="v5-craft-title" className={s.h2}>
                  {V5.craft.title[lang]}
                </h2>
                <p className={s.craftText}>{BRAND_TEXT.nameStory[lang]}</p>
                <KurakBlock lang={lang} />
              </div>
              <div className={s.values}>
                <h3 className={s.h3}>{V5.craft.values[lang]}</h3>
                <ol className={s.valueList}>
                  {VALUES.map((v) => (
                    <li key={v.title.ru} className={s.value}>
                      <h4 className={s.valueH}>{v.title[lang]}</h4>
                      <p className={s.valueText}>{v.text[lang]}</p>
                      <p className={s.valueEx}>
                        <Fill value={dt(v.example, lang)} />
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className={s.principles}>
              <Thread id="v5-thread-principles" className={s.principlesThread} />
              <h3 className={`${s.h3} ${s.principlesH}`}>{V5.craft.principles[lang]}</h3>
              <ol className={s.principleList}>
                {/* «Одна команда на всё» уже сказана в подзаголовке первого экрана: здесь три остальных принципа */}
                {PRINCIPLES.slice(1).map((p) => (
                  <li key={p.title.ru} className={s.principle}>
                    <h4 className={s.principleH}>{p.title[lang]}</h4>
                    <p className={s.principleText}>{p.text[lang]}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 6. Команда: портреты-заглушки в арке, роли, строка о партнёрах */}
        <div className={s.seam} data-edge="felt">
          <Teeth id="v5-seam-3" />
        </div>
        <section id="komanda" className={s.section} aria-labelledby="v5-team-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="v5-team-title" className={s.h2}>
                {V5.team.title[lang]}
              </h2>
              <p className={s.lede}>{V5.team.lede[lang]}</p>
            </div>
            <ul className={s.team}>
              {TEAM.map((p, i) => (
                <li key={p.id} className={s.person}>
                  <Portrait
                    mark={p.name.draft ? CAT_SHORT[p.category][lang] : p.name.value[lang].charAt(0)}
                    tone={PERSON_TONE[p.id] ?? "felt"}
                    shape={i}
                  />
                  <h3 className={s.personName}>
                    <Fill value={dt(p.name, lang)} />
                  </h3>
                  <p className={s.personRole}>{p.role[lang]}</p>
                  {p.exp && (
                    <p className={s.personExp}>
                      <Fill value={dt(p.exp, lang)} />
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
          </div>
        </section>

        {/* 7. Клиенты и отзывы: только с разрешения, пока места-черновики */}
        <section id="otzyvy" className={`${s.section} ${s.reviewsSec}`} aria-labelledby="v5-rev-title">
          <div className="container">
            <Thread id="v5-thread-reviews" className={s.reviewsThread} />
            <div className={s.head}>
              <h2 id="v5-rev-title" className={s.h2}>
                {V5.reviews.title[lang]}
              </h2>
              <p className={s.lede}>{V5.reviews.lede[lang]}</p>
            </div>
            <ul className={s.logos} aria-label={V5.reviews.logos[lang]}>
              {CLIENT_LOGOS.map((l, i) => (
                <li key={i} className={s.logoSlot}>
                  <Fill value={dt(l, lang)} />
                </li>
              ))}
            </ul>
            <ul className={s.reviews}>
              {REVIEWS.map((r, i) => (
                <li key={i} className={s.review} title={V5.reviews.sample[lang]}>
                  <span className="visually-hidden">{V5.reviews.sample[lang]}. </span>
                  <blockquote className={s.quote}>
                    <p>«{r.text[lang]}»</p>
                  </blockquote>
                  <p className={s.who}>
                    <Fill value={dt(r.who, lang)} />
                    <span className={s.whoRole}>{r.role[lang]}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Заявка: что будет дальше, каналы, форма */}
        <div className={s.seam} data-edge="paper2">
          <Teeth id="v5-seam-4" size={20} />
        </div>
        <section id="zayavka" className={`${s.section} v5-felt`} aria-labelledby="v5-form-title">
          <div className={`container ${s.formGrid}`}>
            <div className={s.formAside}>
              <h2 id="v5-form-title" className={s.h2}>
                {V5.form.title[lang]}
              </h2>
              <h3 className={s.h3}>{V5.form.next[lang]}</h3>
              <ol className={s.steps}>
                {STEPS.map((st, i) => (
                  <li key={st.title.ru} className={s.step}>
                    <p className={s.stepT}>
                      {i === 0 && lang === "ky" ? (
                        <>
                          <Fill value={dt(RESPONSE_TIME, lang)} /> {st.title[lang].toLowerCase()}
                        </>
                      ) : i === 0 ? (
                        <>
                          {st.title[lang]} <Fill value={dt(RESPONSE_TIME, lang)} />
                        </>
                      ) : (
                        st.title[lang]
                      )}
                    </p>
                    <p className={s.stepX}>{st.text[lang]}</p>
                  </li>
                ))}
              </ol>
              <h3 className={s.h3}>{V5.form.direct[lang]}</h3>
              <ul className={s.channels}>
                {CHANNELS.map((c) => (
                  <li key={c.id} className={s.channel}>
                    <span className={s.channelLabel}>{c.label[lang]}</span>
                    {c.href ? (
                      <a href={c.href} className="v5-link">
                        <Fill value={c.value} />
                      </a>
                    ) : (
                      <Fill value={c.value} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.formCard}>
              <LeadForm lang={lang} />
            </div>
          </div>
        </section>
      </main>

      {/* 9. Подвал: кремовая этикетка с красным знаком */}
      <footer id="kontakty" className={s.footer}>
        <div className="container">
          <div className={s.footBrand}>
            <KurakLogo className={s.footLogo} title={BRAND_TEXT.name[lang]} />
            <p className={s.wordmark} aria-hidden="true">
              {KURAK_TAGLINE}
            </p>
          </div>
          <div className={s.footCols}>
            <div className={s.footCol}>
              <h2 className={s.footH}>{V5.footer.contacts[lang]}</h2>
              <ul className={s.footList}>
                {CHANNELS.map((c) => (
                  <li key={c.id}>
                    <span className={s.footLabel}>{c.label[lang]}</span>
                    {c.href ? (
                      <a href={c.href} className="v5-link">
                        <Fill value={c.value} />
                      </a>
                    ) : (
                      <Fill value={c.value} />
                    )}
                  </li>
                ))}
                <li>
                  <span className={s.footLabel}>E-mail</span>
                  <Fill value={EMAIL} />
                </li>
              </ul>
            </div>
            <div className={s.footCol}>
              <h2 className={s.footH}>{UI.address[lang]}</h2>
              <p className={s.footText}>
                <Fill value={lang === "ky" && ADDRESS.draft ? { ...ADDRESS, value: V5.footer.addressDraftKy } : ADDRESS} />
              </p>
              <p className={s.footText}>{BRAND_TEXT.oneLine[lang]}</p>
            </div>
            <nav className={s.footCol} aria-label={V5.footer.pages[lang]}>
              <h2 className={s.footH}>{V5.footer.pages[lang]}</h2>
              <ul className={s.footList}>
                {SECTIONS.map((x) => (
                  <li key={x.href}>
                    <a href={x.href} className="v5-link">
                      {V5.nav[x.key][lang]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={s.footCol}>
              <h2 className={s.footH}>{V5.footer.lang[lang]}</h2>
              <LangSwitch lang={lang} className={s.footLang} />
            </div>
          </div>
          <div className={s.footBottom}>
            <p>© 2026 {V5.footer.rights[lang]}</p>
            <a href="#v5-top" className="v5-link">
              {UI.toTop[lang]}
            </a>
          </div>
        </div>
      </footer>

      <MobileBar lang={lang} />
    </div>
  );
}
