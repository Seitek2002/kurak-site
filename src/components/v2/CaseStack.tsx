import { CASES, STATS } from "@/content/site";
import { CATEGORY_INDEX } from "@/content/services";
import { Patch } from "../Patch";
import { Fill } from "../Fill";
import { Scene } from "./Scene";
import s from "./CaseStack.module.css";

/** Кейсы стопкой: карточки прилипают одна на другую, нижние уходят вглубь. */
export function CaseStack() {
  const drafts = CASES.some((c) => c.result.draft) || STATS.some((x) => x.value.draft);

  return (
    <section id="keisy" className={s.section} aria-labelledby="keisy-title">
      <Scene target="keisy" scene="cases" />
      <div className="container">
        <div className={s.head}>
          <h2 id="keisy-title" className={s.title}>
            Что мы уже сшили
          </h2>
          <dl className={s.stats} data-stats>
            {STATS.map((x) => (
              <div key={x.label} className={s.stat} data-stat>
                <dt>{x.label}</dt>
                <dd><Fill value={x.value} /></dd>
              </div>
            ))}
          </dl>
        </div>
        <ul className={s.stack}>
          {CASES.map((c, i) => (
            <li key={c.id} className={s.card} data-case data-cat={c.categories[0]} style={{ "--i": i } as React.CSSProperties}>
              <span className={s.shade} data-shade aria-hidden="true" />
              <div className={s.art} aria-hidden="true">
                {c.categories.map((cat) => (
                  <span key={cat} data-cat={cat}>
                    <Patch cat={cat} plain />
                  </span>
                ))}
              </div>
              <h3 className={s.cardTitle}>
                <span className={s.resultMask}>
                  <span className={s.result} data-result>
                    <Fill value={c.result} />
                  </span>
                </span>
                <span className={s.resultLabel}>{c.resultLabel}</span>
              </h3>
              <div className={s.body}>
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
                <p className={s.cats}>{c.categories.map((cat) => CATEGORY_INDEX[cat].short).join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>
        {drafts && (
          <p className={s.note}>
            Цифры в <span className="fill">пунктире</span> пока образцы. Заменим на настоящие кейсы с разрешения клиентов, под NDA без названий.
          </p>
        )}
      </div>
    </section>
  );
}
