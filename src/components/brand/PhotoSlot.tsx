import type { CSSProperties } from "react";
import s from "./PhotoSlot.module.css";

export type SlotKind = "person" | "scene" | "logo";

/**
 * Место под фото или логотип клиента. Есть src: показывает фото. Нет: плейсхолдер в материале варианта
 * (пунктирная рамка, штриховка, силуэт из геометрии логотипа и подпись «Фото…» / «Логотип клиента»).
 *
 * Размер задаёт родитель: слот растягивается на всю его площадь (или передайте ratio).
 * Цвета берутся из currentColor; вариант может переопределить их переменными --ph-bg, --ph-line, --ph-ink, --ph-hatch.
 * src — путь из content/photos.ts без ведущего слеша (basePath для GitHub Pages добавляется здесь).
 */
export function PhotoSlot({
  src,
  alt,
  label,
  kind = "person",
  hideLabel,
  ratio,
  className,
  style,
}: {
  src?: string;
  /** alt для настоящего фото; без него используется label */
  alt?: string;
  /** Подпись плейсхолдера, например «Фото: Оксана». Она же aria-label */
  label: string;
  kind?: SlotKind;
  /** Для маленьких аватаров: подпись остаётся только для скринридера */
  hideLabel?: boolean;
  /** aspect-ratio, если родитель не задаёт размер, например "4 / 5" */
  ratio?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const st = ratio ? { aspectRatio: ratio, ...style } : style;
  if (src) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    return (
      // eslint-disable-next-line @next/next/no-img-element -- статический экспорт для GitHub Pages, next/image без оптимизатора
      <img src={`${base}/${src.replace(/^\//, "")}`} alt={alt ?? label} loading="lazy" decoding="async" className={[s.img, kind === "logo" ? s.imgLogo : "", className].filter(Boolean).join(" ")} style={st} />
    );
  }
  return (
    <div
      role="img"
      aria-label={label}
      data-photo-slot={kind}
      className={[s.slot, s[kind], hideLabel ? s.tiny : "", className].filter(Boolean).join(" ")}
      style={st}
    >
      <SlotIcon kind={kind} />
      <span className={s.label} aria-hidden="true">
        {label}
      </span>
    </div>
  );
}

/** Силуэты из фигур логотипа: плечи = полукруг U, горы = треугольник A */
function SlotIcon({ kind }: { kind: SlotKind }) {
  if (kind === "scene") {
    return (
      <svg viewBox="0 0 100 100" className={s.icon} aria-hidden="true" focusable="false">
        <circle cx="72" cy="28" r="10" />
        <path d="M6 86 L38 34 L70 86Z" />
        <path d="M48 86 L71 52 L94 86Z" />
      </svg>
    );
  }
  if (kind === "logo") {
    return (
      <svg viewBox="0 0 120 60" className={s.icon} aria-hidden="true" focusable="false">
        <path d="M4 14H34L23 30L34 46H4Z" />
        <path d="M40 14H68V30A14 14 0 0 1 40 30Z" />
        <path d="M95 10L115 46H75Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className={s.icon} aria-hidden="true" focusable="false">
      <circle cx="50" cy="36" r="17" />
      <path d="M16 96A34 34 0 0 1 84 96Z" />
    </svg>
  );
}
