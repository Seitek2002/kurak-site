import { KURAK_PATHS } from "../brand/KurakLogo";
import s from "./V5.module.css";

const BOXES = ["0 6.5 82 86.5", "88 6.5 85 86.5", "181 6.5 74 86.5", "251.5 0 108 93", "361 6.5 82 86.5"] as const;

/**
 * Портрет-заглушка: арка (перевёрнутая U логотипа) из войлока в золотой рамке, внизу фигура логотипа,
 * в центре инициал. Когда будут 2D-рисунки, src заменит войлок, рамка останется.
 */
export function Portrait({ mark, tone, shape, src, alt = "" }: { mark: string; tone: string; shape: number; src?: string; alt?: string }) {
  const k = ((shape % 5) + 5) % 5;
  return (
    <div className={s.portrait} data-tone={tone}>
      <svg className={s.portraitSvg} viewBox="0 0 220 280" aria-hidden="true" focusable="false">
        <path className={s.portraitLine} d="M1 279.5V110A109 109 0 0 1 219 110V279.5" />
        <path className={s.portraitApex} d="M110 0L117 11H103Z" />
        <path className={s.portraitFelt} d="M10 280V110A100 100 0 0 1 210 110V280Z" />
        <svg x="48" y="186" width="124" height="94" viewBox={BOXES[k]} preserveAspectRatio="xMidYMax meet">
          <path className={s.portraitMotif} d={KURAK_PATHS[k]} />
        </svg>
      </svg>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={s.portraitImg} width={440} height={560} loading="lazy" />
      ) : (
        <span className={s.portraitMark} aria-hidden="true">
          {mark}
        </span>
      )}
    </div>
  );
}
