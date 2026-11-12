"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { useSelection } from "@/store/selection";
import { Mark } from "./Mark";
import { MiniQuilt } from "./MiniQuilt";
import { VariantSwitch, VariantLink } from "./VariantSwitch";
import s from "./Header.module.css";

const NAV = [
  { href: "/#uslugi", label: "Услуги" },
  { href: "/#keisy", label: "Кейсы" },
  { href: "/komanda", label: "Команда" },
  { href: "/#voprosy", label: "Вопросы" },
];

function plural(n: number) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "услуга";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "услуги";
  return "услуг";
}

export function Header() {
  const picked = useSelection((st) => st.picked);
  const lastAdded = useSelection((st) => st.lastAdded);
  const setDrawer = useSelection((st) => st.setDrawer);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const n = picked.length;

  return (
    <header className={`${s.header} on-field`}>
      <div className={`container ${s.row}`}>
        <Link href="/" className={s.logo} aria-label="Курак, на главную">
          <Mark className={s.mark} />
          <span className={s.word}>Курак</span>
        </Link>

        <nav aria-label="Основная" className={s.nav}>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={s.navLink}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.actions}>
          <VariantSwitch className={s.variant} />
          <button
            type="button"
            className={s.pick}
            onClick={() => setDrawer(true)}
            aria-haspopup="dialog"
          >
            <MiniQuilt picked={picked} lastAdded={lastAdded} />
            <span className={s.pickLabel}>Подборка</span>
            <span className={s.count}>{n}</span>
            <span className="visually-hidden">{plural(n)}</span>
          </button>
          <Link href="/#zayavka" className={`btn btn--s ${s.cta}`}>
            <span className={s.ctaLong}>Обсудить задачу</span>
            <span className={s.ctaShort} aria-hidden="true">Обсудить</span>
          </Link>
          <button
            type="button"
            className={s.burger}
            aria-expanded={menu}
            aria-controls={menuId}
            onClick={() => setMenu((v) => !v)}
          >
            <span className="visually-hidden">{menu ? "Закрыть меню" : "Открыть меню"}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              {menu ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav id={menuId} aria-label="Мобильная" className={s.sheet} hidden={!menu}>
        <ul className="container">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={s.sheetLink} onClick={() => setMenu(false)}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <VariantLink className={s.sheetLink} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
