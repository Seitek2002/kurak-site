import { literata, literataExt, oswald, oswaldExt } from "../_fonts/v3";
import "./v3.css";

/** Вариант 3 «Кеңеш» в теме Paste-up: доска объявлений, Oswald над Literata. */
export default function V3Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`v3-theme ${oswald.variable} ${oswaldExt.variable} ${literata.variable} ${literataExt.variable}`}>
      {children}
    </div>
  );
}
