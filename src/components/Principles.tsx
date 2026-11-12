import { PRINCIPLES } from "@/content/site";
import type { CategoryId } from "@/content/services";
import { Patch } from "./Patch";
import s from "./Principles.module.css";

const CATS: CategoryId[] = ["pr", "brand", "events", "sales"];

export function Principles() {
  return (
    <section className={`${s.band} on-field`} aria-labelledby="principy-title">
      <div className="container">
        <h2 id="principy-title" className={`h-section ${s.title}`}>
          Как мы шьём проекты
        </h2>
        <ol className={s.list}>
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className={s.item} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <span className={s.patch} data-cat={CATS[i]}>
                <Patch cat={CATS[i]} />
              </span>
              <h3 className={s.itemTitle}>{p.title}</h3>
              <p className={s.text}>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
