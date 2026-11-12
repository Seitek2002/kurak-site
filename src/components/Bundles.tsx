"use client";

import { BUNDLES, SERVICE_INDEX } from "@/content/services";
import { useSelection } from "@/store/selection";
import { Patch } from "./Patch";
import s from "./Bundles.module.css";

/** Готовые сеты: как комбо, только без цен. Одной кнопкой весь сет уходит в подборку. */
export function Bundles() {
  const picked = useSelection((st) => st.picked);
  const addMany = useSelection((st) => st.addMany);

  return (
    <section className="section" aria-labelledby="sety-title">
      <div className="container">
        <div className={s.head}>
          <h2 id="sety-title" className="h-section">
            Или возьмите готовый сет
          </h2>
          <p className="lead">Состав и сроки обсудим на созвоне. Цена всегда после разбора вашего бизнеса.</p>
        </div>
        <ul className={s.grid}>
          {BUNDLES.map((b) => {
            const all = b.services.every((id) => picked.includes(id));
            return (
              <li key={b.id} className={s.card}>
                <div className={s.quilt} aria-hidden="true">
                  {b.services.map((id) => {
                    const cat = SERVICE_INDEX[id]!.category.id;
                    return (
                      <span key={id} className={s.cell} data-cat={cat}>
                        <Patch cat={cat} />
                      </span>
                    );
                  })}
                </div>
                <div className={s.name}>
                  <h3 className={s.title}>{b.title}</h3>
                  <p className={s.line}>{b.line}</p>
                </div>
                <ul className={s.items}>
                  {b.services.map((id) => {
                    const e = SERVICE_INDEX[id]!;
                    return (
                      <li key={id} data-cat={e.category.id}>
                        <span className={s.dot} aria-hidden="true" />
                        {e.service.title}
                      </li>
                    );
                  })}
                </ul>
                <button
                  type="button"
                  className={`btn btn--quiet ${s.cta}`}
                  onClick={() => addMany(b.services)}
                  disabled={all}
                >
                  {all ? "Весь сет в подборке" : "Добавить весь сет"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
