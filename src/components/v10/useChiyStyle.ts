"use client";

import { useSyncExternalStore } from "react";
import { CHIY_STYLES, type ChiyStyle } from "@/content/v10";

/**
 * Стиль полотна живёт в атрибуте data-chiy обёртки .v10-theme: из него CSS берёт палитру,
 * холст перечитывает токены. Хук подписан на этот атрибут, поэтому все переключатели синхронны.
 * На сервере и при гидрации всегда "wool", после гидрации React берёт значение из DOM.
 */
const KEY = "kurak-v10-style";
const theme = () => document.querySelector<HTMLElement>(".v10-theme");

function subscribe(cb: () => void) {
  const el = theme();
  if (!el) return () => {};
  const mo = new MutationObserver(cb);
  mo.observe(el, { attributes: true, attributeFilter: ["data-chiy"] });
  return () => mo.disconnect();
}

const read = (): ChiyStyle => {
  const v = theme()?.getAttribute("data-chiy");
  return CHIY_STYLES.includes(v as ChiyStyle) ? (v as ChiyStyle) : "wool";
};

export function useChiyStyle() {
  return useSyncExternalStore(subscribe, read, () => "wool" as ChiyStyle);
}

export function setChiyStyle(s: ChiyStyle) {
  theme()?.setAttribute("data-chiy", s);
  try {
    localStorage.setItem(KEY, s);
  } catch {
    /* приватный режим: стиль просто не запомнится */
  }
}
