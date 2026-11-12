"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelection } from "@/store/selection";

/** Поднимает подборку из localStorage и включает единственную проявку страницы. */
export function ClientBoot() {
  const pathname = usePathname();

  useEffect(() => {
    void useSelection.persist.rehydrate();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
