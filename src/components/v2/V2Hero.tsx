import { CATEGORIES } from "@/content/services";
import { SITE } from "@/content/site";
import { Patch } from "../Patch";
import { QuiltWord } from "./QuiltWord";
import { Magnetic } from "./Magnetic";
import { Scene } from "./Scene";
import s from "./V2Hero.module.css";

/** Лоскуты вокруг заголовка: [left %, top %, размер px, поворот, скорость параллакса, left % и top % на телефоне] */
const FLOAT: [number, number, number, number, number, number, number][] = [
  [4, 12, 72, -12, 1.4, 6, 14], [88, 10, 96, 14, 0.8, 74, 12], [70, 30, 56, 8, 1.8, 42, 22], [12, 64, 88, 18, 1.1, 88, 26],
  [92, 58, 64, -20, 1.6, 16, 28], [46, 86, 52, 10, 2.1, 84, 84], [30, 8, 44, -8, 2.4, 60, 30], [62, 74, 80, -14, 1.2, 66, 93],
];

export function V2Hero() {
  return (
    <section id="v2-hero" className={s.hero} aria-labelledby="v2-title">
      <Scene target="v2-hero" scene="hero" />
      <div className={s.floats} aria-hidden="true">
        {FLOAT.map(([l, t, size, r, k, ml, mt], i) => {
          const cat = CATEGORIES[i]!.id;
          return (
            <span
              key={cat}
              className={s.float}
              data-cat={cat}
              data-speed={k}
              style={{ "--x": `${l}%`, "--y": `${t}%`, "--mx": `${ml}%`, "--my": `${mt}%`, "--size": `${size}px`, "--r": `${r}deg`, "--i": i } as React.CSSProperties}
            >
              <Patch cat={cat} />
            </span>
          );
        })}
      </div>
      <div className={`container ${s.inner}`}>
        <QuiltWord className={s.word} />
        <div className={s.copy} data-hero-copy>
          <h1 id="v2-title" className={s.title}>
            <span className="v2-line"><span>Маркетинг, сшитый</span></span>
            <span className="v2-line"><span>в&nbsp;одно полотно</span></span>
          </h1>
          <p className={s.lede}>{SITE.promise}</p>
          <div className={s.cta}>
            <Magnetic>
              <a href="#zayavka" className="v2-round" data-cursor="Поехали">
                Обсудить задачу
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
