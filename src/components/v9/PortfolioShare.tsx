"use client";

import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_FILE, UI, portfolioHref, type Lang } from "@/content/kurak";
import { V9 } from "@/content/v9";
import { shareLink } from "@/lib/share";
import { IconDownload, IconShare } from "./Icons";
import s from "./V9.module.css";

/**
 * «Скачать портфолио (PDF)» обычной ссылкой (путь уже с basePath) и рядом «Поделиться»:
 * на телефоне системное меню, на компьютере копирует ссылку и коротко говорит «Ссылка скопирована».
 */
export function PortfolioShare({ lang, className }: { lang: Lang; className?: string }) {
  const [msg, setMsg] = useState("");
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onShare() {
    const out = await shareLink({ title: "Курак", text: UI.shareText[lang], url: portfolioHref(lang) });
    const text = out === "copied" ? UI.copied[lang] : out === "failed" ? V9.shareFailed[lang] : "";
    setMsg(text);
    window.clearTimeout(timer.current);
    if (text) timer.current = window.setTimeout(() => setMsg(""), 3200);
  }

  return (
    <div className={[s.pf, className].filter(Boolean).join(" ")}>
      <a href={portfolioHref(lang)} download={PORTFOLIO_FILE[lang]} className={s.pfLink}>
        <IconDownload className={s.pfIcon} />
        <span>{UI.portfolio[lang]}</span>
      </a>
      <button type="button" className={s.pfShare} onClick={onShare}>
        <IconShare className={s.pfIcon} />
        <span>{UI.share[lang]}</span>
      </button>
      <span className={s.pfStatus} role="status" aria-live="polite">
        {msg}
      </span>
    </div>
  );
}
