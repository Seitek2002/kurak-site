/** Знак Курака: четыре треугольника четырёх цветов, сшитые в квадрат. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <polygon points="0,0 40,0 20,20" style={{ fill: "var(--cat-smm)" }} />
      <polygon points="40,0 40,40 20,20" style={{ fill: "var(--cat-pr)" }} />
      <polygon points="40,40 0,40 20,20" style={{ fill: "var(--cat-brand)" }} />
      <polygon points="0,40 0,0 20,20" style={{ fill: "var(--cat-events)" }} />
    </svg>
  );
}
