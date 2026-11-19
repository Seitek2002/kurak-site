"use client";

import { useEffect, useRef, useState } from "react";
import { UI as K } from "@/content/kurak";
import { UI, type Lang } from "@/content/v3";
import { shareLink } from "@/lib/share";
import { IconShare } from "./Icons";
import s from "./V3.module.css";

/**
 * «Поделиться»: на телефоне системное меню (WhatsApp, Telegram), на компьютере копирует ссылку
 * и коротко говорит «Ссылка скопирована» (aria-live). url уже с basePath.
 */
export function ShareButton({
  lang,
  url,
  text,
  label,
  className,
}: {
  lang: Lang;
  url: string;
  text: string;
  label?: string;
  className?: string;
}) {
  const [msg, setMsg] = useState("");
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onClick() {
    const out = await shareLink({ title: "Курак", text, url });
    const next = out === "copied" ? K.copied[lang] : out === "failed" ? UI.copyFailed[lang] : "";
    setMsg(next);
    window.clearTimeout(timer.current);
    if (next) timer.current = window.setTimeout(() => setMsg(""), 2800);
  }

  return (
    <span className={s.shareWrap}>
      <button type="button" className={className} onClick={onClick}>
        <IconShare />
        {label ?? K.share[lang]}
      </button>
      <span className={s.shareMsg} role="status" aria-live="polite" data-on={msg ? "" : undefined}>
        {msg}
      </span>
    </span>
  );
}
