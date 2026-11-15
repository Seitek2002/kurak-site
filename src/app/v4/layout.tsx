import { golos, nata } from "../_fonts/v4";
import "./v4.css";

/** Вариант 4 «Конструктор»: кремовая бумага, красные детали знака, Nata Sans над Golos Text. */
export default function V4Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`v4-theme ${nata.variable} ${golos.variable}`}>{children}</div>;
}
