import Link from "next/link";
import { LANGS, UI, htmlLang, variantPath, type Lang } from "@/content/kurak";
import s from "./V4.module.css";

/** Рус / Кыр: пара страниц варианта 4, текущая отмечена aria-current. Link, чтобы на GitHub Pages добавлялся basePath */
export function LangSwitch({ lang, compact }: { lang: Lang; compact?: boolean }) {
  return (
    <nav className={s.lang} aria-label={UI.langLabel[lang]}>
      {LANGS.map((l) => (
        <Link
          key={l.id}
          href={variantPath(4, l.id)}
          prefetch={false}
          hrefLang={htmlLang(l.id)}
          lang={htmlLang(l.id)}
          aria-current={l.id === lang ? "page" : undefined}
          className={s.langLink}
        >
          {compact ? l.short : l.full}
        </Link>
      ))}
    </nav>
  );
}
