"use client";

import { useState } from "react";
import { CATEGORIES } from "@/content/services";
import { Patch } from "./Patch";
import s from "./QuiltHero.module.css";

/** Откуда прилетает каждый лоскут при сборке: [x, y, поворот] */
const FROM: [number, number, number][] = [
  [-60, -40, -14], [0, -70, 8], [60, -40, 16],
  [-80, 0, 10], [80, 0, -12],
  [-60, 50, 12], [0, 80, -10], [60, 50, -16],
];

export function QuiltHero() {
  const [active, setActive] = useState<number | null>(null);
  const cat = active === null ? null : CATEGORIES[active];

  // 3×3: восемь направлений по кругу, в центре лоскут клиента
  const cells: (number | "you")[] = [0, 1, 2, 7, "you", 3, 6, 5, 4];

  return (
    <figure className={s.wrap}>
      <ul className={s.quilt} aria-label="Восемь направлений Курака" onPointerLeave={() => setActive(null)}>
        {cells.map((c, pos) => {
          if (c === "you") {
            return (
              <li key="you" className={`${s.cell} ${s.you}`} style={{ "--i": 0 } as React.CSSProperties}>
                <span className={s.youText}>Ваш бизнес</span>
              </li>
            );
          }
          const k = CATEGORIES[c]!;
          const [fx, fy, fr] = FROM[c]!;
          return (
            <li
              key={k.id}
              className={s.cell}
              data-cat={k.id}
              style={{ "--i": c + 1, "--fx": `${fx}px`, "--fy": `${fy}px`, "--fr": `${fr}deg` } as React.CSSProperties}
            >
              <a
                href={`#cat-${k.id}`}
                className={s.patchLink}
                onPointerEnter={() => setActive(c)}
                onFocus={() => setActive(c)}
                onBlur={() => setActive(null)}
                data-pos={pos}
                onClick={() => {
                  // повторный клик по тому же лоскуту: hashchange не случится, откроем вручную
                  if (window.location.hash === `#cat-${k.id}`) window.dispatchEvent(new HashChangeEvent("hashchange"));
                }}
              >
                <Patch cat={k.id} />
                <span className="visually-hidden">
                  {k.n} {k.goal}: {k.short}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <figcaption className={s.caption} aria-hidden="true">
        {cat ? (
          <>
            <span className={s.capNum} data-cat={cat.id}>{cat.n}</span>
            <span className={s.capGoal}>{cat.goal}</span>
            <span className={s.capShort}>{cat.short}</span>
          </>
        ) : (
          <span className={s.capIdle}>Восемь направлений вокруг вашего бизнеса. Нажмите на любое.</span>
        )}
      </figcaption>
    </figure>
  );
}
