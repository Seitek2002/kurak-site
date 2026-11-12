import { onestExt, rubik, rubikExt } from "../_fonts/v3";
import "./v3.css";

/** Вариант 3 «Кеңеш»: Rubik для заголовков, кыргызская кириллица докачивается по требованию. */
export default function V3Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v3-theme ${rubik.variable} ${rubikExt.variable} ${onestExt.variable}`}>{children}</div>;
}
