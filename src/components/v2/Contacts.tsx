import { CHANNELS } from "@/content/kurak";
import { Fill } from "../Fill";
import { Icon } from "./Icon";
import s from "./Contacts.module.css";

/** В Кыргызстане первым пишут в WhatsApp, поэтому порядок такой */
const ORDER = ["whatsapp", "telegram", "phone", "instagram"] as const;
const LIST = ORDER.map((id) => ({ ...CHANNELS.find((c) => c.id === id)!, id }));

/**
 * Контакты: значок и название канала, под ними номер или ник.
 * Пока агентство не прислало контакты, значения — черновики в пунктире (<Fill>), без ссылки.
 * Как только в site.ts появится href, пункт станет ссылкой.
 */
export function Contacts({ className, layout = "row" }: { className?: string; layout?: "row" | "column" }) {
  return (
    <ul className={[s.list, layout === "column" ? s.column : s.row, className].filter(Boolean).join(" ")} aria-label="Контакты">
      {LIST.map((c) => {
        const body = (
          <>
            <span className={s.label}>
              <Icon name={c.id} className={s.icon} />
              {c.label.ru}
            </span>
            <span className={s.value}>
              <Fill value={c.value} />
            </span>
          </>
        );
        const external = c.href.startsWith("http");
        return (
          <li key={c.id} className={s.item}>
            {c.href ? (
              <a
                className={`${s.entry} ${s.link}`}
                href={c.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                data-cursor={c.id === "phone" ? "Позвонить" : "Написать"}
              >
                {body}
              </a>
            ) : (
              <span className={s.entry}>{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
