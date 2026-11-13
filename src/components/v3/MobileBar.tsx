"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Нижняя панель на телефоне. Пока помощник на экране, она его не перекрывает:
 * появляется, когда первый экран ушёл вверх. Без скрипта видна всегда.
 */
export function MobileBar({ className, label, children }: { className?: string; label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("podbor");
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHidden(!!e && e.isIntersecting), { threshold: 0.15 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <nav ref={ref} className={className} aria-label={label} data-hidden={hidden || undefined} inert={hidden || undefined}>
      {children}
    </nav>
  );
}
