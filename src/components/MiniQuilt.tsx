"use client";

import { SERVICE_INDEX } from "@/content/services";
import { Patch } from "./Patch";
import s from "./MiniQuilt.module.css";

/** Подборка как маленькое лоскутное одеяло: одна услуга = один лоскут. */
export function MiniQuilt({
  picked,
  cells = 8,
  lastAdded,
  size = "s",
}: {
  picked: string[];
  cells?: number;
  lastAdded?: string | null;
  size?: "s" | "l";
}) {
  const shown = picked.slice(0, cells);
  const empty = Math.max(0, cells - shown.length);
  return (
    <span className={`${s.quilt} ${size === "l" ? s.large : ""}`} aria-hidden="true">
      {shown.map((id) => {
        const entry = SERVICE_INDEX[id];
        if (!entry) return null;
        return (
          <span key={id} className={`${s.cell} ${id === lastAdded ? s.fresh : ""}`} data-cat={entry.category.id}>
            <Patch cat={entry.category.id} plain={size === "s"} />
          </span>
        );
      })}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`e${i}`} className={`${s.cell} ${s.empty}`} />
      ))}
    </span>
  );
}
