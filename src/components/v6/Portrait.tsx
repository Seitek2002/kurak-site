import { KURAK_PATHS } from "@/components/brand/KurakLogo";
import s from "./V6.module.css";

/** Рамки фигур логотипа: K, U, R, A, K. Каждая обрезана по своей рамке, чтобы фигура заполняла портрет. */
const BOXES = ["0 6.5 82 86.5", "88 6.5 85 86.5", "181 6.5 76 86.5", "251.5 0 108 93", "361 6.5 82 86.5"];

/**
 * Портрет-заглушка, пока нет 2D-рисунков: фигура из логотипа Курака и инициал; пять руководителей по порядку складываются в KURAK.
 * У каждого руководителя своя фигура. Когда художник пришлёт рисунок, передайте src: заглушка уйдёт.
 */
export function Portrait({ glyph, mark, alt, src }: { glyph: number; mark: string; alt: string; src?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={s.portraitImg} src={src} alt={alt} width={400} height={500} decoding="async" />;
  }
  const i = ((glyph % 5) + 5) % 5;
  return (
    <div className={s.portrait} role="img" aria-label={alt} data-glyph={i}>
      <svg className={s.portraitShape} viewBox={BOXES[i]} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
        <path d={KURAK_PATHS[i]} />
      </svg>
      <span className={s.portraitMark} aria-hidden="true">
        {mark}
      </span>
    </div>
  );
}
