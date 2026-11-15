import { KURAK_PATHS } from "@/components/brand/KurakLogo";
import s from "./V7Hero.module.css";

/**
 * Объёмный KURAK для первого экрана. Форма знака не меняется: лицевая грань — те же пять фигур логотипа,
 * объём дают слои-копии со сдвигом вниз вправо (экструзия), свет — градиенты и фаски внутри формы.
 * Каждая буква — своя группа: при загрузке они собираются по очереди (без анимации при reduced motion).
 */
const DEPTH = 16;
const DX = 0.34;
const DY = 0.6;

const stop = (offset: string, token: string, opacity = 1) => <stop offset={offset} style={{ stopColor: `var(${token})`, stopOpacity: opacity }} />;

export function Logo3D({ title, className }: { title: string; className?: string }) {
  const layers = Array.from({ length: DEPTH }, (_, i) => DEPTH - i);
  return (
    <svg viewBox="-4 -6 456 116" className={className} role="img" aria-label={title} focusable="false">
      <title>{title}</title>
      <defs>
        {KURAK_PATHS.map((d, i) => (
          <path key={i} id={`v7-l${i}`} d={d} />
        ))}
        <clipPath id="v7-logo-clip">
          {KURAK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
        <linearGradient id="v7-face" x1="0" y1="0" x2="0" y2="93" gradientUnits="userSpaceOnUse">
          {stop("0", "--v7-red-glint")}
          {stop("0.22", "--v7-red-hover")}
          {stop("0.6", "--v7-red")}
          {stop("1", "--v7-red-press")}
        </linearGradient>
        <linearGradient id="v7-side" x1="0" y1="0" x2="0" y2="110" gradientUnits="userSpaceOnUse">
          {stop("0", "--v7-red-side")}
          {stop("1", "--v7-red-shade")}
        </linearGradient>
        <linearGradient id="v7-gloss" x1="0" y1="0" x2="0" y2="93" gradientUnits="userSpaceOnUse">
          {stop("0", "--v7-gloss")}
          {stop("0.42", "--v7-gloss-0")}
        </linearGradient>
        <linearGradient id="v7-rim" x1="0" y1="60" x2="0" y2="93" gradientUnits="userSpaceOnUse">
          {stop("0", "--v7-cobalt", 0)}
          {stop("1", "--v7-cobalt", 0.3)}
        </linearGradient>
        <linearGradient id="v7-sweep" x1="0" y1="0" x2="1" y2="0">
          {stop("0", "--v7-gloss-0")}
          {stop("0.5", "--v7-gloss", 0.9)}
          {stop("1", "--v7-gloss-0")}
        </linearGradient>
        <filter id="v7-soft" x="-10%" y="-30%" width="120%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Тень на «полу» */}
      <g filter="url(#v7-soft)" opacity="0.55">
        {KURAK_PATHS.map((_, i) => (
          <use key={i} href={`#v7-l${i}`} transform="translate(10 16)" style={{ fill: "var(--v7-shadow)" }} />
        ))}
      </g>

      {KURAK_PATHS.map((_, i) => (
        <g key={i} className={s.letter} style={{ "--i": i } as React.CSSProperties}>
          {layers.map((k) => (
            <use
              key={k}
              href={`#v7-l${i}`}
              transform={`translate(${(k * DX).toFixed(2)} ${(k * DY).toFixed(2)})`}
              fill={k === DEPTH ? undefined : "url(#v7-side)"}
              style={k === DEPTH ? { fill: "var(--v7-red-shade)" } : undefined}
            />
          ))}
          <use href={`#v7-l${i}`} fill="url(#v7-face)" />
          <g clipPath="url(#v7-logo-clip)">
            {/* Фаска света сверху слева и тени снизу справа: обводка, сдвинутая внутрь формы */}
            <use href={`#v7-l${i}`} transform="translate(1.1 1.6)" fill="none" style={{ stroke: "var(--v7-red-glint)" }} strokeWidth="2.2" opacity="0.85" />
            <use href={`#v7-l${i}`} transform="translate(-1 -1.4)" fill="none" style={{ stroke: "var(--v7-red-shade)" }} strokeWidth="2" opacity="0.5" />
            <use href={`#v7-l${i}`} fill="url(#v7-gloss)" opacity="0.6" />
            <use href={`#v7-l${i}`} fill="url(#v7-rim)" />
          </g>
        </g>
      ))}

      {/* Блик, который один раз проходит по знаку при загрузке */}
      <g clipPath="url(#v7-logo-clip)">
        <g className={s.sweep}>
          <rect x="-120" y="-10" width="90" height="120" fill="url(#v7-sweep)" transform="skewX(-18)" />
        </g>
      </g>
    </svg>
  );
}
