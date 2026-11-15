import { v11Display, v11Text } from "../_fonts/v11";
import "./v11.css";

/** Вариант 11 «Тогуз коргоол»: доска, казан и туз. Антиква Piazzolla над гротеском Geologica. */
export default function V11Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v11-theme ${v11Display.variable} ${v11Text.variable}`}>{children}</div>;
}
