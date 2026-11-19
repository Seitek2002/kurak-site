import { CHANNELS, type Lang } from "@/content/kurak";
import { Fill } from "../Fill";
import { IconChat, IconPhone, IconSend } from "./Icons";
import s from "./V6.module.css";

/** Три канала, с которых в Кыргызстане начинают разговор: WhatsApp первым */
const REACH = ["whatsapp", "telegram", "phone"] as const;
const ICON: Record<(typeof REACH)[number], () => React.ReactElement> = { whatsapp: IconChat, telegram: IconSend, phone: IconPhone };

/**
 * Контакты строками счёта: значок, канал, значение. Есть ссылка (wa.me, t.me, tel:) — вся строка ссылка;
 * пока агентство не прислало номера, значение черновик в пунктире (<Fill>), а строка просто текст.
 */
export function Contacts({ lang, className, label }: { lang: Lang; className?: string; label?: string }) {
  const rows = REACH.map((id) => CHANNELS.find((c) => c.id === id)!).filter(Boolean);
  return (
    <ul className={[s.reach, className].filter(Boolean).join(" ")} aria-label={label}>
      {rows.map((c) => {
        const Icon = ICON[c.id as (typeof REACH)[number]];
        const body = (
          <>
            <span className={s.reachIcon}>
              <Icon />
            </span>
            <span className={s.reachName}>{c.label[lang]}</span>
            <span className={`${s.reachValue} v6-num`}>{c.href ? c.value.value : <Fill value={c.value} />}</span>
          </>
        );
        return (
          <li key={c.id}>
            {c.href ? (
              <a href={c.href} className={s.reachRow} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                {body}
              </a>
            ) : (
              <span className={s.reachRow}>{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
