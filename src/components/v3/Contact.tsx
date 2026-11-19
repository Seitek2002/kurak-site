import { CHANNELS, PORTFOLIO_FILE, UI as K, portfolioHref } from "@/content/kurak";
import { UI, type Lang } from "@/content/v3";
import { Fill } from "../Fill";
import { ShareButton } from "./ShareButton";
import { IconDownload, IconPhone, IconTelegram, IconWhatsApp } from "./Icons";
import s from "./V3.module.css";

const ICON = { whatsapp: <IconWhatsApp />, telegram: <IconTelegram />, phone: <IconPhone /> } as const;

/** Три канала связи первым экраном: лист с отрывными строками. Номера пока черновики, ссылкой становятся, когда есть href. */
export function Channels({ lang, className }: { lang: Lang; className?: string }) {
  const list = (["whatsapp", "telegram", "phone"] as const).map((id) => CHANNELS.find((c) => c.id === id)!);
  return (
    <ul className={[s.channels, className].filter(Boolean).join(" ")} aria-label={UI.contactsLabel[lang]}>
      {list.map((c) => {
        const id = c.id as keyof typeof ICON;
        const label = id === "phone" ? UI.call[lang] : c.label[lang];
        const inner = (
          <>
            {ICON[id]}
            <span className={s.chLabel}>{label}</span>
            {c.href ? <span className={s.chValue}>{c.value.value}</span> : <Fill value={c.value} className={s.chValue} />}
          </>
        );
        return (
          <li key={c.id} className={s.channel}>
            {c.href ? (
              <a className={s.chInner} href={c.href} target={id === "phone" ? undefined : "_blank"} rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <span className={s.chInner}>{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** «Скачать портфолио (PDF)» обычной ссылкой (путь уже с basePath) и рядом «Поделиться» */
export function PortfolioLinks({ lang, onField = false }: { lang: Lang; onField?: boolean }) {
  const href = portfolioHref(lang);
  return (
    <div className={`${s.pdfRow} ${onField ? s.pdfRowField : ""}`}>
      <a className={s.pdfLink} href={href} download={PORTFOLIO_FILE[lang]}>
        <IconDownload />
        <span>{K.portfolio[lang]}</span>
      </a>
      <ShareButton lang={lang} url={href} text={K.shareText[lang]} className={s.shareBtn} />
    </div>
  );
}
