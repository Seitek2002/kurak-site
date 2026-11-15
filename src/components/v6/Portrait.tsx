import type { CSSProperties } from "react";
import { KURAK_PATHS } from "@/components/brand/KurakLogo";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import s from "./V6.module.css";

/** Рамки фигур логотипа: K, U, R, A, K. Высота 86.5 у всех, кроме A: она выше, как в самом знаке */
const BOXES = ["0 6.5 82 86.5", "88 6.5 85 86.5", "181 6.5 76 86.5", "251.5 0 108 93", "361 6.5 82 86.5"];

/**
 * Портрет: место под фото 4:5, в левый нижний угол вырезана бумажная плашка с фигурой логотипа.
 * Пять руководителей по порядку дают K-U-R-A-K: фигуры стоят на одной линии и одной высоты, как буквы знака.
 * Фото придёт из content/photos.ts (src), плашка с фигурой останется.
 */
export function Portrait({ glyph, label, src }: { glyph: number; label: string; src?: string }) {
  const i = ((glyph % 5) + 5) % 5;
  const box = BOXES[i] ?? "0 6.5 82 86.5";
  const [, , w = 82, h = 86.5] = box.split(" ").map(Number);
  return (
    <div className={s.portrait} data-glyph={i}>
      <PhotoSlot kind="person" src={src} label={label} className={s.portraitSlot} />
      <span className={s.portraitTab} aria-hidden="true">
        <svg
          className={s.portraitGlyph}
          viewBox={box}
          style={{ "--k": (h / 86.5).toFixed(3), aspectRatio: `${w} / ${h}` } as CSSProperties}
          focusable="false"
        >
          <path d={KURAK_PATHS[i]} />
        </svg>
      </span>
    </div>
  );
}
