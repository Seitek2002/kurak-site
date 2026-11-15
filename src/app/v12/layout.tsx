import { v12Display, v12Text } from "../_fonts/v12";
import "./v12.css";

/** Вариант 12 «Жарчы»: рельеф Кыргызстана и весть от Бишкека. Commissioner над Ysabeau Office. */
export default function V12Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v12-theme ${v12Display.variable} ${v12Text.variable}`}>{children}</div>;
}
