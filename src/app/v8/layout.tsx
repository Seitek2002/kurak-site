import { v8Body, v8Display } from "../_fonts/v8";
import "./v8.css";

/** Вариант 8 «Меню»: подача Додо Пиццы (страница «О нас» и меню) на языке Курака. */
export default function V8Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v8-theme ${v8Display.variable} ${v8Body.variable}`}>{children}</div>;
}
