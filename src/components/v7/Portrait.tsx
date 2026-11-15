import type { CategoryId } from "@/content/services";
import { SHAPE, type ShapeId } from "./Art";
import s from "./V7.module.css";

/**
 * Портрет-заглушка руководителя: крупная фигура логотипа на цветном лоскуте и инициал.
 * У каждого направления своя фигура и цвет. Когда придут 2D-портреты, передайте src: картинка ляжет поверх
 * (слот data-slot прячет заглушку, если внутри есть img).
 */
const LOOK: Record<CategoryId, { shape: ShapeId; tone: string }> = {
  invest: { shape: "u", tone: "red" },
  events: { shape: "a", tone: "saffron" },
  brand: { shape: "r", tone: "cobalt" },
  smm: { shape: "k", tone: "teal" },
  pr: { shape: "u", tone: "cream" },
  sales: { shape: "k", tone: "red" },
  digital: { shape: "r", tone: "cobalt" },
  team: { shape: "a", tone: "teal" },
};

export function Portrait({ category, initial, src, alt = "", size = "l" }: { category: CategoryId; initial: string; src?: string; alt?: string; size?: "l" | "s" }) {
  const look = LOOK[category];
  const sh = SHAPE[look.shape];
  return (
    <span className={`${s.portrait} ${size === "s" ? s.portraitS : ""}`} data-tone={look.tone} data-slot={`portrait-${category}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={alt} /> : null}
      <svg viewBox={`${sh.x} ${sh.y} ${sh.w} ${sh.h}`} className={s.portraitShape} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
        <path d={sh.d} fill="currentColor" />
      </svg>
      <span className={s.portraitInitial} aria-hidden="true">
        {initial}
      </span>
    </span>
  );
}
