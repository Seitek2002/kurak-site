"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Нижняя панель на телефоне. Пока на экране первый блок (там уже есть заявка, контакты и помощник),
 * она его не перекрывает: появляется, когда первый блок ушёл вверх. Без скрипта видна всегда.
 */
export function MobileBar({ className, label, watch, children }: { className?: string; label: string; watch: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(watch);
    if (!hero || !("IntersectionObserver" in window)) return;
    // прячем, пока от первого блока видно больше 120px: панель не закрывает помощник и его кнопки
    const io = new IntersectionObserver(([e]) => setHidden(!!e && e.isIntersecting), { rootMargin: "0px 0px -120px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, [watch]);

  return (
    <nav ref={ref} className={className} aria-label={label} data-hidden={hidden || undefined} inert={hidden || undefined}>
      {children}
    </nav>
  );
}
