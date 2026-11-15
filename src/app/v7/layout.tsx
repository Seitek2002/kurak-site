import { v7Display, v7Text } from "../_fonts/v7";
import "./v7.css";

/** Вариант 7 «Студия»: графитовая подача по мотивам ryba.team на бренде Курака. */
export default function V7Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v7-theme ${v7Display.variable} ${v7Text.variable}`}>{children}</div>;
}
