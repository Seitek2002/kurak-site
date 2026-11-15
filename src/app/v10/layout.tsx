import { v10Display, v10Text } from "../_fonts/v10";
import { InlineScript } from "@/components/v10/InlineScript";
import "./v10.css";

/**
 * Вариант 10 «Чий». Стиль полотна (Шерсть / Тушь / Неон) хранится в data-chiy на обёртке:
 * все цвета страницы и холста берутся из токенов этого стиля. Выбор посетителя поднимается из localStorage
 * до первой отрисовки, поэтому страница не мигает; React этот атрибут не трогает (suppressHydrationWarning).
 */
const RESTORE_STYLE = `try{var s=localStorage.getItem("kurak-v10-style");if(s==="ink"||s==="neon")document.currentScript.parentElement.setAttribute("data-chiy",s)}catch(e){}`;

export default function V10Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`v10-theme ${v10Display.variable} ${v10Text.variable}`} data-chiy="wool" suppressHydrationWarning>
      <InlineScript html={RESTORE_STYLE} />
      {children}
    </div>
  );
}
