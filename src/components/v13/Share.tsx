"use client";

import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_FILE, UI, portfolioHref, type Lang } from "@/content/kurak";
import { V13_UI } from "@/content/v13";
import { shareLink } from "@/lib/share";
import { IconDownload, IconShare } from "./Icons";

/**
 * «Скачать портфолио (PDF)» обычной ссылкой (путь уже с basePath) и рядом «Поделиться»:
 * на телефоне системное меню, на компьютере копирует ссылку и коротко говорит «Ссылка скопирована».
 */
export function PortfolioShare({ lang, className, linkClass, shareClass, statusClass }: { lang: Lang; className?: string; linkClass?: string; shareClass?: string; statusClass?: string }) {
  const [msg, setMsg] = useState("");
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onShare() {
    const out = await shareLink({ title: "Курак", text: UI.shareText[lang], url: portfolioHref(lang) });
    const text = out === "copied" ? UI.copied[lang] : out === "failed" ? V13_UI.shareFailed[lang] : "";
    setMsg(text);
    window.clearTimeout(timer.current);
    if (text) timer.current = window.setTimeout(() => setMsg(""), 3200);
  }

  return (
    <div className={className}>
      <a href={portfolioHref(lang)} download={PORTFOLIO_FILE[lang]} className={linkClass}>
        <IconDownload />
        <span>{UI.portfolio[lang]}</span>
      </a>
      <button type="button" className={shareClass} onClick={onShare}>
        <IconShare />
        <span>{UI.share[lang]}</span>
      </button>
      <span className={statusClass} role="status" aria-live="polite">
        {msg}
      </span>
    </div>
  );
}
