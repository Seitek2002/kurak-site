"use client";

import { useSelection } from "@/store/selection";
import { IconCheck, IconPlus } from "./Geometry";

/**
 * «Добавить в заявку»: кладёт одну услугу или набор услуг в общую подборку.
 * Когда всё уже в заявке, кнопка нажата (aria-pressed) и повторное нажатие убирает эти услуги.
 * До подъёма подборки из localStorage picked = [], поэтому разметка сервера и клиента совпадает.
 */
export function AddToggle({
  ids,
  add,
  added,
  className,
  describedBy,
}: {
  ids: string[];
  add: string;
  added: string;
  className?: string;
  describedBy?: string;
}) {
  const picked = useSelection((s) => s.picked);
  const addMany = useSelection((s) => s.addMany);
  const remove = useSelection((s) => s.remove);
  const on = ids.length > 0 && ids.every((id) => picked.includes(id));

  return (
    <button
      type="button"
      className={["v5-btn-line", className].filter(Boolean).join(" ")}
      aria-pressed={on}
      aria-describedby={describedBy}
      onClick={() => (on ? ids.forEach(remove) : addMany(ids))}
    >
      {on ? <IconCheck /> : <IconPlus />}
      <span>{on ? added : add}</span>
    </button>
  );
}
