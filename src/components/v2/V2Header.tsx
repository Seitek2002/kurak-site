"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelection } from "@/store/selection";
import { Mark } from "../Mark";
import { MiniQuilt } from "../MiniQuilt";
import { VariantSwitch } from "../VariantSwitch";
import s from "./V2Header.module.css";

const NAV = [
  { href: "#uslugi", label: "Услуги" },
  { href: "#keisy", label: "Кейсы" },
  { href: "#komanda", label: "Команда" },
  { href: "#zayavka", label: "Заявка" },
];

function plural(n: number) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "услуга";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "услуги";
  return "услуг";
}

/** Плавающая шапка: прячется, когда листают вниз, возвращается при движении вверх. */
export function V2Header() {
  const picked = useSelection((st) => st.picked);
  const lastAdded = useSelection((st) => st.lastAdded);
  const setDrawer = useSelection((st) => st.setDrawer);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setSolid(y > 40);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 240);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = picked.length;
  return (
    <header className={s.header} data-hidden={hidden || undefined} data-solid={solid || undefined}>
      <div className={`container ${s.row}`}>
        <Link href="/v2" className={s.logo} aria-label="Курак, вариант 2, наверх">
          <Mark className={s.mark} />
          <span className={s.word}>Курак</span>
        </Link>
        <nav aria-label="Разделы" className={s.nav}>
          <ul>
            {NAV.map((i) => (
              <li key={i.href}>
                <a href={i.href} className={s.link}>{i.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.actions}>
          <VariantSwitch className={s.variant} />
          <button type="button" className={s.pick} onClick={() => setDrawer(true)} aria-haspopup="dialog">
            <MiniQuilt picked={picked} lastAdded={lastAdded} />
            <span className={s.pickLabel}>Подборка</span>
            <span className={s.count}>{n}</span>
            <span className="visually-hidden">{plural(n)}</span>
          </button>
          <a href="#zayavka" className={`btn btn--s ${s.cta}`}>
            <span className={s.ctaLong}>Обсудить задачу</span>
            <span className={s.ctaShort} aria-hidden="true">Обсудить</span>
          </a>
        </div>
      </div>
    </header>
  );
}
