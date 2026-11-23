"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import type { Lang } from "@/content/kurak";
import { V9 } from "@/content/v9";
import { MODE_KEY, type Mode } from "./mode";
import s from "./V9.module.css";

const root = () => document.querySelector<HTMLElement>(".v9-theme");
const read = (): Mode => (root()?.dataset.mode === "light" ? "light" : "dark");
/** Режим живёт в атрибуте data-mode обёртки: подписка на его изменения */
function subscribe(cb: () => void) {
  const el = root();
  if (!el) return () => {};
  const mo = new MutationObserver(cb);
  mo.observe(el, { attributes: true, attributeFilter: ["data-mode"] });
  return () => mo.disconnect();
}

function saved(): string | null {
  try {
    return localStorage.getItem(MODE_KEY);
  } catch {
    return null;
  }
}
function store(m: Mode) {
  try {
    localStorage.setItem(MODE_KEY, m);
  } catch {
    /* приватное окно или запрет хранилища: режим просто не запомнится */
  }
}

/**
 * Переключатель тёмного и светлого режима. Кнопка с постоянным именем «Светлая тема» и aria-pressed:
 * нажата = светлая. Значок: круг, наполовину залитый (полукруг R из логотипа), поворачивается при смене.
 * Режим ставится атрибутом data-mode на обёртку .v9-theme, токены обоих режимов в v9.css.
 */
export function ThemeToggle({ lang, className }: { lang: Lang; className?: string }) {
  // На сервере и при гидрации "dark"; дальше читаем DOM, где режим уже поставил скрипт в layout
  const mode = useSyncExternalStore(subscribe, read, () => "dark" as Mode);

  useLayoutEffect(() => {
    // Скрипт layout не выполняется при переходе внутри приложения: тогда сохранённый режим ставим здесь
    const m = saved();
    const el = root();
    if (el && (m === "light" || m === "dark") && el.dataset.mode !== m) el.dataset.mode = m;
  }, []);

  function toggle() {
    const next: Mode = read() === "light" ? "dark" : "light";
    store(next);
    const apply = () => {
      const el = root();
      if (el) el.dataset.mode = next;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (!reduce && doc.startViewTransition) doc.startViewTransition(apply);
    else apply();
  }

  return (
    <button
      type="button"
      className={[s.modeBtn, className].filter(Boolean).join(" ")}
      aria-pressed={mode === "light"}
      aria-label={V9.themeLight[lang]}
      title={V9.themeLight[lang]}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={s.modeIcon}>
        <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
