"use client";

import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_FILE, UI, portfolioHref } from "@/content/kurak";
import { shareLink } from "@/lib/share";
import { Icon } from "./Icon";
import s from "./PortfolioShare.module.css";

/**
 * «Скачать портфолио (PDF)» и «Поделиться»: портфолио можно сохранить себе
 * и переслать шефу, коллегам, знакомым. Обычный <a download>: путь к файлу уже с basePath.
 * «Поделиться» на телефоне открывает системное меню, на компьютере копирует ссылку
 * и коротко подтверждает это на самой кнопке и вслух (aria-live).
 */
export function PortfolioShare({ className }: { className?: string }) {
  const [note, setNote] = useState<{ kind: "copied" | "failed"; text: string } | null>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const say = (kind: "copied" | "failed", text: string) => {
    window.clearTimeout(timer.current);
    setNote({ kind, text });
    timer.current = window.setTimeout(() => setNote(null), kind === "copied" ? 2400 : 4000);
  };

  const onShare = async () => {
    const result = await shareLink({ title: "Курак", text: UI.shareText.ru, url: portfolioHref("ru") });
    if (result === "copied") say("copied", UI.copied.ru);
    else if (result === "failed") say("failed", "Не скопировалось. Скачайте PDF и перешлите файл");
  };
  const copied = note?.kind === "copied";

  return (
    <div className={[s.row, className].filter(Boolean).join(" ")}>
      <a className={s.pdf} href={portfolioHref("ru")} download={PORTFOLIO_FILE.ru} data-cursor="PDF">
        <Icon name="download" className={s.icon} />
        <span className={s.pdfText}>{UI.portfolio.ru}</span>
      </a>
      <span className={s.shareWrap}>
        {/* кнопка сама подтверждает: «Поделиться» → «Ссылка скопирована»; вслух читает живая область рядом */}
        <button type="button" className={s.share} onClick={onShare} data-done={copied || undefined}>
          <Icon name={copied ? "check" : "share"} className={s.icon} />
          <span aria-hidden={copied || undefined}>{copied ? UI.copied.ru : UI.share.ru}</span>
          {copied && <span className="visually-hidden">{UI.share.ru}</span>}
        </button>
        <span className="visually-hidden" aria-live="polite">
          {note?.text}
        </span>
        <span className={s.toast} data-on={note?.kind === "failed" || undefined} aria-hidden="true">
          {note?.kind === "failed" ? note.text : ""}
        </span>
      </span>
    </div>
  );
}
