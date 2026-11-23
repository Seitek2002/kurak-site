import { PRINCIPLES, VALUES, type Lang } from "@/content/kurak";
import { V9 } from "@/content/v9";
import { BADGE_ORDER, KBadge } from "./KBadge";
import s from "./V9.module.css";

/**
 * Красная бегущая лента с ценностями и принципами агентства, перед каждой фразой курак-значок.
 * Первая копия читается скринридером как список, вторая (для бесшовного круга) скрыта.
 * При «уменьшить движение» лента стоит: фразы переносятся в несколько строк.
 */
export function Ribbon({ lang }: { lang: Lang }) {
  const items = [...VALUES.map((v) => v.title[lang]), ...PRINCIPLES.map((p) => p.title[lang])];
  const run = (copy: number) => (
    <ul key={copy} className={s.ribbonRun} aria-hidden={copy ? true : undefined} aria-label={copy ? undefined : V9.ribbonLabel[lang]}>
      {items.map((t, i) => (
        <li key={i} className={s.ribbonItem}>
          <KBadge id={BADGE_ORDER[i % BADGE_ORDER.length]!} className={s.ribbonBadge} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={s.ribbon}>
      <div className={s.ribbonTrack}>{[0, 1].map(run)}</div>
    </div>
  );
}
