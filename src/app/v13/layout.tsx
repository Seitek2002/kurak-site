import { v13Display, v13Text } from "../_fonts/v13";
import "./v13.css";

/** Вариант 13 «Сборка»: опрос, лоскутная история, меню-подборка и калькулятор в цветах логотипа. */
export default function V13Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v13-theme ${v13Display.variable} ${v13Text.variable}`}>{children}</div>;
}
