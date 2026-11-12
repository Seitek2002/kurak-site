import type { Draft } from "@/content/site";

/**
 * Пропуск: данные, которых агентство ещё не прислало. Обведены пунктирным стежком,
 * чтобы образец не приняли за факт. Когда в content/site.ts стоит draft: false, рамка исчезает.
 */
export function Fill({
  value,
  children,
  note,
  className,
}: {
  value?: Draft;
  children?: React.ReactNode;
  note?: string;
  className?: string;
}) {
  if (value && !value.draft) return <span className={className}>{value.value}</span>;
  const label = `Образец, ждёт настоящих данных${note ?? value?.note ? `: ${note ?? value?.note}` : ""}`;
  return (
    <span className={["fill", className].filter(Boolean).join(" ")} title={label} data-fill={note ?? value?.note ?? ""}>
      {value ? value.value : children}
    </span>
  );
}
