"use client";

import { useEffect } from "react";

/**
 * Ссылка на направление (#cat-smm) из лоскутной истории или по адресу открывает его раздел меню.
 * Раздел — обычный <details>: без скрипта ссылка просто ведёт к нему.
 */
export function MenuOpener() {
  useEffect(() => {
    const open = (hash: string) => {
      if (!/^#cat-\w+$/.test(hash)) return;
      const d = document.getElementById(hash.slice(1));
      if (d instanceof HTMLDetailsElement) d.open = true;
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#cat-"]');
      if (a) open(a.getAttribute("href") ?? "");
    };
    const onHash = () => open(window.location.hash);
    onHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return null;
}
