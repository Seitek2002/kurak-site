"use client";

import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_FILE, UI, portfolioHref, type Lang } from "@/content/kurak";
import { V6_HERO } from "@/content/v6";
import { shareLink } from "@/lib/share";
import { IconCheck, IconDownload, IconShare } from "./Icons";
import s from "./V6.module.css";

/**
 * «Скачать портфолио (PDF)» и рядом маленькая «Поделиться»: заказчица хочет, чтобы портфолио
 * можно было скачать и переслать шефу, коллегам, знакомым. На телефоне «Поделиться» открывает системное меню,
 * на компьютере копирует ссылку и коротко пишет «Ссылка скопирована» (слышно и скринридеру).
 * Ссылка обычный <a download>: путь уже с basePath, next/link не нужен.
 */
export function PortfolioLinks({ lang, className }: { lang: Lang; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onShare() {
    const r = await shareLink({ title: "Курак", text: UI.shareText[lang], url: portfolioHref(lang) });
    if (r !== "copied") return;
    window.clearTimeout(timer.current);
    setCopied(true);
    timer.current = window.setTimeout(() => setCopied(false), 2600);
  }

  return (
    <div className={[s.pf, className].filter(Boolean).join(" ")}>
      <a href={portfolioHref(lang)} download={PORTFOLIO_FILE[lang]} className={`v6-link ${s.pfLink}`}>
        <IconDownload />
        <span>{UI.portfolio[lang]}</span>
      </a>
      <span className={s.pfShare}>
        <button type="button" className={s.shareBtn} onClick={onShare} title={V6_HERO.shareHint[lang]} data-on={copied || undefined}>
          {copied ? <IconCheck /> : <IconShare />}
          <span>{UI.share[lang]}</span>
        </button>
        <span role="status" className={s.shareLive}>
          {copied && <span className={s.shareStatus}>{UI.copied[lang]}</span>}
        </span>
      </span>
    </div>
  );
}
