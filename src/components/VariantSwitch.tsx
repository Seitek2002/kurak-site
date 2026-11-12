"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./VariantSwitch.module.css";

/**
 * Три варианта лендинга для заказчика:
 * 1 «Меню-курак» на /, 2 «Полотно» на /v2, 3 «Кеңеш» на /v3 (и /v3/kg).
 */
export const VARIANTS = [
  { n: 1, href: "/", name: "меню-курак" },
  { n: 2, href: "/v2", name: "полотно на скролле" },
  { n: 3, href: "/v3", name: "кеңеш, русский и кыргызский" },
] as const;

function current(pathname: string) {
  if (pathname.startsWith("/v3")) return 3;
  if (pathname.startsWith("/v2")) return 2;
  return 1;
}

export function VariantSwitch({ tone = "field", className, label = "Вариант" }: { tone?: "field" | "paper"; className?: string; label?: string }) {
  const now = current(usePathname());
  return (
    <nav aria-label="Варианты сайта" className={[s.switch, s[tone], className].filter(Boolean).join(" ")}>
      <span className={s.label} aria-hidden="true">{label}</span>
      {VARIANTS.map((v) => (
        <Link key={v.n} href={v.href} prefetch={false} className={s.opt} aria-current={now === v.n ? "page" : undefined} aria-label={`Вариант ${v.n}`}>
          {v.n}
        </Link>
      ))}
    </nav>
  );
}

/** Ссылки на два других варианта: по одной в пункт списка подвала или меню */
export function VariantLinks({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  const now = current(usePathname());
  return (
    <>
      {VARIANTS.filter((v) => v.n !== now).map((v) => (
        <li key={v.n} className={itemClassName}>
          <Link href={v.href} prefetch={false} className={className}>
            Вариант {v.n}: {v.name}
          </Link>
        </li>
      ))}
    </>
  );
}
