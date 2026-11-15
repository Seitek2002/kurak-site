import { v5Sans, v5Serif } from "../_fonts/v5";
import "./v5.css";

/** Вариант 5 «Кут»: войлок и крем, антиква Noto Serif Display над гротеском Golos Text. */
export default function V5Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v5-theme ${v5Serif.variable} ${v5Sans.variable}`}>{children}</div>;
}
