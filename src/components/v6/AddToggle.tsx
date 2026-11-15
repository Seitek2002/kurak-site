"use client";

import { UI, serviceName, type Lang } from "@/content/kurak";
import { V6_UI } from "@/content/v6";
import { useSelection } from "@/store/selection";
import { IconCheck, IconPlus } from "./Icons";

/** «Добавить в заявку» для одной услуги. Состояние видно в тексте кнопки, название услуги слышно скринридеру. */
export function AddToggle({ id, lang, className }: { id: string; lang: Lang; className?: string }) {
  const on = useSelection((st) => st.picked.includes(id));
  const toggle = useSelection((st) => st.toggle);
  return (
    <button
      type="button"
      className={["v6-chip", className].filter(Boolean).join(" ")}
      data-on={on || undefined}
      onClick={() => toggle(id)}
    >
      {on ? <IconCheck /> : <IconPlus />}
      <span>{on ? UI.added[lang] : UI.add[lang]}</span>
      <span className="visually-hidden">: {serviceName(id, lang)}</span>
    </button>
  );
}

/** Сколько услуг направления уже в заявке: появляется после того, как подборка поднялась из памяти устройства */
export function PickedCount({ ids, lang, className }: { ids: string[]; lang: Lang; className?: string }) {
  const n = useSelection((st) => st.picked.filter((x) => ids.includes(x)).length);
  if (!n) return null;
  return <span className={className}>{V6_UI.pickedIn(n)[lang]}</span>;
}

/** Пакет целиком: добавляет все услуги, которых ещё нет в заявке */
export function BundleButton({ ids, add, done, className }: { ids: string[]; add: string; done: string; className?: string }) {
  const all = useSelection((st) => ids.every((x) => st.picked.includes(x)));
  const addMany = useSelection((st) => st.addMany);
  return (
    <button
      type="button"
      className={["v6-chip", className].filter(Boolean).join(" ")}
      data-on={all || undefined}
      aria-disabled={all || undefined}
      onClick={() => {
        if (!all) addMany(ids);
      }}
    >
      {all ? <IconCheck /> : <IconPlus />}
      <span>{all ? done : add}</span>
    </button>
  );
}
