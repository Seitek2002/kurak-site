"use client";

import { UI, type Lang } from "@/content/kurak";
import { V13_MENU } from "@/content/v13";
import { useSelection } from "@/store/selection";
import { IconCheck, IconPlus } from "./Icons";

/** «Добавить в заявку» / «В заявке»: пришивает услугу к «Вашему кураку». До подъёма подборки из localStorage кнопка выключена. */
export function AddToggle({ id, title, lang, className }: { id: string; title: string; lang: Lang; className?: string }) {
  const on = useSelection((st) => st.picked.includes(id));
  const toggle = useSelection((st) => st.toggle);
  return (
    <button type="button" className={className} aria-pressed={on} onClick={() => toggle(id)}>
      {on ? <IconCheck /> : <IconPlus />}
      <span>{on ? UI.added[lang] : UI.add[lang]}</span>
      <span className="visually-hidden">: {title}</span>
    </button>
  );
}

/** Готовый набор: пришить все его услуги разом; если набор уже весь в заявке, повторное нажатие его убирает */
export function BundleToggle({ ids, title, lang, className }: { ids: string[]; title: string; lang: Lang; className?: string }) {
  const picked = useSelection((st) => st.picked);
  const addMany = useSelection((st) => st.addMany);
  const remove = useSelection((st) => st.remove);
  const all = ids.every((id) => picked.includes(id));
  return (
    <button type="button" className={className} aria-pressed={all} onClick={() => (all ? ids.forEach(remove) : addMany(ids))}>
      {all ? <IconCheck /> : <IconPlus />}
      <span>{all ? V13_MENU.bundleIn[lang] : V13_MENU.addBundle[lang]}</span>
      <span className="visually-hidden">: {title}</span>
    </button>
  );
}
