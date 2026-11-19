import { CHANNELS, type Lang } from "@/content/kurak";
import { Fill } from "../Fill";
import { IconInstagram, IconPhone, IconTelegram, IconWhatsApp } from "./Icons";

const ICON = { whatsapp: IconWhatsApp, telegram: IconTelegram, phone: IconPhone, instagram: IconInstagram } as const;

/**
 * Каналы связи из CHANNELS: WhatsApp первым. Значения пока черновики (пунктир через <Fill>);
 * когда агентство впишет ссылку, строка станет ссылкой сама.
 */
export function Contacts({
  lang,
  ids = ["whatsapp", "telegram", "phone"],
  className,
  itemClass,
  labelClass,
  valueClass,
}: {
  lang: Lang;
  ids?: (keyof typeof ICON)[];
  className?: string;
  itemClass?: string;
  labelClass?: string;
  valueClass?: string;
}) {
  const list = ids.map((id) => CHANNELS.find((c) => c.id === id)!).filter(Boolean);
  return (
    <ul className={className}>
      {list.map((c) => {
        const Icon = ICON[c.id as keyof typeof ICON];
        const inner = (
          <>
            <Icon />
            <span className={labelClass}>{c.label[lang]}</span>
            <span className={valueClass}>
              <Fill value={c.value} />
            </span>
          </>
        );
        return (
          <li key={c.id}>
            {c.href ? (
              <a href={c.href} className={itemClass} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                {inner}
              </a>
            ) : (
              <span className={itemClass}>{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

