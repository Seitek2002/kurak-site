import { CHANNELS, UI, type Lang } from "@/content/kurak";
import { Fill } from "../Fill";
import { IconPhone, IconTelegram, IconWhatsApp } from "./Icons";
import s from "./V9.module.css";

const ICON = { whatsapp: IconWhatsApp, telegram: IconTelegram, phone: IconPhone } as const;
type Id = keyof typeof ICON;

/**
 * WhatsApp, Telegram и телефон из CHANNELS (WhatsApp первым: в Кыргызстане пишут туда).
 * Значения пока черновики (пунктир через <Fill>); когда агентство впишет ссылку, строка станет ссылкой.
 */
export function Contacts({ lang, className, ids = ["whatsapp", "telegram", "phone"] }: { lang: Lang; className?: string; ids?: Id[] }) {
  return (
    <ul className={[s.contacts, className].filter(Boolean).join(" ")}>
      {ids.map((id) => {
        const c = CHANNELS.find((x) => x.id === id)!;
        const Icon = ICON[id];
        const label = id === "phone" ? UI.call[lang] : c.label[lang];
        const inner = (
          <>
            <Icon className={s.contactIcon} />
            <span className={s.contactLabel}>{label}</span>
            <span className={s.contactValue}>
              <Fill value={c.value} />
            </span>
          </>
        );
        const ext = c.href.startsWith("http");
        return (
          <li key={id}>
            {c.href ? (
              <a href={c.href} className={s.contact} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined}>
                {inner}
              </a>
            ) : (
              <span className={s.contact}>{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
