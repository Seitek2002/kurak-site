import { kurakDisplay } from "../_fonts/kurakDisplay";
import { v9Text } from "../_fonts/v9";
import { MODE_KEY } from "@/components/v9/mode";
import "./v9.css";

/**
 * Сохранённый режим (тёмный или светлый) ставится до отрисовки: скрипт стоит первым ребёнком обёртки
 * и выполняется при разборе HTML, поэтому неправильная тема не мелькает. По умолчанию тёмный.
 * suppressHydrationWarning: React принимает data-mode, который поставил скрипт.
 */
const MODE_SCRIPT = `(function(){try{var m=localStorage.getItem(${JSON.stringify(MODE_KEY)});if(m==="light"||m==="dark")document.currentScript.parentNode.setAttribute("data-mode",m)}catch(e){}})()`;

/** Вариант 9: подача креативного агентства в гамме логотипа, тёмный и светлый режимы. */
export default function V9Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`v9-theme ${kurakDisplay.variable} ${v9Text.variable}`} data-mode="dark" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
      {children}
    </div>
  );
}
