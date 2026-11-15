"use client";

import { useEffect, useState } from "react";
import { useSelection } from "@/store/selection";
import { UI, type Lang } from "@/content/kurak";
import { V7 } from "@/content/v7";

/**
 * Мелкие интерактивные островки варианта 7.
 * Подборка поднимается из localStorage после гидрации (ClientBoot), до этого picked = [] и на сервере, и в браузере.
 */

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Открывает направление в меню услуг: ссылки с data-v7-open="smm" и адрес #usluga-smm */
export function openCategory(id: string, focus = true) {
  const det = document.getElementById(`usluga-${id}`);
  if (!(det instanceof HTMLDetailsElement)) return false;
  det.open = true;
  det.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  if (focus) det.querySelector("summary")?.focus({ preventScroll: true });
  history.replaceState(null, "", `#usluga-${id}`);
  return true;
}

export function Opener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[data-v7-open]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (openCategory(a.dataset.v7Open ?? "")) e.preventDefault();
    };
    const fromHash = () => {
      const m = /^#usluga-([\w-]+)$/.exec(location.hash);
      if (m) openCategory(m[1]!, false);
    };
    fromHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", fromHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);
  return null;
}

/** «Добавить в заявку» у одной услуги: переключатель aria-pressed */
export function AddButton({ id, lang, className }: { id: string; lang: Lang; className?: string }) {
  const on = useSelection((s) => s.picked.includes(id));
  const toggle = useSelection((s) => s.toggle);
  return (
    <button type="button" className={className} aria-pressed={on} onClick={() => toggle(id)} data-on={on || undefined}>
      <span className="v7-check" aria-hidden="true" />
      {on ? UI.added[lang] : UI.add[lang]}
    </button>
  );
}

/** Готовый набор: добавляет все его услуги; если все уже в заявке, повторное нажатие убирает набор */
export function BundleButton({ ids, lang, className }: { ids: string[]; lang: Lang; className?: string }) {
  const picked = useSelection((s) => s.picked);
  const addMany = useSelection((s) => s.addMany);
  const remove = useSelection((s) => s.remove);
  const all = ids.every((x) => picked.includes(x));
  return (
    <button
      type="button"
      className={className}
      aria-pressed={all}
      data-on={all || undefined}
      onClick={() => (all ? ids.forEach(remove) : addMany(ids))}
    >
      <span className="v7-check" aria-hidden="true" />
      {all ? V7.services.bundleAdded[lang] : V7.services.addBundle[lang]}
    </button>
  );
}

/** Счётчик услуг в заявке для шапки и нижней панели */
export function PickedCount({ className, label }: { className?: string; label: string }) {
  const n = useSelection((s) => s.picked.length);
  if (!n) return null;
  return (
    <span className={className} aria-label={`${n} ${label}`}>
      {n}
    </span>
  );
}

/** Сколько услуг направления уже в заявке: маленькая метка в строке меню */
export function CategoryPicked({ ids, lang, className }: { ids: string[]; lang: Lang; className?: string }) {
  const n = useSelection((s) => s.picked.filter((x) => ids.includes(x)).length);
  if (!n) return null;
  return (
    <span className={className}>
      {n} {V7.nav.inRequest[lang].toLowerCase()}
    </span>
  );
}

/** Нижняя панель на телефоне: главная кнопка всегда под пальцем. Прячется, пока видна такая же кнопка
 *  первого экрана или сама форма. Без скрипта видна всегда. */
export function MobileBar({ lang, className, countClass }: { lang: Lang; className?: string; countClass?: string }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const targets = ["v7-hero-cta", "zayavka"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting));
        setHidden([...seen.values()].some(Boolean));
      },
      { threshold: 0.1 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return (
    <div className={className} data-hidden={hidden || undefined} inert={hidden || undefined}>
      <a href="#zayavka" className="v7-btn v7-btn--wide">
        {UI.discuss[lang]}
        <PickedCount className={countClass} label={V7.mobile.picked[lang]} />
      </a>
    </div>
  );
}
