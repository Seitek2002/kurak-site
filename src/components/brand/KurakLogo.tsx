/**
 * Логотип KURAK: пять геометрических фигур (блок с вырезом, полукруг, чаша R, треугольник A, блок с вырезом).
 * Обведён по присланному файлу, расхождение с оригиналом около 1,6 % пикселей (антиалиасинг краёв).
 * Цвет берётся из currentColor: красный по умолчанию задаёт вариант через color.
 * Пропорции 443 × 93, треугольник A чуть выше остальных букв, как в оригинале.
 */
export function KurakLogo({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 443 93"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="currentColor"
    >
      {title ? <title>{title}</title> : null}
      {KURAK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** Пять фигур логотипа по отдельности: варианты собирают из них анимации и узоры */
export const KURAK_PATHS = [
  "M0 6.5H82L52 49.75L82 93H0Z", // K
  "M88 6.5H173V50.5A42.5 42.5 0 0 1 88 50.5Z", // U
  "M181 6.5H219.5A37 37 0 0 1 243.7 71L255 93H181Z", // R
  "M305.5 0L359.5 93H251.5Z", // A
  "M361 6.5H443L413 49.75L443 93H361Z", // K
] as const;

/** Подпись под знаком в оригинале: гротеск, разрядка около 0.12em */
export const KURAK_TAGLINE = "KURAK AGENCY";

/** Цвета присланного логотипа. Предварительные фирменные цвета пришлют отдельно: меняются здесь и в токенах вариантов. */
export const BRAND = { red: "#DC0F0A", cream: "#FDF4E3" } as const;
