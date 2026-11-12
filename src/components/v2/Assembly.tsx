import { CATEGORIES } from "@/content/services";
import { Patch } from "../Patch";
import { Scene } from "./Scene";
import s from "./Assembly.module.css";

// 3×3 по часовой стрелке вокруг центра: индекс категории в ячейке
const CELLS: (number | "you")[] = [0, 1, 2, 7, "you", 3, 6, 5, 4];

/**
 * Сцена-закрепление: пока человек листает, восемь лоскутов слетаются вокруг «Ваш бизнес»,
 * подсвечивается текущее направление, в конце нить обшивает полотно.
 * Без движения: одеяло уже собрано, список целиком.
 */
export function Assembly() {
  return (
    <section id="sborka" className={s.section} aria-labelledby="sborka-title">
      <Scene target="sborka" scene="assembly" />
      <div className={`container ${s.stage}`} data-stage>
        <div className={s.copy}>
          <h2 id="sborka-title" className={s.title}>
            Восемь лоскутов вокруг вашего бизнеса
          </h2>
          <ol className={s.goals}>
            {CATEGORIES.map((c, i) => (
              <li key={c.id} data-cat={c.id} className={s.goal} data-goal-i={i}>
                <span className={s.num}>{c.n}</span>
                <span className={s.goalText}>{c.goal}</span>
                <span className={s.short}>{c.short}</span>
              </li>
            ))}
          </ol>
          <p className={s.finale} data-finale>
            Одно полотно. Один договор. Один человек, который за него отвечает.
          </p>
        </div>

        <div className={s.quiltWrap}>
          <div className={s.quilt} data-quilt>
            {CELLS.map((c) =>
              c === "you" ? (
                <div key="you" className={`${s.cell} ${s.you}`} data-cell="you">
                  <span>Ваш бизнес</span>
                </div>
              ) : (
                <a
                  key={CATEGORIES[c]!.id}
                  href={`#cat-${CATEGORIES[c]!.id}`}
                  className={s.cell}
                  data-cell={CATEGORIES[c]!.id}
                  data-cat={CATEGORIES[c]!.id}
                  data-cursor="Открыть"
                >
                  <Patch cat={CATEGORIES[c]!.id} />
                  <span className="visually-hidden">
                    {CATEGORIES[c]!.n} {CATEGORIES[c]!.goal}: {CATEGORIES[c]!.short}
                  </span>
                </a>
              ),
            )}
            <svg className={s.thread} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <rect data-thread x="1" y="1" width="98" height="98" pathLength="1" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
