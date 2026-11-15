"use client";

/**
 * Встроенный скрипт, который браузер выполняет при разборе HTML, до первой отрисовки.
 * На клиенте React рендерит его как text/plain, поэтому нет предупреждения о <script> и он не выполняется второй раз
 * (приём из руководства Next.js «Preventing flash before hydration»).
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
