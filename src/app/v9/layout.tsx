import { v9Display, v9Text } from "../_fonts/v9";
import "./v9.css";

/** Вариант 9: чёрный экран креативного агентства, красный логотипа и крем-секции. */
export default function V9Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v9-theme ${v9Display.variable} ${v9Text.variable}`}>{children}</div>;
}
