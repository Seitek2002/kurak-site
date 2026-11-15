import { CASES, SITE, STATS } from "@/content/site";
import { CATEGORY_INDEX } from "@/content/services";
import { casePhoto, SLOT_TEXT } from "@/content/photos";
import { Patch } from "./Patch";
import { Fill } from "./Fill";
import { PhotoSlot } from "./brand/PhotoSlot";
import s from "./Cases.module.css";

export function Cases() {
  const hasDrafts = CASES.some((c) => c.result.draft) || STATS.some((x) => x.value.draft);
  return (
    <section id="keisy" className="section" aria-labelledby="keisy-title">
      <div className="container">
        <div className={s.head}>
          <h2 id="keisy-title" className="h-section">
            Что мы уже сшили
          </h2>
          <dl className={s.stats}>
            {STATS.map((x) => (
              <div key={x.label} className={s.stat}>
                <dt className={s.statLabel}>{x.label}</dt>
                <dd className={s.statValue}>
                  <Fill value={x.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className={s.grid}>
          {CASES.map((c, i) => (
            <li key={c.id} className={s.card} data-cat={c.categories[0]} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <div className={s.media}>
                <PhotoSlot kind="scene" src={casePhoto(c.id)} label={SLOT_TEXT.project.ru} className={s.photo} />
                <div className={s.strip} aria-hidden="true">
                  {c.categories.map((cat) => (
                    <span key={cat} data-cat={cat}>
                      <Patch cat={cat} />
                    </span>
                  ))}
                </div>
              </div>
              <h3 className={s.title}>
                <span className={s.result}>
                  <Fill value={c.result} />
                </span>
                <span className={s.resultLabel}>{c.resultLabel}</span>
              </h3>
              <p className={s.client}>{c.client}</p>
              <dl className={s.story}>
                <div>
                  <dt>Задача</dt>
                  <dd>{c.task}</dd>
                </div>
                <div>
                  <dt>Что сделали</dt>
                  <dd>{c.did}</dd>
                </div>
              </dl>
              <p className={s.cats}>
                {c.categories.map((cat) => CATEGORY_INDEX[cat].short).join(", ")}
              </p>
            </li>
          ))}
        </ul>
        {hasDrafts && (
          <p className={s.note}>
            Цифры в <span className="fill">пунктире</span> пока образцы. Заменим на настоящие кейсы с разрешения клиентов, под NDA без названий.
          </p>
        )}
        {SITE.portfolioPdf.endsWith(".pdf") && (
          <p className={s.pdf}>
            <a className="link" href={SITE.portfolioPdf} download>
              Полное портфолио в PDF
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
