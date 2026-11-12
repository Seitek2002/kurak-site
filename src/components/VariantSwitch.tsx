"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./VariantSwitch.module.css";

/**
 * Переключатель между двумя вариантами лендинга для заказчика.
 * Вариант 1 «Меню-курак» на /, вариант 2 «Полотно» на /v2.
 */
export function VariantSwitch({ tone = "field", className }: { tone?: "field" | "paper"; className?: string }) {
  const pathname = usePathname();
  const v2 = pathname.startsWith("/v2");
  return (
    <nav aria-label="Варианты сайта" className={[s.switch, s[tone], className].filter(Boolean).join(" ")}>
      <span className={s.label} aria-hidden="true">Вариант</span>
      <Link href="/" className={s.opt} aria-current={!v2 ? "page" : undefined} aria-label="Вариант 1">
        1
      </Link>
      <Link href="/v2" className={s.opt} aria-current={v2 ? "page" : undefined} aria-label="Вариант 2">
        2
      </Link>
    </nav>
  );
}

/** Ссылка в подвал: крупно и с пояснением, куда ведёт. */
export function VariantLink({ className }: { className?: string }) {
  const pathname = usePathname();
  const v2 = pathname.startsWith("/v2");
  return (
    <Link href={v2 ? "/" : "/v2"} className={className}>
      {v2 ? "Вариант 1: меню-курак" : "Вариант 2: полотно на скролле"}
    </Link>
  );
}
