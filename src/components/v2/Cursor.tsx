"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import s from "./Cursor.module.css";

/**
 * Кружок-спутник курсора: растёт над лоскутами и кнопками и подписывает действие (data-cursor).
 * Родной курсор не прячем. Только мышь и только без «уменьшить движение».
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!ok.matches) return;
    el.dataset.on = "true";
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, summary, label");
      el.dataset.state = t ? (t.dataset.cursor ? "label" : "hover") : "";
      setLabel(t?.dataset.cursor ?? "");
    };
    const leave = () => (el.dataset.state = "away");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={s.cursor} aria-hidden="true">
      <span className={s.dot} />
      <span className={s.label}>{label}</span>
    </div>
  );
}
