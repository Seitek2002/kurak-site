import { PRINCIPLES } from "@/content/site";
import type { CategoryId } from "@/content/services";
import { Patch } from "../Patch";
import { Scene } from "./Scene";
import s from "./Manifesto.module.css";

const CATS: CategoryId[] = ["pr", "brand", "events", "sales"];

/**
 * Манифест: четыре принципа одной фразой. Слова загораются по мере скролла,
 * у каждого принципа свой лоскут. Ниже пояснения проявляются по одному.
 */
export function Manifesto() {
  const full = PRINCIPLES.map((p) => `${p.title}.`).join(" ");

  return (
    <section id="manifest" className={s.section} aria-labelledby="manifest-title">
      <Scene target="manifest" scene="manifesto" />
      <div className="container">
        <h2 id="manifest-title" className={s.label}>
          Как мы шьём проекты
        </h2>
        <p className="visually-hidden">{full}</p>
        <p className={s.say} data-say aria-hidden="true">
          <span>
            {PRINCIPLES.map((p, i) => (
              <span key={p.title} className={s.sentence}>
                <span className={s.badge} data-badge data-cat={CATS[i]}>
                  <Patch cat={CATS[i]} plain />
                </span>
                {`${p.title}.`.split(" ").map((w, j) => (
                  <span key={j} className={s.word} data-word>
                    {w}{" "}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </p>
        <ol className={s.notes} data-notes>
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className={s.note} data-note data-cat={CATS[i]}>
              <h3 className={s.noteTitle}>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
