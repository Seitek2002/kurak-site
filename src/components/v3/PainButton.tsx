"use client";

import { NEED_EVENT } from "./Wizard";

/** Кнопка в карточке ситуации: отмечает нужное в помощнике и возвращает к нему. */
export function PainButton({ need, label, className }: { need: string; label: string; className?: string }) {
  return (
    <a
      href="#podbor"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(NEED_EVENT, { detail: need }))}
    >
      {label}
    </a>
  );
}
