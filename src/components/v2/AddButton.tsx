"use client";

import { useSelection } from "@/store/selection";

/** Кнопка «В заявку» в панели услуги: единственная интерактивная часть ленты. */
export function AddButton({ id, title, className, iconClass }: { id: string; title: string; className?: string; iconClass?: string }) {
  const on = useSelection((st) => st.picked.includes(id));
  const toggle = useSelection((st) => st.toggle);
  return (
    <button type="button" className={className} aria-pressed={on} onClick={() => toggle(id)} data-cursor={on ? "Убрать" : "В заявку"}>
      <span className={iconClass} aria-hidden="true" />
      {on ? "В заявке" : "В заявку"}
      <span className="visually-hidden">: {title}</span>
    </button>
  );
}
