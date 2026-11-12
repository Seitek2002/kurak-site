import { CATEGORIES } from "@/content/services";
import { Patch } from "../Patch";
import { Magnetic } from "./Magnetic";
import { Scene } from "./Scene";
import s from "./Finale.module.css";

/** Финальный призыв: кольцо из восьми лоскутов крутится на скролле вокруг круглой кнопки. */
export function Finale() {
  return (
    <section id="finale" className={s.section} aria-labelledby="finale-title">
      <Scene target="finale" scene="finale" />
      <div className={s.ring} data-ring aria-hidden="true">
        {CATEGORIES.map((c, i) => (
          <span key={c.id} className={s.patch} data-cat={c.id} style={{ "--a": `${i * 45}deg` } as React.CSSProperties}>
            <Patch cat={c.id} />
          </span>
        ))}
      </div>
      <div className={s.center}>
        <h2 id="finale-title" className={s.title}>
          <span className="v2-line" data-line><span>Ну что,</span></span>
          <span className="v2-line" data-line><span>сошьём?</span></span>
        </h2>
        <Magnetic>
          <a href="#zayavka" className="v2-round" data-cursor="Шьём">
            Обсудить задачу
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
